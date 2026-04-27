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

  const { radicalRoles, story, keyImage } = mnemonic;
  const radicalChars = radicalRoles.map((r) => r.char);
  const pieces = highlightRadicals(story, radicalChars);

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

      {/* 부수 페르소나 — 스토리 등장인물 소개 */}
      {radicalRoles.length > 0 && (
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
        {pieces.map((p, i) =>
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
  );
}
