"use client";

import classNames from "classnames";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import React from "react";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSignupProps {
  label?: string;
  initialMessage?: string;
  source?: string;
  successMessage?: string;
}

export function NewsletterSignup({
  label = "Newsletter",
  initialMessage = "Get conference updates and club news in your inbox.",
  source = "c26-website-footer",
  successMessage = "Check your inbox to confirm your subscription.",
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState(initialMessage);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setMessage("Sending confirmation email...");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source, website }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error || "Could not subscribe right now.");
        return;
      }

      setStatus("success");
      setMessage(successMessage);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe right now.");
    }
  };

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <label
          className="font-sans text-sm font-semibold uppercase text-white"
          htmlFor="newsletter-email"
        >
          {label}
        </label>
        <p className="font-sans text-sm text-white/70" aria-live="polite">
          {status === "success" ? (
            <span className="inline-flex items-center gap-2 text-emerald-400">
              <Check className="h-4 w-4" aria-hidden="true" />
              {message}
            </span>
          ) : (
            message
          )}
        </p>
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          tabIndex={-1}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          autoComplete="off"
        />
      </div>
      <div
        className={classNames(
          "flex min-h-12 overflow-hidden rounded-[5px] border bg-black/55 backdrop-blur",
          status === "error" ? "border-tbc-red" : "border-white/35",
        )}
      >
        <input
          id="newsletter-email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-sm text-white outline-none placeholder:text-white/45"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage(initialMessage);
            }
          }}
          required
          disabled={status === "loading"}
          autoComplete="email"
        />
        <button
          className="flex w-12 shrink-0 items-center justify-center bg-white text-black transition-colors hover:bg-tbc-yellow disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe to newsletter"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : status === "success" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
}
