import { useRef, useCallback, useEffect, useState } from "react";

interface CanvasOptions {
  lineWidth?: number;
  strokeColor?: string;
  guideChar?: string;
  noteExtension?: number; // 아래 여백 (너비 기준 배수). 예: 0.35
}

export function useCanvas(options: CanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const history = useRef<ImageData[]>([]);
  const [lineWidth, setLineWidth] = useState(options.lineWidth ?? 4);
  const [strokeColor, setStrokeColor] = useState(options.strokeColor ?? "#1a1a2e");

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;
  const noteExtension = options.noteExtension ?? 0;

  const drawGrid = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const gridBottom = w; // 상단 정사각형 영역 높이

    ctx.clearRect(0, 0, w, h);

    // 田자 격자 (상단 정사각형 영역)
    ctx.strokeStyle = "#e0d8cc";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, gridBottom);
    ctx.moveTo(0, gridBottom / 2);
    ctx.lineTo(w, gridBottom / 2);
    ctx.stroke();

    // 대각선 가이드 (점선)
    ctx.strokeStyle = "#ede8df";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, gridBottom);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, gridBottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // 상단/메모 영역 구분선 + 메모 영역 기준선
    if (h > gridBottom) {
      ctx.strokeStyle = "#e0d8cc";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, gridBottom);
      ctx.lineTo(w, gridBottom);
      ctx.stroke();

      ctx.strokeStyle = "#ede8df";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, (gridBottom + h) / 2);
      ctx.lineTo(w, (gridBottom + h) / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 가이드 한자 (상단 영역 중앙, 반투명)
    if (options.guideChar) {
      ctx.fillStyle = "rgba(26, 26, 46, 0.06)";
      ctx.font = `${gridBottom * 0.75}px "Noto Serif JP", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.guideChar, w / 2, gridBottom / 2);
    }
  }, [options.guideChar]);

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const width = Math.min(parent.clientWidth, 400);
    canvas.width = width;
    canvas.height = width * (1 + noteExtension);

    drawGrid();
  }, [drawGrid, noteExtension]);

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

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const ctx = getCtx();
      if (!ctx) return;

      // Undo 히스토리 저장
      history.current.push(
        ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
      );

      isDrawing.current = true;
      const { x, y } = getPos(e);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [strokeColor, lineWidth],
  );

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const undo = useCallback(() => {
    const ctx = getCtx();
    const prev = history.current.pop();
    if (ctx && prev) ctx.putImageData(prev, 0, 0);
  }, []);

  const clear = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    history.current = [];
    drawGrid();
  }, [drawGrid]);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    clear,
    lineWidth,
    setLineWidth,
    strokeColor,
    setStrokeColor,
  };
}
