"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Play, Pause, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const MeditationPage = () => {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  // Animation variants matching dashboard
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
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

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    setTime(300);
    setIsActive(false);
  };

  return (
    <motion.div
      className={`min-h-screen p-6 space-y-6 ${
        theme === "light"
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
          : "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div variants={floatingIconVariants} animate="animate">
            <Brain className="h-8 w-8 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-purple-900">Meditation</h1>
        </motion.div>
        <Button
          onClick={() => router.push("/home")}
          variant="outline"
          className="text-purple-600 hover:bg-purple-100"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>

      {/* Main Content */}
      <motion.div className="max-w-2xl mx-auto" variants={containerVariants}>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-purple-900 text-center text-2xl">
              Guided Meditation Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div
                className="text-6xl font-bold text-purple-600 mb-8"
                animate={{
                  scale: isActive ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {formatTime(time)}
              </motion.div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-12 w-12 rounded-full"
                  >
                    {isActive ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12 w-12 rounded-full text-purple-600 hover:bg-purple-100"
                  >
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Meditation Guide */}
            <motion.div
              variants={itemVariants}
              className="text-center text-purple-700 mt-8"
            >
              <p className="text-lg">
                {isActive
                  ? "Take deep breaths and focus on the present moment..."
                  : "Press play to begin your meditation journey"}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MeditationPage;
