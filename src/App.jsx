import { useState, useEffect } from "react";

function WeatherApp() {
  const [cityInput, setCityInput] = useState('London');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async (query) => {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=68e1a27ec345437687d35525222612&q=${query}&days=7&aqi=yes&alerts=no`);
    const data = await response.json();
    setData(data);
    setLoading(false); 
  }
  
  useEffect(() => {
    fetchWeatherData(cityInput);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(data);

  return (
    <div className="weather-app">
      <div className="nav">
        <div className="location text-white mt-10 ml-8 md:ml-20">
          <i className="fa-solid fa-location-dot mr-3"></i>
          <span className="font-semibold">{!loading && data.location.name}, </span>
          <span>{!loading && data.location.country}</span> 
        </div>
        <form className="ml-8 mt-8 md:absolute md:right-24 md:-mt-6" onSubmit={e => e.preventDefault()}>
          <input 
            type="text" 
            className="w-80 h-3 py-4 px-4 bg-neutral-950 text-white rounded-2xl "
            placeholder="search city"
            value={cityInput} 
            onChange={e => setCityInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && fetchWeatherData(cityInput)}
          />
          <i 
            className="fas fa-magnifying-glass text-white -ml-8"
            onClick={() => {
              fetchWeatherData(cityInput); 
            }}
          ></i>
        </form>
      </div>

      {!loading && <div className="cards sm:flex sm:flex-row gap-8 mt-32 md:ml-20 m-8 flex-col ">
        {data.forecast.forecastday.map(day => {
          const timeOfDay = data.current.is_day === 1 ? "day" : "night"; 
          const space = day.day.condition.icon.substr(`//cdn.weatherapi.com/weather/64x64/${timeOfDay}/`.length);
          console.log(timeOfDay, space);
          const date = new Date();
          return (
            <div key={day.date} className={new Date(day.date).toLocaleString('en-us', {  weekday: 'long' }) === date.toLocaleString('en-us', {  weekday: 'long' }) ? "active-weather-card" : "passive-weather-card"}>
              <div className="day text-center text-lg font-semibold">
                {new Date(day.date).toLocaleString('en-us', {  weekday: 'long' })}
                <hr className="mt-2 text-center opacity-40"/>
              </div>
              <div>
              </div> 
                <div className="text-center">
                  <span className="font-extrabold text-7xl ">
                    {parseInt(day.day.avgtemp_c)}
                  </span>
                  <span className="font-semibold text-5xl align-top">°</span>
                  <img className="w-16 h-16 inline" src={`../weather/${timeOfDay}/${space}`} alt="" />
                  <div className="font-semibold text-2xl mt-4">
                    {day.day.condition.text}
                  </div>
                {new Date(day.date).toLocaleString('en-us', {  weekday: 'long' }) === date.toLocaleString('en-us', {  weekday: 'long' }) && (
                <div className="weather-info -mt-2 text-xs font-semibold">
                <span> <br />
                  <span className="w-info">Feels like: </span> 
                  {data.current.feelslike_c}°
                </span> 
                <span className="ml-1">
                  <span className="w-info">Humidity: </span> 
                  {data.current.humidity}%
                </span> <br />
                <div className="mt-2">
                  <span className="">
                    <span className="w-info">Sunrise: </span>  
                    {data.forecast.forecastday[0].astro.sunrise}
                  </span> 
                  <div className="mt-1">
                    <span className="">
                      <span className="w-info">Sunset: </span>  
                      {data.forecast.forecastday[0].astro.sunset} 
                    </span>
                  </div>
                </div>
              </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
      }
    </div>
  );
}

export default WeatherApp;