"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SmilePlus,
  Home,
  BadgePlus,
  Smile,
  Meh,
  Frown,
  Heart,
  Brain,
  Coffee,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MoodLogPage = () => {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notes, setNotes] = useState("");
  const [theme, setTheme] = useState("light");

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

  // Sample mood history data
  const moodHistory = [
    { date: "Mon", mood: 8 },
    { date: "Tue", mood: 7 },
    { date: "Wed", mood: 9 },
    { date: "Thu", mood: 6 },
    { date: "Fri", mood: 8 },
    { date: "Sat", mood: 9 },
    { date: "Sun", mood: 8 },
  ];

  const moods = [
    { icon: Smile, label: "Happy", value: 9, color: "text-green-500" },
    { icon: Meh, label: "Neutral", value: 6, color: "text-yellow-500" },
    { icon: Frown, label: "Sad", value: 3, color: "text-blue-500" },
  ];

  const activities = [
    { icon: Heart, label: "Exercise", color: "text-red-500" },
    { icon: Brain, label: "Meditation", color: "text-purple-500" },
    { icon: Coffee, label: "Social", color: "text-orange-500" },
    { icon: Sun, label: "Outdoors", color: "text-yellow-500" },
  ];

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleSubmit = () => {
    // Here you would typically save the mood log
    console.log({
      mood: selectedMood,
      activities: selectedActivities,
      notes,
      timestamp: new Date(),
    });

    // Show success feedback
    alert("Mood logged successfully!");

    // Reset form
    setSelectedMood(null);
    setSelectedActivities([]);
    setNotes("");
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
            <SmilePlus className="h-8 w-8 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-purple-900">Mood Log</h1>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Input Section */}
        <motion.div variants={containerVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-purple-900">
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div className="grid grid-cols-3 gap-4">
                {moods.map((mood) => (
                  <motion.div
                    key={mood.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full h-24 flex flex-col items-center justify-center gap-2 ${
                        selectedMood === mood.value
                          ? "bg-purple-100 border-purple-500"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <mood.icon className={`h-8 w-8 ${mood.color}`} />
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Activities */}
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  What have you been up to?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-16 flex items-center justify-center gap-2 ${
                          selectedActivities.includes(activity.label)
                            ? "bg-purple-100 border-purple-500"
                            : "hover:bg-purple-50"
                        }`}
                        onClick={() => toggleActivity(activity.label)}
                      >
                        <activity.icon
                          className={`h-5 w-5 ${activity.color}`}
                        />
                        <span>{activity.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Any notes about your day?
                </h3>
                <textarea
                  className="w-full h-24 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your thoughts here..."
                />
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleSubmit}
                  disabled={!selectedMood}
                >
                  <BadgePlus className="h-5 w-5 mr-2" />
                  Log Mood
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood History Section */}
        <motion.div variants={containerVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-purple-900">
                Your Mood History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                    <XAxis dataKey="date" stroke="#7C3AED" />
                    <YAxis stroke="#7C3AED" domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#7C3AED"
                      strokeWidth={2}
                      dot={{ fill: "#7C3AED" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Mood Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Average Mood", value: "7.8" },
                  { label: "Best Day", value: "Wed" },
                  { label: "Streak", value: "5 days" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-purple-50 rounded-lg"
                  >
                    <p className="text-sm text-purple-600">{stat.label}</p>
                    <p className="text-xl font-bold text-purple-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodLogPage;
