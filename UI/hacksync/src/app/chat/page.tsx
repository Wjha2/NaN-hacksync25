"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Sparkles,
  ArrowLeft,
  Moon,
  Sun,
  Brain,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [theme, setTheme] = React.useState("light");

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
  };

  const staggeredItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: MessageSquare,
      title: "24/7 Support",
      description:
        "Always here to listen and provide caring support whenever you need it",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Tailored guidance and support based on your unique journey",
      color: "text-pink-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Advanced technology to provide meaningful, personalized assistance",
      color: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Safe Space",
      description:
        "Secure and confidential environment for your mental wellness",
      color: "text-green-600",
    },
  ];

  React.useEffect(() => {
    // Initialize chatbot
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.AgentInitializer?.init({
        rootId: "JotformAgent-0195323f8de4726ea74b5a7f1fb65f8c09cf",
        formID: "0195323f8de4726ea74b5a7f1fb65f8c09cf",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isInitialOpen: false,
        isDraggable: false,
        background:
          theme === "light"
            ? "linear-gradient(180deg, #C8CEED 0%, #C8CEED 100%)"
            : "linear-gradient(180deg, #1F2937 0%, #1F2937 100%)",
        buttonBackgroundColor: theme === "light" ? "#943ed6" : "#6B46C1",
        buttonIconColor: "#fff",
        variant: false,
        customizations: {
          greeting: "Yes",
          greetingMessage: "Hi! How are you feeling today?",
          pulse: "Yes",
          position: "right",
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [theme]);

  return (
    <AnimatePresence>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "light"
            ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
            : "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
        }`}
      >
        {/* Theme Toggle */}
        <motion.button
          className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </motion.button>

        {/* Enhanced Header */}
        <motion.header
          className={`p-6 shadow-lg backdrop-blur-sm ${
            theme === "light"
              ? "bg-white bg-opacity-40"
              : "bg-gray-800 bg-opacity-40"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto relative flex items-center justify-center">
            <motion.button
              onClick={() => router.back()}
              className="absolute left-0 flex items-center gap-2 hover:opacity-70"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="hidden md:inline">Back</span>
            </motion.button>

            <motion.div
              className="text-4xl font-bold flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div variants={floatingIconVariants} animate="animate">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </motion.div>
              MindEase
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            className={`rounded-3xl shadow-2xl p-8 md:p-12 ${
              theme === "light"
                ? "bg-white bg-opacity-60"
                : "bg-gray-800 bg-opacity-40"
            } backdrop-blur-sm`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              className="text-center mb-16"
              variants={staggeredItemVariants}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                variants={pulseVariants}
                animate="animate"
              >
                Welcome to MindEase
              </motion.h1>
              <motion.p
                className="text-2xl mb-4"
                variants={staggeredItemVariants}
              >
                Your AI-powered mental health companion
              </motion.p>
            </motion.div>

            {/* Enhanced Features Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`rounded-xl p-6 text-center ${
                    theme === "light"
                      ? "bg-white bg-opacity-60 hover:bg-opacity-80"
                      : "bg-gray-700 bg-opacity-40 hover:bg-opacity-60"
                  } backdrop-blur-sm transition-all duration-300`}
                  variants={staggeredItemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <motion.div
                    className={`inline-block ${feature.color} mb-4`}
                    variants={floatingIconVariants}
                    animate="animate"
                  >
                    <feature.icon size={40} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm opacity-80">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Chatbot Section */}
            <motion.div
              className={`rounded-2xl p-8 text-center ${
                theme === "light"
                  ? "bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100"
                  : "bg-gradient-to-r from-purple-900 via-pink-900 to-blue-900"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.h2
                className="text-3xl font-bold mb-4"
                variants={pulseVariants}
                animate="animate"
              >
                Start Your Journey
              </motion.h2>
              <p className="text-lg opacity-80">
                Click the chat icon below to begin your conversation with
                MindEase
              </p>
            </motion.div>
          </motion.div>
        </main>

        {/* Enhanced Footer */}
        <motion.footer
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="opacity-70">© 2024 MindEase. All rights reserved.</p>
        </motion.footer>
      </div>
    </AnimatePresence>
  );
};

export default HomePage;
