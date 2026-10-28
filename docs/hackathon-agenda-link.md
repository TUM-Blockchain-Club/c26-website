# Hackathon Agenda Link

The Hackathon's schedule is published only on the Hackathon site, at
`https://hackathon.tum-blockchain.com/schedule` (`HACKATHON_AGENDA_URL` in
`constants/Links.ts`), so there is one source of truth for it.

- `app/agenda/agenda.tsx`: the "Hackathon" entry in the Event filter is an
  outbound link to that page instead of a filter. The card below the feed
  ("Looking for the Hackathon?") links there too.
- Strapi sessions whose `event` is `hackathon` are left out of the conference
  feed, so nothing entered there by mistake shows up twice.
- `app/agenda/[sessionId]/page.tsx`: such sessions are not prebuilt, and an
  old `/agenda/<id>` link to one redirects to the Hackathon agenda.
