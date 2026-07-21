"use client";

import { useState } from "react";
import { Text } from "@/components/text";
import { Button } from "@/components/button";

// The Digital Assets Day is curated by Bundesblock, so inquiries go to their
// team directly. Opens the sender's own mail client, addressed to both.
const RECIPIENTS = ["daniela@bundesblock.de", "sebastian@bundesblock.de"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACTS = [
  { name: "Daniela Boback", email: "daniela@bundesblock.de" },
  { name: "Sebastian Becker", email: "sebastian@bundesblock.de" },
];

export const BundesblockContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const allFilled = name.trim() && email.trim() && message.trim();
  const emailValid = EMAIL_RE.test(email.trim());
  const canSend = allFilled && emailValid;

  const handleSend = () => {
    if (!allFilled) {
      setError("Please fill in your name, email and message before sending.");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);

    const who = organization.trim()
      ? `${name.trim()} (${organization.trim()})`
      : name.trim();
    const subject = `Digital Assets Day Inquiry: ${who}`;
    const body = [
      "Hi Bundesblock team,",
      "",
      "I have a question about the Digital Assets Day at the TUM Blockchain Conference 26.",
      "",
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      ...(organization.trim() ? [`Organisation: ${organization.trim()}`] : []),
      "",
      "Message:",
      message.trim(),
      "",
      "Best regards",
    ].join("\n");

    window.location.href = `mailto:${RECIPIENTS.join(",")}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    "w-full rounded-md border border-line bg-black px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-faint focus:border-blue-400";

  return (
    <div className="card-blue flex flex-col gap-6 p-7">
      <div className="flex flex-col gap-2">
        <Text as="p" textType="lgsmall" className="font-bold">
          Talk to the Bundesblock team
        </Text>
        <Text as="p" textType="small" className="text-muted max-w-xl">
          Questions about the Digital Assets Day, or a Bundesblock member asking
          about discounts? Send us a message and we will get back to you.
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="bb-name" className="sr-only">
              Your name
            </label>
            <input
              id="bb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="bb-email" className="sr-only">
              Your email
            </label>
            <input
              id="bb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className={inputClass}
            />
          </div>
        </div>

        <label htmlFor="bb-org" className="sr-only">
          Organisation (optional)
        </label>
        <input
          id="bb-org"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Your organisation (optional)"
          className={inputClass}
        />

        <label htmlFor="bb-message" className="sr-only">
          Your message
        </label>
        <textarea
          id="bb-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can the Bundesblock team help?"
          rows={5}
          className={`${inputClass} resize-y`}
        />

        {error && (
          <Text textType="small" className="text-track-regulation">
            {error}
          </Text>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Button
            buttonType="cta"
            disabled={!canSend}
            onClick={handleSend}
            className="btn-blue"
          >
            Send message
          </Button>
          <Text textType="small" className="text-faint">
            Opens your email app, addressed to the Bundesblock team.
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line-subtle pt-6">
        <Text
          as="p"
          textType="small"
          className="font-bold uppercase tracking-widest text-faint"
        >
          Your Bundesblock contacts
        </Text>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CONTACTS.map((contact) => (
            <div key={contact.email} className="flex flex-col gap-1">
              <Text as="p" textType="lgsmall" className="font-bold">
                {contact.name}
              </Text>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-blue-300 underline underline-offset-4 hover:text-blue-200"
              >
                {contact.email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BundesblockContactForm;
