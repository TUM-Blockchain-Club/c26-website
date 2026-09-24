import { PartnerPostCard } from "@/components/brand/PartnerPostCard";
import { mediaPosts } from "@/constants/mediaPortal";

/** The media partners' post templates: one card per platform, three lengths
 * each, same card the community partners get on their portal. */
export const MediaPosts = () => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
    {mediaPosts.map((post) => (
      <PartnerPostCard key={post.platform} post={post} />
    ))}
  </div>
);
