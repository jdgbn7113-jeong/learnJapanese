import { useEffect, useState } from "react";
import type { NovelSentence } from "../types/novel";

export type NovelParagraphMap = {
  totalParagraphs: number;
  paragraphs: { paragraph: number; range: [number, number] }[];
};

let cached: NovelSentence[] | null = null;
let cachedMap: NovelParagraphMap | null = null;

export function useNovelData() {
  const [items, setItems] = useState<NovelSentence[]>(cached ?? []);
  const [paragraphMap, setParagraphMap] = useState<NovelParagraphMap | null>(
    cachedMap,
  );
  const [loading, setLoading] = useState(!cached || !cachedMap);

  useEffect(() => {
    if (cached && cachedMap) return;
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/novel.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/novel-paragraphs.json`).then((r) =>
        r.json(),
      ),
    ]).then(([data, map]: [NovelSentence[], NovelParagraphMap]) => {
      cached = data;
      cachedMap = map;
      setItems(data);
      setParagraphMap(map);
      setLoading(false);
    });
  }, []);

  return { items, paragraphMap, loading };
}
