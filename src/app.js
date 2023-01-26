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
  let amORpm = hours < 12 ? "a.m." : "p.m."; // midnight in 12-hour clock is 12:00 am, noon is 12:00 pm
  hours = hours % 12 || 12; //  % = remainder operator.  || 12 - if the remaining is 0, it will be 12.


  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes} ${amORpm}`;
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
  let sunrise = document.querySelector("#sunrise");
  sunrise.innerHTML = formatHours(response.data.sys.sunrise * 1000);
  let sunset = document.querySelector("#sunset");
  sunset.innerHTML = formatHours(response.data.sys.sunset * 1000);
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

  classTempButton();
}

function search(city) {
  let apiKey = "6f8eb5e9009796b8d457f007bc62c74f";
  let units = "metric";
  let urlEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrlWeather = `${urlEndPoint}?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrlWeather).then(showWeather);

  // for function forecast:
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrlForecast).then(showForecast);
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
  axios.get(apiUrlForecast).then(showForecast);
}

function displayCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", displayCurrentLocation);

//from C to F and backwards + by default has C class active

let celsiusTemperature = null;
let currentTemp = [0, 0, 0, 0, 0];

function toTheFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);

  //for the forecast - changing the symbol and changing the temp

  let symbols = document.querySelectorAll(".symbol-temp"); // tímto si vytvářím array ze všech symbolů - ač je jen jeden..
  symbols.forEach(function (symbol) {
    symbol.innerHTML = "F";
  });

  // tímto si vytvářím array ze všech teplot !

  for (let index = 0; index < 5; index++) {
    let placeForTemp = document.querySelectorAll(".other-hour-temp");
    let oneTemp = currentTemp[index];
    placeForTemp[index].innerHTML = `${Math.round((oneTemp * 9) / 5 + 32)}`;
  }
}

let fahrenheitLink = document.querySelector(".fahrenheit");
fahrenheitLink.addEventListener("click", toTheFahrenheit);

function toTheCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentNumber = document.querySelector("#number");
  currentNumber.innerHTML = Math.round(celsiusTemperature);

  // for the forecast - changing the symbol and changing the temp

  let symbols = document.querySelectorAll(".symbol-temp"); // tímto si vytvářím array ze všech symbolů - ač je jen jeden..
  symbols.forEach(function (symbol) {
    symbol.innerHTML = "C";
  });

  // místo pro smyčku na to, že for Each currentTemp platí, že je rovná cunrrentTemp:
  for (let index = 0; index < 5; index++) {
    let placeForTemp = document.querySelectorAll(".other-hour-temp");
    let oneTemp = currentTemp[index];
    placeForTemp[index].innerHTML = oneTemp;
  }
}

let celsiusLink = document.querySelector(".celsius");
celsiusLink.addEventListener("click", toTheCelsius);

//function Forecast

function showForecast(response) {
  let forecastElement = document.querySelector("#other-hours");
  forecastElement.innerHTML = null;
  let forecast = null;

  currentTemp = [
    Math.round(
      (response.data.list[0].main.temp_max +
        response.data.list[0].main.temp_min) /
        2
    ),
    Math.round(
      (response.data.list[1].main.temp_max +
        response.data.list[1].main.temp_min) /
        2
    ),
    Math.round(
      (response.data.list[2].main.temp_max +
        response.data.list[2].main.temp_min) /
        2
    ),
    Math.round(
      (response.data.list[3].main.temp_max +
        response.data.list[3].main.temp_min) /
        2
    ),
    Math.round(
      (response.data.list[4].main.temp_max +
        response.data.list[4].main.temp_min) /
        2
    ),
  ];

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += ` 
    <div class="col other-hour">
      <div>${formatHours(forecast.dt * 1000)}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png" alt="${forecast.weather[0].description}"/>
       <span class= "other-hour-temp">${Math.round(
         (forecast.main.temp_max + forecast.main.temp_min) / 2
       )}</span>  ° <span class="symbol-temp"> C </span>
    </div>`;
  }

  classTempButton();
}

// because without this function when you press F button and then change the city, the F button is still active/black
// and you need always the F button inactive/blue when there is a new city displayed

function classTempButton() {
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}
