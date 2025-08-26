"use client";
import { TERMS_OF_SERVICE_TEXT } from "../../../constants/policy";
import PolicySection from "../../components/PolicySection";

export default function TermsOfServicePage() {
  return <PolicySection title="서비스 이용약관" text={TERMS_OF_SERVICE_TEXT} />;
}