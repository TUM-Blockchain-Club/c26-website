import { Text } from "@/components/text";
import { Button } from "@/components/button";

const VIDEO_SRC = "/partner/early-bird-teaser.mp4";

export const PartnerVideoAsset = () => (
  <div className="card-tbc flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:gap-10">
    <div className="w-full flex-1 overflow-hidden rounded-md bg-black lg:max-w-md">
      <video
        controls
        preload="metadata"
        playsInline
        className="w-full"
        src={VIDEO_SRC}
      >
        Your browser doesn&apos;t support embedded video.{" "}
        <a href={VIDEO_SRC} download className="underline">
          Download it directly
        </a>
        .
      </video>
    </div>
    <div className="flex flex-1 flex-col gap-3">
      <Text as="p" textType="lgsmall" className="font-bold">
        Conference teaser video
      </Text>
      <Text as="p" textType="small" className="text-muted max-w-md">
        Ready to post as it is, alongside any of the captions below. Perfect for
        your Early Bird or Community Partner announcement.
      </Text>
      <div className="mt-3">
        <Button buttonType="primary" asChild className="w-fit px-5">
          <a href={VIDEO_SRC} download="tbc-conference-26-teaser.mp4">
            Download video
          </a>
        </Button>
      </div>
    </div>
  </div>
);
