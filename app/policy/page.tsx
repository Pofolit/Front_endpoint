"use client";

import { useEffect, useState } from "react";

type PolicyType = "privacy" | "terms";

const POLICY_CONFIG: Record<PolicyType, { src: string; title: string }> = {
  privacy: {
    src: "/policy/privacy-policy",
    title: "개인정보처리방침",
  },
  terms: {
    src: "/policy/terms-of-service",
    title: "서비스 이용약관",
  },
};

interface ExpandedBoxProps {
  readonly type: PolicyType;
  readonly onClose: () => void;
}

function ExpandedBox({ type, onClose }: ExpandedBoxProps) {
  const { src, title } = POLICY_CONFIG[type];
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 transition-all duration-500"
      style={{ animation: "fadeInBox 0.5s" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col relative transition-all duration-500"
        style={{ animation: "expandBox 0.5s" }}
      >
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{
            border: "none",
            borderRadius: "16px",
            flex: 1,
            background: "#fff",
          }}
        />
        <button
          className="absolute top-4 right-4 px-2 py-1 rounded bg-blue-300 text-white text-sm font-semibold shadow"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        >
          닫기
        </button>
      </div>
      <style>{`
        @keyframes fadeInBox {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes expandBox {
          from { transform: scale(0.7); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

interface PolicyBoxProps {
  readonly type: PolicyType;
  readonly hovered: PolicyType | null;
  readonly onHover: (type: PolicyType | null) => void;
  readonly onExpand: (type: PolicyType) => void;
}

function PolicyBox({ type, hovered, onHover, onExpand }: PolicyBoxProps) {
  const { src, title } = POLICY_CONFIG[type];
  const isHovered = hovered === type;
  const isOtherHovered = hovered && hovered !== type;

  return (
    <button
      type="button"
      className={`relative w-full transition-all duration-300 ${
        isHovered
          ? "scale-105 z-10"
          : isOtherHovered
          ? "scale-90 opacity-60"
          : ""
      }`}
      onMouseEnter={() => onHover(type)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(type)}
      onBlur={() => onHover(null)}
      onClick={() => onExpand(type)}
      style={{ transition: "all 0.3s", outline: "none" }}
      aria-label={title + " 더 크게 보기"}
    >
      <iframe
        src={src}
        title={title}
        width="100%"
        height="60"
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          transition: "all 0.3s",
          background: "#fff",
        }}
      />
      <span
        className={`absolute right-4 top-4 px-3 py-1 rounded bg-blue-300 text-white text-xs font-semibold shadow transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-8"
        }`}
        style={{
          cursor: "default",
          transition: "all 0.3s",
        }}
      >
        더 크게 보기
      </span>
    </button>
  );
}

export default function PolicyPage() {
  const [hovered, setHovered] = useState<PolicyType | null>(null);
  const [expanded, setExpanded] = useState<PolicyType | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // SSR에서는 아무것도 렌더링하지 않음

  return (
    <div className="flex flex-col items-center gap-4 w-full transition-all duration-500 mt-8 px-8 py-4">
      {!expanded && (
        <>
          <PolicyBox
            type="privacy"
            hovered={hovered}
            onHover={setHovered}
            onExpand={setExpanded}
          />
          <PolicyBox
            type="terms"
            hovered={hovered}
            onHover={setHovered}
            onExpand={setExpanded}
          />
        </>
      )}
      {expanded && (
        <ExpandedBox type={expanded} onClose={() => setExpanded(null)} />
      )}
    </div>
  );
}