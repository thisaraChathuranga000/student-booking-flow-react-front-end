import React from "react";
import "./LeftPanel.css";
import InfoRow from "./InfoRow";

export default function LeftPanel({ center }) {
  return (
    <aside className="bf-card bf-left">
      <header className="bf-header">
        <div className="">
          <img src="/logo1.png" alt="Institute Logo" className="institute-logo" width={90}/>
        </div>
        <div>
          <p className="bf-org">{center.org}</p>
          <h1 className="bf-title">{center.title}</h1>
        </div>
      </header>

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
            <li>Select your time – 09:00 AM</li>
            <li>Press Next button</li>
            <li>
              Enter your details (Name, Email, Lesson, Course) – e.g., "flower – baby's breath"
            </li>
          </ol>
        </div>

        <div className="bf-terms">
          <p className="bf-terms-title">Terms & Conditions</p>
          <ul>
            <li>සියලුම සිසුන් පන්ති කාමරයට පෙ.ව 9.00 පැමිණිය යුතුය.</li>
            <li>පන්ති කාමරයෙන් පිටවීමට පෙර daily diary අත්සන් කළ යුතුය.</li>
            <li>ආයතනයෙන් ලබාදෙන T-shirt හැඳ පැමිණිය යුතුය. කොණ්ඩය පිටුපසට බැඳිය යුතුය.</li>
            <li>දිවා ආහාර කාලය ප.ව 12.30 – ප.ව 1.30.</li>
            <li>තමන් වැඩ කරපු ස්ථානය පිරිසිදු කර ප.ව 3:00 වන විට පන්ති කාමරයෙන් අනිවාර්යෙන් ඉවත් විය යුතුයි.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
