"use client";
import { PRIVACY_POLICY_TEXT } from "../../../constants/policy";
import PolicySection from "../../components/PolicySection";

export default function PrivacyPolicyPage() {
  return <PolicySection title="개인정보처리방침" text={PRIVACY_POLICY_TEXT} />;
}
"use client"
export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>개인정보처리방침</h2>
      <p>개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침개인정보처리방침 .</p>
    </div>
  );
}