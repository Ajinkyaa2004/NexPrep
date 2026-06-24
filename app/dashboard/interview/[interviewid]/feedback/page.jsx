import React from "react";
import FeedbackClient from "./_components/FeedbackClient";

export default async function Feedback({ params }) {
  const unwrappedParams = await params;
  const interviewId = unwrappedParams?.interviewid;

  // Data is fetched client-side (with the user's auth token) inside FeedbackClient.
  return <FeedbackClient interviewId={interviewId} />;
}
