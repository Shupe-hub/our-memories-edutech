# Resend Contact Form Setup

The Contact Us form sends JSON to `public_html/api/contact.php`. That PHP endpoint uses Resend's REST API and sends accepted enquiries to `info@ourmemoriesedutech.co.za`. The Resend API key is read only by PHP from a file outside the public web root; it is never sent to the browser.

## Files

- `public_html/api/contact.php` — standalone PHP 8.2+ endpoint for Afrihost shared hosting.
- `private/resend-config.example.php` — credential-free template. Do not put live credentials in this tracked example.
- `src/pages/Contact.jsx` and `src/pages/Contact.css` — the existing Contact page form and its submission/status styling.
- `.gitignore` — excludes the live private configuration and server-side rate-limit data.

The root `public_html/` folder is separate from Vite's `public/` folder. `npm run build` copies Vite's `public/` into `dist/`; it does not bundle this PHP endpoint. Deploy the PHP endpoint separately and do not delete it when uploading a new frontend build.

## Configure Resend

1. Create or sign in to a Resend account.
2. Add `ourmemoriesedutech.co.za` as a sending domain in Resend.
3. Add the DNS records Resend provides (including SPF and DKIM) to the domain's Afrihost DNS zone. Add any additional records Resend requests, then wait until Resend reports the domain as verified.
4. Choose a sender address on the verified domain. Use that address in the PHP configuration below. The endpoint does not accept a sender address from the browser.
5. Keep `info@ourmemoriesedutech.co.za` as the recipient.

## Configure the private cPanel file

The endpoint resolves its private directory as the directory named `private` next to the PHP document root. For a document root of `/home/CPANEL_USERNAME/public_html`, the expected file is:

`/home/CPANEL_USERNAME/private/resend-config.php`

In cPanel File Manager or SSH:

1. Create `/home/CPANEL_USERNAME/private/` if it does not exist. Keep it outside `public_html`.
2. Copy the contents of `private/resend-config.example.php` into a new server-side file named `resend-config.php` in that private directory.
3. Replace the API key and sender placeholder with the real Resend API key and a sender address from the verified domain. Do not change the recipient address.
4. Set the private directory permissions to `700` and `resend-config.php` to `600`. The endpoint rejects a configuration file that is readable by group or other users.
5. Never upload the live configuration into `public_html`, Vite's `public/`, or GitHub. Do not edit the tracked example to contain credentials.

The private directory also needs to be writable by the PHP process so the endpoint can maintain its locked, cross-session rate-limit file. That file contains HMAC-hashed client identifiers and timestamps, not email/message contents; it is created with `600` permissions.

## Upload to Afrihost

1. Confirm the domain is using HTTPS and that the hosting account has PHP 8.2+ with the PHP cURL extension enabled.
2. Upload `public_html/api/contact.php` to the corresponding `api/contact.php` path under the domain's actual document root. The root-level source folder in this repository is not part of Vite's build output.
3. Upload the Vite build output from `dist/` for the frontend as usual. Preserve the existing `api/contact.php` when replacing the static build files.
4. The endpoint permits browser requests only from `https://ourmemoriesedutech.co.za` and `https://www.ourmemoriesedutech.co.za`. If the production site uses another canonical origin, update `CONTACT_ALLOWED_ORIGINS` deliberately before deployment.
5. The endpoint enforces HTTPS, accepts JSON POST, validates all fields server-side, rejects a filled honeypot, and limits each client address to five submissions per hour using a locked private file. The origin restriction is not authentication and is supplemented by validation and rate limiting.

## Test the live form

Submit the Contact Us form on the HTTPS production site using a controlled test email address. Confirm that:

- The page shows a loading state and disables the submit button while the request is in flight.
- A successful Resend API acceptance clears the form and shows the confirmation message.
- The enquiry arrives at `info@ourmemoriesedutech.co.za`, and replying to it addresses the visitor's email.
- Failed requests show a friendly error without exposing PHP, cURL, or Resend internals.

An example valid request (this sends a real email when used against production):

```sh
curl -i 'https://www.ourmemoriesedutech.co.za/api/contact.php' \
  -H 'Origin: https://www.ourmemoriesedutech.co.za' \
  -H 'Content-Type: application/json' \
  --data '{"name":"Test Visitor","email":"visitor@example.com","phone":"072 000 0000","service":"other","subject":"Contact form test","message":"Testing the live Resend contact form.","website":""}'
```

For safe negative checks, use an invalid email, omit a required field, send a JSON body larger than 16 KiB, or fill `website`; none should send an email. Five valid form attempts from one client address within an hour cause later attempts to return HTTP 429, even if an upstream Resend request fails. To test the Resend failure response, temporarily use an invalid test API key in the private file and submit once; do not commit or share the key, then restore the valid one. Avoid repeated tests from production visitors' shared IP addresses.

Expected server-side checks:

| Test | Expected result |
|---|---|
| Invalid email or omitted name, email, subject, or message | HTTP 422 JSON error; no email |
| Request body over 16 KiB or message over 8,000 bytes | HTTP 413 or 422 JSON error; no email |
| Non-empty `website` honeypot | HTTP 422 JSON error; no email |
| Sixth otherwise-valid request from the same IP in one hour | HTTP 429 and `Retry-After` |
| Invalid Resend API key / Resend non-2xx response | HTTP 502 with a generic message; internal response is not exposed |
| Valid request with configured key and verified sender | HTTP 200 after Resend accepts the email; verify actual inbox delivery separately |

## Current verification boundary

The frontend build and lint can be run locally with `npm run build` and `npm run lint`. Live PHP validation, rate-limit behavior, and Resend delivery require PHP 8.2/cURL on the hosting server, the private configuration, HTTPS, and a verified Resend sender. No successful email delivery should be assumed until the live test above succeeds.
