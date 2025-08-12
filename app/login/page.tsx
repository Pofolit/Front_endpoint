"use client";

import React from 'react';
import { Chrome, MessageCircle } from 'lucide-react';

// 소셜 로그인 버튼 컴포넌트

interface SocialLoginButtonProps {
  provider: 'google' | 'kakao';
  label: string;
  icon: React.ElementType;
  redirectUrl: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, label, icon: Icon, redirectUrl }) => {
  
  const handleClick = () => {
    try {
      window.location.href = redirectUrl;
      provider === 'google' ? console.log('Google login clicked') : console.log('Kakao login clicked');
    } catch (error) {
      console.error("Error during login button click:", error);
    }
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
      </div>
    </div>
  );
}

