import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./StepCalendar.css";
import { MONTHS, sameDay, formatDateForAPI } from "../utils/calendarUtils";
import { bookingAPI } from "../services/api";
import { MAX_SPOTS } from "../constants/bookingConstants";
import { selectBookingCount, selectIsLoadingCount, setBookingCount, setIsLoadingCount } from "../store/slices/bookingFlowSlice";
import { BRANCH } from "../constants/instituteData";

export default function StepCalendar({
  calendar, date, setDate, time, setTime, dayLabel, onNext, onPrevMonth, onNextMonth, branch, setBranch
}) {
  const dispatch = useDispatch();
  const monthName = MONTHS[calendar.month];
  const bookingCount = useSelector(selectBookingCount);
  const isLoadingCount = useSelector(selectIsLoadingCount);
  const today = new Date(); 
  today.setHours(0,0,0,0);
  const availableSpots = MAX_SPOTS - bookingCount;
  const isFull = bookingCount >= MAX_SPOTS;

  useEffect(() => {
    if (date) {
      const fetchBookingCount = async () => {
        dispatch(setIsLoadingCount(true));
        try {
          const formattedDate = formatDateForAPI(date);
          const result = await bookingAPI.getBookingCount(formattedDate);
          dispatch(setBookingCount(result.count || 0));
        } catch (error) {
          console.error('Failed to fetch booking count:', error);
          dispatch(setBookingCount(0));
        } finally {
          dispatch(setIsLoadingCount(false));
        }
      };
      
      fetchBookingCount();
    } else {
      dispatch(setBookingCount(0));
    }
  }, [date, dispatch]);

  // Clear selected date if it becomes invalid due to branch restrictions
  useEffect(() => {
    if (date && branch === "Battaramulla") {
      const isMonday = date.getDay() === 1;
      const isTuesday = date.getDay() === 2;
      if (isMonday || isTuesday) {
        setDate(null); // Clear the invalid date
      }
    }
  }, [branch, date, setDate]);

  return (
    <div>
      <div className="bf-right-top">
        <h2 className="bf-h2">Select a Date & Time</h2>
        
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

        {date && (
          <div className="bf-pill">
            {date.toLocaleDateString(undefined, {
              weekday: "long", month: "long", day: "numeric",
            })}
          </div>
        )}
      </div>

      <div className="bf-grid">
        {/* Calendar */}
        <div>
          <div className="bf-month">
            <button 
              onClick={onPrevMonth}
              className="bf-month-nav"
              title="Previous month"
            >
              ‹
            </button>
            <span>{monthName} {calendar.year}</span>
            <button 
              onClick={onNextMonth}
              className="bf-month-nav"
              title="Next month"
            >
              ›
            </button>
          </div>

          <div className="bf-weekdays">
            {"MON TUE WED THU FRI SAT SUN".split(" ").map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="bf-days">
            {calendar.cells.map((d, i) => {
              const active = date && d && sameDay(date, d);
              const otherMonth = !(d && d.getMonth() === calendar.month);
              const past = d && d < today;
              
              // Disable Monday (1) and Tuesday (2) for Battaramulla branch
              const isBattaramulla = branch === "Battaramulla";
              const isMonday = d && d.getDay() === 1;
              const isTuesday = d && d.getDay() === 2;
              const branchRestricted = isBattaramulla && (isMonday || isTuesday);
              
              const disabled = otherMonth || past || branchRestricted;
              
              // Determine title message
              let titleMessage = "";
              if (past) {
                titleMessage = "Past dates are not available";
              } else if (branchRestricted) {
                titleMessage = "Battaramulla branch is closed on Mondays and Tuesdays";
              }
              
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => setDate(d)}
                  className={[
                    "bf-day",
                    otherMonth ? "bf-day-dim" : "",
                    past ? "bf-day-past" : "",
                    branchRestricted ? "bf-day-restricted" : "",
                    active ? "bf-day-active" : "",
                    disabled ? "bf-day-disabled" : ""
                  ].join(" ")}
                  title={titleMessage}
                >
                  {d ? d.getDate() : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time & Next */}
        <div className="bf-slot">
          <div className="bf-slot-title">
            {dayLabel}, 09:00 AM
          </div>

          <div className="bf-slot-row">
            <button
              onClick={() => setTime("09:00")}
              className={`bf-btn-time ${time === "09:00" ? "bf-btn-time--active" : ""}`}
              title={"Select 09:00 AM"}
              disabled={isFull}
            >
              09:00 AM
            </button>

            {isLoadingCount ? (
              <div className="bf-spots">Loading...</div>
            ) : isFull ? (
              <div className="bf-spots bf-spots--full">FULL</div>
            ) : (
              <div className="bf-spots">spots left - {availableSpots}</div>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!date || time !== "09:00" || isFull}
            className="bf-btn-primary bf-btn-next"
            title={
              !date 
                ? "Pick a date" 
                : isFull 
                  ? "This date is fully booked" 
                  : (time !== "09:00" ? "Pick 09:00" : "Next")
            }
          >
            Next
          </button>

          {isFull && date && (
            <p className="bf-full-hint">
              This day has reached the 50-student capacity. Please choose another date.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
