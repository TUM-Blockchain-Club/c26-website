import { Button } from "@/components/button";

// Tally form: applicants fill this in on Tally, in a new tab.
const TALLY_FORM_URL = "https://tally.so/r/Xx7WVP";

// Applications are not open yet — the button is disabled for now. Flip this to
// true to re-enable the link without touching anything else.
const APPLICATIONS_OPEN = false;

export const SpeakerApplicationForm = () => (
  <Button
    buttonType="cta"
    asChild
    className={`w-fit px-8 py-4 text-base ${
      APPLICATIONS_OPEN
        ? ""
        : "pointer-events-none cursor-not-allowed opacity-50"
    }`}
  >
    <a
      href={TALLY_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!APPLICATIONS_OPEN}
      tabIndex={APPLICATIONS_OPEN ? undefined : -1}
    >
      Apply to Speak
    </a>
  </Button>
);

export default SpeakerApplicationForm;
