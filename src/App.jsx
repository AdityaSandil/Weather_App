import React, { useState, useEffect } from 'react';
import WeatherBackground from './components/weatherbackground'; // Import the WeatherBackground component

// Main App component
function App() {
  // State variables for city input, weather data, loading status, and error messages
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // IMPORTANT: For a real application, consider securing your API key
  // This key is for demonstration purposes with OpenWeatherMap API
  const API_KEY = '87716282a8a3d07be32618f2c1905630'; // Replace with your actual API key

  // useEffect hook to fetch weather for the last searched city on component mount
  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity'); // Retrieve last city from local storage
    if (lastCity) {
      setCity(lastCity); // Set city state
      fetchWeather(lastCity); // Fetch weather for the retrieved city
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Fetches weather data for a given city name.
   * @param {string} cityName - The name of the city to fetch weather for.
   */
  const fetchWeather = async (cityName) => {
    setIsLoading(true); // Set loading state to true
    setError(''); // Clear any previous errors
    setWeather(null); // Clear previous weather data

    try {
      // Step 1: Geocoding - Convert city name to latitude and longitude
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      // Check if geocoding was successful and a city was found
      if (!geoResponse.ok || geoData.length === 0) {
        setError('City not found. Please check the city name.');
        setIsLoading(false);
        return;
      }

      const { lat, lon } = geoData[0]; // Extract latitude and longitude

      // Step 2: Fetch current weather data using latitude and longitude
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      // Check if weather data fetch was successful
      if (!weatherResponse.ok) {
        // Handle specific API errors based on status code
        if (weatherResponse.status === 401) {
          setError('API key is invalid or unauthorized. Please check your API key.');
        } else {
          setError('Unable to fetch weather data. Please try again later.');
        }
        setIsLoading(false);
        return;
      }

      setWeather(weatherData); // Set weather data state
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Always set loading state to false after fetch attempt
    }
  };

  /**
   * Handles the "Go" button click or Enter key press.
   * Saves the current city to local storage and fetches weather.
   */
  const getWeather = () => {
    if (!city.trim()) { // Prevent searching for an empty city name
      setError('Please enter a city name.');
      return;
    }
    localStorage.setItem('lastCity', city); // Save current city to local storage
    fetchWeather(city); // Fetch weather for the entered city
  };

  /**
   * Handles key down events on the input field, specifically for the "Enter" key.
   * @param {Object} e - The keyboard event object.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getWeather(); // Trigger weather fetch on Enter key press
    }
  };

  /**
   * WeatherCard Component: Displays detailed weather information.
   * This component is nested within App for simplicity, but can be a separate file.
   * @param {Object} props - Component props.
   * @param {Object} props.weather - The weather data object.
   */
  const WeatherCard = ({ weather }) => {
    if (!weather) return null; // Don't render if no weather data

    // Destructure weather data for easier access
    const { name, main, weather: weatherDetails, wind, sys } = weather;
    const description = weatherDetails[0]?.description || 'N/A';
    const iconCode = weatherDetails[0]?.icon || '01d'; // Default icon
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // OpenWeatherMap icon URL

    // Helper function to convert Unix timestamp to readable time
    const formatTime = (timestamp) => {
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg text-center mt-6 animate-fade-in">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">{name}, {sys.country}</h2>
        <div className="flex items-center justify-center mb-4">
          <img src={iconUrl} alt={description} className="w-20 h-20" />
          <p className="text-6xl font-bold text-blue-700">{Math.round(main.temp)}°C</p>
        </div>
        <p className="text-xl text-gray-700 capitalize mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-4 text-left text-gray-700">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thermometer text-blue-500 mr-2">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
            </svg>
            Min Temp: <span className="font-medium ml-1">{Math.round(main.temp_min)}°C</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thermometer text-red-500 mr-2">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
            </svg>
            Max Temp: <span className="font-medium ml-1">{Math.round(main.temp_max)}°C</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplet text-blue-500 mr-2">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7Z"/>
            </svg>
            Humidity: <span className="font-medium ml-1">{main.humidity}%</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wind text-green-500 mr-2">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 1.8L2 22"/><path d="M9.6 4.6A2 2 0 1 1 12 7H2"/><path d="M12.6 10.6A2 2 0 1 1 15 13H2"/>
            </svg>
            Wind: <span className="font-medium ml-1">{wind.speed} m/s</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sunrise text-yellow-600 mr-2">
              <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m17.07 10.93-1.41 1.41"/><path d="M18.36 6.64 17 8"/><path d="M6.64 6.64 8 8"/><path d="M16 18a4 4 0 0 0-8 0"/>
            </svg>
            Sunrise: <span className="font-medium ml-1">{formatTime(sys.sunrise)}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sunset text-orange-600 mr-2">
              <path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m17.07 10.93 1.41 1.41"/><path d="M18.36 6.64 17 8"/><path d="M6.64 6.64 8 8"/><path d="M16 18a4 4 0 0 0-8 0"/>
            </svg>
            Sunset: <span className="font-medium ml-1">{formatTime(sys.sunset)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    // Main container for the application
    <div className="relative min-h-screen flex flex-col items-center justify-center font-inter p-4 sm:p-6 md:p-8">
      {/* Weather background video component */}
      <WeatherBackground weather={weather} /> {/* Use imported video background */}

      {/* Main content card */}
      <div className="z-10 relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">WeatherWise</h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter city name (e.g., London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key press
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-700 transition-all duration-200 text-lg"
            aria-label="City name input"
          />
          <button
            onClick={getWeather}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
            aria-label="Get weather button"
          >
            Go
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <p className="text-center text-blue-600 text-lg font-medium animate-pulse">
            Fetching weather data...
          </p>
        )}

        {/* Error message display */}
        {error && (
          <p className="text-red-600 text-center text-lg font-medium mt-4 animate-fade-in">
            {error}
          </p>
        )}

        {/* WeatherCard component display */}
        {weather && !isLoading && !error && (
          <div className="mt-4">
            <WeatherCard weather={weather} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
