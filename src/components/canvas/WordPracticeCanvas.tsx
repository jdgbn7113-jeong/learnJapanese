import { useCallback, useEffect, useRef } from "react";

const NOTE_EXT = 0.35;
const DEFAULT_CELLS_PER_ROW = 3;

interface Props {
  chars: string[];
  label?: string;
  meaning?: string;
  cellsPerRow?: number;
  showHints?: boolean;
}

export default function WordPracticeCanvas({
  chars,
  label,
  meaning,
  cellsPerRow = DEFAULT_CELLS_PER_ROW,
  showHints = true,
}: Props) {
  const CELLS_PER_ROW = cellsPerRow;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const history = useRef<ImageData[]>([]);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const drawGrid = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || chars.length === 0) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const n = chars.length;
    const cellSize = w / CELLS_PER_ROW;
    const rowHeight = cellSize * (1 + NOTE_EXT);
    const rows = Math.ceil(n / CELLS_PER_ROW);

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / CELLS_PER_ROW);
      const col = i % CELLS_PER_ROW;
      const ox = col * cellSize;
      const oy = row * rowHeight;
      const gridBottom = oy + cellSize;
      const rowBottom = oy + rowHeight;

      ctx.strokeStyle = "#e0d8cc";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);

      // 왼쪽 경계 (같은 행 내부 셀 경계)
      if (col > 0) {
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, rowBottom);
        ctx.stroke();
      }

      // 마지막 글자이면서 행을 꽉 채우지 못한 경우 오른쪽 경계 추가
      if (i === n - 1 && col < CELLS_PER_ROW - 1) {
        ctx.beginPath();
        ctx.moveTo(ox + cellSize, oy);
        ctx.lineTo(ox + cellSize, rowBottom);
        ctx.stroke();
      }

      // 윗쪽 경계 (행 사이)
      if (row > 0) {
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + cellSize, oy);
        ctx.stroke();
      }

      // 아래쪽 경계 (마지막 행이 아닌데 바로 아래 셀이 없는 경우)
      if (row < rows - 1 && i + CELLS_PER_ROW >= n) {
        ctx.beginPath();
        ctx.moveTo(ox, rowBottom);
        ctx.lineTo(ox + cellSize, rowBottom);
        ctx.stroke();
      }

      // 田자 격자
      ctx.beginPath();
      ctx.moveTo(ox + cellSize / 2, oy);
      ctx.lineTo(ox + cellSize / 2, gridBottom);
      ctx.moveTo(ox, oy + cellSize / 2);
      ctx.lineTo(ox + cellSize, oy + cellSize / 2);
      ctx.stroke();

      // 대각선 가이드 (점선)
      ctx.strokeStyle = "#ede8df";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + cellSize, gridBottom);
      ctx.moveTo(ox + cellSize, oy);
      ctx.lineTo(ox, gridBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // 격자/메모 구분선 + 메모 영역 기준선
      ctx.strokeStyle = "#e0d8cc";
      ctx.beginPath();
      ctx.moveTo(ox, gridBottom);
      ctx.lineTo(ox + cellSize, gridBottom);
      ctx.stroke();

      ctx.strokeStyle = "#ede8df";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(ox, (gridBottom + rowBottom) / 2);
      ctx.lineTo(ox + cellSize, (gridBottom + rowBottom) / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 가이드 문자 — 연습 모드에서만
      if (showHints) {
        const resolvedFont =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--font-serif")
            .trim() || '"Noto Serif JP", serif';
        ctx.fillStyle = "rgba(26, 26, 46, 0.12)";
        ctx.font = `${cellSize * 0.75}px ${resolvedFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(chars[i], ox + cellSize / 2, oy + cellSize / 2);
      }
    }

    // 메모 영역의 한글 뜻 보조 — 첫 행에만, 연습 모드에서만
    if (showHints && meaning) {
      const firstRowCols = Math.min(n, CELLS_PER_ROW);
      const firstRowWidth = firstRowCols * cellSize;
      const noteHeight = rowHeight - cellSize;
      const noteCenterY = cellSize + noteHeight / 2;
      const sansFont =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-sans")
          .trim() || '"Noto Sans KR", sans-serif';
      const maxFont = noteHeight * 0.55;
      let fontSize = maxFont;
      ctx.font = `${fontSize}px ${sansFont}`;
      const maxWidth = firstRowWidth * 0.92;
      const measured = ctx.measureText(meaning).width;
      if (measured > maxWidth) {
        fontSize = (maxFont * maxWidth) / measured;
        ctx.font = `${fontSize}px ${sansFont}`;
      }
      ctx.fillStyle = "rgba(26, 26, 46, 0.14)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meaning, firstRowWidth / 2, noteCenterY);
    }
  }, [chars, meaning, CELLS_PER_ROW, showHints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent || chars.length === 0) return;

    const n = chars.length;
    const rows = Math.ceil(n / CELLS_PER_ROW);
    const cellSize = parent.clientWidth / CELLS_PER_ROW;

    canvas.width = parent.clientWidth;
    canvas.height = rows * cellSize * (1 + NOTE_EXT);

    drawGrid();
  }, [drawGrid, chars.length]);

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

  const undo = () => {
    const ctx = getCtx();
    const prev = history.current.pop();
    if (ctx && prev) ctx.putImageData(prev, 0, 0);
  };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx) return;
    history.current = [];
    drawGrid();
  };

  if (chars.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        {label ? (
          <div className="text-xs font-bold text-stone-light">{label}</div>
        ) : (
          <div />
        )}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={undo}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-stone-light/10 text-stone hover:bg-ink hover:text-paper active:scale-95 transition-all duration-150"
          >
            되돌리기
          </button>
          <button
            onClick={clear}
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white active:scale-95 transition-all duration-150"
          >
            지우기
          </button>
        </div>
      </div>
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
  );
}
