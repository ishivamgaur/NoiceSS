import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Frame } from "@/components/brand/frame";
import Mockup, { GitHubIcon } from "./Mockup";
import Reveal from "./Reveal";
import RevealObserver from "./RevealObserver";
import { Wordmark } from "@/components/brand/logo-noise";
import Grain from "./Grain";
import { PERSPECTIVES, ASPECT_CATEGORIES, MACOS_BACKGROUNDS, NATURE_BACKGROUNDS, RAYCAST_BACKGROUNDS } from "@/lib/constants";

const ratios = ASPECT_CATEGORIES.reduce((n, c) => n + c.ratios.length, 0);
const backdrops = MACOS_BACKGROUNDS.length + NATURE_BACKGROUNDS.length + RAYCAST_BACKGROUNDS.length;

const showcase = [
  {
    img: "/landing/s-perspective.webp",
    alt: "Photograph rendered in isometric 3D perspective inside a glass border on a dark green backdrop",
    kicker: "Angle",
    title: "Tilt it",
    body: `${PERSPECTIVES.length} presets, or set pitch, yaw, roll and depth yourself.`,
  },
  {
    img: "/landing/s-glass.webp",
    alt: "Photograph inside a thick translucent glass border over a Sequoia forest backdrop",
    kicker: "Light",
    title: "Light it",
    body: "Backdrop blur, shadow depth and a frosted border that picks up the wallpaper.",
  },
  {
    img: "/landing/s-noise.webp",
    alt: "Photograph with heavy noise and film grain applied across canvas and image",
    kicker: "Texture",
    title: "Texture it",
    body: "Noise and film grain, applied to the canvas, the image, or both.",
  },
];

const primaryBtn =
  "rounded-lg border border-transparent bg-white font-semibold text-black shadow-lg shadow-white/10 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.96]";
const studioBtn =
  "rounded-lg border border-transparent bg-white/[0.03] text-zinc-200 transition-all duration-200 hover:bg-white/[0.07] hover:text-white active:scale-[0.96]";

export default function Landing() {
  return (
    <div data-scrolling-page className="min-h-[100dvh] w-full overflow-x-clip bg-bg-dark text-text-main antialiased">
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-reveal-ready','')" }} />
      <RevealObserver />

      <Frame shape="box" className="mx-auto w-[min(100%,1240px)] px-3 py-3 md:px-6 md:py-5">
        <div className="relative rounded-[3px] bg-bg-dark">
          <nav
            aria-label="Primary"
            className="sticky top-4 z-[200] mx-auto flex w-[min(100%,52rem)] items-center justify-between gap-4 rounded-md border border-dashed border-line bg-bg-dark/90 px-3 py-1 backdrop-blur-md md:px-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Wordmark />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <a
                href="https://github.com/ishivamgaur/noiceSS"
                target="_blank"
                rel="noreferrer"
                aria-label="Star NoiceSS on GitHub"
                className="hidden size-8 items-center justify-center rounded-[3px] text-zinc-400 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white active:scale-[0.96] sm:flex"
              >
                <GitHubIcon size={15} />
              </a>
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                className={`${primaryBtn} h-8 rounded-[3px] px-4 text-xs`}
              >
                Open studio
              </Button>
            </div>
          </nav>

          <main>
            <section className="relative overflow-hidden">
              <Grain className="opacity-[0.03] mix-blend-overlay" />
              <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 text-center md:px-10 md:pt-24 md:pb-20">
                <Reveal>
                  <h1 className="mx-auto max-w-[15ch] text-balance text-[clamp(2.5rem,8vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
                    Make the screenshot look designed.
                  </h1>
                </Reveal>
                <Reveal delay={80}>
                  <p className="mx-auto mt-6 max-w-[46ch] text-pretty text-base leading-relaxed text-text-muted">
                    A real frame, a real angle, real lighting. Free and open source.
                  </p>
                </Reveal>
                <Reveal delay={160}>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                    <Frame>
                      <Button nativeButton={false} render={<Link href="/" />} className={`${primaryBtn} h-11 px-6`}>
                        Start designing
                        <ArrowRight size={16} />
                      </Button>
                    </Frame>
                    <Frame>
                      <Button
                        nativeButton={false}
                        render={<a href="https://github.com/ishivamgaur/noiceSS" target="_blank" rel="noreferrer" />}
                        variant="outline"
                        className={`${studioBtn} h-11 px-6`}
                      >
                        <GitHubIcon size={16} />
                        Star on GitHub
                      </Button>
                    </Frame>
                  </div>
                </Reveal>

                <Reveal delay={240} className="mt-16 md:mt-24">
                  <Mockup />
                </Reveal>
              </div>
            </section>

            <section aria-label="Capabilities" className="border-y border-dashed border-line">
              <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4 md:px-10">
                {[
                  { k: "Ratios", v: ratios },
                  { k: "Backdrops", v: backdrops },
                  { k: "Angles", v: PERSPECTIVES.length },
                  { k: "Export", v: "4K" },
                ].map((s, i) => (
                  <Reveal
                    key={s.k}
                    delay={i * 50}
                    className={`border-white/5 py-7 md:border-l md:px-6 ${i === 0 ? "md:border-l-0 md:pl-0" : ""} ${i % 2 === 1 ? "border-l pl-6" : ""}`}
                  >
                    <dt className="text-[11px] uppercase tracking-wider text-zinc-500">{s.k}</dt>
                    <dd className="mt-1.5 font-mono text-2xl tabular-nums text-white">{s.v}</dd>
                  </Reveal>
                ))}
              </dl>
            </section>

            <section aria-label="Showcase">
              <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
                {showcase.map((f, i) => {
                  const flip = i % 2 === 1;
                  return (
                    <Reveal key={f.title}>
                      <div
                        className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
                          i > 0 ? "mt-16 border-t border-dashed border-line pt-16 md:mt-24 md:pt-24" : ""
                        }`}
                      >
                        <div className={flip ? "md:order-2" : ""}>
                          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">{f.kicker}</p>
                          <h2 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-white">
                            {f.title}
                          </h2>
                          <p className="mt-4 max-w-[40ch] text-pretty text-[15px] leading-relaxed text-text-muted">
                            {f.body}
                          </p>
                        </div>
                        <figure
                          className={`overflow-hidden rounded-xl border border-white/5 bg-panel ${flip ? "md:order-1" : ""}`}
                        >
                          <img src={f.img} alt={f.alt} loading="lazy" className="block w-full" />
                        </figure>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            <section className="border-t border-dashed border-line">
              <div className="mx-auto max-w-2xl px-5 py-20 text-center md:px-10 md:py-28">
                <Reveal>
                  <h2 className="text-balance text-[clamp(1.75rem,5vw,2.5rem)] font-medium leading-tight tracking-[-0.03em] text-white">
                    Try it on something you already built
                  </h2>
                  <p className="mx-auto mt-4 max-w-[42ch] text-pretty text-[15px] leading-relaxed text-text-muted">
                    No account. Nothing uploaded. Everything runs in the browser.
                  </p>
                  <Frame className="mt-8">
                    <Button nativeButton={false} render={<Link href="/" />} className={`${primaryBtn} h-11 px-6`}>
                      Open NoiceSS
                      <ArrowRight size={16} />
                    </Button>
                  </Frame>
                </Reveal>
              </div>
            </section>
          </main>

          <footer className="border-t border-dashed border-line">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-7 md:px-10">
              <p className="text-[12px] text-zinc-600">NoiceSS - open source screenshot mockup studio</p>
              <a
                href="https://github.com/ishivamgaur/noiceSS"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-2 py-1.5 text-[12px] text-zinc-600 transition-colors duration-200 hover:bg-white/[0.04] hover:text-zinc-300"
              >
                GitHub
              </a>
            </div>
          </footer>
        </div>
      </Frame>
    </div>
  );
}
