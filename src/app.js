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
  let hours = updatedDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = updatedDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}, ${hours}:${minutes}`;
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

  let updatedTime = document.querySelector("#time");
  updatedTime.innerHTML = displayUpdateTime(response.data.dt * 1000);

  console.log(response.data);
  celsiusTemperature = response.data.main.temp;
}

function search(city) {
  let apiKey = "6f8eb5e9009796b8d457f007bc62c74f";
  let units = "metric";
  let urlEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrlWeather = `${urlEndPoint}?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrlWeather).then(showWeather);
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
  let urlEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${urlEndPoint}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function displayCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", displayCurrentLocation);

//from C to F and backwards

let celsiusTemperature = null;

function toTheFahrenheit(event) {
  event.preventDefault();
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", toTheFahrenheit);

function toTheCelsius(event) {
  event.preventDefault();
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", toTheCelsius);
