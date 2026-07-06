import React from 'react';

const RefundCancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg p-6 sm:p-10 text-slate-700 font-sans leading-relaxed">
        
        {/* Header Section */}
        <div className="border-b-2 border-slate-900 pb-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 uppercase tracking-wide mb-2">
            ANANT SCHOOL
          </h1>
          <div className="text-lg sm:text-xl font-semibold text-slate-600 mb-4">
            Cancellation & Refund Policy (रद्दीकरण और धनवापसी नीति)
          </div>
          <div className="bg-slate-50 border-l-4 border-blue-500 p-3 rounded-r-md text-sm text-slate-500 flex flex-col sm:flex-row sm:gap-6">
            <p><strong>Last Updated:</strong> July 2026</p>
            <p><strong>Applicability:</strong> All SaaS Subscription Plans</p>
          </div>
        </div>

        {/* Intro Paragraph */}
        <p className="mb-6">
          At ANANT SCHOOL, we strive to ensure our school management software meets your institutional needs. However, we understand that administrative requirements may change. This Cancellation and Refund Policy outlines the terms under which you can cancel your subscription and when refunds are applicable.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          1. Subscription Cancellation by the School
        </h2>
        <p className="mb-3">
          <strong className="text-slate-900">1.1 Cancellation Process:</strong> School administrators hold the right to cancel their subscription at any time. To initiate a cancellation, the authorized Admin must submit a formal request via the Billing section of the ANANT SCHOOL dashboard or email our support team at <em className="text-blue-600">billing@anantschool.com</em> using the registered official email address.
        </p>
        <p className="mb-6">
          <strong className="text-slate-900">1.2 Effect of Cancellation:</strong> Cancellation will take effect at the end of the current paid billing cycle. You will retain full access to all software features, subdomains, and data until the end of your prepaid billing period.
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          2. Refund Policy
        </h2>
        <p className="mb-4">
          Because ANANT SCHOOL is a B2B SaaS (Software as a Service) platform with immediate infrastructure allocation and setup costs, our refund rules are structured as follows:
        </p>
        <p className="mb-3">
          <strong className="text-slate-900">2.1 Monthly Subscriptions:</strong> Payments for month-to-month subscription plans are <strong className="text-slate-900">strictly non-refundable</strong>. If you cancel a monthly subscription in the middle of a billing cycle, you will not receive a prorated refund for the remaining days.
        </p>
        <p className="mb-3">
          <strong className="text-slate-900">2.2 Annual Subscriptions (7-Day Guarantee):</strong> For new annual subscription purchases, we offer a <strong className="text-slate-900">7-Day Money-Back Guarantee</strong>. If you are dissatisfied with the platform within the first 7 days of your initial annual payment, you are eligible for a full refund (minus any one-time setup or onboarding fees, if applicable). After 7 days, annual subscriptions are non-refundable.
        </p>
        <p className="mb-6">
          <strong className="text-slate-900">2.3 Renewal Payments:</strong> Auto-renewal charges (if enabled) are non-refundable. Schools are notified 7 to 15 days prior to an upcoming annual renewal charge. It is the School's responsibility to cancel the subscription before the renewal date if they do not wish to continue.
        </p>

        {/* Highlight / Exception Box */}
        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-8 text-sm text-red-800">
          <strong className="text-red-900 block mb-1">Exceptions to Refunds:</strong>
          No refunds will be granted if a school's account is suspended or terminated by ANANT SCHOOL due to a violation of our Terms and Conditions, Prohibited Use policy, or data breach attempts.
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          3. Termination by ANANT SCHOOL
        </h2>
        <p className="mb-3">
          We reserve the right to suspend or terminate a school's account and access to the platform without prior notice or liability under the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Non-payment of subscription fees beyond the standard 7-day grace period.</li>
          <li>Violation of our Terms and Conditions, including unauthorized sharing of access credentials or reverse-engineering the software.</li>
          <li>Uploading illegal, fraudulent, or malicious content onto the platform.</li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          4. Data Handling Post-Cancellation
        </h2>
        
        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4 my-6 text-sm text-green-800">
          <strong className="text-green-900 block mb-1">Important Data Exit Strategy:</strong>
          We do not hold your data hostage. Upon cancellation, your data remains yours.
        </div>

        <p className="mb-3">
          <strong className="text-slate-900">4.1 Data Export Window:</strong> Upon the effective date of cancellation (end of the billing cycle), the School will be granted a <strong className="text-slate-900">30-day grace period</strong>. During this window, administrators can export all essential institutional data (Student lists, Fee ledgers, Attendance records) in standard formats (CSV/Excel).
        </p>
        <p className="mb-6">
          <strong className="text-slate-900">4.2 Permanent Deletion:</strong> After the 30-day grace period expires, to comply with data privacy and protection laws (DPDP Act 2023), ANANT SCHOOL will permanently and irreversibly delete all data associated with the canceled account from our active servers. <strong className="text-slate-900">Once deleted, this data cannot be recovered.</strong>
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          5. Chargebacks and Payment Disputes
        </h2>
        <p className="mb-6">
          If a school initiates a chargeback or dispute with their credit card provider or bank for a valid subscription charge, ANANT SCHOOL reserves the right to immediately suspend the account pending the resolution of the dispute. We highly encourage schools to contact our billing team first to resolve any payment issues amicably.
        </p>

        {/* Section 6 */}
        <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pl-3 border-l-4 border-blue-600">
          6. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions or require assistance with cancelling your subscription or requesting an eligible refund, please reach out to our billing department:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong className="text-slate-900">Email:</strong> billing@anantschool.com</li>
          <li><strong className="text-slate-900">Support Desk:</strong> Available via your Admin Dashboard (9:00 AM to 6:00 PM IST)</li>
        </ul>

      </div>
    </div>
  );
};

export default RefundCancellationPolicy;