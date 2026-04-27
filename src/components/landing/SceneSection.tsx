import React, { useEffect, useRef } from "react";

type Tone = "story" | "words" | "kanji";

interface Leaf { text: string; pos: "tl" | "tr" | "bl" | "br"; rot: number }

interface Props {
  tone: Tone;
  chapter: string;          // "Chapter 01"
  meta: string;             // "物語 · Story"
  jpHeader: string;         // "小説で、すぐに学ぶ。"
  titleWords: string[];     // ["소설로", "바로", ...] — staggered
  emWord?: string;          // word to highlight in scene-color
  body: React.ReactNode;
  tag: string;              // pill tag at bottom
  reverse?: boolean;        // image on left
  glyph?: string;           // fallback char (used if image not provided)
  image?: { src: string; alt: string };
  leaves?: Leaf[];          // floating decorative chars
}

const tones: Record<Tone, { c: string; soft: string; cssVar: string; softVar: string }> = {
  story: { c: "#7c5cf5", soft: "#f0eafe", cssVar: "story", softVar: "story-soft" },
  words: { c: "#00b894", soft: "#e6f7f3", cssVar: "words", softVar: "words-soft" },
  kanji: { c: "#f04452", soft: "#fff4f4", cssVar: "kanji", softVar: "kanji-soft" },
};

const leafPos = {
  tl: "top-[14%] left-[10%] -rotate-[8deg]",
  tr: "top-[20%] right-[12%] rotate-[12deg]",
  bl: "bottom-[18%] left-[18%] rotate-[6deg]",
  br: "bottom-[22%] right-[10%] -rotate-[10deg]",
};

/**
 * SceneSection — full-screen chapter with split layout.
 * IntersectionObserver triggers a staggered word reveal (.45s + i*.08s) and
 * fades in glyph/leaves/orbit/text. Use 3 in sequence.
 */
export default function SceneSection({
  tone, chapter, meta, jpHeader, titleWords, emWord, body, tag,
  reverse, glyph, image, leaves = [],
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const t = tones[tone];

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.querySelectorAll<HTMLElement>("[data-word]").forEach((w, i) => {
            w.style.transitionDelay = `${0.45 + i * 0.08}s`;
          });
          el.classList.add("scene-in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const sceneStyle = {
    // exposed so descendants can use var(--c) / var(--c-soft)
    ["--c" as any]: t.c,
    ["--c-soft" as any]: t.soft,
  } as React.CSSProperties;

  return (
    <section
      ref={ref}
      style={sceneStyle}
      className={`scene relative grid min-h-screen grid-cols-2 items-center gap-20 overflow-hidden px-16 py-20 max-[1280px]:gap-12 max-[1280px]:px-12 max-[860px]:grid-cols-1 max-[860px]:gap-10 max-[860px]:px-5 max-[860px]:py-16 ${reverse ? "[&>.text]:order-2 [&>.visual]:order-1 max-[860px]:[&>.text]:order-1 max-[860px]:[&>.visual]:order-2" : ""}`}
    >
      {/* TEXT */}
      <div className="text">
        <div className="scene-num mb-7 flex items-center gap-3 text-[13px] font-bold opacity-0 [transition:opacity_.9s_ease_.1s,transform_.9s_ease_.1s] [transform:translateY(20px)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:none]"
             style={{ color: t.c }}>
          <span className="scene-bar h-0.5 w-10 origin-left scale-x-0 [transition:transform_1s_cubic-bezier(.2,.7,.2,1)_.3s] [.scene-in_&]:scale-x-100"
                style={{ background: t.c }} />
          <span>{chapter}</span>
          <span className="h-1 w-1 rounded-full opacity-50" style={{ background: t.c }} />
          <span>{meta}</span>
        </div>

        <div className="mb-4 font-jp text-[17px] font-medium tracking-[0.06em] opacity-0 [transition:opacity_.9s_ease_.25s,transform_.9s_ease_.25s] [transform:translateX(-20px)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:none]"
             style={{ color: t.c }}>
          {jpHeader}
        </div>

        <h3 className="mb-8 text-balance text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.2] tracking-tightest text-ink">
          {titleWords.map((w, i) => {
            const isEm = w === emWord;
            return (
              <React.Fragment key={i}>
                <span
                  data-word
                  className="inline-block opacity-0 [transition:opacity_.8s_ease,transform_.8s_cubic-bezier(.2,.7,.2,1)] [transform:translateY(24px)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:none]"
                  style={isEm ? { color: t.c } : undefined}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </h3>

        <p className="max-w-[520px] text-[17px] font-medium leading-[1.75] text-ink-soft opacity-0 [transition:opacity_1s_ease_.8s,transform_1s_ease_.8s] [transform:translateY(20px)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:none] [&_strong]:font-bold [&_strong]:text-ink">
          {body}
        </p>

        <div
          className="mt-9 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-bold opacity-0 [transition:opacity_.9s_ease_1s,transform_.9s_ease_1s] [transform:translateY(20px)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:none]"
          style={{ background: t.soft, color: t.c }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: t.c }} />
          {tag}
        </div>
      </div>

      {/* VISUAL */}
      <div
        className="visual relative grid h-[70vh] min-h-[480px] place-items-center overflow-hidden rounded-[28px] border border-line max-[860px]:h-[50vh] max-[860px]:min-h-[360px]"
        style={{ background: t.soft }}
      >
        {/* dashed orbits */}
        <span className="pointer-events-none absolute inset-[2.5%] h-[95%] w-[95%] rounded-full border-[1.5px] border-dashed opacity-0 [transition:opacity_1.6s_ease,transform_2s_cubic-bezier(.2,.7,.2,1)] [transform:scale(0.7)_rotate(15deg)] [.scene-in_&]:opacity-35 [.scene-in_&]:[transform:scale(1)_rotate(0)]"
              style={{ borderColor: `color-mix(in srgb, ${t.c} 35%, white)` }} />
        <span className="pointer-events-none absolute inset-[15%] h-[70%] w-[70%] rounded-full border-[1.5px] border-dashed opacity-0 [transition:opacity_1.6s_ease,transform_2s_cubic-bezier(.2,.7,.2,1)] [transform:scale(0.7)_rotate(-20deg)] [.scene-in_&]:opacity-60 [.scene-in_&]:[transform:scale(1)_rotate(0)]"
              style={{ borderColor: `color-mix(in srgb, ${t.c} 35%, white)` }} />

        {leaves.map((l, i) => (
          <span
            key={i}
            className={`absolute font-jp text-2xl font-medium opacity-0 [transition:opacity_1.4s_ease,transform_1.6s_ease] [.scene-in_&]:opacity-65 ${leafPos[l.pos]}`}
            style={{ color: t.c, transform: `translateY(20px) rotate(${l.rot}deg)` }}
          >
            {l.text}
          </span>
        ))}

        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            className="relative z-[2] h-auto w-[clamp(280px,32vw,440px)] max-w-[calc(100%-64px)] object-contain opacity-0 [transition:opacity_1.2s_ease,transform_1.4s_cubic-bezier(.2,.7,.2,1)] [transform:translateY(30px)_scale(0.92)] [filter:drop-shadow(0_20px_40px_rgba(60,40,20,0.12))] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:translateY(0)_scale(1)]"
          />
        ) : (
          <div
            className="relative z-[2] font-jp font-medium leading-none tracking-[-0.04em] opacity-0 [transition:opacity_1.2s_ease,transform_1.4s_cubic-bezier(.2,.7,.2,1)] [transform:translateY(30px)_scale(0.92)] [.scene-in_&]:opacity-100 [.scene-in_&]:[transform:translateY(0)_scale(1)]"
            style={{ color: t.c, fontSize: "clamp(280px, 30vw, 460px)" }}
          >
            {glyph}
          </div>
        )}
      </div>
    </section>
  );
}
