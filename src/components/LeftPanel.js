import React from "react";
import "./LeftPanel.css";
import InfoRow from "./InfoRow";

export default function LeftPanel({ center, date, time, tz, zoneLabel, formatRange }) {
  return (
    <aside className="bf-card bf-left">
      <header className="bf-header">
        <div className="bf-logo">ISSC</div>
        <div>
          <p className="bf-org">{center.org}</p>
          <h1 className="bf-title">{center.title}</h1>
        </div>
      </header>

      <ul className="bf-meta">
        <InfoRow icon="⏱" label={center.duration} />
        <InfoRow icon="📍" label={center.address} />
      </ul>

      <div className="bf-copy">
        <p>
          සියලුම සිසුන් මෙම form එක අනිවාර්යෙන්ම සම්පුර්ණ කර ඔබ පැමිණෙන
          දිනයන් වෙන් කර ගත යුතුය. මෙම Schedule එකට අනුකූලව ඉගැන්වීම්
          කටයුතු සකස් කරන බැවින්, පැය 24 කට පෙර මෙය සම්පූර්ණ නොකළහොත්
          ඊට පසු දින පංතියට ඔබට සම්බන්ධ විය නොහැක.
        </p>
        <p>
          එදිනට ඔබ ඉගෙන ගැනීමට බලාපොරොත්තු වන module එක daily diary එකේ
          පිළිවෙලට මෙහි සඳහන් කළ යුතුය.
        </p>

        <div className="bf-example">
          <p className="bf-example-title">Example</p>
          <ol>
            <li>Read terms and conditions</li>
            <li>Select your day – Fri 20</li>
            <li>Select your time – 09:00</li>
            <li>Press Next button</li>
            <li>
              Enter your details (Name, Email, Lesson, Course) – e.g., "flower – baby's breath"
            </li>
          </ol>
        </div>

        <div className="bf-terms">
          <p className="bf-terms-title">Terms & Conditions</p>
          <ul>
            <li>සියලුම සිසුන් පන්ති කාමරයට 9.00am පැමිණිය යුතුය.</li>
            <li>පන්ති කාමරයෙන් පිටවීමට පෙර daily diary අත්සන් කළ යුතුය.</li>
            <li>ආයතනයෙන් ලබාදෙන T-shirt හැඳ පැමිණිය යුතුය; කොණ්ඩය පිටුපසට බැඳිය යුතුය.</li>
            <li>දිවා ආහාර කාලය 12.30pm – 1.30pm.</li>
            <li>3.00pm වෙලා ස්ථානය පිරිසිදු කර ඉවත් විය යුතුය.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
