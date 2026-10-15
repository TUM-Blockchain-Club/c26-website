import { AgendaPageBody } from "@/app/agenda/agenda-page";
/** Rebuilt in the background when the cached programme is older than this, so
 * an edit in Strapi reaches the site on its own. Strapi's webhook makes it
 * immediate, see app/api/revalidate. */
// A literal, because Next reads segment config statically. Keep it in step
// with the cache lifetime in components/service/conference26.ts.
export const revalidate = 60;

const AgendaPage = () => <AgendaPageBody />;

export default AgendaPage;
