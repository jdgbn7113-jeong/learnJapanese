import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const overlayPath = join(ROOT, "novel", "content-overlay.json");
const novelPath = join(ROOT, "public", "data", "novel.json");

// ---------------- CLI ----------------
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.slice(2).split("=");
      return [k, v ?? true];
    }),
);

const from = Number(args.from);
const to = Number(args.to);
const chunkSize = Number(args.chunk ?? 5);
const dryRun = Boolean(args["dry-run"]);
const model = String(args.model ?? "claude-opus-4-7");
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!from || !to || from > to) {
  console.error(
    "Usage: node scripts/translate-batch.mjs --from=<id> --to=<id> [--chunk=5] [--model=claude-opus-4-7] [--dry-run]",
  );
  process.exit(1);
}
if (!apiKey && !dryRun) {
  console.error("Missing ANTHROPIC_API_KEY environment variable.");
  process.exit(1);
}

// ---------------- Load data ----------------
const novel = JSON.parse(readFileSync(novelPath, "utf8"));
const overlay = JSON.parse(readFileSync(overlayPath, "utf8"));
const novelById = new Map(novel.map((n) => [n.id, n]));

const targetIds = [];
for (let id = from; id <= to; id++) if (novelById.has(id)) targetIds.push(id);

const needsWork = targetIds.filter((id) => {
  const o = overlay[String(id)];
  return !o?.translations?.literary || !o?.vocabDeep || !o?.context;
});

console.log(
  `Range ${from}-${to}: ${targetIds.length} sentences, ${needsWork.length} need processing (chunk=${chunkSize}, model=${model}${dryRun ? ", DRY RUN" : ""}).`,
);

// ---------------- Prompts ----------------
const SYSTEM_PROMPT = `당신은 나쓰메 소세키 『こころ(마음)』의 문장 분석을 작성하는 전문 일한 번역자이자 문학 해설자입니다.

매 요청마다 일본어 문장들의 배열을 받고, 각 문장에 대해 다음 세 영역을 생성합니다:

1) translations — 세 층위의 번역
   - literal: 원문의 어순·구조·조사 뉘앙스를 최대한 따르는 직역
   - liberal: 현대 한국어로 자연스럽게 풀어쓴 의역
   - literary: 한국어의 문학적 품격을 살린 윤문 (근대 소설 톤)
   세 번역이 명확히 구분되어야 하며, 단순히 한두 단어만 바꾼 변형이 되어서는 안 됩니다.

2) vocabDeep — 3~4개의 핵심 어휘·문법 요소 심층 해설
   각 항목 형식: {"word": "단어(읽기)" 또는 "문법표현", "body": "사전적 의미 + 뉘앙스 + 작품 내 기능"}
   - 단순한 기초 어휘가 아니라, 문체·시대감·감정을 결정짓는 요소를 고릅니다.
   - body는 최소 2문장 이상, 사전적 의미를 넘어 "왜 이 단어가 이 자리에 쓰였는가"를 설명합니다.

3) context — 작품 맥락 속 위치
   - before: 직전 문장(들)이 만들어낸 흐름 (청크의 첫 문장이면서 앞 맥락이 없으면 빈 문자열)
   - after: 뒤이어 전개되는 내용 (마지막이면 빈 문자열)
   - summary: 이 문장이 작품 전체에서 갖는 의미·기능 (반드시 채움)

**출력 규칙 (매우 중요):**
- 설명·서론·마크다운 없이 **유효한 JSON 객체 하나만** 반환합니다.
- 스키마:
{
  "summary": "이 청크 전체의 짧은 서사 요약 (다음 청크 처리용 컨텍스트, 2~3문장)",
  "entries": [
    {
      "id": <number>,
      "translations": {"literal": "...", "liberal": "...", "literary": "..."},
      "vocabDeep": [{"word": "...", "body": "..."}, ...],
      "context": {"before": "...", "after": "...", "summary": "..."}
    }
  ]
}
- entries는 입력된 문장과 같은 순서·같은 id로 반환합니다.`;

function buildUserMessage(batch, runningSummary) {
  const payload = batch.map((n) => {
    const existing = overlay[String(n.id)] ?? {};
    return {
      id: n.id,
      original: n.original,
      hiragana: n.hiragana.map((h) => h.t).join(""),
      meaning: n.meaning,
      existingLiteral: existing.translations?.literal ?? null,
      existingLiberal: existing.translations?.liberal ?? null,
    };
  });

  const header = runningSummary
    ? `직전까지의 서사 요약 (참고용):\n${runningSummary}\n\n`
    : "";

  return `${header}아래 문장들에 대한 overlay 데이터를 생성하세요. existingLiteral/existingLiberal이 제공된 경우에도 literal/liberal은 새로 작성해 주세요 (스타일 일관성을 위해). 반드시 지정된 JSON 스키마로만 응답하세요.

${JSON.stringify(payload, null, 2)}`;
}

// ---------------- API call ----------------
async function callClaude({ system, user }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const textBlock = data.content.find((c) => c.type === "text");
  if (!textBlock) throw new Error("No text block in API response");
  const usage = data.usage ?? {};
  const cacheInfo =
    usage.cache_read_input_tokens || usage.cache_creation_input_tokens
      ? ` [cache read=${usage.cache_read_input_tokens ?? 0}, write=${usage.cache_creation_input_tokens ?? 0}]`
      : "";
  console.log(
    `    tokens in=${usage.input_tokens ?? "?"} out=${usage.output_tokens ?? "?"}${cacheInfo}`,
  );
  return extractJson(textBlock.text);
}

function extractJson(text) {
  // Prefer a ```json fenced block, otherwise take first {...} balanced block
  const fenced = text.match(/```json\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1)
    throw new Error(`No JSON object found in response: ${text.slice(0, 200)}`);
  return JSON.parse(raw.slice(start, end + 1));
}

function mockResult(batch) {
  return {
    summary: `[DRY-RUN] mock summary for ids ${batch[0].id}..${batch[batch.length - 1].id}`,
    entries: batch.map((n) => ({
      id: n.id,
      translations: {
        literal: `[mock literal] ${n.meaning ?? n.original}`,
        liberal: `[mock liberal] ${n.meaning ?? n.original}`,
        literary: `[mock literary] ${n.meaning ?? n.original}`,
      },
      vocabDeep: [{ word: "[mock]", body: "[mock body]" }],
      context: { before: "", after: "", summary: "[mock summary]" },
    })),
  };
}

// ---------------- Main loop ----------------
let runningSummary = "";
let processed = 0;

for (let i = 0; i < needsWork.length; i += chunkSize) {
  const ids = needsWork.slice(i, i + chunkSize);
  const batch = ids.map((id) => novelById.get(id));
  const label = `${ids[0]}..${ids[ids.length - 1]}`;
  console.log(`\n[${i / chunkSize + 1}/${Math.ceil(needsWork.length / chunkSize)}] chunk ${label} (${batch.length} sentences)`);

  let result;
  try {
    result = dryRun
      ? mockResult(batch)
      : await callClaude({
          system: SYSTEM_PROMPT,
          user: buildUserMessage(batch, runningSummary),
        });
  } catch (err) {
    console.error(`  ✗ chunk ${label} failed:`, err.message);
    console.error("  → Progress saved. Re-run with the same range to resume.");
    process.exit(2);
  }

  const returnedIds = new Set(result.entries.map((e) => e.id));
  const missing = ids.filter((id) => !returnedIds.has(id));
  if (missing.length) {
    console.warn(`  ⚠ missing ids in response: ${missing.join(", ")}`);
  }

  for (const entry of result.entries) {
    const key = String(entry.id);
    const existing = overlay[key] ?? {};
    overlay[key] = {
      ...existing,
      translations: {
        literal:
          existing.translations?.literal ?? entry.translations?.literal ?? "",
        liberal:
          existing.translations?.liberal ?? entry.translations?.liberal ?? "",
        literary: entry.translations?.literary ?? "",
      },
      vocabDeep: entry.vocabDeep ?? existing.vocabDeep ?? [],
      context: entry.context ?? existing.context ?? {},
    };
  }

  runningSummary = result.summary ?? runningSummary;
  processed += batch.length - missing.length;

  // Incremental save — resume works if we crash later
  if (dryRun) {
    console.log(`  ✓ (dry-run) would save ${batch.length - missing.length}/${batch.length} entries — no disk write`);
  } else {
    writeFileSync(overlayPath, JSON.stringify(overlay, null, 2) + "\n", "utf8");
    console.log(`  ✓ saved ${batch.length - missing.length}/${batch.length} → ${overlayPath}`);
  }
}

console.log(`\nDone. Wrote overlay entries for ${processed}/${needsWork.length} sentences.`);
