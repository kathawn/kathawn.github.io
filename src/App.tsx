import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Scene from "./scene/Scene";
import { rig } from "./scene/rig";
import {
  boardverse,
  cinema,
  education,
  figures,
  highlights,
  objective,
  person,
  scholarship,
  skills,
} from "./content";

gsap.registerPlugin(ScrollTrigger);

/** Tách chữ thành từng ký tự (giữ nguyên từ để không xuống dòng giữa từ) */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span key={wi}>
          {wi > 0 ? " " : null}
          <span className="word">
            {[...word].map((ch, ci) => (
              <span className="char" key={ci}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

function Count({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return (
    <span data-count={value} data-dec={decimals}>
      {value.toFixed(decimals)}
    </span>
  );
}

function Spec({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="spec" data-reveal>
      {rows.map(([k, v]) => (
        <div className="spec-row" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function CopyRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const [state, setState] = useState<"idle" | "done" | "manual">("idle");
  const ref = useRef<HTMLSpanElement>(null);
  const copy = () => {
    const done = () => {
      setState("done");
      setTimeout(() => setState("idle"), 1600);
    };
    const manual = () => {
      const el = ref.current;
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
      setState("manual");
      setTimeout(() => setState("idle"), 2200);
    };
    try {
      navigator.clipboard.writeText(value).then(done, manual);
    } catch {
      manual();
    }
  };
  return (
    <div className="contact-row">
      <span className="contact-label">{label}</span>
      {href ? (
        <a className="contact-value" href={href} ref={ref as never}>
          {value}
        </a>
      ) : (
        <span className="contact-value" ref={ref}>
          {value}
        </span>
      )}
      <button type="button" className="copy" onClick={copy} id={`copy-${label.toLowerCase()}`}>
        {state === "done" ? "Copied" : state === "manual" ? "Selected — press Ctrl+C" : "Copy"}
      </button>
    </div>
  );
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLParagraphElement>(null);
  const progress = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rig.reduced = reduced;

    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const onPointer = (e: PointerEvent) => {
      rig.px = (e.clientX / window.innerWidth) * 2 - 1;
      rig.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // điều hướng mượt trong trang
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id === "#top" ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      else (el as HTMLElement).scrollIntoView();
    };
    document.addEventListener("click", onClick);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // ---------------- mở màn
      if (reduced) {
        rig.intro = 1;
      } else {
        gsap.to(rig, { intro: 1, duration: 2.6, ease: "power2.out", delay: 0.15 });
        gsap.from(".hero .char", {
          yPercent: 55,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1.2,
          stagger: 0.035,
          ease: "power3.out",
          delay: 0.25,
        });
        gsap.from(".hero [data-in]", {
          y: 26,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.85,
        });
        gsap.from(".nav", { y: -30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.6 });
      }

      // ---------------- bút dạ quang + hiện dần + bộ đếm
      gsap.utils.toArray<HTMLElement>(".hl").forEach((el) => {
        gsap.fromTo(
          el,
          { backgroundSize: "0% 100%" },
          {
            backgroundSize: "100% 100%",
            duration: reduced ? 0 : 1.1,
            ease: "power2.inOut",
            delay: el.closest(".hero") ? 1.5 : 0,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const dec = Number(el.dataset.dec || 0);
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 1.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
            onStart: () => {
              el.textContent = (0).toFixed(dec);
            },
            onUpdate: () => {
              el.textContent = o.v.toFixed(dec);
            },
          });
        });
      }

      // ---------------- băng chữ chạy
      const marquee = gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 38,
        ease: "none",
        paused: reduced,
      });

      // ---------------- các bước BoardVerse
      const steps = gsap.utils.toArray<HTMLElement>(".step");
      const bar = document.querySelector<HTMLElement>(".step-bar i");
      let active = -1;
      const setActive = (n: number) => {
        if (n === active) return;
        active = n;
        steps.forEach((el, i) => el.classList.toggle("is-active", i === n));
      };
      setActive(0);

      mm.add("(min-width: 900px)", () => {
        ScrollTrigger.create({
          trigger: ".steps-pin",
          start: "top top",
          end: `+=${steps.length * 65}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const s = self.progress * (steps.length - 1);
            rig.step = s;
            setActive(Math.round(s));
            if (bar) bar.style.transform = `scaleY(${self.progress})`;
          },
        });
      });
      mm.add("(max-width: 899px)", () => {
        steps.forEach((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 65%",
            end: "bottom 65%",
            onToggle: (self) => {
              if (!self.isActive) return;
              setActive(i);
              gsap.to(rig, { step: i, duration: 0.7, ease: "power2.out" });
              if (bar) bar.style.transform = `scaleY(${(i + 1) / steps.length})`;
            },
          }),
        );
      });

      // ---------------- cuộn → bố cục 3D
      const secs = gsap.utils.toArray<HTMLElement>("[data-sec]");
      const anchors = secs.map((el) => ScrollTrigger.create({ trigger: el, start: "top top" }));
      let figIdx = -1;
      const update = () => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        let tgt = 0;
        for (let i = 1; i < anchors.length; i++) {
          const S = anchors[i].start;
          tgt += gsap.utils.clamp(0, 1, (y - (S - 0.9 * vh)) / (0.7 * vh));
        }
        rig.target = tgt;
        const idx = Math.round(tgt);
        if (idx !== figIdx && fig.current) {
          figIdx = idx;
          const el = fig.current;
          gsap.fromTo(
            el,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true },
          );
          el.textContent = figures[idx] ?? "";
          // chú thích nằm cùng phía với mô hình 3D
          el.classList.toggle("is-left", idx === 3);
        }
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          update();
          if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
          const v = Math.min(Math.abs(self.getVelocity()) / 900, 3);
          gsap.to(marquee, { timeScale: 1 + v, duration: 0.4, overwrite: true });
        },
        onRefresh: update,
      });
      update();
    }, root);

    // ảnh/phông tải xong thì tính lại vị trí
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onClick);
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={root}>
      <Scene />
      <div className="blueprint" aria-hidden="true" />

      <header className="nav">
        <a href="#top" className="brand" aria-label="Back to top">
          N<span>·</span>M<span>·</span>Q
        </a>
        <nav aria-label="Sections">
          <a href="#highlights">Highlights</a>
          <a href="#work">Projects</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#contact" className="nav-cta">
            Contact
          </a>
        </nav>
        <i className="nav-progress" ref={progress} />
      </header>

      <p className="figcap" ref={fig} aria-hidden="true">
        {figures[0]}
      </p>

      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className="sec hero" id="top" data-sec="0">
          <div className="col">
            <p className="eyebrow" data-in>
              Portfolio · {person.role} · {person.location}
            </p>
            <h1 className="hero-name">
              <span className="line">
                <Chars text={person.first} />
              </span>
              <span className="line accent">
                <Chars text={person.last} />
              </span>
            </h1>
            <p className="lede" data-in>
              I turn business needs into <span className="hl">clear requirements</span>, process models and
              relational database designs that both stakeholders and developers can build from.
            </p>
            <ul className="hero-meta" data-in>
              <li>MIS student · Thuongmai University</li>
              <li>GPA 3.6/4.0</li>
              <li>TOEIC L&amp;R 850</li>
            </ul>
            <div className="cta" data-in>
              <a href="#work" className="btn btn-primary">
                See projects
              </a>
              <a href="#contact" className="btn">
                Get in touch
              </a>
            </div>
          </div>
          <p className="scroll-hint" data-in>
            Scroll — the scattered cards are requirements. Watch them become a system.
          </p>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((n) => (
              <span key={n}>
                Requirement Elicitation <b>◆</b> BRD <b>◆</b> SRS <b>◆</b> SDD <b>◆</b> User Stories <b>◆</b>{" "}
                Acceptance Criteria <b>◆</b> UML <b>◆</b> BPMN <b>◆</b> ERD <b>◆</b> SQL Server <b>◆</b> Agile &amp;
                Scrum <b>◆</b>{" "}
              </span>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- HIGHLIGHTS */}
        <section className="sec" id="highlights" data-sec="1">
          <div className="col">
            <p className="eyebrow" data-reveal>
              §1 · Highlights
            </p>
            <h2 data-reveal>
              Results on the <span className="hl">record</span>
            </h2>
            <div className="stats" data-reveal>
              {highlights.map((h) => (
                <div className="stat" key={h.id}>
                  <span className="stat-label">{h.label}</span>
                  <span className="stat-num">
                    <Count value={h.value} decimals={h.decimals} />
                    {h.suffix && <small>{h.suffix}</small>}
                  </span>
                  <span className="stat-cap">{h.caption}</span>
                </div>
              ))}
            </div>
            <div className="award" data-reveal>
              <span className="stamp">Awarded</span>
              <div>
                <p className="award-title">{scholarship.title}</p>
                <p className="award-when">{scholarship.when}</p>
              </div>
            </div>
            <Spec
              rows={[
                ["Education", `${education.school}, ${education.city}`],
                ["Degree", education.degree],
                ["Graduation", "Expected June 2027"],
              ]}
            />
          </div>
        </section>

        {/* ---------------------------------------------------- BOARDVERSE */}
        <section className="sec project" id="work" data-sec="2">
          <div className="col">
            <p className="eyebrow" data-reveal>
              §2 · Featured project · {boardverse.code}
            </p>
            <h2 className="proj-title" data-reveal>
              {boardverse.name}
            </h2>
            <p className="proj-tag" data-reveal>
              {boardverse.tagline}
            </p>
            <Spec
              rows={[
                ["Role", boardverse.role],
                ["Type", boardverse.kind],
                ["Period", boardverse.period],
                ["Stack", boardverse.stack.join(" · ")],
                [
                  "Repository",
                  <a href={boardverse.repoHref} target="_blank" rel="noreferrer" key="r">
                    github.com/{boardverse.repo} ↗
                  </a>,
                ],
              ]}
            />
            <div className="stats stats-4" data-reveal>
              {boardverse.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">
                    <Count value={s.value} />
                  </span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="steps-pin">
            <div className="col steps">
              <p className="eyebrow">How it was built</p>
              <div className="steps-body">
                <div className="step-bar" aria-hidden="true">
                  <i />
                </div>
                <ol>
                  {boardverse.steps.map((s, i) => (
                    <li className="step" key={s.title}>
                      <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                      <div className="step-content">
                        <h3>{s.title}</h3>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- CINEMA */}
        <section className="sec project right" id="cinema" data-sec="3">
          <div className="col">
            <p className="eyebrow" data-reveal>
              §3 · Project · {cinema.code}
            </p>
            <h2 className="proj-title" data-reveal>
              {cinema.name}
            </h2>
            <p className="proj-tag" data-reveal>
              {cinema.tagline}
            </p>
            <Spec
              rows={[
                ["Role", cinema.role],
                ["Type", cinema.kind],
                ["Date", cinema.period],
                ["Deliverable", cinema.deliverable],
                ["Stack", cinema.stack.join(" · ")],
              ]}
            />
            <div className="stats stats-4" data-reveal>
              {cinema.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <span className="stat-num">
                    <Count value={s.value} />
                  </span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="points">
              {cinema.points.map((p) => (
                <div className="point" key={p.title} data-reveal>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- TOOLKIT */}
        <section className="sec" id="toolkit" data-sec="4">
          <div className="col">
            <p className="eyebrow" data-reveal>
              §4 · Toolkit
            </p>
            <h2 data-reveal>
              Methods and <span className="hl">tools</span>
            </h2>
            <p className="body" data-reveal>
              {objective}
            </p>
            <div className="lanes">
              {skills.map((l) => (
                <div className="lane" key={l.lane} data-reveal>
                  <p className="lane-head">
                    <span>{l.lane}</span>
                    <span>{String(l.items.length).padStart(2, "0")}</span>
                  </p>
                  <ul>
                    {l.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- CONTACT */}
        <section className="sec contact" id="contact" data-sec="5">
          <div className="col">
            <p className="eyebrow" data-reveal>
              §5 · Contact
            </p>
            <h2 className="contact-title" data-reveal>
              Ready to bring this to a <span className="hl">real team</span>.
            </h2>
            <p className="body" data-reveal>
              Looking for a place to apply requirement analysis, process modeling and database design in a real-world
              working environment.
            </p>
            <div className="contact-list" data-reveal>
              <CopyRow label="Email" value={person.email} href={`mailto:${person.email}`} />
              <CopyRow label="Phone" value={person.phone} href={`tel:${person.phoneHref}`} />
              <div className="contact-row">
                <span className="contact-label">LinkedIn</span>
                <a className="contact-value" href={person.linkedinHref} target="_blank" rel="noreferrer">
                  {person.linkedin} ↗
                </a>
                <span />
              </div>
              <div className="contact-row">
                <span className="contact-label">Based in</span>
                <span className="contact-value">{person.location}, Vietnam</span>
                <span />
              </div>
            </div>
          </div>
          <footer className="foot">
            <span>© 2026 {person.name}</span>
            <span>Built with React Three Fiber &amp; GSAP</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
