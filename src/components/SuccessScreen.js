import React from "react";
import "./SuccessScreen.css";
import { formatTimeToAMPM } from "../utils/calendarUtils";

export default function SuccessScreen({ inviteUrl, scheduled }) {
  return (
    <div className="bf-success">
      <div className="bf-success-icon">✔</div>
      <h3 className="bf-success-title">You are scheduled</h3>
      <p className="bf-success-text">
        A calendar invitation has been sent to your email address.
      </p>

      {/* Details summary */}
      <div className="bf-summary-card">
        <div className="bf-summary-row"><strong>Organization:</strong> {scheduled.org}</div>
        <div className="bf-summary-row"><strong>Event:</strong> {scheduled.title}</div>
        <div className="bf-summary-row"><strong>Date:</strong> {scheduled.dateLabel}</div>
        <div className="bf-summary-row"><strong>Time:</strong>{`${formatTimeToAMPM(scheduled.time)}`}</div>
        <div className="bf-summary-row"><strong>Duration:</strong> {scheduled.duration}</div>
        <div className="bf-summary-row"><strong>Location:</strong> {scheduled.address}</div>
        <div className="bf-summary-row"><strong>Name:</strong> {scheduled.name}</div>
        <div className="bf-summary-row"><strong>Email:</strong> {scheduled.email}</div>
        <div className="bf-summary-row"><strong>Course:</strong> {scheduled.course}</div>
        <div className="bf-summary-row"><strong>Lesson:</strong> {scheduled.lesson}</div>
      </div>

      <a className="bf-outline-btn" href={inviteUrl} target="_blank" rel="noreferrer">
        Open Invitation ↗
      </a>
    </div>
  );
}
