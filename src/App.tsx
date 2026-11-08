import { useCallback, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectDialog } from "./components/ProjectDialog";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { WhatsAppIcon } from "./components/ui";
import { useInView } from "./lib/hooks";
import { genericMessage, whatsappUrl } from "./lib/whatsapp";

export default function App() {
  // O header ganha fundo assim que a página sai do topo.
  const [topRef, atTop] = useInView<HTMLDivElement>({ once: false, rootMargin: "0px", threshold: 0 });
  // O hero fica parado enquanto a página sobe; o WhatsApp flutuante aparece depois da primeira tela.
  const [heroZoneRef, heroVisible] = useInView<HTMLDivElement>({ once: false, rootMargin: "-88px 0px 0px 0px", threshold: 0 });
  const [contactRef, contactVisible] = useInView<HTMLDivElement>({ once: false, rootMargin: "0px", threshold: 0 });
  const [openProject, setOpenProject] = useState<string | null>(null);
  const close = useCallback(() => setOpenProject(null), []);

  const showFloat = !heroVisible && !contactVisible;

  return (
    <>
      <div ref={topRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[120px] w-px" />
      <div ref={heroZoneRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[85dvh] w-px" />
      <Header solid={!atTop} />
      <main>
        <Hero onOpenProject={setOpenProject} visible={heroVisible} />
        <About />
        <Projects onOpen={setOpenProject} />
        <Services />
        <Team />
      </main>
      <div ref={contactRef}>
        <Contact />
      </div>

      <a
        href={whatsappUrl(genericMessage)}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar no WhatsApp"
        data-visible={showFloat}
        tabIndex={showFloat ? 0 : -1}
        className="float-in btn on-dark fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center bg-aco text-nevoa shadow-[0_10px_30px_-8px_rgb(15_26_43/0.45)] hover:bg-aco-escuro md:right-8 md:bottom-8 md:size-16"
      >
        <WhatsAppIcon />
      </a>

      <ProjectDialog projectId={openProject} onClose={close} />
      <Cursor />
    </>
  );
}
