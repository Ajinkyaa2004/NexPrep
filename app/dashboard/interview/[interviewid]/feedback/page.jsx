
import React from "react";
import { getFeedbackList } from "../../../../actions/interview";
import FeedbackClient from "./_components/FeedbackClient";

export default async function Feedback({ params }) {
  const unwrappedParams = await params;
  const interviewId = unwrappedParams?.interviewId || unwrappedParams?.interviewwid || unwrappedParams?.interviewid;

  const feedbackList = await getFeedbackList(interviewId);

  // console.log("First Record:", feedbackList[0]);

  return <FeedbackClient feedbackList={feedbackList} />;
}
