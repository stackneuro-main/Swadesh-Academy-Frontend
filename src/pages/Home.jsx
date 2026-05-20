import HeroSection from "../components/HeroSection";
import HeroLottieimg from "../assets/LottieIcon/STUDENT.json";
import { Suspense, lazy } from "react";
import { Phone } from 'lucide-react';
const Courses = lazy(() => import("./Courses"));
const Cirtificate = lazy(() => import("./Ceritifiactepage"));

export default function Hero() {
  return (
    <section>
      {/* Hero Section */}
      <HeroSection
        text1="Your all in one"
        text2=" learning platform"
        img={HeroLottieimg}
      ></HeroSection>

      <Suspense fallback={<div>Loading....</div>}>
        <Courses />
        <Cirtificate/>
        
      </Suspense>

      {/* ✅ WhatsApp Floating Icon */}
      <a
        href="https://wa.me/917735755673" // replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce"
      >
        <Phone size={28} />
      </a>
    </section>
  );
}
