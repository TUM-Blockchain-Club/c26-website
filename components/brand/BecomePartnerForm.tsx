"use client";

import { useState } from "react";
import Link from "next/link";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

const RECIPIENT = "marketing@tum-blockchain.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PartnerType = "community" | "media";

const TYPE_OPTIONS: {
  key: PartnerType;
  title: string;
  description: string;
  assetsHref: string;
}[] = [
  {
    key: "community",
    title: "Community Partner",
    description:
      "You run a community, a student club or a network and want to spread the word to your members.",
    assetsHref: "/partners",
  },
  {
    key: "media",
    title: "Media Partner",
    description:
      "You run a publication, podcast, newsletter or channel and want to cover the conference.",
    assetsHref: "/media",
  },
];

export const BecomePartnerForm = ({
  initialType = "community",
}: {
  initialType?: PartnerType;
}) => {
  const [type, setType] = useState<PartnerType>(initialType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allFilled =
    name.trim() && email.trim() && organization.trim() && message.trim();
  const emailValid = EMAIL_RE.test(email.trim());
  const canSend = allFilled && emailValid;

  const typeLabel =
    type === "community" ? "Community Partner" : "Media Partner";
  const activeOption =
    TYPE_OPTIONS.find((option) => option.key === type) ?? TYPE_OPTIONS[0];

  const handleSend = () => {
    if (!allFilled) {
      setError("Please fill in all fields before sending.");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);

    const subject = `Become a ${typeLabel}: ${name.trim()} (${organization.trim()})`;
    const body = [
      "Hi TUM Blockchain Team,",
      "",
      `We would love to become a ${typeLabel} of the TUM Blockchain Conference 26.`,
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Organisation: ${organization.trim()}`,
      "",
      "About us:",
      message.trim(),
      "",
      "Looking forward to hearing from you!",
    ].join("\n");

    // Opens the sender's own email client, pre-addressed and pre-filled, so
    // the message is sent from their address. No backend / mail service.
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    "w-full rounded-md border border-line bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-faint focus:border-line-strong";

  return (
    <div className="card-tbc flex flex-col gap-6 p-7">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setType(option.key)}
              className={`flex flex-col gap-2 rounded-lg border p-5 text-left transition-colors ${
                type === option.key
                  ? "border-line-strong bg-white/[0.05]"
                  : "border-line-subtle hover:border-line"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    type === option.key
                      ? "bg-gradient-tbc"
                      : "border border-line"
                  }`}
                  aria-hidden
                />
                <Text as="span" textType="lgsmall" className="font-bold">
                  {option.title}
                </Text>
              </span>
              <Text as="span" textType="small" className="text-muted">
                {option.description}
              </Text>
            </button>
          ))}
        </div>
        <Text as="p" textType="small" className="text-muted">
          Curious what you would get as a {typeLabel}?{" "}
          <Link
            href={activeOption.assetsHref}
            className="font-bold text-white underline underline-offset-4 hover:text-secondary"
          >
            See the {typeLabel} assets
          </Link>
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="bp-name" className="sr-only">
              Your name
            </label>
            <input
              id="bp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="bp-email" className="sr-only">
              Your email
            </label>
            <input
              id="bp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={inputClass}
            />
          </div>
        </div>

        <label htmlFor="bp-org" className="sr-only">
          Organisation
        </label>
        <input
          id="bp-org"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder={
            type === "community"
              ? "Your community or organisation"
              : "Your outlet, podcast or channel"
          }
          className={inputClass}
        />

        <label htmlFor="bp-message" className="sr-only">
          Tell us about yourself
        </label>
        <textarea
          id="bp-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            type === "community"
              ? "Tell us about your community: who you reach, how many members, which channels…"
              : "Tell us about your outlet and how you would like to cover the conference…"
          }
          rows={5}
          className={`${inputClass} resize-y`}
        />

        {error && (
          <Text textType="small" className="text-track-regulation">
            {error}
          </Text>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Button buttonType="cta" disabled={!canSend} onClick={handleSend}>
            Send inquiry
          </Button>
          <Text textType="small" className="text-faint">
            Opens your email app, addressed to {RECIPIENT}.
          </Text>
        </div>
      </div>
    </div>
  );
};
