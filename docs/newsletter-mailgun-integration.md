# Mailgun Newsletter Integration

The footer newsletter form and ticket alert signup post to `POST /api/newsletter`. The route validates the email address, ignores honeypot submissions, and adds the subscriber to the configured Mailgun mailing list from the server so the private API key never reaches the browser.

## Environment

Set these variables in local and production environments:

- `MAILGUN_API_KEY`: Mailgun private API key.
- `MAILGUN_LIST_ADDRESS`: Mailing list address, for example `info@tum-blockchain.com`.
- `MAILGUN_API_BASE`: Optional API base. The EU Mailgun account should use `https://api.eu.mailgun.net`.

## Opt-In Behavior

The Mailgun list member endpoint directly adds a subscribed member. It does not automatically send a confirmation email. A double opt-in flow would need a separate confirmation-token route plus a confirmation email, or a dedicated newsletter tool that provides that workflow.

## Signup Sources

The client can send a short `source` value. It is stored in the Mailgun member `vars` payload so operators can tell footer newsletter signups from ticket alert signups.
