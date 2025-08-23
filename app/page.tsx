"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PolicyPage from "./policy/page";
import axios from "./lib/axios";

interface User {
  [x: string]: any;
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  birthDay?: string;
  job?: string;
  domain?: string;
  interests: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const accessToken = localStorage.getItem("token");

    const showLoginButtonWithDelay = (delay: number) => {
      setTimeout(() => setShowLoginButton(true), delay);
    };

    const hideLoadingAndShowLoginButton = (loadingDelay: number, buttonDelay: number) => {
      setTimeout(() => {
        setShowLoading(false);
        showLoginButtonWithDelay(buttonDelay);
      }, loadingDelay);
    };

    if (!accessToken) {
      hideLoadingAndShowLoginButton(1100, 500); // Loading fadeout, button fadein
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/v1/users/me");
        setUser(response.data as User);
        console.log(response.data);
      } catch (info) {
        hideLoadingAndShowLoginButton(2700, 2000);
        console.info("fail token fetch :", info);
        router.replace("/login");
      }
    };

    fetchUserData();
  }, [router]);

  let userInfoContent;
  if (!isMounted || !user) {
    userInfoContent = (
      <div style={{ height: 32, position: "relative" }}>
        <h1 className="text-2xl font-bold text-center mb-4">메인 페이지</h1>
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-4 transition-opacity duration-700 ${
            showLoading ? "opacity-100" : "opacity-0"
          }`}
          style={{
            pointerEvents: "none",
          }}
        >
          Loading...
        </div>
        <button
          onClick={() => router.replace("/login")}
          className={`absolute left-1/2 -translate-x-1/2 mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold shadow transition-opacity duration-700 ${
            showLoginButton ? "opacity-100" : "opacity-0"
          }`}
          style={{
            pointerEvents: showLoginButton ? "auto" : "none",
          }}
        >
          Sign In
        </button>
      </div>
    );
  } else {
    userInfoContent = (
      <div className="text-center text-lg font-semibold ">
        <div className="text-sm relative ">
          <p className="absolute -left-5 ">user nickname : </p>
          <p className="absolute top-7 -left-7 ">user email : </p>
          <p className="absolute translate-y-40 translate-x-20"> param: profileImageUrl</p>
        </div>
        <div style={{ opacity: 0.3, marginTop: 8, filter: "blur(3px)" }}>
          <p>{user.nickname}</p>
          <p>{user.email}</p>
          {user.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              alt="프로필 이미지"
            className="mx-auto mt-8 px-4 py-4 rounded-md w-1/2 h-fit object-cover "
          />
          )}
          </div>
      </div>
    );
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
        id="box"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {userInfoContent}
        {!user ? <PolicyPage /> : null}
      </div>
    </main>
  );
}