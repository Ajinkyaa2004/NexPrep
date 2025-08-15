// app/dashboard/interview/[interviewwid]/feedback/page.jsx
import React from "react";
import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import { db } from "../../../../../utils/db.js";
import { UserAnswer } from "../../../../../utils/schema.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { FileText } from "lucide-react";


export default async function Feedback({ params }) {
  const interviewId =
    params?.interviewId || params?.interviewwid || params?.interviewid;

  const feedbackList = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, interviewId))
    .orderBy(asc(UserAnswer.id));

  const overallRating =
    feedbackList.length > 0
      ? (
        feedbackList.reduce(
          (sum, item) => sum + Number(item.rating || 0),
          0
        ) / feedbackList.length
      ).toFixed(1)
      : "0";

  const getPerformanceTag = (rating) => {
    if (rating >= 8) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (rating >= 5) return { label: "Good", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Average", color: "bg-red-100 text-red-800" };
  };

  // Add this below getPerformanceTag
  const getResultMessage = (rating) => {
    if (rating >= 8) return "🎉 Congratulations! You nailed it!";
    if (rating >= 6) return "👍 Good job! A little polish and you’ll ace it.";
    if (rating >= 5) return "🤝 Not bad! You’re on the right track.";
    if (rating >= 3) return "💪 Keep practicing — you’ll get there.";
    return "💡 Better luck next time! Let’s work on the basics.";
  };

  // Convert overallRating to a number for checking
  const overallRatingNum = Number(overallRating);


  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-600 drop-shadow-sm mt-7 mb-5">
          {feedbackList.length > 0
            ? getResultMessage(overallRatingNum)
            : "No feedback available"}
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here’s your interview performance breakdown
        </p>
        <div className="mt-4 inline-block px-6 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
          <span className="text-blue-600 font-semibold text-lg">
            Overall Rating: {overallRating}/10
          </span>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-5">
      {feedbackList.length > 0 ? (
  feedbackList.map((item, idx) => {
    const ratingNum = Number(item.rating || 0);
    const perf = getPerformanceTag(ratingNum);

    // Split feedback only on ". " to preserve sentence integrity
    const feedbackPoints = item.feedback
      ? item.feedback.split(/\. /).filter(Boolean)
      : [];

    // Strength points (if any) handled similarly
    const strengthPoints = item.strength
      ? item.strength.split(/\. /).filter(Boolean)
      : [];

            return (
              <Collapsible
                key={item.id ?? idx}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                {/* Trigger with gradient + rotating chevron */}
                <CollapsibleTrigger className="group p-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-t-xl transition-colors">
                  <span className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {idx + 1}. {item.question}
                  </span>
                  <ChevronsUpDown className="h-5 w-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>

                {/* Smooth dropdown: keep mounted + animate height & opacity */}
                <CollapsibleContent
                  forceMount
                  className="overflow-hidden bg-white rounded-b-xl transition-[max-height,opacity] duration-500 ease-in-out
               data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px]
               data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
                >
                  <div className="p-4 space-y-4">
                    {/* Answers */}
                    <div className="p-3 border rounded-md bg-red-50 text-red-900">
                      <strong>Your Answer:</strong>{" "}
                      {item.userAns || <span className="italic text-gray-500">No answer given</span>}
                    </div>
                    <div className="p-3 border rounded-md bg-green-50 text-green-900">
                      <strong>Correct Answer:</strong>{" "}
                      {item.correctAns || <span className="italic text-gray-500">No correct answer provided</span>}
                    </div>

                    {/* Rating */}
                    <div>
                      <div className="flex justify-between mb-1 items-center">
                        <span className="font-medium text-gray-700">Rating: {ratingNum}/10</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${perf.color} transform transition-transform duration-300 ease-in-out hover:scale-105`}>
                          {perf.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(ratingNum / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Strengths */}
                    {strengthPoints.length > 0 ? (
                      <div className="p-3 border rounded-md bg-green-50 text-green-900">
                        <strong>Strengths:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {strengthPoints.map((point, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {point.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-gray-50 text-gray-500 italic">
                        No strengths identified for this question
                      </div>
                    )}

                    {/* Areas for Improvement */}
                    {feedbackPoints.length > 0 ? (
                      <div className="p-3 border rounded-md bg-yellow-50 text-yellow-900">
                        <strong>Areas for Improvement:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {feedbackPoints.map((point, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              {point.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-gray-50 text-gray-500 italic">
                        No improvement points for this question
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>



            );
          })
        ) : (
          <p className="text-gray-500 text-center italic bg-white p-6 rounded-lg shadow-inner">
            📄 No feedback yet — complete your interview to see results !
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link href="/dashboard">
          <Button className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
