import type { Radical, RadicalRole } from "../../types/kanji";

interface Props {
  char: string;
  meanings: string[];
  radicals: Radical[];
  radicalRoles?: RadicalRole[];
}

// 부수 A + 부수 B = 한자 C 결합을 시각화
export default function RadicalCombiner({
  char,
  meanings,
  radicals,
  radicalRoles = [],
}: Props) {
  if (radicals.length === 0) return null;

  const personaOf = (c: string) =>
    radicalRoles.find((r) => r.char === c)?.persona;

  // 단일 부수 한자(본뜬 글자)는 결합이 의미 없음 — 간소화된 뷰
  const isPictograph = radicals.length === 1 && radicals[0].char === char;

  if (isPictograph) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl p-6 text-[#f5f0e8]">
        <h3 className="text-sm font-bold tracking-wider uppercase text-[#9b9bab] mb-4">
          부수 분해
        </h3>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white/10 border border-white/15 rounded-lg px-6 py-4 text-center text-[#f5f0e8]">
            <span className="block font-serif text-4xl font-bold mb-1">
              {radicals[0].char}
            </span>
            <span className="text-xs text-[#9b9bab]">
              {radicals[0].meaning}
            </span>
          </div>
          <span className="text-[11px] text-[#9b9bab] italic mt-1">
            단일 부수 — 사물의 모양을 본뜬 글자
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 text-[#f5f0e8]">
      <h3 className="text-sm font-bold tracking-wider uppercase text-[#9b9bab] mb-5">
        부수 결합
      </h3>

      <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
        {radicals.map((r, i) => {
          const persona = personaOf(r.char);
          return (
            <div key={`${r.char}-${i}`} className="flex items-center gap-2 md:gap-3">
              {i > 0 && (
                <span className="text-2xl text-[#6b6b7b] font-bold">+</span>
              )}
              <div className="bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-center text-[#f5f0e8] min-w-[88px]">
                <span className="block font-serif text-3xl font-bold mb-1">
                  {r.char}
                </span>
                <span className="block text-xs text-[#9b9bab]">
                  {r.meaning}
                </span>
                {persona && (
                  <span className="block text-[11px] text-accent mt-1 italic">
                    {persona}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* 결합 화살표 */}
        <span className="text-2xl text-[#6b6b7b] font-bold mx-1">=</span>

        {/* 최종 한자 */}
        <div className="bg-accent/20 border-2 border-accent rounded-lg px-5 py-3 text-center min-w-[96px]">
          <span className="block font-serif text-4xl font-bold mb-1 text-white">
            {char}
          </span>
          <span className="block text-xs text-[#e5d5c3]">
            {meanings.slice(0, 2).join(", ")}
          </span>
        </div>
      </div>
    </div>
  );
}
