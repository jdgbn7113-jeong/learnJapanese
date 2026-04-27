import type { VocabLevel } from "./vocab";

export type HiraganaToken = { t: string; e: boolean };

export type VocabRef = {
  level: VocabLevel;
  index: number;
};

export type VocabEntry = {
  kanji: string;
  reading: string;
  meaning: string;
  ref?: VocabRef;
};

export type GrammarEntry = {
  element: string;
  desc: string;
};

export type NovelNote = {
  title: string;
  body: string;
};

export type Translations = {
  literal: string;
  liberal: string;
  literary: string;
};

export type VocabDeepItem = {
  word: string;
  body: string;
};

export type NovelContext = {
  before?: string;
  after?: string;
  summary: string;
};

export type NovelSentence = {
  id: number;
  paragraph: number;
  original: string;
  hiragana: HiraganaToken[];
  meaning: string;
  vocab: VocabEntry[];
  grammar: GrammarEntry[];
  notes: NovelNote[];
  translations?: Translations;
  vocabDeep?: VocabDeepItem[];
  context?: NovelContext;
};
