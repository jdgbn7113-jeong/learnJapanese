import { useState, useEffect, useCallback } from "react";
import type { Kanji } from "../types/kanji";

type KanjiMap = Record<string, Kanji>;
type JlptIndex = Record<string, string[]>;

let cachedData: KanjiMap | null = null;
let cachedIndex: JlptIndex | null = null;

export function useKanjiData() {
  const [kanjiMap, setKanjiMap] = useState<KanjiMap>(cachedData ?? {});
  const [jlptIndex, setJlptIndex] = useState<JlptIndex>(cachedIndex ?? {});
  const [loading, setLoading] = useState(!cachedData || !cachedIndex);

  useEffect(() => {
    if (cachedData && cachedIndex) return;
    Promise.all([
      fetch("/data/kanji.json").then((r) => r.json()),
      fetch("/data/jlpt-index.json").then((r) => r.json()),
    ]).then(([data, idx]: [KanjiMap, JlptIndex]) => {
      cachedData = data;
      cachedIndex = idx;
      setKanjiMap(data);
      setJlptIndex(idx);
      setLoading(false);
    });
  }, []);

  const getKanji = useCallback(
    (char: string): Kanji | undefined => kanjiMap[char],
    [kanjiMap],
  );

  const search = useCallback(
    (query: string): Kanji[] => {
      if (!query.trim()) return [];
      const q = query.trim().toLowerCase();
      return Object.values(kanjiMap).filter(
        (k) =>
          k.char === q ||
          k.meanings.some((m) => m.includes(q)) ||
          k.readings.onyomi.some((r) => r.includes(q)) ||
          k.readings.kunyomi.some((r) => r.includes(q)),
      );
    },
    [kanjiMap],
  );

  const getByJlpt = useCallback(
    (level: string): Kanji[] => {
      const upper = level.toUpperCase();
      return Object.values(kanjiMap).filter((k) => k.jlpt === upper);
    },
    [kanjiMap],
  );

  const getAdjacent = useCallback(
    (char: string): { prev?: string; next?: string } => {
      const k = kanjiMap[char];
      if (!k || !k.jlpt) return {};
      const list = jlptIndex[k.jlpt] ?? [];
      const i = list.indexOf(char);
      if (i === -1) return {};
      return {
        prev: i > 0 ? list[i - 1] : undefined,
        next: i < list.length - 1 ? list[i + 1] : undefined,
      };
    },
    [kanjiMap, jlptIndex],
  );

  return { getKanji, search, getByJlpt, getAdjacent, loading };
}
