import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-xl p-8 sm:p-12 text-slate-700 font-sans leading-relaxed">
        
        {/* Header Section */}
        <div className="border-b-2 border-slate-900 pb-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
            ANANT SCHOOL
          </h1>
          <div className="text-xl font-semibold text-slate-600 mb-5">
            Terms and Conditions (नियम और शर्तें)
          </div>
          <div className="bg-slate-100 border-l-4 border-blue-600 p-4 rounded-r-lg text-sm text-slate-600 flex flex-col sm:flex-row sm:gap-8">
            <p><strong className="text-slate-800">Last Updated:</strong> July 2026</p>
            <p><strong className="text-slate-800">Document Version:</strong> 1.0 (Comprehensive SaaS Agreement)</p>
          </div>
        </div>

        {/* Intro Paragraph */}
        <p className="mb-6 text-lg">
          Welcome to ANANT SCHOOL. By registering your school, accessing our platform, or utilizing our cloud-based school management services, you agree to comply with and be bound legally by the following Terms and Conditions. Please read these terms comprehensively before proceeding with account activation.
        </p>

        {/* Legal Agreement Highlight Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 my-8 text-sm sm:text-base text-blue-900">
          <strong className="text-blue-950 font-bold block mb-1">LEGAL AGREEMENT:</strong> 
          This document constitutes a legally binding agreement between ANANT SCHOOL (the "Service Provider") and the registered educational institution, represented by its authorized signatories including Owners, Principals, or Management Personnel (the "Customer/School").
        </div>

        {/* Section 1 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          1. Account Registration, Verification & Security
        </h2>
        <div className="space-y-4">
          <p><strong className="text-slate-900">1.1 Eligibility & Authority:</strong> Registration is strictly restricted to authorized administrative personnel. By creating an account, the registering individual warrants that they possess full legal authority to bind the respective educational institution to these terms.</p>
          <p><strong className="text-slate-900">1.2 Verification Accuracy:</strong> The School is strictly required to provide verified, accurate, and complete data during onboarding. This includes official School Name, registered UDISE code, active email addresses, and verified management contact details. Providing fraudulent credentials will result in immediate termination of access.</p>
          <p><strong className="text-slate-900">1.3 Password & Subdomain Safety:</strong> The School bears absolute responsibility for maintaining the strict confidentiality of admin, staff, teacher, student, and parental login credentials. Any activity taking place under the allocated school subdomain (e.g., <em>schoolname.anantschool.com</em>) is the sole liability of the School.</p>
        </div>

        {/* Section 2 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          2. SaaS Scope of Services & License Rights
        </h2>
        <div className="space-y-4">
          <p><strong className="text-slate-900">2.1 Scope of Service:</strong> ANANT SCHOOL provides a comprehensive cloud-based Enterprise SaaS platform encompassing features such as Student Information Management, Automated Attendance Tracking, Fee Collection, Marksheet Generation, and Payroll Management.</p>
          <p><strong className="text-slate-900">2.2 License Grant:</strong> We grant the School a limited, non-exclusive, non-transferable, and revocable license to access and operate the software interface strictly for internal educational workflows. Software ownership and foundational code are not transferred to the School.</p>
        </div>

        {/* Section 3 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          3. Data Ownership, Privacy & Compliance (DPDP Act 2023)
        </h2>
        <div className="space-y-4">
          <p><strong className="text-slate-900">3.1 100% Data Ownership:</strong> The School retains absolute, 100% legal ownership over all individual student profiles, academic registries, and financial logs uploaded to the system. ANANT SCHOOL claims no ownership rights over the School's operational data.</p>
          <p><strong className="text-slate-900">3.2 Role as Data Processor:</strong> We process internal data exclusively to fulfill service delivery requirements and will never sell, lease, or distribute the school's internal records to third-party advertising networks.</p>
          <p><strong className="text-slate-900">3.3 Mandatory Parental Consent:</strong> As per the Digital Personal Data Protection (DPDP) Act, 2023, the School acts as the primary data fiduciary and must procure necessary parental consent before uploading personal records belonging to minor students onto the platform.</p>
        </div>

        {/* Section 4 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          4. Subscriptions, Fees, Taxes & Price Modifications
        </h2>
        <div className="space-y-4">
          <p><strong className="text-slate-900">4.1 Billing Structure:</strong> Services are provisioned on a subscription basis (Monthly or Annually). Payments must be cleared using designated payment channels on or before the specified billing invoice date.</p>
          <p><strong className="text-slate-900">4.2 Grace Period & Late Payments:</strong> If a subscription fee goes unpaid past the scheduled billing date, a mandatory <strong className="text-slate-900">7-day grace period</strong> will be extended. Failure to clear outstanding invoices will trigger automated temporary account suspension.</p>
        </div>

        {/* Section 5 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          5. Prohibited Use Policy
        </h2>
        <p className="mb-4">The School agrees that its administrators, faculty, and affiliated portal users will not:</p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <li>Deploy automated scrapers, data-mining bots, or extraction scripts to harvest data from the portal.</li>
          <li>Utilize the platform infrastructure to host malicious web components or store unlawful content.</li>
          <li>Share administrative credentials or staff accounts across unauthorized individuals or separate institutional branches.</li>
          <li>Overload or stress-test server nodes to intentionally cause platform downtime.</li>
        </ul>

        {/* Section 6 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          6. Disclaimers & Financial Limitation of Liability
        </h2>
        <p className="mb-6">
          <strong className="text-slate-900">6.1 "As-Is" Service Provision:</strong> ANANT SCHOOL is provisioned strictly on an "As-Is" and "As-Available" baseline framework. We do not declare or warrant absolute, error-free operations. Schools are advised to keep independent offline backups.
        </p>
        
        {/* Liability Cap Box (Red for legal emphasis) */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6 text-sm sm:text-base text-red-900">
          <strong className="text-red-950 font-bold block mb-1">6.2 FINANCIAL LIABILITY CAP:</strong> 
          Under no circumstances shall the collective financial liability of ANANT SCHOOL for any operational claim, data discrepancy, server outage, or legal dispute exceed the total subscription fees actually paid by the School during the <strong className="font-bold underline">three (3) months immediately preceding</strong> the event causing the claim.
        </div>

        {/* Section 7 */}
        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          7. Governing Law & Dispute Jurisdiction
        </h2>
        <div className="space-y-4 mb-8">
          <p><strong className="text-slate-900">7.1 Governing Law:</strong> These Terms and Conditions shall be systematically construed, governed, and interpreted exclusively under the prevailing national laws of the Republic of India.</p>
          <p><strong className="text-slate-900">7.2 Exclusive Jurisdiction:</strong> Any legal dispute, arbitration procedure, or court litigation arising out of or related to this SaaS agreement shall be filed exclusively within the territorial jurisdiction of the competent courts located in <strong className="text-slate-900">India</strong>.</p>
        </div>

      </div>
    </div>
  );
}