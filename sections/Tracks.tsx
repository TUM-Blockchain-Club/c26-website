"use client";

import Image from "next/image";
import { Text } from "@/components/text";
import { Track } from "@/components/track";
import {
  GraduationCap,
  Globe,
  TestTube,
  FileText,
  Network,
  School2,
} from "lucide-react";

export const trackItems = [
  {
    title: "Education",
    img: "/tracks/graduation.svg",
    description: (
      <>
        Blockchain 101, Scaling 101, ZK 101, and DeFi 101. These are just some
        of the talks from our Education Track that help you get started in web3.
      </>
    ),
  },
  {
    title: "Applications",
    img: "/tracks/earth.svg",
    description: (
      <>
        Learn about the untapped potential of blockchain and cryptography in
        medicine, finance, identity, and more. From private AI-inference to
        secure voting, this track explores the real-world applications of web3.
      </>
    ),
  },
  {
    title: "Research",
    img: "/tracks/lab.svg",
    description: (
      <>
        Top researchers and experts present the state-of-the-art in Distributed
        Systems, Cryptography, Security, and Cryptoeconomics and where each
        field is heading.
      </>
    ),
  },
  {
    title: "Regulation",
    img: "/tracks/paragraph.svg",
    description: (
      <>
        Hear from legal experts and policy makers what businesses, builders, and
        users must know when navigating the legal landscape of web3. This track
        covers everything from compliance to crypto-taxes.
      </>
    ),
  },
  {
    title: "Ecosystem",
    img: "/tracks/ecosystem.svg",
    description: (
      <>
        Explore the blockchain ecosystem from protocols to corporates. Uncover
        diverse insights, future visions and connect with industry leaders.
      </>
    ),
  },
  {
    title: "Academic",
    img: "/tracks/graduation.svg",
    description: (
      <>
        We promote academic excellence by hosting leading researchers and
        professionals to present blockchain innovations at the 2026 TUM
        Blockchain Conference, in collaboration with TUM and IEEE Blockchain.
      </>
    ),
  },
];

const Tracks = () => {
  return (
    <section className="w-full flex flex-col items-center" id="tracks">
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Tracks
      </Text>
      <div className="flex flex-col items-center space-y-10 md:space-y-0 md:flex-row md:flex-wrap md:justify-center md:gap-x-10 mt-20 text-center lg:text-left md:text-left">
        <Track
          icon={GraduationCap}
          iconColor="#4ADE80"
          title={trackItems[0].title}
          desc={trackItems[0].description}
          dimension={70}
        />
        <Track
          icon={Globe}
          iconColor="#2DD4BF"
          title={trackItems[1].title}
          desc={trackItems[1].description}
          dimension={70}
        />
        <Track
          icon={TestTube}
          iconColor="#FACC15"
          title={trackItems[2].title}
          desc={trackItems[2].description}
          dimension={70}
        />
        <Track
          icon={FileText}
          iconColor="#F87171"
          title={trackItems[3].title}
          desc={trackItems[3].description}
          dimension={70}
        />
        <Track
          icon={Network}
          iconColor="#60A5FA"
          title={trackItems[4].title}
          desc={trackItems[4].description}
          dimension={70}
        />
        {/* <Track
          icon={School2}
          iconColor="#FB923C"
          title={trackItems[5].title}
          desc={trackItems[5].description}
          dimension={70}
        /> */}
      </div>
    </section>
  );
};

export default Tracks;
