import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKanjiData } from "../../hooks/useKanjiData";
import type { Kanji } from "../../types/kanji";

interface Props {
  large?: boolean;
}

export default function SearchBar({ large }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Kanji[]>([]);
  const [open, setOpen] = useState(false);
  const { search } = useKanjiData();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const r = search(value);
      setResults(r.slice(0, 8));
      setOpen(r.length > 0);
    }, 150);
  };

  const go = (char: string) => {
    setQuery("");
    setOpen(false);
    navigate(`/kanji/${char}`);
  };

  const goAll = () => {
    const q = query.trim();
    if (!q) return;
    setQuery("");
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const q = query.trim();
    if (!q) return;
    const exact = results.find((r) => r.char === q);
    if (exact) go(exact.char);
    else goAll();
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="한자, 뜻, 읽기로 검색..."
        className={`w-full bg-card text-ink outline-none shadow-sm focus:shadow-md transition-shadow duration-200 ${
          large
            ? "px-6 py-4 rounded-full text-lg"
            : "px-4 py-2 rounded-full text-sm"
        }`}
      />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((k) => (
            <button
              key={k.char}
              onClick={() => go(k.char)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-paper transition-colors text-left"
            >
              <span className="font-serif text-2xl font-bold text-ink w-10 text-center">
                {k.char}
              </span>
              <div className="min-w-0">
                <span className="text-sm text-ink block truncate">
                  {k.meanings.join(", ")}
                </span>
                <span className="text-xs text-stone-light block truncate">
                  {k.readings.onyomi.join(", ")}
                  {k.readings.kunyomi.length > 0 &&
                    ` / ${k.readings.kunyomi.join(", ")}`}
                </span>
              </div>
              {k.jlpt && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                  {k.jlpt}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={goAll}
            className="w-full px-4 py-2.5 text-sm text-accent font-bold hover:bg-paper border-t border-border transition-colors text-center"
          >
            "{query}" 전체 결과 보기 →
          </button>
        </div>
      )}
    </div>
  );
}
