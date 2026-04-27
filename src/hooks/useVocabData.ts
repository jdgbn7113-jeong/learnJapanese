import { useEffect, useState } from "react";
import type { VocabFile, VocabLevel, VocabWord } from "../types/vocab";

const cache: Partial<Record<VocabLevel, VocabWord[]>> = {};

export function useVocabData(level: VocabLevel) {
  const [words, setWords] = useState<VocabWord[]>(cache[level] ?? []);
  const [loading, setLoading] = useState(!cache[level]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache[level]) {
      setWords(cache[level]!);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/data/vocab-${level.toLowerCase()}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`${level} 단어 데이터가 아직 준비되지 않았습니다`);
        return r.json();
      })
      .then((data: VocabFile) => {
        cache[level] = data.words;
        setWords(data.words);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, [level]);

  return { words, loading, error };
}
