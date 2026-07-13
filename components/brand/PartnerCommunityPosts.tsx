import { Text } from "@/components/text";
import { CopyButton } from "@/components/brand/CopyButton";
import { communityPosts } from "@/constants/partnerTimeline";

export const PartnerCommunityPosts = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {communityPosts.map((post) => {
        const paragraphs = post.text.split("\n\n");
        return (
          <div
            key={post.channel}
            className="card-tbc-soft flex h-full min-w-0 flex-col gap-5 p-6"
          >
            <div className="flex flex-col gap-1.5">
              <Text as="p" textType="lgsmall" className="font-bold">
                {post.channel}
              </Text>
              <Text as="p" textType="small" className="text-muted">
                {post.hint}
              </Text>
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              {paragraphs.map((paragraph, i) => (
                <Text
                  key={i}
                  as="p"
                  textType="small"
                  className="text-secondary min-w-0 whitespace-pre-line break-words"
                >
                  {paragraph}
                </Text>
              ))}
            </div>
            <div className="mt-auto pt-3">
              <CopyButton
                value={post.text}
                label={`Copy ${post.channel} text`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
