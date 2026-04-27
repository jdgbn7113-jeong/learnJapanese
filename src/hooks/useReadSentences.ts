import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kanji-master:novel-read";

function loadInitial(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "number"));
  } catch {
    return new Set();
  }
}

export function useReadSentences() {
  const [readSet, setReadSet] = useState<Set<number>>(loadInitial);

  const markRead = useCallback((id: number) => {
    setReadSet((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore quota / privacy mode errors
      }
      return next;
    });
  }, []);

  const isRead = useCallback((id: number) => readSet.has(id), [readSet]);

  // 다른 탭에서의 변경 동기화
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setReadSet(loadInitial());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { readSet, markRead, isRead };
}
