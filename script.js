const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input");
(locationBtn = inputPart.querySelector("button")),
  (wIcon = document.querySelector(".weather-part img")),
  (arrowBack = wrapper.querySelector("header i"));

let api;
inputField.addEventListener("keyup", (e) => {
  //if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    //if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser not support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords; //getting lat and lon of the user device from coords obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=KEY`;
  fetchData();
}
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
  console.log(error);
}
//Using Open WeatherMap API key
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=KEY`;
  fetchData();
}
function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}
function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    //lets get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = "Weather_Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "Weather_Icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "Weather_Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "Weather_Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "Weather_Icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "Weather_Icons/rain.svg";
    }

    // lets pass these values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".temp .deg").style.display = "block";
    wrapper.querySelector(".details .temp .deg").style.display = "block";
    wrapper.querySelector(".fahrenhite").style.display = "none";
    wrapper.querySelector(".details .temp .fahrenhite").style.display = "none";
    document.querySelector(".temp").onclick = function () {
      wrapper.querySelector(".temp .numb").innerText =
        Math.round(((temp * 9) / 5.0 + 32) * 100) / 100;
      wrapper.querySelector(".temp .numb-2").innerText =
        Math.round(((feels_like * 9) / 5.0 + 32) * 100) / 100;
      wrapper.querySelector(".temp .deg").style.display = "none";
      wrapper.querySelector(".details .temp .deg").style.display = "none";
      wrapper.querySelector(".temp .fahrenhite").style.display = "block";
      wrapper.querySelector(".details .temp .fahrenhite").style.display =
        "block";
    };

    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    ClearFields();
  }
}
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
function ClearFields() {
  document.querySelector("input").value = "";
}
