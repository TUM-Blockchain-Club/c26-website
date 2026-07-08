"use client";

const Video = () => {
  return (
    <section className="w-full flex flex-col lg:flex-row justify-center items-center lg:mt-[-125px]">
      <div className="w-full max-w-[340px] sm:max-w-[560px] rounded-2xl bg-gradient-tbc p-[3px] shadow-glow">
        <div
          className="relative w-full overflow-hidden rounded-[calc(1rem-3px)]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/jcm7LlyuKss"
            title="YouTube video player"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Video;
