import type { Mnemonic } from "../../types/kanji";

interface Props {
  mnemonic: Mnemonic;
}

// 스토리 문자열에서 부수 글자를 찾아 하이라이트한 조각들로 분해
function highlightRadicals(
  story: string,
  radicalChars: string[],
): Array<{ text: string; isRadical: boolean }> {
  if (radicalChars.length === 0) return [{ text: story, isRadical: false }];

  const pattern = new RegExp(
    `(${radicalChars.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const parts = story.split(pattern);
  return parts
    .filter((p) => p.length > 0)
    .map((p) => ({ text: p, isRadical: radicalChars.includes(p) }));
}

export default function MnemonicStory({ mnemonic }: Props) {
  if (!mnemonic) return null;

  const { radicalRoles, story, keyImage, imagery } = mnemonic;
  const radicalChars = radicalRoles.map((r) => r.char);
  const storyPieces = highlightRadicals(story, radicalChars);
  const imageryPieces = imagery
    ? highlightRadicals(imagery, radicalChars)
    : [];
  const hasOrigins = radicalRoles.some((r) => r.origin);

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* 핵심 이미지 — 한 줄 강력 이미지 */}
      {keyImage && (
        <div className="border-l-4 border-accent pl-4 py-1">
          <p className="text-lg md:text-xl font-bold text-ink leading-snug">
            {keyImage}
          </p>
        </div>
      )}

      {/* 부수별 글자 유래 (origin이 있을 때만 표시) */}
      {hasOrigins && (
        <div className="space-y-2.5">
          {radicalRoles.map((r, i) => (
            <p
              key={`${r.char}-origin-${i}`}
              className="text-[15px] leading-relaxed text-ink"
            >
              <span className="font-serif font-bold text-accent text-lg mr-1">
                {r.char}
              </span>
              {r.name && (
                <span className="text-stone text-sm mr-1">({r.name})</span>
              )}
              <span className="text-stone-light mx-1">=</span>
              <span>{r.origin}</span>
            </p>
          ))}
        </div>
      )}

      {/* 부수 페르소나 — origin이 없을 때만 페르소나 칩 표시 (구버전 호환) */}
      {!hasOrigins && radicalRoles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {radicalRoles.map((r, i) => (
            <span
              key={`${r.char}-${i}`}
              className="inline-flex items-baseline gap-1.5 bg-paper border border-border rounded-full px-3 py-1"
            >
              <span className="font-serif text-base font-bold text-accent">
                {r.char}
              </span>
              <span className="text-xs text-stone">= {r.persona}</span>
            </span>
          ))}
        </div>
      )}

      {/* 본 스토리 — 부수 글자 하이라이트 */}
      <p className="text-[15px] leading-relaxed text-ink">
        {storyPieces.map((p, i) =>
          p.isRadical ? (
            <span
              key={i}
              className="font-serif font-bold text-accent bg-accent/10 rounded px-1"
            >
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          ),
        )}
      </p>

      {/* 감각적 장면 — 구체적 시청각 이미지 */}
      {imagery && (
        <div className="rounded-lg bg-accent/5 border-l-4 border-accent-light pl-4 py-3">
          <p className="text-[15px] leading-relaxed text-ink">
            {imageryPieces.map((p, i) =>
              p.isRadical ? (
                <span
                  key={i}
                  className="font-serif font-bold text-accent bg-accent/10 rounded px-1"
                >
                  {p.text}
                </span>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </p>
        </div>
      )}
    </div>
  );
}
