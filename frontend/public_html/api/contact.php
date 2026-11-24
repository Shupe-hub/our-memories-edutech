<?php
declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const CONTACT_RECIPIENT = 'info@ourmemoriesedutech.co.za';
const CONTACT_ALLOWED_ORIGINS = [
    'https://ourmemoriesedutech.co.za',
    'https://www.ourmemoriesedutech.co.za',
];
const CONTACT_MAX_BODY_BYTES = 16384;
const CONTACT_RATE_WINDOW_SECONDS = 3600;
const CONTACT_RATE_LIMIT = 5;

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function requestIsHttps(): bool
{
    $https = strtolower((string) ($_SERVER['HTTPS'] ?? ''));
    return ($https !== '' && $https !== 'off' && $https !== '0')
        || (string) ($_SERVER['SERVER_PORT'] ?? '') === '443';
}

function validUtf8(string $value): bool
{
    return preg_match('//u', $value) === 1;
}

function hasHeaderControlCharacters(string $value): bool
{
    return preg_match('/[\r\n\x00-\x1f\x7f]/', $value) === 1;
}

function rateLimitRequest(string $privateDirectory, string $clientIp, string $apiKey): array
{
    if (!is_dir($privateDirectory) || !is_writable($privateDirectory)) {
        error_log('Contact endpoint rate-limit directory is unavailable.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    $rateFile = $privateDirectory . DIRECTORY_SEPARATOR . 'contact-rate-limit.json';
    $handle = fopen($rateFile, 'c+');
    if ($handle === false) {
        error_log('Contact endpoint could not open its rate-limit store.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        error_log('Contact endpoint could not lock its rate-limit store.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    rewind($handle);
    $contents = stream_get_contents($handle);
    if ($contents === false || strlen($contents) > 1048576) {
        flock($handle, LOCK_UN);
        fclose($handle);
        error_log('Contact endpoint rate-limit store is unreadable or oversized.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    $entries = [];
    if ($contents !== '') {
        $decoded = json_decode($contents, true);
        if (!is_array($decoded) || json_last_error() !== JSON_ERROR_NONE) {
            flock($handle, LOCK_UN);
            fclose($handle);
            error_log('Contact endpoint rate-limit store contains invalid data.');
            return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
        }
        $entries = $decoded;
    }

    $now = time();
    $cutoff = $now - CONTACT_RATE_WINDOW_SECONDS;
    foreach ($entries as $key => $timestamps) {
        if (!is_string($key) || !is_array($timestamps)) {
            flock($handle, LOCK_UN);
            fclose($handle);
            error_log('Contact endpoint rate-limit store has an invalid structure.');
            return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
        }

        $entries[$key] = array_values(array_filter(
            $timestamps,
            static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $cutoff
        ));
        if ($entries[$key] === []) {
            unset($entries[$key]);
        }
    }

    $ipKey = hash_hmac('sha256', $clientIp, $apiKey);
    $recentRequests = $entries[$ipKey] ?? [];
    $allowed = count($recentRequests) < CONTACT_RATE_LIMIT;
    $retryAfter = $allowed
        ? 0
        : max(1, CONTACT_RATE_WINDOW_SECONDS - ($now - min($recentRequests)));

    if ($allowed) {
        if (!array_key_exists($ipKey, $entries) && count($entries) >= 5000) {
            flock($handle, LOCK_UN);
            fclose($handle);
            error_log('Contact endpoint rate-limit store reached its capacity.');
            return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
        }
        $entries[$ipKey][] = $now;
    }

    $encoded = json_encode($entries, JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        flock($handle, LOCK_UN);
        fclose($handle);
        error_log('Contact endpoint could not encode its rate-limit store.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    rewind($handle);
    $written = ftruncate($handle, 0)
        && fwrite($handle, $encoded) === strlen($encoded)
        && fflush($handle);
    $permissionsSet = chmod($rateFile, 0600);
    flock($handle, LOCK_UN);
    fclose($handle);

    if (!$written || !$permissionsSet) {
        error_log('Contact endpoint could not safely persist its rate-limit store.');
        return ['allowed' => false, 'status' => 503, 'retry_after' => 0];
    }

    return [
        'allowed' => $allowed,
        'status' => $allowed ? 200 : 429,
        'retry_after' => $retryAfter,
    ];
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if (!in_array($origin, CONTACT_ALLOWED_ORIGINS, true)) {
    respond(403, ['success' => false, 'error' => 'This website origin is not allowed.']);
}

header('Access-Control-Allow-Origin: ' . $origin);
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (!requestIsHttps()) {
    respond(426, ['success' => false, 'error' => 'Please use the secure website connection.']);
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? ''));
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['success' => false, 'error' => 'Only POST requests are supported.']);
}

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType !== 'application/json') {
    respond(415, ['success' => false, 'error' => 'Please submit the form using JSON.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > CONTACT_MAX_BODY_BYTES) {
    respond(413, ['success' => false, 'error' => 'Your message is too large. Please shorten it and try again.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > CONTACT_MAX_BODY_BYTES) {
    respond(413, ['success' => false, 'error' => 'Your message is too large. Please shorten it and try again.']);
}

$data = json_decode($rawBody, true);
if (!is_array($data) || array_is_list($data) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, ['success' => false, 'error' => 'The submitted form could not be read.']);
}

$honeypot = $data['website'] ?? '';
if (!is_string($honeypot) || trim($honeypot) !== '') {
    respond(422, ['success' => false, 'error' => 'Please check the form and try again.']);
}

$name = trim(is_string($data['name'] ?? null) ? $data['name'] : '');
$email = trim(is_string($data['email'] ?? null) ? $data['email'] : '');
$subject = trim(is_string($data['subject'] ?? null) ? $data['subject'] : '');
$message = trim(is_string($data['message'] ?? null) ? $data['message'] : '');
$phone = trim(is_string($data['phone'] ?? null) ? $data['phone'] : '');
$service = trim(is_string($data['service'] ?? null) ? $data['service'] : '');

if (
    (isset($data['phone']) && !is_string($data['phone']))
    || (isset($data['service']) && !is_string($data['service']))
) {
    respond(422, ['success' => false, 'error' => 'Please check the additional contact details and try again.']);
}

if (
    $name === ''
    || strlen($name) > 160
    || !validUtf8($name)
    || hasHeaderControlCharacters($name)
) {
    respond(422, ['success' => false, 'error' => 'Please provide your name (up to 160 characters).']);
}
if (
    $email === ''
    || strlen($email) > 254
    || hasHeaderControlCharacters($email)
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
) {
    respond(422, ['success' => false, 'error' => 'Please provide a valid email address.']);
}
if (
    $subject === ''
    || strlen($subject) > 180
    || !validUtf8($subject)
    || hasHeaderControlCharacters($subject)
) {
    respond(422, ['success' => false, 'error' => 'Please provide a subject (up to 180 characters).']);
}
if (
    $message === ''
    || strlen($message) > 8000
    || !validUtf8($message)
    || preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/', $message) === 1
) {
    respond(422, ['success' => false, 'error' => 'Please provide a message of up to 8,000 characters.']);
}
if (
    strlen($phone) > 40
    || strlen($service) > 100
    || !validUtf8($phone)
    || !validUtf8($service)
    || hasHeaderControlCharacters($phone)
    || hasHeaderControlCharacters($service)
) {
    respond(422, ['success' => false, 'error' => 'Please check the additional contact details and try again.']);
}

$documentRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
$resolvedDocumentRoot = $documentRoot !== '' ? realpath($documentRoot) : false;
$privateDirectory = $resolvedDocumentRoot !== false
    ? dirname($resolvedDocumentRoot) . DIRECTORY_SEPARATOR . 'private'
    : '';
$resolvedPrivateDirectory = $privateDirectory !== '' ? realpath($privateDirectory) : false;
$privateDirectoryPermissions = $resolvedPrivateDirectory !== false
    ? fileperms($resolvedPrivateDirectory)
    : false;

if (
    $resolvedDocumentRoot === false
    || $resolvedPrivateDirectory === false
    || $privateDirectoryPermissions === false
    || ($privateDirectoryPermissions & 0077) !== 0
    || str_starts_with(
        $resolvedPrivateDirectory . DIRECTORY_SEPARATOR,
        rtrim($resolvedDocumentRoot, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
    )
) {
    error_log('Contact endpoint private configuration directory is missing or not private.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

$configPath = $resolvedPrivateDirectory . DIRECTORY_SEPARATOR . 'resend-config.php';
if (!is_file($configPath) || !is_readable($configPath)) {
    error_log('Contact endpoint private Resend configuration is unavailable.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

$configPermissions = fileperms($configPath);
if ($configPermissions === false || ($configPermissions & 0077) !== 0) {
    error_log('Contact endpoint private Resend configuration permissions are too broad.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

try {
    $config = require $configPath;
} catch (Throwable) {
    error_log('Contact endpoint could not load its private Resend configuration.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

if (!is_array($config)) {
    error_log('Contact endpoint private Resend configuration has an invalid format.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

$apiKey = $config['api_key'] ?? null;
$sender = $config['sender_email'] ?? null;
$recipient = $config['recipient_email'] ?? null;
$senderAddress = '';
if (is_string($sender) && preg_match('/<([^<>]+)>/', $sender, $senderMatch) === 1) {
    $senderAddress = trim($senderMatch[1]);
} elseif (is_string($sender)) {
    $senderAddress = trim($sender);
}

if (
    !is_string($apiKey)
    || strlen($apiKey) < 20
    || stripos($apiKey, 'replace') !== false
    || !is_string($sender)
    || hasHeaderControlCharacters($sender)
    || filter_var($senderAddress, FILTER_VALIDATE_EMAIL) === false
    || !is_string($recipient)
    || $recipient !== CONTACT_RECIPIENT
) {
    error_log('Contact endpoint private Resend configuration is incomplete or invalid.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is not configured yet. Please try again later.']);
}

$clientIp = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
if (filter_var($clientIp, FILTER_VALIDATE_IP) === false) {
    error_log('Contact endpoint could not validate the connecting client address.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is temporarily unavailable. Please try again later.']);
}

$rateLimit = rateLimitRequest($resolvedPrivateDirectory, $clientIp, $apiKey);
if (!$rateLimit['allowed']) {
    if ($rateLimit['status'] === 429) {
        header('Retry-After: ' . (string) $rateLimit['retry_after']);
        respond(429, ['success' => false, 'error' => 'Too many enquiries were sent from this connection. Please try again later.']);
    }
    respond(503, ['success' => false, 'error' => 'The enquiry service is temporarily unavailable. Please try again later.']);
}

if (!function_exists('curl_init')) {
    error_log('Contact endpoint requires the PHP cURL extension.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is temporarily unavailable. Please try again later.']);
}

$messageLines = [
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Service: ' . ($service !== '' ? $service : 'Not specified'),
    '',
    'Message:',
    $message,
];
$emailPayload = [
    'from' => $sender,
    'to' => [$recipient],
    'reply_to' => $email,
    'subject' => '[Website enquiry] ' . $subject,
    'text' => implode("\n", $messageLines),
];
$encodedPayload = json_encode($emailPayload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
if ($encodedPayload === false) {
    error_log('Contact endpoint could not encode an email request.');
    respond(500, ['success' => false, 'error' => 'We could not prepare your enquiry. Please try again.']);
}

$curl = curl_init('https://api.resend.com/emails');
if ($curl === false) {
    error_log('Contact endpoint could not initialize PHP cURL.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is temporarily unavailable. Please try again later.']);
}

$curlOptionsSet = curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $encodedPayload,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
]);
if (!$curlOptionsSet) {
    curl_close($curl);
    error_log('Contact endpoint could not configure PHP cURL.');
    respond(503, ['success' => false, 'error' => 'The enquiry service is temporarily unavailable. Please try again later.']);
}

$resendResponse = curl_exec($curl);
$curlError = curl_errno($curl);
$resendStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

if ($resendResponse === false || $curlError !== 0) {
    error_log('Contact endpoint could not reach Resend (cURL error ' . $curlError . ').');
    respond(502, ['success' => false, 'error' => 'We could not send your enquiry right now. Please try again later.']);
}

if ($resendStatus < 200 || $resendStatus >= 300) {
    error_log('Contact endpoint received a non-success response from Resend (HTTP ' . $resendStatus . ').');
    respond(502, ['success' => false, 'error' => 'We could not send your enquiry right now. Please try again later.']);
}

$resendResult = json_decode($resendResponse, true);
if (
    !is_array($resendResult)
    || !isset($resendResult['id'])
    || !is_string($resendResult['id'])
) {
    error_log('Contact endpoint received an unexpected success response from Resend.');
    respond(502, ['success' => false, 'error' => 'We could not confirm your enquiry. Please try again later.']);
}

respond(200, [
    'success' => true,
    'message' => 'Your enquiry was received.',
]);
