import { Link } from "react-router-dom";
import type { Kanji } from "../../types/kanji";

interface Props {
  kanji: Kanji;
}

export default function KanjiCard({ kanji }: Props) {
  return (
    <Link
      to={`/kanji/${kanji.char}`}
      className="bg-card border border-border rounded-xl p-4 text-center no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all group"
    >
      <span className="block font-serif text-4xl font-bold text-ink group-hover:text-accent transition-colors">
        {kanji.char}
      </span>
      <span className="block text-xs text-stone mt-2 truncate">
        {kanji.meanings.join(", ")}
      </span>
      <span className="block text-[11px] text-stone-light mt-1 truncate">
        {kanji.readings.onyomi.join(", ")}
      </span>
    </Link>
  );
}
