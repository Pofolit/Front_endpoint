"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nextTick } from "process";

const FIELDS = [
  { label: "닉네임(aka)", name: "aka", type: "text", required: true },
  { label: "생일", name: "birthDay", type: "date"  },
];

const JOBS = [
  { label: "프리랜서", value: "프리랜서" },
  { label: "직장인", value: "직장인" },
];

const DOMAINS = [
  { label: "글", value: "writing" },
  { label: "그림", value: "art" },
  { label: "음악", value: "music" },
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
    aka: "",
    birthDay: "",
    domain: "",
    job: "",
    interests: [] as string[],
  });
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가

  // 인증 후 토큰/유저 정보 저장
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", user ?? "");
      // 주소창에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (user) {
      setNickname(decodeURIComponent(user));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((v) => v !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 토큰 가져오기
    const token = localStorage.getItem("accessToken");
    // 서버로 추가 정보 전송
    await fetch("http://localhost:8080/api/v1/users/me/details", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    router.replace("/");
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
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder={field.name === "aka" ? nickname : undefined} // 닉네임 placeholder 적용
            />
          </div>
        ))}
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