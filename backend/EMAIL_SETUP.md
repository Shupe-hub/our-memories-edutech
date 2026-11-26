# Backend email setup

Set these variables in `backend/.env` for local development and in CyberCircuit cPanel's Node.js application environment for production:

```env
RESEND_API_KEY=
EMAIL_FROM="Our Memories EduTech <noreply@send.ourmemoriesedutech.co.za>"
EMAIL_REPLY_TO=
APP_PUBLIC_URL=https://ourmemoriesedutech.co.za
EMAIL_LOGO_URL=https://ourmemoriesedutech.co.za/our-memories-edutech-logo.png
```

The API key must remain server side. The backend validates the sender format and requires an HTTPS application URL in production. `EMAIL_REPLY_TO` is optional. A support address is shown in the footer only when `SUPPORT_EMAIL` is configured. Restart the cPanel Node.js app after changing variables.

The official logo source is `frontend/public/our-memories-edutech-logo.png`. It is copied to the site's public root by the frontend build. The final URL above matches that public path; verify it returns the PNG after deploying the site. The production host was not reachable during implementation, so public availability could not be confirmed here.

An authorized super administrator can send a single controlled test to their own account with `POST /api/system-admin/email/test`. A successful response means Resend accepted the request; delivery, bounce, and later provider events require checking Resend's dashboard or webhooks. No bulk test action is provided.

The public Contact Us form already uses its own protected Resend PHP endpoint on the shared host. Its existing validation, rate limiting, configured recipient, and reply-to behavior remain in place; it is not duplicated in the Node backend.
