# Strapi: where this year's content lives

The agenda, the speakers, the side events, the sponsors and the partners are
edited in Strapi and read from there at build time and while the site is live.
The lists under `constants/` stay in the repo as a fallback.

Admin: <https://strapi.rbg.tum-blockchain.com/admin>

## What is where

| Content                   | Collection              | Rendered by                                         |
| ------------------------- | ----------------------- | --------------------------------------------------- |
| Agenda, both days         | `agenda-26s`            | `/agenda`, `/conference-day`, `/digital-assets-day` |
| Speakers                  | `speakers26`            | `/speakers`, and every face in the agenda           |
| Side events               | `side-events-26`        | `/side-events`                                      |
| Sponsors                  | `sponsor-26s`           | the Sponsors section on the home page               |
| Community, media partners | `community-partner-26s` | the Partners section on the home page               |

Everything else on the site is in the repo on purpose: stage names, track
colours, the sponsorship tiers, the FAQ, the venue, last year's gallery.

## Adding a session

The fields that matter:

- **sessionId** is the session's permanent link, `/agenda/<sessionId>`. Keep it
  when a title, time or stage changes, because the link has been shared. Never
  reuse one for a different session.
- **event** decides which day the session belongs to, and which page shows it.
- **room** is the stage under that day's own name — Nakamoto, Turing and Hopper
  on the conference day, Main Stage, Executive Forum and Future Stage on the
  Digital Assets Day. They are the same three rooms.
- **type** `Break` turns the entry into a break rather than a session.
- **speakers** is the relation: pick people from the speaker list and their
  portrait, role and company come along.
- **speakerNames** is the older free-text field, `{"speaker_1": "…"}`, kept for
  anyone without a speaker card, and for the moderator under the key
  `moderator`. Its order is the order the names appear in; the relation only
  adds people it does not already name.

## Adding a speaker

**slug** is the anchor of their card, `/speakers#<slug>`, and what the agenda
links to. It is `c26-` plus their name. **priority** is the position in the
list, lowest first. A speaker without a photo renders as a silhouette.

## When does a change appear?

Within a minute. Each page carries `revalidate = 60`, so the first request
after that rebuilds it in the background.

Immediately, if the webhook is set up:

- in Strapi under _Settings → Webhooks_, pointing at
  `https://conference26.tum-blockchain.com/api/revalidate`, with the header
  `x-revalidate-secret` and the events _Entry publish, unpublish, update,
  delete_
- the same value as `STRAPI_WEBHOOK_SECRET` in the Vercel project

Without the secret on both sides the endpoint answers 403 and nothing happens,
which is the safe direction: the site then simply refreshes on its own schedule.

## If Strapi is down

Every page falls back to the list in `constants/`, and the build log says so:

```
[strapi] agenda: 95 from Strapi            # read from Strapi
[strapi] agenda: falling back to the 95 in the repo   # Strapi did not answer
```

The fallback means a broken token or an outage never empties a page. It also
means a stale page can look healthy, so the line above is worth a glance in the
deployment log after any change to the token.

## Tokens

`STRAPI_API_TOKEN` in the Vercel project, **read-only**, unlimited duration.
Created in Strapi under _Settings → API Tokens_. A new token only takes effect
after a redeploy.

Never commit a token. `.env.local` is gitignored and stays local.
