"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../../../../api/Interceptor";
  

export default function SignupAuthCallbackPage() {
    const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/");
    }
  }, [router]);

  return (
    <div>
      인증 처리 중입니다...
    </div>
  );
}