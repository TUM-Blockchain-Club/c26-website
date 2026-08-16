/**
 * Re-mounts on every route change, so each page drifts in with the
 * .page-enter animation (reduced-motion safe, defined in globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
