import { Button } from "@/components/button";

// Tally form: applicants fill this in on Tally, in a new tab.
const TALLY_FORM_URL = "https://tally.so/r/Xx7WVP";

export const SpeakerApplicationForm = () => (
  <Button buttonType="cta" asChild className="w-fit px-8 py-4 text-base">
    <a href={TALLY_FORM_URL} target="_blank" rel="noopener noreferrer">
      Apply to Speak
    </a>
  </Button>
);

export default SpeakerApplicationForm;
