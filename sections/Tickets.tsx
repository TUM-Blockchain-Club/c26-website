import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Ticket } from "@/components/ticket";
import Link from "next/link";

const Tickets = () => {
  return (
    <section className="w-full" id="tickets">
      <div className="flex w-full justify-center items-center">
        <Text textType={"sub_hero"} className="text-gradient">
          Tickets
        </Text>
      </div>
      <div className="w-full flex justify-center">
        <div className="sm:flex mt-20 justify-center sm:space-x-10 space-y-10 sm:space-y-0 w-7/8 sm:w-full">
          <Ticket price={8} ticketType={"student"} title="Student" />
          <Ticket price={59} ticketType={"regular"} title="Regular" />
          <Ticket price={459} ticketType={"vip"} title="VIP" />
        </div>
      </div>
      <div className="w-full flex justify-center mt-20">
        <Button buttonType={"cta"} asChild disabled>
          <Link href={"https://tum-blockchain-conference-26.eventbrite.de"}>
            Tickets
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Tickets;
