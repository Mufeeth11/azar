import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-6 font-poppins text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#F47C20]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">Terms of Service</h1>
            <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the SR Digital website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Printing Services & Artwork</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Copyright:</strong> You guarantee that you hold the legal copyright or proper licensing for any artwork, logos, or designs you submit to us for printing. SR Digital is not liable for copyright infringement on user-submitted materials.</li>
              <li><strong>Color Matching:</strong> While we use high-quality commercial printers, 100% exact color matching is not guaranteed due to variations in monitor displays and CMYK printing processes.</li>
              <li><strong>Proof Approval:</strong> If a digital proof is provided, the printing process will not begin until you have formally approved it. We are not responsible for typos or errors missed during the proofing stage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Payment & Refunds</h2>
            <p className="mb-2">Due to the custom nature of printing services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders cannot be cancelled or refunded once the printing process has commenced.</li>
              <li>If there is a manufacturing defect or an error on our part, we will reprint the defective items free of charge. Claims must be made within 3 days of receiving the product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Turnaround Times</h2>
            <p>Estimated turnaround times are provided as a courtesy and are not guaranteed. We will make every effort to complete your order within the estimated timeframe, but we are not liable for delays caused by equipment failure, shipping delays, or acts of God.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Modifications</h2>
            <p>SR Digital reserves the right to modify these Terms of Service at any time. We will do so by posting and drawing attention to the updated terms on this site.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
