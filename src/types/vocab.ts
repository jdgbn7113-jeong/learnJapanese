export type PartOfSpeech =
  | "명사"
  | "동사"
  | "い형용사"
  | "な형용사"
  | "부사"
  | "조사"
  | "대명사"
  | "의문사"
  | "연체사"
  | "감탄사"
  | "인사"
  | "접속사"
  | "수사";

export type VocabWord = {
  kana: string;
  kanji: string | null;
  meaning: string;
  pos: PartOfSpeech;
};

export type VocabLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type VocabFile = {
  level: VocabLevel;
  words: VocabWord[];
};
