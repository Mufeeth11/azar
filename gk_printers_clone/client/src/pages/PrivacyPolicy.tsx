import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-6 font-poppins text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#10A7FF]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">Privacy Policy</h1>
            <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>Welcome to SR Digital. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. The Data We Collect About You</h2>
            <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, and title.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers provided via our contact forms.</li>
              <li><strong>Project Data:</strong> includes files, designs, and requirements you submit for printing purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to your inquiries and provide quotes for printing services.</li>
              <li>To process and deliver your printing orders.</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. Your submitted designs and contact information are kept strictly confidential and are not shared with third-party marketing agencies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Contact Details</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us via the Contact Us page on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
