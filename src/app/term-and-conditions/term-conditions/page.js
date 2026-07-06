import PolicyViewer from "@/components/policy-term/policyViewer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <PolicyViewer fileName="terms.md" title="Terms & Conditions" />
    </div>
  );
}