import { softwareDevelopment } from "../utils/constants";
import CourseCard from "./CourseCard";
import HeadingStyle from "./HeadingStyle";
import { motion, useAnimation } from "motion/react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { CheckCircle2 } from 'lucide-react'; // optional icon

export default function CoursecardSection({ type, heading }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const coursetype = softwareDevelopment;

  const complementaryFeatures = [
    "💼 Real-world Projects",
    "📝 Interview Preparation",
    "📄 Resume Building",
  ];

  return (
    <>


   {/* Neon-Glow Complementary Features with Blue Gradient */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 px-4">
  {complementaryFeatures.map((feature, index) => (
    <motion.div
      key={index}
      custom={index}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
      className="relative flex items-center justify-center gap-1 group cursor-pointer bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 rounded-xl p-3 shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Neon Icon */}
      <div className="">
        <CheckCircle2 
          size={28} 
          className="text-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] transition-all"
        />
      </div>

      {/* Neon Text */}
      <h3 className="text-white font-bold text-md  md:text-lg text-center  transition-all">
        {feature}
      </h3>

      {/* Neon hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"></div>
    </motion.div>
  ))}
</div>

  

    <motion.div
      className="mt-2"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
    >
   <HeadingStyle text={heading} />

      {/* Course Cards */}
      <div className="grid place-content-center gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
        {coursetype.map((courseinfo, ind) => (
          <CourseCard key={ind} courseinfo={courseinfo} />
        ))}
      </div>
    </motion.div>
    </>
  );
}
