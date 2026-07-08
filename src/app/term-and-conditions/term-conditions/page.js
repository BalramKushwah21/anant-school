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
            <p><strong className="text-slate-800">Last Updated:</strong> June 2026</p>
            <p><strong className="text-slate-800">Document Version:</strong> 1.0 (Comprehensive SaaS Agreement)</p>
          </div>
        </div>

        {/* Intro Paragraph */}
        <p className="mb-6 text-base">
          Welcome to ANANT SCHOOL. By registering your school, accessing our platform, or utilizing our cloud-based school management services, you agree to comply with and be bound legally by the following Terms and Conditions. Please read these terms comprehensively before proceeding with account activation.
        </p>

        {/* Legal Agreement Highlight Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 my-8 text-sm sm:text-base text-blue-900">
          <strong className="text-blue-950 font-bold block mb-1">LEGAL AGREEMENT:</strong> 
          This document constitutes a legally binding agreement between ANANT SCHOOL (the "Service Provider") and the registered educational institution, represented by its authorized signatories including Owners, Principals, or Management Personnel (the "Customer/School").
        </div>

        {/* Section 1 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          1. Account Registration, Verification & Security
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">1.1 Eligibility & Authority:</strong> Registration is strictly restricted to authorized administrative personnel. By creating an account, the registering individual warrants that they possess full legal authority to bind the respective educational institution to these terms.</p>
          <p><strong className="text-slate-900 font-semibold">1.2 Verification Accuracy:</strong> The School is strictly required to provide verified, accurate, and complete data during onboarding. This includes, but is not limited to, official School Name, registered UDISE (Unified District Information System for Education) code, institutional Board affiliation (CBSE, ICSE, State Board, etc.), active email addresses, and verified management contact details. Providing fraudulent or inaccurate credentials will result in immediate termination of access.</p>
          <p><strong className="text-slate-900 font-semibold">1.3 Password & Subdomain Safety:</strong> The School bears absolute responsibility for maintaining the strict confidentiality of admin, staff, teacher, student, and parental login credentials. Any activity taking place under the allocated school subdomain (e.g., <em>schoolname.anantschool.com</em>) is the sole liability of the School.</p>
        </div>

        {/* Section 2 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          2. SaaS Scope of Services & License Rights
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">2.1 Scope of Service:</strong> ANANT SCHOOL provides a comprehensive cloud-based Enterprise SaaS platform encompassing features such as Student Information Management, Automated Attendance Tracking, Fee Collection & Registry, Marksheet & Report Card Generation, Non-Teaching Staff Payroll, and Transport/Vehicle Management Systems.</p>
          <p><strong className="text-slate-900 font-semibold">2.2 License Grant:</strong> We grant the School a limited, non-exclusive, non-transferable, revocable, and non-sublicensable license to access and operate the software interface strictly for internal educational and administrative workflows. Software ownership, foundational code, framework architecture, and proprietary algorithms are not transferred to the School.</p>
        </div>

        {/* Section 3 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          3. Intellectual Property (IP) Ownership
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">3.1 Platform Rights:</strong> All intellectual property rights, copyrights, trademarks, software source codes, UI/UX designs, system logic, brand assets, and proprietary documentation associated with ANANT SCHOOL remain the exclusive and absolute property of ANANT SCHOOL.</p>
          <p><strong className="text-slate-900 font-semibold">3.2 Restrictions:</strong> The School, including its staff, IT administrators, or external affiliates, is strictly prohibited from reverse-engineering, decompiling, copying, modifying, creating derivative works of, or attempting to extract the underlying source code of the platform.</p>
        </div>

        {/* Section 4 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          4. Data Ownership, Privacy & Compliance (DPDP Act 2023)
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">4.1 100% Data Ownership:</strong> The School retains absolute, 100% legal ownership over all individual student profiles, teacher rosters, internal marks, academic registries, and financial logs uploaded to the system. ANANT SCHOOL claims no ownership rights over the School's operational data.</p>
          <p><strong className="text-slate-900 font-semibold">4.2 Role as Data Processor:</strong> ANANT SCHOOL acts strictly as a "Data Processor" under relevant regulations. We process internal data exclusively to fulfill service delivery requirements and will never sell, lease, monetize, or distribute the school's internal records to third-party advertising networks or external data brokers.</p>
          <p><strong className="text-slate-900 font-semibold">4.3 Mandatory Parental Consent:</strong> As per the Digital Personal Data Protection (DPDP) Act, 2023 and child privacy frameworks, the School acknowledges that it acts as the primary data fiduciary. It is the absolute legal duty of the School management to procure necessary parental or guardian consent before uploading personal records belonging to minor students (under 18 years of age) onto the platform.</p>
          <p><strong className="text-slate-900 font-semibold">4.4 Sovereignty & Data Hosting:</strong> All data handled by ANANT SCHOOL is strictly hosted on secured, enterprise-grade cloud servers localized within the geographical boundaries of India to comply with national sovereign data residency guidelines.</p>
        </div>

        {/* Section 5 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          5. Data Security & Breach Notification Protocol
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">5.1 Security Benchmarks:</strong> ANANT SCHOOL implements standard data safety protocols, including end-to-end SSL/TLS data encryption during transmission and AES-256 encryption-at-rest. Automated firewall protections and role-based access tokens are implemented to defend institutional information.</p>
          <p><strong className="text-slate-900 font-semibold">5.2 Breach Notification Timeline:</strong> In the highly unlikely event of a confirmed malicious data breach compromising sensitive institutional records, ANANT SCHOOL will officially notify the designated School Admin within 72 hours of discovery. This notification will include a mitigation strategy report outlining steps to restore complete security perimeter defense.</p>
        </div>

        {/* Section 6 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          6. Subscriptions, Fees, Taxes & Price Modifications
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">6.1 Billing Structure:</strong> Services are provisioned on a subscription basis, billed either Monthly or Annually depending on the selected institutional package. All payments must be cleared using designated payment channels on or before the specified billing invoice date.</p>
          <p><strong className="text-slate-900 font-semibold">6.2 Tax Obligations:</strong> All quoted subscription prices are exclusive of statutory government levies. Applicable indirect taxes (such as 18% Goods and Services Tax - GST in India) shall be calculated and appended to the billing invoice at the time of purchase or renewal.</p>
          <p><strong className="text-slate-900 font-semibold">6.3 Grace Period & Late Payments:</strong> If a subscription fee goes unpaid past the scheduled billing date, a mandatory 7-day grace period will be extended. Failure to clear outstanding invoices within these 7 days will trigger automated temporary account suspension, during which portal access for admins, teachers, and parents will be restricted.</p>
          <p><strong className="text-slate-900 font-semibold">6.4 Price Modifications:</strong> ANANT SCHOOL reserves the right to alter standard subscription price metrics. Any upward adjustment in recurring pricing tiers will be communicated via formal written notice or electronic mail at least 30 days in advance of the next renewal cycle.</p>
          <p><strong className="text-slate-900 font-semibold">6.5 Refund Policy:</strong> All subscription fees paid are completely non-refundable and non-creditable, unless explicitly stated otherwise in a separate, customized Service Level Agreement (SLA).</p>
        </div>

        {/* Section 7 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          7. Prohibited Use Policy
        </h2>
        <p className="mb-4 text-base">The School agrees that its administrators, faculty, and affiliated portal users will not:</p>
        <ul className="list-disc pl-6 space-y-3 text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <li>Deploy automated scrapers, data-mining bots, or extraction scripts to harvest data from the portal interface.</li>
          <li>Utilize the platform infrastructure to host malicious web components, distribute malware, or store unlawful content.</li>
          <li>Share administrative credentials or staff accounts across unauthorized individuals or separate institutional branches without proper multi-campus upgrade plans.</li>
          <li>Overload or stress-test server nodes to intentionally cause platform downtime or latency issues for other subdomains.</li>
        </ul>

        {/* Section 8 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          8. Termination & Post-Termination Exit Strategy
        </h2>
        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">8.1 Voluntary Termination:</strong> The School can initiate account termination at any time by raising an official deactivation ticket through the designated billing admin console.</p>
          <p><strong className="text-slate-900 font-semibold">8.2 Post-Termination Retention & Portability:</strong> Upon active subscription termination, ANANT SCHOOL guarantees a 30-day data retention window. During these 30 days, the School can request a full system data export. ANANT SCHOOL will provide this export in standard portable formats (such as structured CSV or Microsoft Excel spreadsheets) containing raw student and financial records.</p>
          <p><strong className="text-slate-900 font-semibold">8.3 Permanent Purge:</strong> Immediately upon the expiry of the 30-day post-termination window, all associated data tables, asset uploads, and structural backups linked to the respective subdomain will be permanently and irreversibly purged from our active production databases in compliance with privacy retention laws.</p>
        </div>

        {/* Section 9 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          9. Disclaimers & Financial Limitation of Liability
        </h2>
        <p className="mb-6 text-base">
          <strong className="text-slate-900 font-semibold">9.1 "As-Is" Service Provision:</strong> ANANT SCHOOL is provisioned strictly on an "As-Is" and "As-Available" baseline framework. While our technical operations aim for an enterprise-level 99.9% application uptime, we do not declare or warrant absolute, error-free operations or continuous uninterrupted sessions. Schools are strongly advised to keep independent monthly offline backups of their primary academic registries.
        </p>
        
        {/* Liability Cap Box (Red for legal emphasis) */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6 text-sm sm:text-base text-red-900">
          <strong className="text-red-950 font-bold block mb-1">9.2 FINANCIAL LIABILITY CAP:</strong> 
          Under no circumstances shall the collective financial liability of ANANT SCHOOL for any operational claim, data discrepancy, server outage, or legal dispute exceed the total dollar amount or rupee value equivalent to the subscription fees actually paid by the School during the <strong className="font-bold underline">three (3) months immediately preceding</strong> the event causing the respective claim.
        </div>

        {/* Section 10 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          10. Governing Law & Dispute Jurisdiction
        </h2>
        <div className="space-y-4 mb-8 text-base">
          <p><strong className="text-slate-900 font-semibold">10.1 Governing Law:</strong> These compiled Terms and Conditions shall be systematically construed, governed, and interpreted exclusively under the prevailing national laws of the Republic of India.</p>
          <p><strong className="text-slate-900 font-semibold">10.2 Exclusive Jurisdiction:</strong> Any legal dispute, arbitration procedure, or court litigation arising out of or related to this SaaS agreement shall be filed exclusively within the territorial jurisdiction of the competent courts located in the city of the corporate headquarters of ANANT SCHOOL (e.g., New Delhi, India).</p>
        </div>

      </div>
    </div>
  );
}