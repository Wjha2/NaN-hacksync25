"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Star,
  Heart,
  Check,
  X,
  ArrowLeft,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const DailyAssessment = () => {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [currentValue, setCurrentValue] = useState(5);
  const [categoryScores, setCategoryScores] = useState({});
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);
  const [mlPrediction, setMlPrediction] = useState(null);

  // Calculate score for a single section
  const calculateSectionScore = (sectionAnswers, questions) => {
    if (!sectionAnswers) return 0;

    let sectionTotal = 0;

    questions.forEach((question, index) => {
      const answer = sectionAnswers[index];
      if (answer !== undefined) {
        if (question.type === "boolean") {
          sectionTotal += answer ? 10 : 0;
        } else if (question.type === "slider") {
          sectionTotal += answer;
        }
      }
    });

    return sectionTotal;
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Calculate overall category score based on the DataFrame method
  const calculateCategoryScore = (categoryKey) => {
    if (!answers[categoryKey]) return 0;

    const category = categories[categoryKey];
    const sections = Object.entries(category.sections);

    switch (categoryKey) {
      case "social":
        // SOCIAL_ACTIVITY_SCORE = PLACES_VISITED + SOCIAL_NETWORK + SUPPORTING_OTHERS
        return sections.reduce((total, [sectionKey, questions]) => {
          return (
            total +
            calculateSectionScore(answers[categoryKey][sectionKey], questions)
          );
        }, 0);

      case "work":
        // WORK_PRODUCTIVITY_SCORE = ACHIEVEMENT + TODO_COMPLETED + PERSONAL_AWARDS
        return sections.reduce((total, [sectionKey, questions]) => {
          return (
            total +
            calculateSectionScore(answers[categoryKey][sectionKey], questions)
          );
        }, 0);

      case "selfCare":
        // SELF_CARE_SCORE = SLEEP_HOURS + TIME_FOR_PASSION + WEEKLY_MEDITATION
        return sections.reduce((total, [sectionKey, questions]) => {
          return (
            total +
            calculateSectionScore(answers[categoryKey][sectionKey], questions)
          );
        }, 0);

      case "stress":
        // STRESS_IMPACT = DAILY_STRESS + DAILY_SHOUTING - LIVE_VISION
        const dailyScore = calculateSectionScore(
          answers[categoryKey]["daily"],
          sections[0][1]
        );
        const emotionalScore = calculateSectionScore(
          answers[categoryKey]["emotional"],
          sections[1][1]
        );
        const visionScore = calculateSectionScore(
          answers[categoryKey]["vision"],
          sections[2][1]
        );
        return dailyScore + emotionalScore + visionScore;

      default:
        return 0;
    }
  };

  // Get maximum possible score for a category
  const getMaxCategoryScore = (categoryKey) => {
    const category = categories[categoryKey];
    const sections = Object.entries(category.sections);

    if (categoryKey === "stress") {
      // For stress, we subtract the vision score, so max is different
      const dailyMaxScore = sections[0][1].length * 10;
      const emotionalMaxScore = sections[1][1].length * 10;
      const visionMaxScore = sections[2][1].length * 10;
      return dailyMaxScore + emotionalMaxScore - visionMaxScore;
    } else {
      // For other categories, it's sum of all sections
      return sections.reduce((total, [_, questions]) => {
        return total + questions.length * 10;
      }, 0);
    }
  };

  // Convert raw score to percentage
  const getScorePercentage = (categoryKey, rawScore) => {
    const maxScore = getMaxCategoryScore(categoryKey);
    if (categoryKey === "stress") {
      // For stress, lower is better, so we invert the percentage
      return Math.round(100 - (rawScore / maxScore) * 100);
    }
    return Math.round((rawScore / maxScore) * 100);
  };

  // Update scores when showing summary
  const checkAllTestsCompleted = () => {
    const completedTests = Object.keys(answers).length;
    setAllTestsCompleted(completedTests === 4);
  };

  // Modify the updateCategoryScores function to include the completion check:
  const updateCategoryScores = () => {
    const scores = {};
    Object.keys(categories).forEach((categoryKey) => {
      if (answers[categoryKey]) {
        const rawScore = calculateCategoryScore(categoryKey);
        scores[categoryKey] = {
          raw: rawScore,
          percentage: getScorePercentage(categoryKey, rawScore),
        };
      }
    });
    setCategoryScores(scores);
    checkAllTestsCompleted(); // Add this line
  };

  const submitToModel = async () => {
    const finalData = {
      SOCIAL_ACTIVITY_SCORE: categoryScores.social?.percentage / 100 || 0, // numeric
      WORK_PRODUCTIVITY_SCORE: categoryScores.work?.percentage / 100 || 0, // numeric
      SELF_CARE_SCORE: categoryScores.selfCare?.percentage / 100 || 0, // numeric
      STRESS_IMPACT: categoryScores.stress?.percentage / 100 || 0, // numeric
    };
    console.log("Submitting to model:", finalData);
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Model Predictions:", result);
      setMlPrediction(result);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const MLPredictionCard = () => {
    if (!mlPrediction) return null;

    const getRecommendations = () => {
      const recommendations = [];

      if (mlPrediction.cognitive_overload === 1) {
        recommendations.push({
          title: "Cognitive Load Management",
          icon: "🧠",
          suggestions: [
            "Consider breaking down tasks into smaller, manageable chunks",
            "Take regular breaks using the Pomodoro technique",
            "Practice mindfulness or meditation to clear your mind",
          ],
        });
      }

      if (mlPrediction.social_engagement_needs === 0) {
        recommendations.push({
          title: "Social Connection Enhancement",
          icon: "👥",
          suggestions: [
            "Schedule regular catch-ups with friends or colleagues",
            "Join community groups or social activities",
            "Engage more in team activities at work",
          ],
        });
      }

      if (mlPrediction.work_life_balance_adjust === 1) {
        recommendations.push({
          title: "Work-Life Balance Adjustment",
          icon: "⚖️",
          suggestions: [
            "Set clear boundaries between work and personal time",
            "Schedule dedicated time for hobbies and relaxation",
            "Review and adjust your daily routine",
          ],
        });
      }

      return recommendations.length > 0
        ? recommendations
        : [
            {
              title: "Maintaining Well-being",
              icon: "✨",
              suggestions: [
                "Continue your current balanced approach",
                "Monitor your well-being regularly",
                "Stay proactive about self-care",
              ],
            },
          ];
    };

    return (
      <Card className="mt-6">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>AI Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getRecommendations().map((rec, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>{rec.icon}</span>
                  {rec.title}
                </h3>
                <ul className="space-y-2">
                  {rec.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Modified handleNext to update scores
  const handleNext = () => {
    if (currentQuestion < 8) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestion =
        categories[currentCategory].sections[
          Object.keys(categories[currentCategory].sections)[
            Math.floor((currentQuestion + 1) / 3)
          ]
        ][(currentQuestion + 1) % 3];
      setCurrentValue(
        nextQuestion.type === "slider" ? getCurrentAnswer() ?? 5 : 5
      );
    } else {
      setCurrentQuestion(0);
      updateCategoryScores();
      setShowSummary(true);
    }
  };

  const BackgroundBubbles = () => {
    const bubbles = Array(20).fill(null);
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {bubbles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{
              width: Math.random() * 200 + 50 + "px",
              height: Math.random() * 200 + 50 + "px",
            }}
          />
        ))}
      </div>
    );
  };

  // Categories object remains the same
  const categories = {
    social: {
      title: "Daily Social Activity",
      icon: <Sun className="w-6 h-6" />,
      color: "from-blue-500 to-sky-400",
      sections: {
        places: [
          {
            type: "boolean",
            text: "Did you visit any place outside your home today?",
          },
          {
            type: "slider",
            text: "How enjoyable was your visit?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you visit a social or public place today?",
          },
        ],
        network: [
          {
            type: "boolean",
            text: "Did you engage in at least one meaningful conversation today?",
          },
          {
            type: "slider",
            text: "How socially connected did you feel today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you interact with more than two different people today?",
          },
        ],
        support: [
          {
            type: "boolean",
            text: "Did you help someone emotionally or practically today?",
          },
          {
            type: "slider",
            text: "How fulfilling was your support for others today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did anyone express gratitude towards you today?",
          },
        ],
      },
    },
    work: {
      title: "Daily Work Productivity",
      icon: <Star className="w-6 h-6" />,
      color: "from-green-500 to-emerald-400",
      sections: {
        achievement: [
          {
            type: "boolean",
            text: "Did you accomplish a key work or personal goal today?",
          },
          {
            type: "slider",
            text: "How productive did you feel today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you receive any recognition or appreciation today?",
          },
        ],
        todo: [
          {
            type: "boolean",
            text: "Did you complete at least 80% of your planned tasks today?",
          },
          {
            type: "slider",
            text: "How efficient was your time management today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you not procrastinate on any tasks today?",
          },
        ],
        awards: [
          {
            type: "boolean",
            text: "Did you reward yourself for completing a task today?",
          },
          {
            type: "slider",
            text: "How motivated do you feel for tomorrow?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you set any personal goals for the next day?",
          },
        ],
      },
    },
    selfCare: {
      title: "Daily Self-Care",
      icon: <Heart className="w-6 h-6" />,
      color: "from-purple-500 to-pink-400",
      sections: {
        sleep: [
          {
            type: "boolean",
            text: "Did you sleep for at least 6 hours last night?",
          },
          {
            type: "slider",
            text: "How well-rested did you feel this morning?",
            min: 1,
            max: 10,
          },
          { type: "boolean", text: "Did you wake up feeling refreshed?" },
        ],
        passion: [
          {
            type: "boolean",
            text: "Did you spend at least 30 minutes on a hobby today?",
          },
          {
            type: "slider",
            text: "How much joy did your personal time bring you today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you learn or try something new today?",
          },
        ],
        meditation: [
          {
            type: "boolean",
            text: "Did you practice meditation or relaxation today?",
          },
          {
            type: "slider",
            text: "How calm and balanced did you feel today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you take intentional breaks from work today?",
          },
        ],
      },
    },
    stress: {
      title: "Daily Stress Impact",
      icon: <Moon className="w-6 h-6" />,
      color: "from-orange-500 to-red-400",
      sections: {
        daily: [
          {
            type: "boolean",
            text: "Did you not experience significant stress today?",
          },
          {
            type: "slider",
            text: "How relaxing was your day overall?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you successfully manage your stress levels today?",
          },
        ],
        emotional: [
          {
            type: "boolean",
            text: "You did not experience any emotional outbursts today.",
          },
          {
            type: "slider",
            text: "How emotionally balanced did you feel today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "You have not experienced any conflicts or arguments today.",
          },
        ],
        vision: [
          { type: "boolean", text: "Did today feel meaningful to you?" },
          {
            type: "slider",
            text: "How clear do you feel about your goals today?",
            min: 1,
            max: 10,
          },
          {
            type: "boolean",
            text: "Did you take a moment to reflect on something positive?",
          },
        ],
      },
    },
  };

  const getCurrentQuestion = () => {
    if (!currentCategory) return null;
    const category = categories[currentCategory];
    const sectionKeys = Object.keys(category.sections);
    const sectionIndex = Math.floor(currentQuestion / 3);
    const questionIndex = currentQuestion % 3;
    return {
      ...category.sections[sectionKeys[sectionIndex]][questionIndex],
      section: sectionKeys[sectionIndex],
    };
  };

  // Function to get the current answer for the question
  const getCurrentAnswer = () => {
    const question = getCurrentQuestion();
    if (!question) return null;
    return answers[currentCategory]?.[question.section]?.[currentQuestion % 3];
  };

  const handleAnswer = (value) => {
    const question = getCurrentQuestion();
    setAnswers({
      ...answers,
      [currentCategory]: {
        ...answers[currentCategory],
        [question.section]: {
          ...(answers[currentCategory]?.[question.section] || {}),
          [currentQuestion % 3]: value,
        },
      },
    });
  };

  const resetCategory = () => {
    setCurrentCategory(null);
    setShowSummary(false);
    setCurrentValue(5);
  };

  const handleCategorySelect = (key) => {
    setCurrentCategory(key);
    setCurrentQuestion(0);
    setCurrentValue(5);
  };

  const renderAnswerSummary = () => {
    if (!currentCategory || !answers[currentCategory]) return null;

    const categoryScore = categoryScores[currentCategory];

    return (
      <>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Overall Score</h2>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{categoryScore.raw} points</div>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${categories[currentCategory].color}`}
                style={{ width: `${categoryScore.percentage}%` }}
              />
            </div>
          </div>
          {currentCategory === "stress" && (
            <p className="text-sm text-gray-600 mt-2">
              Note: For stress impact, lower scores are better. Score is
              inverted for percentage display.
            </p>
          )}
        </div>
        {Object.entries(categories[currentCategory].sections).map(
          ([sectionKey, questions]) => {
            const sectionScore = calculateSectionScore(
              answers[currentCategory][sectionKey],
              questions
            );

            return (
              <div key={sectionKey} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold capitalize">
                    {sectionKey}
                  </h3>
                  <span className="font-medium">{sectionScore} points</span>
                </div>
                <div className="space-y-2">
                  {questions.map((question, index) => {
                    const answer =
                      answers[currentCategory][sectionKey]?.[index];
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <p className="text-sm flex-1">{question.text}</p>
                        <span className="ml-4 font-medium">
                          {question.type === "boolean"
                            ? answer
                              ? "Yes (10 points)"
                              : "No (0 points)"
                            : `${answer} points`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full p-6 relative">
      <BackgroundBubbles />
      <motion.header
        className="bg-purple-600 p-4 md:p-6 shadow-lg relative"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto relative">
          {/* Back Button */}
          <motion.button
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white flex items-center gap-2 hover:text-purple-200 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="hidden md:inline">Back</span>
          </motion.button>

          <motion.div
            className="text-3xl font-bold text-white flex items-center gap-2 justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-8 h-8" />
            MindEase
          </motion.div>
        </div>
      </motion.header>
      <AnimatePresence mode="wait">
        {!currentCategory ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {Object.entries(categories).map(([key, category]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer overflow-hidden"
                  onClick={() => handleCategorySelect(key)}
                >
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {category.title}
                        </h2>
                        {answers[key] && (
                          <div>
                            <p className="text-sm text-green-600">Completed</p>
                            {categoryScores[key] && (
                              <p className="text-sm font-medium">
                                Score: {categoryScores[key].raw}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <motion.div
              className="col-span-full flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                onClick={submitToModel}
                disabled={!allTestsCompleted}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Get AI Insights{" "}
                {!allTestsCompleted && "(Complete all 4 assessments)"}
              </Button>
            </motion.div>
            <MLPredictionCard />
          </motion.div>
        ) : showSummary ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto"
          >
            <Card>
              <div
                className={`h-2 bg-gradient-to-r ${categories[currentCategory].color}`}
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetCategory}
                    className="mr-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  {categories[currentCategory].icon}
                  {categories[currentCategory].title} Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderAnswerSummary()}
                <Button className="w-full mt-4" onClick={resetCategory}>
                  Return to Categories
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto"
          >
            <Card>
              <div
                className={`h-2 bg-gradient-to-r ${categories[currentCategory].color}`}
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetCategory}
                    className="mr-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  {categories[currentCategory].icon}
                  {categories[currentCategory].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {getCurrentQuestion() && (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg">{getCurrentQuestion().text}</h3>

                    {getCurrentQuestion().type === "boolean" ? (
                      <div className="flex gap-4">
                        <Button
                          variant={
                            getCurrentAnswer() === true ? "default" : "outline"
                          }
                          className={`flex-1 ${
                            getCurrentAnswer() === true
                              ? "border-2 text-green-400 border-green-400 hover:text-green-500 hover:border-green-500"
                              : ""
                          }`}
                          onClick={() => handleAnswer(true)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Yes
                        </Button>
                        <Button
                          variant={
                            getCurrentAnswer() === false ? "default" : "outline"
                          }
                          className={`flex-1 ${
                            getCurrentAnswer() === false
                              ? "border-2 text-green-400 border-green-400 hover:text-green-500 hover:border-green-500"
                              : ""
                          }`}
                          onClick={() => handleAnswer(false)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          No
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          value={[getCurrentAnswer() ?? currentValue]}
                          min={1}
                          max={10}
                          step={1}
                          className="[&_.relative_.bg-primary]:bg-black [&_[role='slider']]:bg-black [&_[role='slider']]:border-black"
                          onValueChange={(value) => {
                            setCurrentValue(value[0]);
                            handleAnswer(value[0]);
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>1</span>
                          <span>
                            Selected: {getCurrentAnswer() ?? currentValue}
                          </span>
                          <span>10</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentQuestion > 0) {
                            setCurrentQuestion(currentQuestion - 1);
                            const prevQuestion = getCurrentQuestion();
                            if (prevQuestion.type === "slider") {
                              setCurrentValue(getCurrentAnswer() ?? 5);
                            }
                          }
                        }}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={getCurrentAnswer() === undefined}
                      >
                        {currentQuestion < 8 ? "Next" : "Finish"}
                      </Button>
                    </div>

                    <div className="w-full bg-gray-200 h-1 rounded-full mt-6">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${categories[currentCategory].color}`}
                        style={{
                          width: `${((currentQuestion + 1) / 9) * 100}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyAssessment;
