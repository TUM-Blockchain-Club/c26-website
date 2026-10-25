import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stage Screens, TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function StageLoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-[#0a090c] px-4">
      <form
        method="post"
        action="/api/stage-login"
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-white/15 p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffc110]">
          Stage screens
        </p>
        <h1 className="text-2xl font-bold text-white">Enter the passcode</h1>
        <input type="hidden" name="next" value={next ?? "/stage-76803f8f95"} />
        <label htmlFor="passcode" className="sr-only">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="rounded-lg border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-white"
        />
        {error && (
          <p className="text-sm text-[#ff8f86]">
            That passcode is not right. Try again.
          </p>
        )}
        <button
          type="submit"
          className="rounded-lg bg-[#ffc110] px-4 py-3 font-bold text-black"
        >
          Open
        </button>
      </form>
    </div>
  );
}
