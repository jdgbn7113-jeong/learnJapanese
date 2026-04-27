import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CHARS_PER_LINE = 7;
const MAX_ROWS = 5;
const STORAGE_KEY = "novel:traceCanvasExpanded";

interface Props {
  sentence: string;
  charsPerLine?: number;
}

export default function SentenceTraceCanvas({
  sentence,
  charsPerLine = DEFAULT_CHARS_PER_LINE,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const history = useRef<ImageData[]>([]);
  // 캔버스를 실제로 리사이즈한 마지막 치수. 토글 시 불필요한 리사이즈로 그림이 지워지는 것을 막는다.
  const lastSized = useRef<{ w: number; rows: number } | null>(null);

  const [expanded, setExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const len = sentence.length;
  const rows = Math.min(MAX_ROWS, Math.max(1, Math.ceil(len / charsPerLine)));

  const drawGrid = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const rowHeight = h / rows;

    ctx.clearRect(0, 0, w, h);

    // 가로 실선 (행 경계)
    ctx.strokeStyle = "#e0d8cc";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let i = 0; i <= rows; i++) {
      const y = Math.round(i * rowHeight) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 가로 점선 (각 행의 중앙 보조선)
    ctx.strokeStyle = "#ede8df";
    ctx.setLineDash([6, 6]);
    for (let i = 0; i < rows; i++) {
      const y = Math.round(i * rowHeight + rowHeight / 2) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }, [rows]);

  useEffect(() => {
    if (!expanded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    if (w === 0) return;
    // 치수가 동일하면 리사이즈하지 않음 → canvas.width 대입으로 그림이 지워지는 것을 방지.
    if (
      lastSized.current &&
      lastSized.current.w === w &&
      lastSized.current.rows === rows
    ) {
      return;
    }
    const rowHeight = w / charsPerLine;
    canvas.width = w;
    canvas.height = rows * rowHeight;
    lastSized.current = { w, rows };

    drawGrid();
  }, [drawGrid, rows, charsPerLine, expanded]);

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    history.current.push(
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    );
    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx) return;
    history.current = [];
    drawGrid();
  };

  if (len === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls="sentence-trace-canvas"
          className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-stone-light hover:text-accent transition-colors"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded ? "" : "-rotate-90"}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          필사
        </button>
        {expanded && (
          <button
            onClick={clear}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white active:scale-95 transition-all duration-150"
          >
            지우기
          </button>
        )}
      </div>
      {/* hidden 시에도 canvas를 언마운트하지 않아 그림 비트맵이 보존된다. */}
      <div
        id="sentence-trace-canvas"
        className={expanded ? "" : "hidden"}
      >
        <div className="border border-border rounded-lg overflow-hidden bg-white w-full">
          <canvas
            ref={canvasRef}
            className="cursor-crosshair touch-none block w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
