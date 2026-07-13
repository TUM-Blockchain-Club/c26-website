import { Text } from "@/components/text";
import { CopyButton } from "@/components/brand/CopyButton";
import { partnerNewsletter } from "@/constants/partnerTimeline";

export const PartnerNewsletter = () => {
  const paragraphs = partnerNewsletter.body.split("\n\n");

  return (
    <div className="card-tbc flex flex-col gap-6 p-7 lg:p-9">
      <div className="flex flex-col gap-3 border-b border-line-subtle pb-6">
        <Text textType="small" className="text-faint uppercase tracking-widest">
          Subject line
        </Text>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text textType="lgsmall" className="font-bold">
            {partnerNewsletter.subject}
          </Text>
          <CopyButton value={partnerNewsletter.subject} label="Copy subject" />
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
        <CopyButton
          value={partnerNewsletter.body}
          label="Copy newsletter text"
        />
      </div>
    </div>
  );
};
