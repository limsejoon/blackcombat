"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, total: diff };
}

interface Props {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const isOver = timeLeft.total <= 0;
  const dDays = timeLeft.days;

  return (
    <div className="flex flex-col items-center gap-2">
      {isOver ? (
        <div className="text-white tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>
          대회 진행 중
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 mb-1">
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.15em", color: "#e8b400" }}>
              D - {dDays}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "일", value: timeLeft.days },
              { label: "시", value: timeLeft.hours },
              { label: "분", value: timeLeft.minutes },
              { label: "초", value: timeLeft.seconds },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-xl"
                    style={{
                      background: "#111111",
                      border: "2px solid #e8b400",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: "#e8b400",
                    }}
                  >
                    {String(value).padStart(2, "0")}
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#cccccc", letterSpacing: "0.1em", marginTop: 4 }}>
                    {label}
                  </span>
                </div>
                {i < 3 && <span style={{ color: "#e8b400", fontWeight: 800, fontSize: "1.5rem", marginBottom: 16 }}>:</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
