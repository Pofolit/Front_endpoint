import PrivacyPolicyPage from "./privacy-policy/page";
import TermsOfServicePage from "./terms-of-service/page";

export default function PolicyPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 32 }}>
      <PrivacyPolicyPage />
      <TermsOfServicePage />
    </div>
  );
}