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
      : "N/A";

  const getPerformanceTag = (rating) => {
    if (rating >= 8) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (rating >= 5) return { label: "Good", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Average", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-600 drop-shadow-sm">
          Congratulations!
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

            const feedbackPoints = item.feedback
              ? item.feedback.split(/\. |\n|,/).filter(Boolean)
              : [];

            const strengthPoints = item.strength
              ? item.strength.split(/\. |\n|,/).filter(Boolean)
              : [];

            return (
              <Collapsible
                key={item.id ?? idx}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <CollapsibleTrigger className="p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-xl">
                  <span className="font-semibold text-gray-800 text-lg">
                    {idx + 1}. {item.question}
                  </span>
                  <ChevronsUpDown className="h-5 w-5 text-gray-500" />
                </CollapsibleTrigger>

                <CollapsibleContent className="p-4 space-y-4 bg-white rounded-b-xl">
                  {/* Answers */}
                  <div className="p-3 border rounded-md bg-red-50 text-red-900">
                    <strong>Your Answer:</strong> {item.userAns || "—"}
                  </div>
                  <div className="p-3 border rounded-md bg-green-50 text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns || "—"}
                  </div>

                  {/* Rating */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700">
                        Rating: {ratingNum}/10
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${perf.color}`}>
                        {perf.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${(ratingNum / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Strengths */}
                  {strengthPoints.length > 0 && (
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
                  )}

                  {/* Areas for Improvement */}
                 {/* Areas for Improvement */}
{feedbackPoints.length > 0 && (
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
)}

                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <p className="text-gray-500 text-center italic">
            No feedback available yet.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link href="/dashboard">
          <Button className="px-6 py-2 text-lg rounded-full shadow-md hover:shadow-lg transition-all">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}