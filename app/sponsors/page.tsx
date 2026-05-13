import { Container } from "@/components/container";
import Sponsors from "@/sections/Sponsors";

const SponsorsPage = () => {
  return (
    <div className={"flex justify-center"}>
      <main className={"w-full max-w-7xl pt-[25px] lg:pt-0 z-20 pb-40"}>
        <Container>
          <div className={"mt-[100px] md:mt-[20vh]"}>
            <Sponsors />
          </div>
        </Container>
      </main>
    </div>
  );
};

export default SponsorsPage;
