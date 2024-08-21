"use client";
import React, { useState } from "react";
import { CohereClient } from "cohere-ai";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What cuisines do you prefer?",
    options: ["Italian", "Japanese", "Mexican", "Indian"],
  },
  {
    id: 2,
    text: "What would you like to add?",
    options: ["Cheese", "Cream", "Gravy", "Soupy", "Rice", "Noodles"],
  },
  {
    id: 3,
    text: "What kind of spice do you prefer?",
    options: ["Hot", "Mild", "Extra Spicy", "None"],
  },
];

const MyCard: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<{ [key: number]: string[] }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [customCuisine, setCustomCuisine] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const cohere = new CohereClient({
    token: process.env.NEXT_PUBLIC_COHERE_API_KEY || "",
  });

  const sendToHuggingFaceAPI = async () => {
    const data = Object.values(selections).flat().join(", ");
    try {
      const response = await cohere.chat({
        message: `You are a suggestion bot. You are going to suggest dishes based on these preferences: ${data}. Please suggest 5 dishes.Only send the name in bold, brief description of the dish. Do not include any additional information.`,
      });
      setApiResult(response.text);
    } catch (error) {
      console.error("Error sending data to API:", error);
      setApiResult("An error occurred while processing your request.");
    }
  };

  const handleNextQuestion = () => {
    // Check if a selection was made or a custom cuisine was entered
    if (
      !selections[currentQuestion] ||
      selections[currentQuestion].length === 0
    ) {
      if (currentQuestion === 0 && customCuisine) {
        const newSelections = { ...selections };
        newSelections[currentQuestion] = [customCuisine];
        setSelections(newSelections);
        setCustomCuisine(""); // Clear the custom cuisine input
      } else {
        toast(
          "Please select an option or enter a custom cuisine before proceeding.",
          {
            style: { background: "red", color: "white" },
          }
        );
        return;
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
      sendToHuggingFaceAPI();
    }
  };

  const handleOptionClick = (option: string) => {
    const isMultiSelectable = currentQuestion === 1; // Second question is multi-selectable
    const newSelections = { ...selections };

    if (isMultiSelectable) {
      if (newSelections[currentQuestion]?.includes(option)) {
        newSelections[currentQuestion] = newSelections[currentQuestion].filter(
          (item) => item !== option
        );
      } else {
        newSelections[currentQuestion] = newSelections[currentQuestion]
          ? [...newSelections[currentQuestion], option]
          : [option];
      }
    } else {
      newSelections[currentQuestion] = [option];
      setSelectedOption(option);
    }

    setSelections(newSelections);
  };

  const handleAddCustomCuisine = () => {
    if (customCuisine) {
      const newSelections = { ...selections };
      newSelections[currentQuestion] = newSelections[currentQuestion]
        ? [...newSelections[currentQuestion], customCuisine]
        : [customCuisine];
      setSelections(newSelections);
      setCustomCuisine(""); // Clear the input after adding
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelections({});
    setIsFinished(false);
    setApiResult(null);
    setCustomCuisine("");
    setSelectedOption(null);
  };

  return (
    <div className="py-32 md:py-48 overflow-hidden">
      <div className="container sm:max-w-2xl md:max-w-5xl lg:max-w-7xl h-full flex sm:flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-4">
          {!isFinished ? (
            <Card className="bg-zinc-900 text-white overflow-hidden w-[300px] md:w-[500px] p-4">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                  MealSnap
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-0 w-full border border-slate-100" />
                <div className="py-4">
                  <h1 className="text-lg font-semibold">
                    {questions[currentQuestion].text}
                  </h1>
                </div>
                <div className="flex flex-col gap-2 z-20">
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option} className="py-2">
                      <div
                        className={cn(
                          "border border-zinc-500 rounded-md w-full h-8 flex items-center justify-between px-2 cursor-pointer",
                          {
                            "bg-zinc-500 text-white":
                              selections[currentQuestion]?.includes(option),
                          }
                        )}
                        onClick={() => handleOptionClick(option)}
                      >
                        <div className="">{option}</div>
                      </div>
                    </div>
                  ))}
                  {currentQuestion === 0 && (
                    <>
                      <div className="py-1">
                        <input
                          type="text"
                          className="border border-violet-500 rounded-md w-full h-8 bg-black px-2 py-4"
                          value={customCuisine}
                          onChange={(e) => setCustomCuisine(e.target.value)}
                          placeholder="Enter your cuisine"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          className="px-4 py-2 text-black"
                          onClick={handleAddCustomCuisine}
                        >
                          Add
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="relative z-10 bg-zinc-900 text-white overflow-hidden w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-0 w-full border border-slate-100" />
                <div className="py-4">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {apiResult || ""}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {!isFinished && (
            <div className="flex justify-end w-full gap-2">
              <Button variant="destructive" onClick={handleReset}>
                Reset
              </Button>
              <Button
                onClick={handleNextQuestion}
                variant={"outline"}
                className="text-black"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCard;
