import React from "react";

export default function InfoRow({ icon, label }) {
  return (
    <li className="bf-meta-row">
      <span className="bf-meta-icon">{icon}</span>
      <span>{label}</span>
    </li>
  );
}
