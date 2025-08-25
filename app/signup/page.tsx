"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "../lib/axios";

// 필드 정보 배열을 수정
const FIELDS = [
  { label: "이메일", name: "email", type: "email", readOnly: true },
  { label: "닉네임", name: "nickname", type: "text", required: true },
  { label: "생일", name: "birthDay", type: "date" },
];

const JOBS = [
  { label: "프리랜서", value: "freelancer" },
  { label: "직장인", value: "employee" },
];

const DOMAINS = [
  { label: "글", value: "writing" },
  { label: "그림", value: "art" },
  { label: "음악", value: "music" },
  { label: "개발", value: "dev" },
];

const INTERESTS = [
  { label: "글", value: "writing" },
  { label: "그림", value: "art" },
  { label: "음악", value: "music" },
  { label: "개발", value: "dev" },
];

export default function SignupDetailsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "email",
    nickname: "nickname",
    profileImageUrl: "profileImageUrl",
    birthDay: "birthDay",
    job: "job",
    domain: "domain",
    interests: [] as string[],
    // 여기서 토큰 재발행 요청을 할지말지?
  });

  // 인증 후 토큰/유저 정보 저장
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    console.log("Current URL search params:", window.location.search);
    console.log("Access Token from URL:", token);
    console.log("Refresh Token from URL:", refreshToken);
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decodedToken: any = jwtDecode(token);
        // 토큰에서 불변 정보만 추출하여 폼 상태에 설정
        setForm((prev) => ({
          ...prev,
          email: decodedToken.email,
          nickname: decodedToken.nickname,
          profileImageUrl: decodedToken.profileImageUrl,
        }));
        console.log("Decoded token:", decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
      
      // 주소창에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.error("Access or refresh token is missing from the URL.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        interests: isChecked
          ? [...prev.interests, value]
          : prev.interests.filter((v) => v !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("token");
    
    const updatePayload = {
      nickname: form.nickname,
      birthDay: form.birthDay,
      job: form.job,
      domain: form.domain,
      interests: form.interests
      
    };
    
    try {
      const response = await axios.patch("/api/v1/users/signup", updatePayload);
      if (response.status === 200) {
        router.replace("/");
        alert("정보가 성공적으로 저장됐습니다.");
      } else {
        alert("정보 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("네트워크 오류가 발생했습니다:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-2">추가 정보 입력</h2>
        
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label className="block font-semibold mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              readOnly={field.readOnly}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder={field.label}
            />
          </div>
        ))}
        {/* 업무분야 선택 */}
        <div>
          <label className="block font-semibold mb-1">업무분야</label>
          <select
            name="domain"
            value={form.domain}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">선택</option>
            {DOMAINS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* 직업 선택 */}
        <div>
          <label className="block font-semibold mb-1">직업</label>
          <select
            name="job"
            value={form.job}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">선택</option>
            {JOBS.map((j) => (
              <option key={j.value} value={j.value}>
                {j.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* 관심사 체크박스 */}
        <div>
          <label className="block font-semibold mb-1">관심사</label>
          <div className="flex gap-3 flex-wrap">
            {INTERESTS.map((i) => (
              <label key={i.value} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="interests"
                  value={i.value}
                  checked={form.interests.includes(i.value)}
                  onChange={handleChange}
                />
                {i.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-4"
        >
          저장하고 시작하기
        </button>
      </form>
    </div>
  );
}
