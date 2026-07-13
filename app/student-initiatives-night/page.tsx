import Image from "next/image";
import { Text } from "@/components/text";

export default function PaperSubmission() {
  return (
    <div className="overflow-x-hidden flex justify-center">
      <div className="mt-[200px] md:mt-page-top-lg max-w-4xl pb-32 px-6">
        <Text
          as="p"
          textType={"sub_hero"}
          className="text-gradient text-left pb-[0.15em]"
        >
          Student Initiatives Night
        </Text>
        <div className="mt-12">
          <Text as="p" textType={"paragraph"}>
            Calling all curious seekers!
          </Text>
        </div>
        <div className="mt-6">
          <Text as="p" textType={"paragraph"}>
            Student initiatives are an integral part of Munich's innovative
            ecosystem, always brimming with energy and enthusiasm. But we have
            few opportunities to truly understand the exciting projects that
            they are working on. That is why we bring to you the third iteration
            of Student Initiatives Night as part of this year's TUM Blockchain
            Conference!
          </Text>
        </div>
        <div className="mt-12">
          <Text textType={"title"} className="text-gradient">
            Agenda
          </Text>
        </div>
        <div className="mt-6">
          <Text as="p" textType={"paragraph"}>
            <ul style={{ listStyleType: "circle" }} className="pl-5 space-y-2">
              <li>
                15:30 - 16:15: Board Workshop
                <br /> In this workshop, we will discuss the most pressing
                issues that the initiatives face and how to overcome them! The
                main focus will be on how to properly raise funds together with
                experts from student initiatives and companies.
              </li>
              <li>
                16:30 - 17:30: Pitch Time
                <br />
                16 pitches, 3 minutes each! Initiatives will pitch the latest
                projects that they have been working on, so stay tuned for
                surprises and opportunities.
              </li>
              <li>
                17:30 Onwards: Networking
                <br />
                Network with various initiatives and get to know how you can
                join them!
              </li>
            </ul>
          </Text>
        </div>
        <div className="mt-12">
          <Text textType={"title"} className="text-gradient">
            Initiatives
          </Text>
        </div>
        <div className="grid gap-1 items-center grid-cols-2 md:grid-cols-3 px-4 md:gap-4 lg:grid-cols-5 mt-12">
          <Image
            src={"/student-initiatives/aitum-logo.png"}
            alt={"Tum.ai"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/levitum-logo.png"}
            alt={"Levitum"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/BMSL-logo.png"}
            alt={"Bioinformatics Munich Student Lab"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/TUMBusinessGame.png"}
            alt={"TUMBG"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/FalconVision.png"}
            alt={"FalconVision"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/180-logo.png"}
            alt={"180 degrees"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/RoboTUM.png"}
            alt={"ROBOTUM"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/TUDesign-logo.png"}
            alt={"TU Design"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/TUMXR-logo.png"}
            alt={"TUM-XR: Student Initiative"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/HERPolitics-logo.png"}
            alt={"HER Politics"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/TUMCaseClub-logo.png"}
            alt={"TUM Case Club"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/tbc-logo.png"}
            alt={"TUM Blockchain Club"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/START-logo.png"}
            alt={"START Munich"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/AIR-logo.png"}
            alt={"AIR"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/Entrepreneurial-Group-logo.png"}
            alt={"Entrepreneurial Group e.V."}
            width={200}
            height={200}
          />

          {/* 
          <Image
            src={"/student-initiatives/aselub-logo.png"}
            alt={"Aselub"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/cdtm-logo.png"}
            alt={"CDTM"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/enactus-logo.png"}
            alt={"Enactus"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/green-logo.png"}
            alt={"Tum greem tech"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/horyzn-logo.png"}
            alt={"Horyzn"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/mtp-logo.png"}
            alt={"MTP"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/neurotum-logo.png"}
            alt={"Neurotum"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/speaker-logo.png"}
            alt={"Tum Speaker Series"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/sr-logo.png"}
            alt={"SR"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/start-logo.png"}
            alt={"Start munich"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/teg-logo.png"}
            alt={"TEG"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/tuic-logo.png"}
            alt={"TUIC"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/warr-logo.png"}
            alt={"WARR"}
            width={200}
            height={200}
          />
          <Image
            src={"/student-initiatives/innovis.png"}
            alt={"INNOVIS"}
            width={200}
            height={200}
          />
           */}
        </div>
        <div className="mt-16">
          <Text as="p" textType={"paragraph"}>
            Join us for an exciting evening where 15 initiatives will pitch the
            most interesting projects that they have been working on and how you
            can get involved with them! Note: This event is open to everyone
            attending the conference, so whether you're a professional,
            entrepreneur, or corporate, don't miss joining us to get a scoop on
            the latest happenings!
            <br />
            <br />
            Venue for the Board Workshop: Lovelace room
            <br />
            Venue for the pitches: Lovelace room
          </Text>
        </div>
        <div className="mt-6">
          <Text textType={"sub_title"}>Supported by</Text>
          <div className="md:flex mt-4">
            {/* <div className="relative w-[200px] h-[200px]">
              <Image
                src="/sponsors/unternehmertum_logo.png"
                alt="UnternehmerTum"
                fill
                style={{ objectFit: "contain" }}
              ></Image>
            </div> */}
            <div className="relative w-[200px] h-[200px]">
              <Image
                src="/logos/tbc-wordmark.svg"
                alt="TUM Blockchain Club"
                fill
                style={{ objectFit: "contain" }}
              ></Image>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
