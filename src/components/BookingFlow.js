import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStep,
  selectTimezone,
  selectDate,
  selectTime,
  selectFormData,
  selectScheduled,
  selectCalendarMonth,
  setStep,
  setTimezone,
  setDate,
  setTime,
  setName,
  setEmail,
  setLesson,
  setCourse,
  setBranch,
  setScheduled,
  goToPrevMonth,
  goToNextMonth
} from "../store/slices/bookingFlowSlice";
import { addBooking } from "../store/slices/bookingSlice";
import { bookingAPI } from "../services/api";
import "../styles/globals.css";
import "./BookingFlowMain.css";
import LeftPanel from "./LeftPanel";
import StepCalendar from "./StepCalendar";
import StepForm from "./StepForm";
import SuccessScreen from "./SuccessScreen";
import { buildCalendar, toKey, formatRange, zoneLabel, formatDateForAPI } from "../utils/calendarUtils";
import { CENTER } from "../constants/instituteData";
import { INVITE_URL } from "../constants/url";
 

export default function BookingFlow() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const step = useSelector(selectStep);
  const tz = useSelector(selectTimezone);
  const date = useSelector(selectDate);
  const time = useSelector(selectTime);
  const { name, email, lesson, course, branch } = useSelector(selectFormData);
  const scheduled = useSelector(selectScheduled);
  const calendarMonth = useSelector(selectCalendarMonth);

  const calendar = useMemo(() => {
    return buildCalendar(calendarMonth.year, calendarMonth.month);
  }, [calendarMonth]);

  const dayLabel = date
    ? date.toLocaleDateString(undefined, { weekday: "long" })
    : "Day";

  const handleNext = () => {
    if (!date || time !== "09:00") return;
    const nowColombo = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' }));
    console.log('Current time in Asia/Colombo:', nowColombo);
    const selectedDate = new Date(date);
    selectedDate.setHours(9, 0, 0, 0);
    const diffMs = selectedDate.getTime() - nowColombo.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      alert('Bookings must be made at least 24 hours in advance. Please select a later date.');
      return;
    }
    
    dispatch(setStep(2));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const bookingData = {
      course,
      date: formatDateForAPI(date),
      email,
      lesson,
      name,
      branch
    };
    
    try {
      const result = await bookingAPI.createBooking(bookingData);
      dispatch(addBooking(bookingData));
      
      const scheduledData = {
        dateKey: bookingData.date,
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
        branch,
        duration: "6 hr",
        address: CENTER.address,
        org: CENTER.org,
        title: CENTER.title,
        bookingId: result?.id,
      };
      
      const calendarBookingData = {
        name,
        email,
        course,
        lesson,
        branch,
        date: bookingData.date,
        time,
        duration: 6, 
        center: CENTER
      };
      
      try {
        await bookingAPI.sendCalendarInvitation({
          to: email,
          bookingData: calendarBookingData,
          scheduledData
        });
        console.log('Calendar invitation sent successfully');
      } catch (inviteError) {
        console.warn('Failed to send calendar invitation via email:', inviteError);
      }
      
      dispatch(setScheduled(scheduledData));
      dispatch(setStep(3));
      
    } catch (error) {
      console.error('error:', error);
      if (error.response?.status === 409) {
        alert(`A booking already exists for email ${bookingData.email} on date ${bookingData.date}`);
      } else {
        alert('Failed to create booking. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bf-page">
      {/* Modern Header */}
      <header className="home-header">
        <img src="/logo1.png" alt="Institute Logo" className="institute-logo" width={90}/>
        <div className="home-header-content">
          <h1>International Sugar Studio and Campus</h1>
          <p>Book Your Learning Session - Battaramulla Center</p>
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
              setTz={(timezone) => dispatch(setTimezone(timezone))}
              date={date}
              setDate={(d) => { dispatch(setDate(d)); }}
              time={time}
              setTime={(timeValue) => dispatch(setTime(timeValue))}
              dayLabel={dayLabel}
              onNext={handleNext}
              onPrevMonth={() => dispatch(goToPrevMonth())}
              onNextMonth={() => dispatch(goToNextMonth())}
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
              branch={branch}
              setName={(nameValue) => dispatch(setName(nameValue))}
              setEmail={(emailValue) => dispatch(setEmail(emailValue))}
              setLesson={(lessonValue) => dispatch(setLesson(lessonValue))}
              setCourse={(courseValue) => dispatch(setCourse(courseValue))}
              setBranch={(branchValue) => dispatch(setBranch(branchValue))}
              onBack={() => dispatch(setStep(1))}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}

          {step === 3 && scheduled && (
            <SuccessScreen 
                inviteUrl={INVITE_URL} 
                scheduled={scheduled}
              />
          )}
        </section>
      </div>
    </div>
  );
}
