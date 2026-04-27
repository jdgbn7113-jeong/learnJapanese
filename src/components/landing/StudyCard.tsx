import { Link } from "react-router-dom";

type Tone = "story" | "words" | "kanji";

interface Props {
  tone: Tone;
  glyph: string;
  title: string;
  subTitle: string;
  description: string;
  to: string;
  featured?: boolean;
}

const toneClasses: Record<Tone, { tint: string; soft: string; ring: string; gradient: string }> = {
  story: {
    tint: "text-story",
    soft: "bg-story-soft",
    ring: "border-story/25 hover:border-story",
    gradient: "from-white to-story-soft",
  },
  words: {
    tint: "text-words",
    soft: "bg-words-soft",
    ring: "",
    gradient: "",
  },
  kanji: {
    tint: "text-kanji",
    soft: "bg-kanji-soft",
    ring: "",
    gradient: "",
  },
};

/**
 * StudyCard — 3 categories. `featured` enlarges the card, fills the glyph mark,
 * and switches the arrow to a circular filled badge. Used for the MAIN (소설) card.
 */
export default function StudyCard({
  tone, glyph, title, subTitle, description, to, featured,
}: Props) {
  const t = toneClasses[tone];

  if (featured) {
    return (
      <Link
        to={to}
        className={`group relative grid grid-cols-[72px_1fr_auto] items-center gap-[18px] rounded-card border-[1.5px] ${t.ring} bg-gradient-to-br ${t.gradient} px-7 py-7 text-ink transition-[transform,box-shadow,border-color] duration-200 shadow-featured hover:-translate-y-[3px] hover:shadow-featured-hover`}
      >
        <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-story font-jp text-[36px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(124,92,245,0.6)]">
          {glyph}
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2.5 text-[19px] font-bold tracking-snug text-ink">
            {title}
            <span className="font-jp text-[12px] font-medium tracking-wide text-ink-faint">
              {subTitle}
            </span>
          </div>
          <div className="text-[14px] font-medium leading-[1.5] text-ink-soft">
            {description}
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-story text-[18px] text-white transition group-hover:translate-x-1">
          →
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className="group relative grid grid-cols-[56px_1fr_auto] items-center gap-[18px] rounded-card border border-line bg-surface-card px-6 py-[22px] text-ink transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
    >
      <div className={`grid h-12 w-12 place-items-center rounded-[14px] ${t.soft} font-jp text-[26px] font-medium ${t.tint}`}>
        {glyph}
      </div>
      <div>
        <div className="mb-1 flex items-baseline gap-2 text-base font-bold tracking-snug text-ink">
          {title}
          <span className="font-jp text-[12px] font-medium tracking-wide text-ink-faint">
            {subTitle}
          </span>
        </div>
        <div className="text-[13px] font-medium leading-[1.5] text-ink-faint">
          {description}
        </div>
      </div>
      <div className="text-[20px] font-semibold text-ink-faint2 transition group-hover:translate-x-1 group-hover:text-ink">
        →
      </div>
    </Link>
  );
}
