import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone } from "lucide-react";

import BenefitsSection from "../components/BenefitsSection";
import AboutSection from "../components/AboutSection";
import FeedbackSection from "../components/FeedbackSection";
import HeroSection from "../components/HeroSection";
import StudentTrustSection from "../components/StudentTrustSection";
import StudentReviewsSection from "../components/StudentReviewsSection";
import CoursecardSection from "../components/CoursecardSection";

const Contact = lazy(() => import("./Contact"));
const Cirtificate = lazy(() => import("./Ceritifiactepage"));

export default function Hero() {
  const location = useLocation();
  const [courseType, setCourseType] = useState("all");
  const courseTypeOptions = [
    { value: "all", label: "All Courses" },
    { value: "ongoing", label: "Ongoing" },
    { value: "upcoming", label: "Upcoming" },
  ];

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = location.hash.replace("#", "");
    let attempts = 0;

    function scrollToHashTarget() {
      const target = document.getElementById(targetId);

      if (target) {
        const navbarOffset = 96;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        window.setTimeout(scrollToHashTarget, 80);
      }
    }

    scrollToHashTarget();
  }, [location.hash]);

  return (
    <section className="space-y-12">
      <HeroSection text1="Modern tech education for the" text2=" next generation of developers." />
      <StudentTrustSection />
      <BenefitsSection />

      <Suspense fallback={<div>Loading....</div>}>
        <section id="Course_Section" className="scroll-mt-28">
          <CoursecardSection
            type={courseType}
            activeType={courseType}
            onTypeChange={setCourseType}
            filterOptions={courseTypeOptions}
            showCatalogLink
          />
        </section>
        <Cirtificate />
        <AboutSection />
        <StudentReviewsSection />
        <FeedbackSection />
        <section id="contact" className="scroll-mt-28 py-8">
          <Contact />
        </section>
      </Suspense>

      <a
        href="https://wa.me/917735755673"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 rounded-full bg-green-500 p-3 text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <Phone size={28} />
      </a>
    </section>
  );
}
