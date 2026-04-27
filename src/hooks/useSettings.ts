import { useEffect, useState } from "react";

export type FontOption = {
  id: string;
  label: string;
  jp: string;
  description: string;
  family: string;
};

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "noto-serif",
    label: "Noto Serif JP",
    jp: "ノト明朝",
    description: "구글 기본 일본어 명조. 균형감 있고 가독성이 높음",
    family: '"Noto Serif JP", serif',
  },
  {
    id: "noto-sans",
    label: "Noto Sans JP",
    jp: "ノト角ゴシック",
    description: "깔끔한 고딕. 화면에서 읽기 편함",
    family: '"Noto Sans JP", sans-serif',
  },
  {
    id: "shippori",
    label: "Shippori Mincho",
    jp: "しっぽり明朝",
    description: "일본 웹에서 인기 있는 전통 명조체",
    family: '"Shippori Mincho", serif',
  },
  {
    id: "zen-old",
    label: "Zen Old Mincho",
    jp: "ゼン古典明朝",
    description: "고전적인 인쇄물 느낌의 묵직한 명조",
    family: '"Zen Old Mincho", serif',
  },
  {
    id: "klee-one",
    label: "Klee One",
    jp: "クレー",
    description: "일본 초등학교 교과서체. 손글씨 느낌",
    family: '"Klee One", cursive',
  },
  {
    id: "kaisei",
    label: "Kaisei Decol",
    jp: "解星デコール",
    description: "펜으로 쓴 듯 부드러운 명조",
    family: '"Kaisei Decol", serif',
  },
  {
    id: "mplus-rounded",
    label: "M PLUS Rounded 1c",
    jp: "M+ラウンド",
    description: "모서리가 둥근 현대적 고딕",
    family: '"M PLUS Rounded 1c", sans-serif',
  },
  {
    id: "hina",
    label: "Hina Mincho",
    jp: "ひな明朝",
    description: "가늘고 우아한 명조. 문학적 분위기",
    family: '"Hina Mincho", serif',
  },
  {
    id: "yuji",
    label: "Yuji Syuku",
    jp: "遊字 粛",
    description: "붓글씨 느낌의 서예체",
    family: '"Yuji Syuku", serif',
  },
];

const STORAGE_KEY = "kanji-master:font";
const DEFAULT_ID = "noto-sans";

function resolveFamily(id: string): string {
  return (
    FONT_OPTIONS.find((f) => f.id === id)?.family ?? FONT_OPTIONS[0].family
  );
}

export function applyFont(id: string) {
  document.documentElement.style.setProperty("--font-serif", resolveFamily(id));
}

export function initSettings() {
  const saved = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ID;
  applyFont(saved);
}

export function useSettings() {
  const [fontId, setFontIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ID;
  });

  useEffect(() => {
    applyFont(fontId);
    localStorage.setItem(STORAGE_KEY, fontId);
  }, [fontId]);

  return { fontId, setFontId: setFontIdState };
}
