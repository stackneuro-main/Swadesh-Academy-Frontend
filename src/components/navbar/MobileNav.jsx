import  { useState } from "react";
import {useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, AlignJustify, X } from "lucide-react";

export default function MobileNav({ navitems }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

return (
    <>

      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={{ rotate: mobileOpen ? 90 : 0 }}
        transition={{ duration: 0.3 }}
        className="cursor-pointer z-30 relative"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <AlignJustify size={28} />}
      </motion.div>

      {/* Mobile Menu========================================================================== */}
      {mobileOpen && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-0 top-16 px-5 w-full backdrop-blur-3xl z-20 flex flex-col gap-5"
        >
          <ul className="flex flex-col gap-4">
            {navitems.map((item, index) => (
              <motion.li
                key={index}
                onTapStart={() => {
                  if (!item.child) {
                    navigate(item.path);
                    setMobileOpen(false);
                  } else {
                    setClickCheck(prev => (prev === index ? null : index));
                  }
                }}
                onTapCancel={() => setClickCheck(null)}
                className="relative flex flex-col gap-2 cursor-pointer  hover:bg-blue-700/20 transition-all ease-in-out duration-100  p-3 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.child && <ChevronDown className="inline" />}
                </div></motion.li>
            ))}
          </ul>
</motion.div>
      )}
    </>
  );
}
