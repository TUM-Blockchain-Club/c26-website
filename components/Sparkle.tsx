import Image from "next/image";

const Sparkle = () => {
  return (
    <div className="absolute inset-x-0 top-0 h-screen -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[160vh] w-[160vw] -translate-x-1/2 -translate-y-1/2 opacity-95 blur-sm">
        <div className="hero-ring-wobble relative h-full w-full">
          <Image
            src="/hero/mask-group-1.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
};

export default Sparkle;
