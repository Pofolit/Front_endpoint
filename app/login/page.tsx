"use client";

import React, { useState } from "react";
import { Chrome, MessageCircle } from 'lucide-react';

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
      onClick={() => onExpand(type)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          onExpand(type);
        }
      }}
      style={{ transition: "all 0.3s", cursor: "pointer" }}
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

// 소셜 로그인 버튼 컴포넌트
interface SocialLoginButtonProps {
  provider: 'google' | 'kakao';
  label: string;
  icon: React.ElementType;
  redirectUrl: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, label, icon: Icon, redirectUrl }) => {
  const handleClick = () => {
    window.location.href = redirectUrl;
  };

  const baseClasses = "w-full flex items-center justify-center p-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md";
  const googleClasses = "bg-white text-gray-700 border border-gray-300";
  const kakaoClasses = "bg-[#FEE500] text-[#3c1e1e]";
  const iconClasses = "mr-3";

  return (
    <button 
      onClick={handleClick}
      className={`${baseClasses} ${provider === 'google' ? googleClasses : kakaoClasses}`}
    >
      <Icon className={iconClasses} />
      <span>{label}</span>
    </button>
  );
};

export default function LoginPage() {
  const [hovered, setHovered] = useState<PolicyType | null>(null);
  const [expanded, setExpanded] = useState<PolicyType | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          로그인
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          환영합니다
        </p>

        <div className="space-y-4">
          <SocialLoginButton
            provider="google"
            label="Google 계정으로 로그인"
            icon={Chrome}
            redirectUrl={'http://localhost:8080/oauth2/authorization/google'}
          />
          <SocialLoginButton
            provider="kakao"
            label="카카오 계정으로 로그인"
            icon={MessageCircle}
            redirectUrl={'http://localhost:8080/oauth2/authorization/kakao'}
          />
        </div>

        {/* 정책 컴포넌트 */}
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
    </div>
  );
}

