"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PolicyPage from "./policy/page";
import { fetchUserData, handleAuthCallback } from "./lib/axios";
import { UserInfo } from "./lib/types/user";

export default function HomePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showProfileButton, setShowProfileButton] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const showLoginButtonWithDelay = (delay: number) => {
      setTimeout(() => setShowLoginButton(true), delay);
    };

    const hideLoadingAndShowLoginButton = (
      loadingDelay: number,
      buttonDelay: number
    ) => {
      setTimeout(() => {
        setShowLoading(false);
        showLoginButtonWithDelay(buttonDelay);
      }, loadingDelay);
    };
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      window.history.replaceState({}, document.title, window.location.pathname);
      hideLoadingAndShowLoginButton(1100, 500); // Loading fadeout, button fadein
    }
    // 사용자 추가 정보 가져오기
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserData();
        setUserInfo(userInfo as UserInfo);
      } catch (userInfo) {
        hideLoadingAndShowLoginButton(2700, 2000);
        setUserInfo(null);
        console.info("fail token fetch :", userInfo);
        router.replace("/login");
      }
    };
    getUserInfo();
  }, [router]);

  let userInfoContent;
  if (!isMounted || !userInfo) {
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
          <p className="absolute translate-y-40 translate-x-20">
            {" "}
            param: profileImageUrl
          </p>
        </div>
        <div style={{ opacity: 0.3, marginTop: 8, filter: "blur(3px)" }}>
          <p>{userInfo.nickname}</p>
          {/* <p>{userInfo.email}</p> */}
          {userInfo.profileImageUrl && (
            <img
              src={userInfo.profileImageUrl}
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
      <div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
        id="box"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {userInfoContent}
        <div className="mt-20">{!userInfo ? <PolicyPage /> : null} </div>
      </div>
    </main>
  );
}
