import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import DuotonePlate from "@/components/Duotone/DuotonePlate";
import Tilt3D from "@/components/Duotone/Tilt3D";
import { SOCIAL_LINKS } from "@/lib/links";

const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Services are shown as cards with the price and the scope both visible.
 *
 * They used to sit inside an accordion, which hid the one thing a visitor
 * comes to this page to compare behind a click per row.
 */
const SERVICES = [
  {
    name: "Full prod",
    price: "R$150",
    scope:
      "Produção completa, composição, arranjo, mixagem, mixagem de vocais e masterização.",
  },
  {
    name: "Beat",
    price: "R$125",
    scope: "Beat feito sob medida conforme requisitos do cliente.",
  },
  {
    name: "Mix e Master",
    price: "R$125",
    scope: "Mixagem e masterização de faixas já gravadas.",
  },
];

export default function About() {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: SOFT },
        };

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar activeTab="beats" onTabChange={() => {}} />

      <main className="mx-auto w-full max-w-[1400px] px-6 pb-16 pt-24">
        {/* ------------------------------------------------------- banner */}
        <motion.div {...enter(0)} className="group">
          <DuotonePlate
            src="/cover.jpg"
            alt="Foto de capa de prxdby4le"
            priority
            className="h-40 w-full shadow-[var(--shadow-lift)] sm:h-56 lg:h-72"
          />
        </motion.div>

        {/* -------------------------------------------------------- intro */}
        <section className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-20">
          <div>
            <motion.h1
              {...enter(0.06)}
              className="masthead font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold text-foreground"
            >
              prxdby4le
            </motion.h1>

            <motion.p
              {...enter(0.14)}
              className="font-mono-data mt-4 text-xs uppercase tracking-[0.18em] text-ink"
            >
              Produtor musical
            </motion.p>

            <motion.p
              {...enter(0.2)}
              className="mt-7 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Produção musical e criação de conteúdo. Se curtiu alguma coisa por aqui,
              me chama em qualquer uma das redes abaixo.
            </motion.p>

            <motion.ul {...enter(0.28)} className="mt-9 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ink-ghost inline-flex h-11 items-center px-5 text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div {...enter(0.12)} className="group mx-auto w-full max-w-[18rem] lg:mx-0">
            <Tilt3D max={8} lift={44}>
              <DuotonePlate
                src="/profile.jpg"
                alt="Foto de perfil de prxdby4le"
                priority
                className="aspect-square shadow-[var(--shadow-lift)]"
              />
            </Tilt3D>
          </motion.div>
        </section>

        {/* ----------------------------------------------------- services */}
        <section className="mt-24">
          <motion.div {...enter(0.05)} className="border-t border-ink/20 pt-5">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Trabalhos e valores
            </h2>
            <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
              Prazo e forma de pagamento a combinar por mensagem.
            </p>
          </motion.div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <motion.article
                key={service.name}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: SOFT }}
                className="plate flex flex-col p-6"
              >
                <h3 className="text-sm font-medium tracking-tight text-foreground">
                  {service.name}
                </h3>
                <p className="font-display mt-3 text-4xl font-bold tracking-tight text-ink">
                  {service.price}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {service.scope}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
