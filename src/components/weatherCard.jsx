function WeatherCard({ weather }) {
  // WeatherAPI format
  if (weather.location && weather.current) {
    const { location, current } = weather;
    return (
      <div className="bg-gradient-to-br from-blue-600/60 to-blue-400/40 border border-blue-200 backdrop-blur-md p-7 rounded-2xl shadow-2xl text-center text-white w-80 mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
          {location.name}, {location.country}
        </h2>
        <img
          src={current.condition.icon}
          alt={current.condition.text}
          className="mx-auto my-4 w-20 h-20 rounded-full shadow-lg bg-white/30"
        />
        <p className="text-3xl font-semibold mb-1">{current.temp_c}°C</p>
        <p className="text-lg text-blue-100 mb-2">{current.condition.text}</p>
        <div className="flex flex-col gap-1 text-sm text-blue-50 mt-3">
          <span>
            Feels Like:{" "}
            <span className="font-bold">{current.feelslike_c}°C</span>
          </span>
          <span>
            Humidity:{" "}
            <span className="font-bold">{current.humidity}%</span>
          </span>
          <span>
            Wind:{" "}
            <span className="font-bold">{current.wind_kph} kph</span>
          </span>
          <span>
            Pressure:{" "}
            <span className="font-bold">{current.pressure_mb} hPa</span>
          </span>
          <span>
            Cloud Cover:{" "}
            <span className="font-bold">{current.cloud}%</span>
          </span>
        </div>
        <p className="text-xs text-blue-200 mt-4">
          Time: {current.last_updated}
        </p>
      </div>
    );
  }

  // Visual Crossing format
  if (weather.currentConditions && (weather.address || weather.resolvedAddress)) {
    const { currentConditions } = weather;
    return (
      <div className="bg-gradient-to-br from-blue-600/60 to-blue-400/40 border border-blue-200 backdrop-blur-md p-7 rounded-2xl shadow-2xl text-center text-white w-80 mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
          {weather.resolvedAddress || weather.address}
        </h2>
        {currentConditions.icon && (
          <img
            src={`https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${currentConditions.icon}.png`}
            alt={currentConditions.conditions}
            className="mx-auto my-4 w-20 h-20 rounded-full shadow-lg bg-white/30"
          />
        )}
        <p className="text-3xl font-semibold mb-1">{currentConditions.temp}°C</p>
        <p className="text-lg text-blue-100 mb-2">{currentConditions.conditions}</p>
        <div className="flex flex-col gap-1 text-sm text-blue-50 mt-3">
          <span>
            Feels Like:{" "}
            <span className="font-bold">{currentConditions.feelslike}°C</span>
          </span>
          <span>
            Humidity:{" "}
            <span className="font-bold">{currentConditions.humidity}%</span>
          </span>
          <span>
            Wind:{" "}
            <span className="font-bold">{currentConditions.windspeed} kph</span>
          </span>
          <span>
            Pressure:{" "}
            <span className="font-bold">{currentConditions.pressure} hPa</span>
          </span>
          <span>
            Cloud Cover:{" "}
            <span className="font-bold">{currentConditions.cloudcover}%</span>
          </span>
        </div>
        <p className="text-xs text-blue-200 mt-4">
          Time: {currentConditions.datetime}
        </p>
      </div>
    );
  }

  // Fallback
  return (
    <div className="bg-gradient-to-br from-gray-700/60 to-gray-400/40 border border-gray-200 backdrop-blur-md p-7 rounded-2xl shadow-2xl text-center text-white w-80 mx-auto">
      <p>No weather data available.</p>
    </div>
  );
}

export default WeatherCard;