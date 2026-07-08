import { Text } from "@/components/text";
import { LumaTicketButton } from "@/components/luma-ticket-button";

const Tickets = () => {
  return (
    <section className="w-full flex flex-col items-center gap-4" id="tickets">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Be part of it
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Tickets
      </Text>
      <div className="card-tbc w-full max-w-2xl flex flex-col items-center gap-6 px-8 py-12 mt-8 text-center">
        <Text textType={"sub_title"} className="font-bold">
          Tickets are available now
        </Text>
        <Text as="p" textType="paragraph" className="max-w-md text-white/70">
          Three days of talks, panels, workshops and networking with the
          brightest minds in blockchain. Munich, October 29&ndash;31, 2026.
        </Text>
        <LumaTicketButton
          id="luma-ticket-btn-tickets"
          className="px-8 py-4 text-base font-bold md:px-10 md:py-5 md:text-lg"
        />
      </div>
    </section>
  );
};

export default Tickets;
