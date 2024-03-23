import { convertAmPm } from "./utils/timeUtils.js";
import { formattedUnitWithLabel } from "./utils/formatUtils.js";
import { createEl, appendEl } from "./utils/domUtils.js";

// Base class for all weather cards
class WeatherCard {
  constructor(weatherCardParams) {
    // Properties based off of weatherCardParams
    this._timeMeasurement = weatherCardParams.timeMeasurement;
    this._imperialTemp = weatherCardParams.imperialTemp;
    this._metricTemp = weatherCardParams.metricTemp;
    this._icon = weatherCardParams.icon;

    // Other properties
    this.tempUnit = "f";
    this._card = createEl("div", "");
    this.isImperial = true;
  }
  get formattedTimeMeasurement() {
    return this._timeMeasurement;
  }
  addCardType() {
    this._card.classList.add(this._cardType);
  }
  createCard() {
    this.addCardType();
    const body = document.querySelector("body");
    const timeMeasurementEl = createEl("p", this.formattedTimeMeasurement);
    const tempEl = this._imperialTemp
      ? createEl(
          "p",
          formattedUnitWithLabel(this._imperialTemp, this.tempUnit),
          "temp"
        )
      : "";
    const iconEl = createEl("img");
    iconEl.src = this._icon;
    appendEl(body, this._card);
    if (tempEl) {
      appendEl(this._card, timeMeasurementEl, tempEl, iconEl);
    } else {
      appendEl(this._card, timeMeasurementEl, iconEl);
    }
  }
  // Toggle between imperial and metric units for the weather card
  toggleImperialMetric() {
    this.isImperial = !this.isImperial;
    this.updateImperialMetricLabels();
  }
  // Update imperial and metric labels
  updateImperialMetricLabels() {
    this.tempUnit = this.isImperial ? "f" : "c";
    this.updateImperialMetricLabel(
      ".temp",
      this._imperialTemp,
      this._metricTemp,
      this.tempUnit
    );
  }
  updateImperialMetricLabel(className, imperialValue, metricValue, unit) {
    const el = this._card.querySelector(className);
    if (el) {
      el.innerText = formattedUnitWithLabel(
        this.isImperial ? imperialValue : metricValue,
        unit
      );
    }
  }
}

// Class for the current day weather card (today)
class CurrentWeatherCard extends WeatherCard {
  constructor(currentWeatherCardParams) {
    super(currentWeatherCardParams);
    // Properties based off of currentWeatherCardParams
    this._location = currentWeatherCardParams.location;
    this._conditionText = currentWeatherCardParams.conditionText;
    this._imperialFeelsLikeTemp =
      currentWeatherCardParams.imperialFeelsLikeTemp;
    this._metricFeelsLikeTemp = currentWeatherCardParams.metricFeelsLikeTemp;
    this._humidity = currentWeatherCardParams.humidity;
    this._chanceOfRain = currentWeatherCardParams.chanceOfRain;
    this._imperialWindSpeed = currentWeatherCardParams.imperialWindSpeed;
    this._metricWindSpeed = currentWeatherCardParams.metricWindSpeed;

    // Other properties
    this._cardType = "current-weather-card";
    this.speedUnit = "mi";
  }
  get formattedTimeMeasurement() {
    const date = new Date(this._timeMeasurement);
    const day = date.getDate();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const formattedHourMin = convertAmPm(date, true);
    const minutes = date.getMinutes();
    const formattedDate = `${month} ${day}, ${year} ${formattedHourMin}`;
    return formattedDate;
  }
  createCard() {
    super.createCard();
    const currentWeatherContainer = document.querySelector(
      ".current-weather-container"
    );
    appendEl(currentWeatherContainer, this._card);
    // const body = document.querySelector("body");

    this.createStylingContainers();
  }
  /* Create two extra div containers to hold information inside the current weather container for styling purposes
     <div class="current-weather-container">
       <div class="main-info">
         Base class card details here (timeMeasurementEl, tempEl, iconEl)
       </div>
       <div class="weather-conditions"></div>
     </div>
   */
  createStylingContainers() {
    const mainInfoEl = this.createMainInfoEl();
    const weatherConditionsEl = this.createWeatherConditionsEl();

    appendEl(this._card, mainInfoEl, weatherConditionsEl);
  }

  createMainInfoEl() {
    const mainInfoEl = createEl("div", "", "main-info");

    // Move this._card's elements to mainInfo container instead for styling purposes
    while (this._card.firstChild) {
      mainInfoEl.appendChild(this._card.firstChild);
    }
    // Add location element to mainInfo container
    const locationEl = createEl("p", this._location);
    appendEl(mainInfoEl, locationEl);
    const convertImperialMetricBtn = createEl(
      "button",
      `Display °C`,
      "convert-imperial-metric"
    );
    const tempEl = this._card.querySelector(".temp");
    const iconEl = this._card.querySelector("img");
    mainInfoEl.insertBefore(convertImperialMetricBtn, iconEl);
    const conditionEl = createEl("p", this._conditionText, "conditions");
    mainInfoEl.insertBefore(conditionEl, tempEl);

    return mainInfoEl;
  }
  createWeatherConditionsEl() {
    const weatherConditionsEl = createEl("div", "", "weather-conditions");

    const feelsLikeEl = createEl(
      "p",
      formattedUnitWithLabel(this._imperialFeelsLikeTemp, this.tempUnit),
      "feels-like"
    );
    const humidityEl = createEl(
      "p",
      formattedUnitWithLabel(this._humidity, "%")
    );
    const chanceOfRainEl = createEl(
      "p",
      formattedUnitWithLabel(this._chanceOfRain, "%")
    );
    const windSpeedEl = createEl(
      "p",
      formattedUnitWithLabel(this._imperialWindSpeed, this.speedUnit),
      "wind-speed"
    );

    appendEl(
      weatherConditionsEl,
      feelsLikeEl,
      humidityEl,
      chanceOfRainEl,
      windSpeedEl
    );

    return weatherConditionsEl;
  }
  toggleImperialMetric() {
    super.toggleImperialMetric();
    this.toggleConvertImperialMetricBtn();
  }
  // Updates convert imperial metric button with new temp unit when toggled
  toggleConvertImperialMetricBtn() {
    const convertImperialMetricBtn = document.querySelector(
      ".convert-imperial-metric"
    );
    const altTempUnit = this.tempUnit === "c" ? "f" : "c";
    convertImperialMetricBtn.innerText = `Display °${altTempUnit.toUpperCase()}`;
  }
  updateImperialMetricLabels() {
    super.updateImperialMetricLabels();
    this.speedUnit = this.isImperial ? "mi" : "km";

    this.updateImperialMetricLabel(
      ".feels-like",
      this._imperialFeelsLikeTemp,
      this._metricFeelsLikeTemp,
      this.tempUnit
    );
    this.updateImperialMetricLabel(
      ".wind-speed",
      this._imperialWindSpeed,
      this._metricWindSpeed,
      this.speedUnit
    );
  }
}

// Class for day weather cards
class DayWeatherCard extends WeatherCard {
  // Create an index variable to increase every time a new instance of DayWeatherCard is created
  constructor(dayWeatherCardParams) {
    super(dayWeatherCardParams);
    // Properties based off of dayWeatherCardParams
    this._imperialMinTemp = dayWeatherCardParams.imperialMinTemp;
    this._metricMinTemp = dayWeatherCardParams.metricMinTemp;
    this._imperialMaxTemp = dayWeatherCardParams.imperialMaxTemp;
    this._metricMaxTemp = dayWeatherCardParams.metricMaxTemp;
    this._card.dataset.index =
      dayWeatherCardParams.index % dayWeatherCardParams.forecastArr.length;

    // Other properties
    this._cardType = "day-weather-card";
  }
  // Convert time to day of the week
  get FormattedTimeMeasurement() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const index = new Date(this._timeMeasurement + " 00:00").getDay();
    return days[index];
  }
  createCard() {
    super.createCard();
    const forecastCardsContainer = document.querySelector(
      ".forecast-cards-container"
    );
    appendEl(forecastCardsContainer, this._card);
    const displayHourlyForecastBtn = createEl(
      "button",
      "Display hourly forecast",
      "display-hourly-forecast"
    );
    const minTempEl = createEl(
      "p",
      formattedUnitWithLabel(this._imperialMinTemp, this.tempUnit),
      "min-temp"
    );
    const maxTempEl = createEl(
      "p",
      formattedUnitWithLabel(this._imperialMaxTemp, this.tempUnit),
      "max-temp"
    );
    appendEl(this._card, displayHourlyForecastBtn, minTempEl, maxTempEl);
  }
  updateImperialMetricLabels() {
    super.updateImperialMetricLabels();
    this.updateImperialMetricLabel(
      ".min-temp",
      this._imperialMinTemp,
      this._metricMinTemp,
      this.tempUnit
    );
    this.updateImperialMetricLabel(
      ".max-temp",
      this._imperialMaxTemp,
      this._metricMaxTemp,
      this.tempUnit
    );
  }
}

// Class for hourly weather cards
class HourlyWeatherCard extends WeatherCard {
  constructor(hourlyWeatherCardParams) {
    super(hourlyWeatherCardParams);
    this._cardType = "hourly-weather-card";
  }
  get formattedTimeMeasurement() {
    const date = new Date(this._timeMeasurement);
    const formattedHour = convertAmPm(date);
    return formattedHour;
  }
  createCard() {
    super.createCard();
    const forecastCardsContainer = document.querySelector(
      ".forecast-cards-container"
    );
    appendEl(forecastCardsContainer, this._card);
  }
}
// Factory function to create instances of a current day card
function createCurrentWeatherCard(currentWeatherCardParams) {
  return new CurrentWeatherCard(currentWeatherCardParams);
}
// Factory function to create instances of a forecast day card
function createDayWeatherCard(dayWeatherCardParams) {
  return new DayWeatherCard(dayWeatherCardParams);
}

// Factory function to create instances of a hourly card
function createHourlyWeatherCard(hourlyWeatherCardParams) {
  return new HourlyWeatherCard(hourlyWeatherCardParams);
}

export {
  createCurrentWeatherCard,
  createDayWeatherCard,
  createHourlyWeatherCard,
};
