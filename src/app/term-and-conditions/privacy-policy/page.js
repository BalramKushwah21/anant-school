import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-xl p-8 sm:p-12 text-slate-700 font-sans leading-relaxed">
        
        {/* Header Section */}
        <div className="border-b-2 border-slate-900 pb-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
            ANANT SCHOOL
          </h1>
          <div className="text-xl font-semibold text-slate-600 mb-5">
            Privacy Policy (गोपनीयता नीति)
          </div>
          <div className="bg-slate-100 border-l-4 border-blue-600 p-4 rounded-r-lg text-sm text-slate-600 flex flex-col sm:flex-row sm:gap-8">
            <p><strong className="text-slate-800">Last Updated:</strong> July 2026</p>
            <p><strong className="text-slate-800">Compliance:</strong> DPDP Act 2023 Ready</p>
          </div>
        </div>

        {/* Intro Paragraph */}
        <p className="mb-6 text-base">
          At <strong className="text-slate-900">ANANT SCHOOL</strong>, we deeply respect your privacy and are committed to protecting the personal data of schools, administrators, teachers, non-teaching staff, parents, and students. This policy outlines how we handle, process, and secure the data uploaded to our cloud-based School Management SaaS platform.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          1. Information We Collect
        </h2>
        <p className="mb-4 text-base">We collect data at different levels to ensure the software runs smoothly and efficiently:</p>
        <ul className="list-disc pl-6 space-y-3 text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <li><strong className="text-slate-900">From School Admins:</strong> School Name, Email, Phone Number, Address, Logo, UDISE Code, and Billing Details.</li>
          <li><strong className="text-slate-900">From Teachers/Staff:</strong> Name, Contact Info, Qualifications, Payroll Information, and Attendance records.</li>
          <li><strong className="text-slate-900">From Students/Parents:</strong> Name, Roll Number, Class, Guardian Details, Fee records, Academic Performance, and Transport details.</li>
          <li><strong className="text-slate-900">Technical Data:</strong> IP Address, browser type, and essential cookies to keep users securely logged into their specific subdomains.</li>
        </ul>

        {/* Section 2 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          2. How We Use the Information
        </h2>
        <p className="mb-4 text-base">We act strictly as a <strong className="text-slate-900">Data Processor</strong>. We use the collected information solely to:</p>
        <ul className="list-disc pl-6 space-y-3 text-slate-700">
          <li>Provide, maintain, and personalize the School Management Software via the allocated subdomain.</li>
          <li>Generate automated internal reports (Report cards, Fee receipts, Attendance charts, ID Cards).</li>
          <li>Send critical SMS/Email or WhatsApp alerts to parents and staff (e.g., OTPs, fee reminders, emergency holidays).</li>
          <li>Process SaaS subscription payments securely.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          3. Data Protection, Security & Hosting
        </h2>
        
        {/* Security Highlight Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6 text-sm sm:text-base text-green-900">
          <strong className="text-green-950 font-bold block mb-1">DATA LOCALIZATION:</strong> 
          All sensitive institutional and personal data is hosted securely on enterprise-grade cloud servers located within the territorial jurisdiction of <strong className="underline">India</strong> to strictly comply with national data sovereignty laws.
        </div>

        <div className="space-y-4 text-base">
          <p><strong className="text-slate-900 font-semibold">Encryption:</strong> All data transferred between users and our servers is encrypted using SSL/HTTPS technology. Passwords are encrypted using secure hashing algorithms (like bcrypt) before saving to the database.</p>
          <p><strong className="text-slate-900 font-semibold">Access Control:</strong> Only authorized school users can view their specific school data based on role-based access. Our internal team cannot view student or financial data unless explicitly requested by the school admin for technical support troubleshooting.</p>
        </div>

        {/* Section 4 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          4. Data Sharing and Third Parties
        </h2>
        <p className="mb-4 text-base">We <strong className="text-red-600 font-bold">NEVER</strong> sell, trade, rent, or monetize school or student data to third-party marketing companies or data brokers. Data is only shared with trusted third-party service providers strictly necessary for core functionality, such as:</p>
        <ul className="list-disc pl-6 space-y-3 text-slate-700">
          <li><strong className="text-slate-900">Payment Gateways:</strong> (e.g., Razorpay, Stripe) to process online fee collections securely. We do not store raw credit/debit card numbers on our servers.</li>
          <li><strong className="text-slate-900">Communication Gateways:</strong> SMS, Email, and WhatsApp API providers to send official school notifications.</li>
          <li><strong className="text-slate-900">Cloud Infrastructure:</strong> Trusted cloud providers for secure database hosting and backups.</li>
        </ul>

        {/* Section 5 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          5. Data Retention and Deletion
        </h2>
        <div className="space-y-4 text-base">
          <p>We retain school data as long as the SaaS subscription remains active.</p>
          <p>Upon termination or cancellation of the service, schools can request a complete export of their data (in CSV/Excel formats) within a <strong className="text-slate-900 font-semibold">30-day grace period</strong>. Following this post-termination window, all data related to that school subdomain will be permanently and irreversibly purged from our active databases.</p>
        </div>

        {/* Section 6 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          6. Children's Privacy (Minor Data)
        </h2>
        
        {/* DPDP Act Compliance Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 my-6 text-sm sm:text-base text-blue-900">
          <strong className="text-blue-950 font-bold block mb-1">LEGAL RESPONSIBILITY:</strong> 
          Our platform processes the data of minor students. However, ANANT SCHOOL acts merely as the technology provider. The School acts as the primary <strong>"Data Fiduciary"</strong> and is legally responsible for procuring mandatory parental or guardian consent before uploading the personal records of minors (children under 18 years of age) onto the platform.
        </div>
        <p className="text-base text-slate-700">We do not directly interact with or collect data from children without school authorization. We strictly prohibit the use of children's data for behavioral monitoring or targeted advertising.</p>

        {/* Section 7 */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-6 pl-4 border-l-4 border-blue-600">
          7. Grievance Redressal & Contact Us
        </h2>
        <p className="mb-4 text-base">
          In compliance with the Information Technology Act and the Digital Personal Data Protection Act, 2023, if you have any questions, concerns, or grievances regarding this Privacy Policy or your data, please contact our designated Grievance Officer at:
        </p>
        <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 text-slate-800">
          <p className="mb-2"><strong className="text-slate-900">Email:</strong> bkushwah1081@gmail.com, dangiramdas09@gmail.com</p>
          <p><strong className="text-slate-900">Address:</strong> Anand Nagar, Bhopal, Madhya Pradesh, India</p>
        </div>

      </div>
    </div>
  );
}