"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

interface PolicyBoxProps {
  type: PolicyType;
  hovered: PolicyType | null;
  onHover: (type: PolicyType | null) => void;
  onExpand: (type: PolicyType) => void;
}

function PolicyBox({ type, hovered, onHover, onExpand }: PolicyBoxProps) {
  const { src, title } = POLICY_CONFIG[type];
  const isHovered = hovered === type;
  const isOtherHovered = hovered && hovered !== type;

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isHovered
          ? "scale-105 z-10"
          : isOtherHovered
          ? "scale-90 opacity-60"
          : ""
      }`}
      role="button"
      tabIndex={0}
      onMouseEnter={() => onHover(type)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(type)}
      onBlur={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onExpand(type);
        }
      }}
      style={{ transition: "all 0.3s", outline: "none" }}
      aria-label={POLICY_CONFIG[type].title + " 더 크게 보기"}
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
      <button
        className={`absolute right-4 top-4 px-3 py-1 rounded bg-blue-300 text-white text-xs font-semibold shadow transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-8"
        }`}
        style={{
          cursor: "default",
          transition: "all 0.3s",
        }}
        onClick={() => onExpand(type)}
      >
        더 크게 보기
      </button>
    </div>
  );
}

interface ExpandedBoxProps {
  type: PolicyType;
  onClose: () => void;
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
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [hovered, setHovered] = useState<PolicyType | null>(null);
  const [expanded, setExpanded] = useState<PolicyType | null>(null);
  const [mounted, setMounted] = useState(false); // 추가

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", user ?? "");
      router.replace("/");
    } else if (error) {
      alert(error || "인증에 실패했습니다.");
      router.replace("/login");
    }
  }, []);

  let userInfoContent;
  if (!mounted) {
    userInfoContent = (
      <div style={{ height: 32 }}>
        <p>Loading...</p> {/* SSR 시 placeholder */}
      </div>
    );
  } else if (user) {
    userInfoContent = (
      <div className="text-center">
        <p className="text-lg font-semibold">
          환영합니다, {decodeURIComponent(user)} 님!
        </p>
      </div>
    );
  } else {
    userInfoContent = (
      <p className="text-center text-gray-500">
        로그인 후 사용자 정보가 표시됩니다.
      </p>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
        id="box"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <h1 className="text-2xl font-bold text-center mb-4">메인 페이지</h1>

        {userInfoContent}
        <div><a href="/login">login</a></div>
        <div className="mt-8 flex flex-col items-center gap-4 w-full transition-all duration-500">
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
        </div>
        {expanded && (
          <ExpandedBox type={expanded} onClose={() => setExpanded(null)} />
        )}
      </div>
    </main>
  );
}