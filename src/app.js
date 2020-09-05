// funkcion to display the updated time - it´s called from the function showWeather

function displayUpdateTime(timestamp) {
  let updatedDate = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[updatedDate.getDay()];

  return `${day}, ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// get a temp and other information + set Amsterdam as default city

function showWeather(response) {
  let h1 = document.querySelector("#city");
  h1.innerHTML = response.data.name;
  let country = document.querySelector("#country");
  country.innerHTML = response.data.sys.country;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let temperature = document.querySelector("#number");
  temperature.innerHTML = Math.round(response.data.main.temp);
  let highTemperature = document.querySelector("#high-temperature");
  highTemperature.innerHTML = Math.round(response.data.main.temp_max);
  let lowTemperature = document.querySelector("#low-temperature");
  lowTemperature.innerHTML = Math.round(response.data.main.temp_min);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let mainImageWeather = document.querySelector("#image-weather");
  mainImageWeather.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainImageWeather.setAttribute("alt", response.data.weather[0].description);

  let updatedTime = document.querySelector("#time");
  updatedTime.innerHTML = displayUpdateTime(response.data.dt * 1000);

  celsiusTemperature = response.data.main.temp;

  console.log(response.data);
}

function search(city) {
  let apiKey = "6f8eb5e9009796b8d457f007bc62c74f";
  let units = "metric";
  let urlEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrlWeather = `${urlEndPoint}?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrlWeather).then(showWeather);

  // for function forecast:
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city-form").value;
  search(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

search("Amsterdam");

//get current location and put it into function showWeather

function searchLocation(position) {
  let apiKey = "6f8eb5e9009796b8d457f007bc62c74f";
  let units = "metric";
  let urlEndPoint = "https://api.openweathermap.org/data/2.5/";
  let apiUrl = `${urlEndPoint}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);

  // for function forecast:
  let apiUrlForecast = `${urlEndPoint}forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function displayCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", displayCurrentLocation);

//from C to F and backwards + by default has C class active

let celsiusTemperature = null;

function toTheFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

let fahrenheitLink = document.querySelector(".fahrenheit");
fahrenheitLink.addEventListener("click", toTheFahrenheit);

function toTheCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector(".celsius");
celsiusLink.addEventListener("click", toTheCelsius);

//function Forecast

function displayForecast(response) {
  console.log(response.data);

  let forecastEl = document.querySelector("#other-hours");
  forecastEl.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastEl.innerHTML += ` 
    <div class="col other-hour">
      <div>${formatHours(forecast.dt * 1000)}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png" alt="${forecast.weather[0].description}"/>
       <span id= "other-hour-temp">${Math.round(
         (forecast.main.temp_max + forecast.main.temp_min) / 2
       )}</span>  °
    </div>`;
  }
}
