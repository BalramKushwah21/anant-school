import PolicyViewer from "@/components/policy-term/policyViewer";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <PolicyViewer fileName="policy.md" title="Privacy Policy" />
    </div>
  );
}