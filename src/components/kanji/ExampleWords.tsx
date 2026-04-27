import type { Example } from "../../types/kanji";

interface Props {
  examples: Example[];
}

export default function ExampleWords({ examples }: Props) {
  if (examples.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-bold tracking-wider uppercase text-accent mb-3">
        예제 단어
      </h3>
      <div className="space-y-2">
        {examples.map((ex, i) => (
          <div key={i} className="flex items-baseline gap-3 text-sm">
            <span className="font-serif font-bold text-ink text-base">
              {ex.word}
            </span>
            <span className="text-stone-light">{ex.reading}</span>
            <span className="text-stone">{ex.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
