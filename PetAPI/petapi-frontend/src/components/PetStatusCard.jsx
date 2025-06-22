import React from "react";

function PetStatusCard({ name, hunger, happiness, health, level, experience }) {
  const xpForNextLevel = level * 100;
  const xpPercent = Math.min(100, (experience / xpForNextLevel) * 100);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, maxWidth: 350, margin: "0 auto", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center" }}>{name}</h2>
      <div style={{ margin: "12px 0" }}>
        <label>Seviye: {level}</label>
      </div>
      <div style={{ margin: "12px 0" }}>
        <label>XP</label>
        <progress value={experience} max={xpForNextLevel} style={{ width: "100%" }} />
        <div>{experience} / {xpForNextLevel} XP</div>
      </div>
      <div style={{ margin: "12px 0" }}>
        <label>Açlık</label>
        <progress value={hunger} max={100} style={{ width: "100%" }} />
        <div>{hunger} / 100</div>
      </div>
      <div style={{ margin: "12px 0" }}>
        <label>Mutluluk</label>
        <progress value={happiness} max={100} style={{ width: "100%" }} />
        <div>{happiness} / 100</div>
      </div>
      <div style={{ margin: "12px 0" }}>
        <label>Sağlık</label>
        <progress value={health} max={100} style={{ width: "100%" }} />
        <div>{health} / 100</div>
      </div>
    </div>
  );
}

export default PetStatusCard; 