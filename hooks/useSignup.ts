import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../api/axios";
import { useUserDispatch } from "../context/UserContext";
import { extractIdFromToken, extractEmailFromToken, extractNicknameFromToken } from "../utils/token";
import { isValidEmail, isValidNickname, isValidUUID } from "../utils/validator";

export function useSignup() {
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
      [name]: value,
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

  return { form, handleChange, handleSubmit, router };
}
