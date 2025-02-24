"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Clock,
  Activity,
  SmilePlus,
  Users,
  Bell,
  Brain,
  Coffee,
  Sun,
  Moon,
  Zap,
  MessageSquare,
  BarChart2,
  Sparkles,
  Shield,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MindEaseDashboard = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState("daily");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [theme, setTheme] = useState("light");

  // Enhanced animation variants
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

  // Sample data
  const wellnessData = [
    { date: "Mon", mood: 80, energy: 70, focus: 75, stress: 30 },
    { date: "Tue", mood: 85, energy: 75, focus: 80, stress: 25 },
    { date: "Wed", mood: 75, energy: 65, focus: 70, stress: 40 },
    { date: "Thu", mood: 90, energy: 85, focus: 85, stress: 20 },
    { date: "Fri", mood: 85, energy: 80, focus: 80, stress: 25 },
  ];

  const upcomingActivities = [
    {
      id: 1,
      title: "Meditation Session",
      time: "9:00 AM",
      type: "wellness",
      priority: "high",
    },
    {
      id: 2,
      title: "Mood Check-in",
      time: "12:00 PM",
      type: "tracking",
      priority: "medium",
    },
    {
      id: 3,
      title: "Breathing Exercise",
      time: "3:00 PM",
      type: "wellness",
      priority: "medium",
    },
    {
      id: 4,
      title: "Evening Reflection",
      time: "8:00 PM",
      type: "mindfulness",
      priority: "high",
    },
  ];

  const navigationCards = [
    {
      title: "Talk to MindEase",
      description: "Get AI-powered mental health support",
      icon: MessageSquare,
      link: "/chat",
      color: "bg-purple-500",
    },
    {
      title: "Wellness Insights",
      description: "View your personalized wellness analytics",
      icon: BarChart2,
      link: "/modelthingy",
      color: "bg-indigo-500",
    },
  ];

  const CHART_COLORS = {
    primary: "#7C3AED",
    secondary: "#A78BFA",
    tertiary: "#DDD6FE",
    stress: "#EF4444",
  };

  // Custom Components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-200">
          <p className="font-bold text-purple-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const WellnessIndicator = () => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-50"
          />
          <div className="relative z-10">
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className="text-purple-600 mb-4"
            >
              <Heart className="h-8 w-8" />
            </motion.div>
            <h3 className="text-lg font-semibold text-purple-900">
              Overall Wellness
            </h3>
            <p className="text-3xl font-bold mt-2 text-purple-700">85%</p>
            <div className="mt-4">
              <div className="h-2 bg-purple-100 rounded-full">
                <motion.div
                  className="h-2 bg-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const WellnessChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Wellness Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wellnessData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.stress}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.stress}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
              <XAxis dataKey="date" stroke="#7C3AED" />
              <YAxis stroke="#7C3AED" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke={CHART_COLORS.primary}
                fillOpacity={1}
                fill="url(#colorMood)"
              />
              <Area
                type="monotone"
                dataKey="stress"
                stroke={CHART_COLORS.stress}
                fillOpacity={1}
                fill="url(#colorStress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

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
        className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        variants={itemVariants}
      >
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div variants={floatingIconVariants} animate="animate">
            <Sparkles className="h-8 w-8 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-purple-900">MindEase</h1>
        </motion.div>

        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        ></motion.div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {navigationCards.map((card, index) => (
          <motion.a
            key={index}
            href={card.link}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block"
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 flex items-center space-x-4">
                <motion.div
                  className={`${card.color} p-3 rounded-lg`}
                  variants={floatingIconVariants}
                  animate="animate"
                >
                  <card.icon className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-purple-600">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <Button
          className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-purple-100 text-purple-700"
          variant="outline"
          onClick={() => router.push("/meditate")}
        >
          <motion.div variants={floatingIconVariants} animate="animate">
            <Brain className="h-6 w-6" />
          </motion.div>
          Meditate
        </Button>
        <Button
          className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-purple-100 text-purple-700"
          variant="outline"
          onClick={() => router.push("/mood-log")}
        >
          <motion.div variants={floatingIconVariants} animate="animate">
            <SmilePlus className="h-6 w-6" />
          </motion.div>
          Mood Log
        </Button>
        {[
          { icon: Coffee, label: "Take a Break" },
          { icon: Shield, label: "Self Care" },
        ].map((action, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-purple-100 text-purple-700"
              variant="outline"
            >
              <motion.div variants={floatingIconVariants} animate="animate">
                <action.icon className="h-6 w-6" />
              </motion.div>
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <WellnessChart />
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <WellnessIndicator />

          <AnimatePresence>
            {upcomingActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="bg-white hover:bg-purple-50 transition-colors duration-200"
                  onMouseEnter={() => setHoveredCard(activity.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-4">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: hoveredCard === activity.id ? 1.02 : 1,
                      }}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-purple-900">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-purple-600">
                          {activity.time}
                        </p>
                      </div>
                      {activity.priority === "high" && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                          Priority
                        </span>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Wellness Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {[
          {
            title: "Meditation Minutes",
            value: "45",
            icon: Brain,
            color: "text-blue-600",
          },
          {
            title: "Mood Score",
            value: "8.5",
            icon: SmilePlus,
            color: "text-green-600",
          },
          {
            title: "Focus Sessions",
            value: "3",
            icon: Zap,
            color: "text-purple-600",
          },
          {
            title: "Stress Level",
            value: "Low",
            icon: Activity,
            color: "text-pink-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 opacity-50"
                />
                <div className="relative z-10">
                  <motion.div
                    variants={floatingIconVariants}
                    animate="animate"
                    className={`${stat.color} mb-4`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="text-sm font-medium text-purple-600">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-purple-900 mt-2">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Mindfulness Reminder */}
      <motion.div variants={containerVariants} className="mt-6">
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardContent className="p-6">
            <motion.div
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <motion.div variants={floatingIconVariants} animate="animate">
                  <Bell className="h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Time for a Mindful Moment
                  </h3>
                  <p className="text-purple-100">
                    Take a deep breath and center yourself
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium"
              >
                Start Now
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 text-purple-600"
        variants={itemVariants}
      >
        <p className="opacity-70">© 2024 MindEase. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
};

export default MindEaseDashboard;
