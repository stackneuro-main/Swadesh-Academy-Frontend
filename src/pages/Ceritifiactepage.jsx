// src/components/CertificateSection.jsx
import certificateImg from "../assets/Images/Blue Simple Achievement Certificate.png"; // your certificate image


export default function Certificatepage() {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-10">
      {/* Left side - Text */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-3">
          {/* <FaAward className="text-yellow-500" /> */}
          Get Certified With Confidence
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
          After completing any of our professional courses, you’ll receive an
          industry-recognized certificate that validates your new skills and boosts
          your career opportunities.
        </p>

        {/* <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-all">
          View Sample Certificate
        </button> */}
      </div>

      {/* Right side - Image */}
      <div className="flex-1 flex justify-center">
        <img
          src={certificateImg}
          alt="Certificate Example"
          className="w-full max-w-md rounded-lg shadow-xl hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
    </section>
  );
}
