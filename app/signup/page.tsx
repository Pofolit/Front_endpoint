"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../api/axios";
import { useUserDispatch } from "../context/UserContext";
import { extractIdFromToken, extractEmailFromToken, extractNicknameFromToken } from "../../api/token";
import { isValidEmail, isValidNickname, isValidUUID } from "../../api/validator";

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

export default function SignupDetailsPage() {
  const router = useRouter();
  const dispatch = useUserDispatch();
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    profileImageUrl: "",
    birthDay: "",
    job: "",
    domain: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const id = extractIdFromToken(token);
      const email = extractEmailFromToken(token);
      const nickname = extractNicknameFromToken(token);
      if (!id || !isValidUUID(id) || !isValidEmail(email ?? "") || !isValidNickname(nickname ?? "")) {
        alert("잘못된 인증 정보입니다.");
        router.replace("/login");
        return;
      }
      dispatch({ type: "LOGIN", payload: { id, email: email ?? "", nickname: nickname ?? "" } });
      setForm((prev) => ({
        ...prev,
        email: email ?? "",
        nickname: nickname ?? "",
      }));
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      alert("Access or refresh token is missing from the URL.");
      router.replace("/login");
    }
  }, [router, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "date" ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatePayload = {
      nickname: form.nickname,
      birthDay: form.birthDay,
      job: form.job,
      domain: form.domain,
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
              className={`w-full border rounded px-3 py-2 ${
                field.readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
        <button
          onClick={() => router.replace("/")
          }
          className="w-1/2 mx-auto bg-orange-500 text-white py-2 rounded font-bold mt-4"
        >
          메인 화면으로 돌아가기
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded font-bold mt-4"
        >
          저장하고 시작하기
        </button>
      </form>
    </div>
  );
}
