import type { ReactNode } from "react";
import StudyCard from "./StudyCard";

/**
 * Hero section — left: copy + meta, right: 3 study cards (소설 = featured/MAIN).
 * Wrapped to max-w-hero (1280px) and centered.
 */
export default function Hero() {
  return (
    <section className="relative mx-auto grid min-h-screen max-w-hero grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-8 px-16 pb-20 pt-24 max-[1280px]:grid-cols-1 max-[1280px]:gap-7 max-[1280px]:px-12 max-[860px]:px-5 max-[860px]:pt-12">
      {/* LEFT — copy */}
      <div className="max-w-[720px]">
        <h1 className="mb-6 text-balance text-[clamp(42px,5vw,64px)] font-extrabold leading-[1.18] tracking-tightest text-ink">
          준비없이 바로
          <br />
          <span className="text-brand">일본어</span>를
          <br />
          시작하세요.
          <span className="mt-3.5 block font-jp text-[0.32em] font-medium tracking-[0.16em] text-ink-faint">
            毎日すこしずつ、ことばを編む
          </span>
        </h1>
        <p className="mb-8 max-w-[460px] text-[18px] font-medium leading-[1.6] text-ink-soft">
          짧은 소설 한 페이지.
          <br />
          부담 없이 시작해서 꾸준히 이어가요.
        </p>
        <div className="flex flex-wrap gap-6 text-[13px] font-semibold text-ink-faint">
          <MetaPip>JLPT N5–N1</MetaPip>
          <MetaPip>회원가입 불필요</MetaPip>
        </div>
      </div>

      {/* RIGHT — study cards */}
      <div className="flex flex-col gap-3">
        <StudyCard
          tone="story"
          featured
          glyph="物"
          title="소설"
          subTitle="ものがたり"
          description="짧은 소설과 일상의 장면으로 일본어를 만나는, 가장 자연스러운 학습 방법"
          to="/novel"
        />
        <StudyCard
          tone="words"
          glyph="語"
          title="단어"
          subTitle="ことば"
          description="소설에 있는 단어를 바로바로"
          to="/vocab/n5"
        />
        <StudyCard
          tone="kanji"
          glyph="漢"
          title="한자"
          subTitle="かんじ"
          description="부수와 연상으로 배우는 한자"
          to="/jlpt/n5"
        />
      </div>
    </section>
  );
}

function MetaPip({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-soft text-[10px] font-extrabold text-brand">
        ✓
      </span>
      {children}
    </span>
  );
}
