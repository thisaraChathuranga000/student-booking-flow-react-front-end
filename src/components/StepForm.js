import React from "react";
import "./StepForm.css";
import { formatRange } from "../utils/calendarUtils";
import { COURSE_OPTIONS } from "../constants/courseOptions";
import { BRANCH } from "../constants/instituteData";

export default function StepForm({
  center, date, time,
  name, email, lesson, course, branch,
  setName, setEmail, setLesson, setCourse, setBranch,
  onBack, onSubmit, isLoading = false
}) {
  return (
    <div>
      <div className="bf-form-head">
        <button className="bf-back" onClick={onBack} aria-label="Back">←</button>
        <div>
          <p className="bf-org">{center.org}</p>
          <h3 className="bf-form-title">{center.title}</h3>
          <p className="bf-summary">
            {`${formatRange(date, time, 6)}`}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="bf-form"
      >
        <div className="bf-field">
          <label>Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Chathumini Wijesinghe"
          />
        </div>

        <div className="bf-field">
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="chathu2wijsinghe@gmail.com"
          />
        </div>

        <div className="bf-field bf-field--wide">
          <label>Lesson *</label>
          <textarea
            rows="3"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            required
            placeholder="Please add your class prepare lesson (e.g., flower – baby's breath)"
          />
        </div>

        <div className="bf-field bf-field--wide">
          <label>Course *</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select…</option>
            {COURSE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bf-field bf-field--wide">
          <label>Branch *</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          >
            <option value="">Select Branch…</option>
            {BRANCH.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="bf-actions">
          <button 
            type="submit" 
            className="bf-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
