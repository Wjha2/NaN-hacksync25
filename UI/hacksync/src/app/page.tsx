"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import { Heart, Brain, Users, Sun } from "lucide-react";

// Pseudo-random number generator with seed for consistent values
let seed = 12345;
const seededRandom = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// Pre-generate background element positions
const BACKGROUND_ELEMENTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: seededRandom() * 100,
  y: seededRandom() * 100,
  scale: seededRandom() * 0.5 + 0.5,
  rotation: seededRandom() * 360,
  animationDuration: 8 + seededRandom() * 4,
  animationDelay: i * 0.2,
}));

// Pre-define rotating objects
const ROTATING_OBJECTS = [
  {
    delay: 0,
    scale: 1,
    speed: 20,
    color: "#9333EA",
    left: "10%",
    top: "20%",
  },
  {
    delay: 5,
    scale: 1.5,
    speed: 25,
    color: "#3B82F6",
    left: "60%",
    top: "15%",
  },
  {
    delay: 2,
    scale: 0.7,
    speed: 15,
    color: "#EF4444",
    left: "80%",
    top: "60%",
  },
  {
    delay: 8,
    scale: 1.2,
    speed: 22,
    color: "#10B981",
    left: "20%",
    top: "70%",
  },
  {
    delay: 4,
    scale: 0.9,
    speed: 18,
    color: "#F59E0B",
    left: "50%",
    top: "50%",
  },
];

// Pre-define features
const FEATURES = [
  {
    icon: <Heart className="w-8 h-8 text-rose-500" />,
    title: "Self-Care Journey",
    description:
      "Personalized wellness plans tailored to your unique needs and goals",
    animationDelay: 0,
  },
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Mental Wellness",
    description:
      "Expert-backed techniques for maintaining mental health and reducing stress",
    animationDelay: 0.2,
  },
  {
    icon: <Users className="w-8 h-8 text-green-500" />,
    title: "Community Support",
    description:
      "Connect with others on similar journeys in a safe, supportive environment",
    animationDelay: 0.4,
  },
  {
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    title: "Daily Growth",
    description:
      "Track your progress and celebrate small wins on your wellness journey",
    animationDelay: 0.6,
  },
];

const RotatingObject = ({ delay, scale, speed, color, left, top }) => (
  <motion.div
    className="absolute w-40 h-40"
    style={{ left, top }}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.1, 0.3, 0.1],
      rotateX: [0, 360],
      rotateY: [0, 360],
      scale: [scale * 0.8, scale, scale * 0.8],
    }}
    transition={{
      duration: speed,
      repeat: Infinity,
      delay,
      ease: "linear",
    }}
  >
    <div
      className="w-full h-full rounded-lg"
      style={{
        background: `linear-gradient(45deg, ${color}20, ${color}40)`,
        border: `2px solid ${color}30`,
        transform: "preserve-3d",
        transformStyle: "preserve-3d",
      }}
    />
  </motion.div>
);

const BackgroundObjects = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {ROTATING_OBJECTS.map((obj, index) => (
      <RotatingObject key={index} {...obj} />
    ))}
  </div>
);

const FeatureCard = ({ feature, index, springConfig }) => (
  <motion.div
    className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl"
    variants={{
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: { opacity: 1, y: 0, scale: 1 },
    }}
    whileHover={{
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      y: -5,
    }}
    transition={{
      type: "spring",
      ...springConfig,
    }}
  >
    <motion.div
      animate={{
        rotate: [0, 10, 0],
        scale: [1, 1.1, 1],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: feature.animationDelay,
      }}
    >
      <div className="mb-4">{feature.icon}</div>
    </motion.div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">
      {feature.title}
    </h3>
    <p className="text-gray-600">{feature.description}</p>
  </motion.div>
);

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gradientRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-purple-50"
    >
      <BackgroundObjects />

      {/* Background Elements */}
      {BACKGROUND_ELEMENTS.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-8 h-8 rounded-full bg-purple-200 opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            scale: element.scale,
            rotate: element.rotation,
          }}
          animate={{
            x: [element.x - 2, element.x + 2, element.x - 2],
            y: [element.y, element.y - 20, element.y],
            rotate: [
              element.rotation,
              element.rotation + 180,
              element.rotation,
            ],
          }}
          transition={{
            duration: element.animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.animationDelay,
          }}
        />
      ))}

      {/* Gradient Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(120,0,255,0.1), rgba(120,0,255,0))",
          rotate: gradientRotation,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Section */}
      <motion.div
        className="relative h-screen flex items-center justify-center"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <motion.div
          className="text-center px-4 max-w-4xl mx-auto z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", ...springConfig }}
        >
          <motion.h1
            className="text-6xl font-bold text-gray-900 mb-6"
            style={{
              x: useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
              y: useTransform(mouseY, [-0.5, 0.5], [-10, 10]),
            }}
          >
            Your Journey to
            <motion.span
              className="text-purple-600"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {" "}
              Wellness{" "}
            </motion.span>
            Begins Here
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover a personalized approach to mental health and well-being,
            supported by AI-driven insights and a caring community.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/signup">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(120,0,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all"
              >
                Get Started
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(120,0,255,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all"
              >
                Login
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 px-4 relative">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              springConfig={springConfig}
            />
          ))}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="py-20 px-4 text-center relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          style={{
            x: useTransform(mouseX, [-0.5, 0.5], [-20, 20]),
            y: useTransform(mouseY, [-0.5, 0.5], [-20, 20]),
          }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of others who have taken the first step towards
            better mental health.
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(120,0,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all"
            >
              Begin Your Journey
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
