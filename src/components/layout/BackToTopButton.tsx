"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full px-4 py-3 shadow-2xl border backdrop-blur-md"
          style={{
            backgroundColor: "rgba(26,17,8,0.9)",
            borderColor: "#3d2a0e",
            color: "#fef3c7",
          }}
        >
          <ArrowUp size={16} />
          <span className="text-sm font-semibold">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
