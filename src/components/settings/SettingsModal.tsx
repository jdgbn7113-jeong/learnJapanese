import { useEffect } from "react";
import { FONT_OPTIONS, useSettings } from "../../hooks/useSettings";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsModal({ open, onClose }: Props) {
  const { fontId, setFontId } = useSettings();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2
            id="settings-title"
            className="font-serif text-xl font-bold text-ink"
          >
            설정
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg text-stone hover:bg-paper hover:text-ink transition-colors flex items-center justify-center"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <section>
            <h3 className="text-sm font-bold tracking-wider uppercase text-stone-light mb-1">
              한자·일본어 폰트
            </h3>
            <p className="text-sm text-stone mb-4">
              일본인들이 실제로 사용하는 폰트 중에서 선택할 수 있어요.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {FONT_OPTIONS.map((option) => {
                const selected = option.id === fontId;
                return (
                  <button
                    key={option.id}
                    onClick={() => setFontId(option.id)}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      selected
                        ? "border-accent bg-paper"
                        : "border-border bg-card hover:border-accent"
                    }`}
                  >
                    <div
                      className="text-3xl font-bold text-ink mb-2 leading-none"
                      style={{ fontFamily: option.family }}
                    >
                      日本語 漢字
                    </div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-bold text-ink text-sm">
                        {option.label}
                      </span>
                      <span
                        className="text-xs text-stone-light"
                        style={{ fontFamily: option.family }}
                      >
                        {option.jp}
                      </span>
                    </div>
                    <p className="text-xs text-stone leading-relaxed">
                      {option.description}
                    </p>
                    {selected && (
                      <div className="mt-2 text-xs font-bold text-accent">
                        ✓ 선택됨
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
