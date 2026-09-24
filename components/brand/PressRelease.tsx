import { Text } from "@/components/text";
import { CopyButton } from "@/components/brand/CopyButton";
import { pressRelease } from "@/constants/mediaPortal";

/** The ready-to-publish press release, shown in full with one copy button
 * for the whole text (headline to contact) so it can go straight into a CMS
 * or an email. */
export const PressRelease = () => {
  const r = pressRelease();
  const full = [
    r.headline,
    r.subheadline,
    "",
    `${r.dateline}. ${r.paragraphs[0]}`,
    ...r.paragraphs.slice(1),
    "",
    `${r.linkLabel}: ${r.link}`,
  ].join("\n\n");

  return (
    <div className="card-tbc-soft flex min-w-0 flex-col gap-6 p-7 lg:p-9">
      <div className="flex flex-col gap-3">
        <Text as="p" textType="small" className="text-muted">
          Press release, {r.dateline}
        </Text>
        <Text as="p" textType="title" className="font-bold leading-snug">
          {r.headline}
        </Text>
        <Text
          as="p"
          textType="lgsmall"
          className="text-secondary max-w-3xl leading-relaxed"
        >
          {r.subheadline}
        </Text>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {r.paragraphs.map((paragraph, i) => (
          <Text
            key={i}
            as="p"
            textType="small"
            className="text-secondary max-w-3xl leading-relaxed"
          >
            {i === 0 ? (
              <>
                <span className="font-bold text-white">{r.dateline}. </span>
                {paragraph}
              </>
            ) : (
              paragraph
            )}
          </Text>
        ))}
        <Text as="p" textType="small" className="text-muted">
          {r.linkLabel}:{" "}
          <a
            href={r.link}
            className="break-all font-bold text-white underline underline-offset-4"
          >
            {r.link}
          </a>
        </Text>
      </div>
      <div className="pt-2">
        <CopyButton value={full} label="Copy the full press release" />
      </div>
    </div>
  );
};
