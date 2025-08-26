export type PolicyType = "privacy" | "terms";

export const POLICY_CONFIG: Record<PolicyType, { src: string; title: string }> = {
  privacy: {
    src: "/policy/privacy-policy",
    title: "개인정보처리방침",
  },
  terms: {
    src: "/policy/terms-of-service",
    title: "서비스 이용약관",
  },
};
