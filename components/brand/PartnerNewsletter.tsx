import { Text } from "@/components/text";
import { CopyButton } from "@/components/brand/CopyButton";
import { partnerNewsletter } from "@/constants/partnerTimeline";

export const PartnerNewsletter = ({
  newsletter = partnerNewsletter,
}: {
  /** Defaults to the community partner draft; the media portal passes its own. */
  newsletter?: { subject: string; body: string };
}) => {
  const paragraphs = newsletter.body.split("\n\n");

  return (
    <div className="card-tbc flex flex-col gap-6 p-7 lg:p-9">
      <div className="flex flex-col gap-3 border-b border-line-subtle pb-6">
        <Text textType="small" className="text-faint uppercase tracking-widest">
          Subject line
        </Text>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text textType="lgsmall" className="font-bold">
            {newsletter.subject}
          </Text>
          <CopyButton value={newsletter.subject} label="Copy subject" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {paragraphs.map((paragraph, i) => (
          <Text
            key={i}
            as="p"
            textType="paragraph"
            className="text-secondary break-words"
          >
            {paragraph}
          </Text>
        ))}
      </div>

      <div className="pt-1">
        <CopyButton value={newsletter.body} label="Copy newsletter text" />
      </div>
    </div>
  );
};
