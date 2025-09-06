import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
import "../styles/globals.css";
import "./BookingFlowMain.css";
import LeftPanel from "./LeftPanel";
import StepCalendar from "./StepCalendar";
import StepForm from "./StepForm";
import SuccessScreen from "./SuccessScreen";
import { buildCalendar, toKey, formatRange, zoneLabel } from "../utils/calendarUtils";

export default function BookingFlow() {
  const { addBooking } = useBookings();
  const [step, setStep] = useState(1);          // 1 = calendar, 2 = form, 3 = success
  const [tz, setTz] = useState("Asia/Colombo");
  const [date, setDate] = useState(null);       // JS Date
  const [time, setTime] = useState("");         // select 09:00 explicitly
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lesson, setLesson] = useState("");
  const [course, setCourse] = useState("");

  // This will hold the final data to display on the success page
  const [scheduled, setScheduled] = useState(null);

  // For demo, Gmail inbox as the "open invitation" link.
  const inviteUrl = "https://mail.google.com/mail/u/0/#inbox";

  const CENTER = {
    org: "International sugar studio and campus",
    title: "Battramulla Center– Student Weekly Plans",
    duration: "6 hr",
    address: "no 165/1/2, B240, Battaramulla",
  };

  // Demo data for booked counts; key = YYYY-MM-DD
  // Put 50 on a date to simulate FULL.
  // const BOOKED = { "2025-08-30": 27, "2025-08-31": 50 };
  // const TOTAL = 50;

  // Compute seats left for the chosen day
  // const spotsLeft = useMemo(() => {
  //   if (!date) return TOTAL;
  //   const key = toKey(date);
  //   return Math.max(0, TOTAL - (BOOKED[key] || 0));
  // }, [date]);

  // Calendar: Track current viewing month/year
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const calendar = useMemo(() => {
    return buildCalendar(calendarMonth.year, calendarMonth.month);
  }, [calendarMonth]);

  // Handy derived labels
  const dayLabel = date
    ? date.toLocaleDateString(undefined, { weekday: "long" })
    : "Day";

  // Month navigation functions
  const goToPrevMonth = () => {
    setCalendarMonth(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: newMonth };
    });
  };

  const goToNextMonth = () => {
    setCalendarMonth(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: newMonth };
    });
  };

  const handleSubmit = async () => {
    // Add booking to global context
    const bookingData = {
      date: toKey(date),
      time,
      name,
      email,
      course,
      lesson
    };
    
    addBooking(bookingData);
    
    // Prepare data for success page
    setScheduled({
      dateKey: toKey(date),
      dateLabel: date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time,
      tzLabel: zoneLabel(tz),
      name,
      email,
      course,
      lesson,
      duration: "6 hr",
      address: CENTER.address,
      org: CENTER.org,
      title: CENTER.title,
    });
    setStep(3);
  };

  return (
    <div className="bf-page">
      {/* Modern Header */}
      <header className="home-header">
        <div className="home-header-content">
          <h1>International Sugar Studio and Campus</h1>
          <p>Book Your Learning Session - Battaramulla Center</p>
        </div>
        <div className="header-actions">
          <Link to="/admin" className="button-login">
            Login
          </Link>
        </div>
      </header>
      
      <div className="bf-wrap">
        {/* LEFT PANEL */}
        <LeftPanel 
          center={CENTER}
          date={date}
          time={time}
          tz={tz}
          zoneLabel={zoneLabel}
          formatRange={formatRange}
        />

        {/* RIGHT PANEL */}
        <section className="bf-card bf-right">
          {step === 1 && (
            <StepCalendar
              calendar={calendar}
              tz={tz}
              setTz={setTz}
              date={date}
              setDate={(d) => { setDate(d); setTime(""); }}
              time={time}
              setTime={setTime}
              dayLabel={dayLabel}
              onNext={() => setStep(2)}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
            />
          )}

          {step === 2 && (
            <StepForm
              center={CENTER}
              tz={tz}
              date={date}
              time={time}
              name={name}
              email={email}
              lesson={lesson}
              course={course}
              setName={setName}
              setEmail={setEmail}
              setLesson={setLesson}
              setCourse={setCourse}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}

          {step === 3 && scheduled && (
            <SuccessScreen inviteUrl={inviteUrl} scheduled={scheduled} />
          )}
        </section>
      </div>
    </div>
  );
}
