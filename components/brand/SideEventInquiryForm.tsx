"use client";

import { useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

const RECIPIENT = "relations@tum-blockchain.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SideEventInquiryForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allFilled =
    name.trim() && email.trim() && organization.trim() && message.trim();
  const emailValid = EMAIL_RE.test(email.trim());
  const canSend = allFilled && emailValid;

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

    const who = `${name.trim()} (${organization.trim()})`;
    const subject = `Side Event Inquiry: ${who}`;
    const body = [
      "Hi TUM Blockchain Team,",
      "",
      "We would love to host a side event around the TUM Blockchain Conference 26.",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Organisation: ${organization.trim()}`,
      "",
      "Idea:",
      message.trim(),
      "",
      "Looking forward to hearing from you!",
    ].join("\n");

    // Opens the partner's own email client, pre-addressed and pre-filled, so
    // the message is sent from their address. No backend / mail service.
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    "w-full rounded-md border border-line bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-faint focus:border-line-strong";

  return (
    <div className="card-tbc flex flex-col gap-4 p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="se-name" className="sr-only">
            Your name
          </label>
          <input
            id="se-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="se-email" className="sr-only">
            Your email
          </label>
          <input
            id="se-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className={inputClass}
          />
        </div>
      </div>

      <label htmlFor="se-org" className="sr-only">
        Organisation
      </label>
      <input
        id="se-org"
        type="text"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        placeholder="Your organisation"
        className={inputClass}
      />

      <label htmlFor="se-message" className="sr-only">
        Your side event idea
      </label>
      <textarea
        id="se-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us about the side event you would like to host…"
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
  );
};
