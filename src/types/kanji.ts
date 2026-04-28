// 한자 하나의 데이터 구조
export interface Kanji {
  char: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  meanings: string[];
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1" | null;
  grade: number | null;
  strokes: number;
  radicals: Radical[];
  mnemonic: Mnemonic;
  examples: Example[];
}

// 부수 정보
export interface Radical {
  char: string;
  meaning: string;
  position?: string;
}

// 연상 스토리 데이터 — 구조화된 스토리텔링
export interface Mnemonic {
  radicalRoles: RadicalRole[]; // 각 부수에 부여된 페르소나/역할
  story: string;               // 본 스토리 (부수 글자가 등장)
  keyImage?: string;           // 한 줄 강력 이미지 (구버전 — 신규는 imagery 사용)
  imagery?: string;            // 감각적 장면 (구체적 시청각 이미지)
}

// 부수 페르소나 — 스토리 속에서 이 부수가 맡는 역할
export interface RadicalRole {
  char: string;
  persona: string;     // 예: "네모난 감옥", "햇살이 드는 창문"
  name?: string;       // 훈음 (예: "입 구")
  origin?: string;     // 글자 자체의 형성 유래 (예: "사람의 벌린 입 모양을 본뜬 한자")
}

// 예제 단어
export interface Example {
  word: string;
  reading: string;
  meaning: string;
}
