import React from "react";

import Thunderstorm from "../assets/Thunderstorm.mp4";
import Rain from "../assets/Rain.mp4";
import Snow from "../assets/Snow.mp4";
import ClearDay from "../assets/ClearDay.mp4";
import ClearNight from "../assets/ClearNight.mp4";
import CloudsDay from "../assets/CloudsDay.mp4";
import CloudsNight from "../assets/CloudsNight.mp4";
import Haze from "../assets/Haze.mp4";
import DefaultVideo from "../assets/Default.mp4";

const WeatherBackground = ({ weather, condition, time }) => {
  // Extract condition and time if weather object is provided
  let cond = condition;
  let tm = time;

  if (weather) {
    // WeatherAPI format
    if (weather.current && weather.current.condition) {
      cond = weather.current.condition.text;
      tm = weather.current.is_day === 1 ? "day" : "night";
    }
    // Visual Crossing format
    else if (weather.currentConditions) {
      cond = weather.currentConditions.conditions;
      // Estimate day/night from icon string (Visual Crossing uses "day" or "night" in icon name)
      tm =
        weather.currentConditions.icon &&
        weather.currentConditions.icon.includes("night")
          ? "night"
          : "day";
    }
  }

  // Normalize and map condition string for video selection
  cond = cond ? cond.toLowerCase() : "default";
  let videoKey = "default";
  if (/thunder/.test(cond)) videoKey = "thunderstorm";
  else if (/drizzle/.test(cond)) videoKey = "drizzle";
  else if (/rain/.test(cond)) videoKey = "rain";
  else if (/snow/.test(cond)) videoKey = "snow";
  else if (/clear/.test(cond)) videoKey = "clear";
  else if (/cloud/.test(cond)) videoKey = "clouds";
  else if (/(mist|haze|fog|smoke)/.test(cond)) videoKey = "haze";

  const videos = {
    thunderstorm: Thunderstorm,
    drizzle: Rain,
    rain: Rain,
    snow: Snow,
    clear: tm === "day" ? ClearDay : ClearNight,
    clouds: tm === "day" ? CloudsDay : CloudsNight,
    mist: Haze,
    smoke: Haze,
    haze: Haze,
    fog: Haze,
    default: DefaultVideo,
  };

  const videoSrc = videos[videoKey] || videos["default"];

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover animate-fade-in"
        src={videoSrc}
        type="video/mp4"
      />
      {/* Gradient overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default WeatherBackground;

// Add this to your global CSS if not present:
/*
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1s ease;
}
*/