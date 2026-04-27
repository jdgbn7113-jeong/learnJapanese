import { useCanvas } from "../../hooks/useCanvas";

interface Props {
  char: string;
  meaning?: string;
}

const NOTE_EXT = 0.35;

export default function PracticeSlot({ char, meaning }: Props) {
  const { canvasRef, startDrawing, draw, stopDrawing, clear } = useCanvas({
    guideChar: char,
    noteExtension: NOTE_EXT,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-serif text-lg font-bold text-ink">{char}</span>
          {meaning && (
            <span className="text-sm font-semibold text-ink truncate">· {meaning}</span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={clear}
            className="text-[10px] px-2 py-1 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
          >
            지우기
          </button>
        </div>
      </div>
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ aspectRatio: `1 / ${1 + NOTE_EXT}` }}
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
