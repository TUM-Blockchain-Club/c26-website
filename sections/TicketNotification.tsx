import { NewsletterSignup } from "@/components/newsletter";
import { Text } from "@/components/text";

const TicketNotification = () => {
  return (
    <section className="w-full" aria-labelledby="ticket-notification-title">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[5px] border border-white/15 bg-white/[0.04] p-6 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex max-w-lg flex-col gap-3">
          <Text
            as="p"
            textType="sub_title"
            className="text-gradient"
            id="ticket-notification-title"
          >
            Get notified once tickets are available
          </Text>
          <Text as="p" textType="paragraph" className="text-white/75">
            Join the list and we will send the ticket drop announcement straight
            to your inbox.
          </Text>
        </div>
        <NewsletterSignup
          label="Ticket alerts"
          initialMessage="Leave your email for the ticket drop."
          source="c26-website-ticket-alerts"
          successMessage="Check your inbox to confirm ticket alerts."
        />
      </div>
    </section>
  );
};

export default TicketNotification;
