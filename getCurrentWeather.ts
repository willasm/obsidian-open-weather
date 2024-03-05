// • getCurrentWeather - Returns Air Qulity Index From API • 
export default async function getCurrentWeather(key:any, latitude:any, longitude:any, language:any, units:any, format:any) {
  let weatherData;
  let weatherString;
  let url;
  let aqiNumber;
  let aqiString;

  // • Get Air Quality Index From API • 
  let urlAQI = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key}`
  if (latitude.length > 0 && longitude.length > 0 && key.length > 0) {
    let reqAQI = await fetch(urlAQI);
    let jsonAQI = await reqAQI.json();
    if (jsonAQI.cod) {
      aqiNumber = 0;
      aqiString = "Air Quality Index is Not Available";
    } else {
      const aqiStringsArr = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
      aqiNumber = jsonAQI.list[0].main.aqi;
      aqiString = aqiStringsArr[aqiNumber-1]
    };
  } else {
    aqiNumber = 0;
    aqiString = "Air Quality Index is Not Available";
  };

  // • Get Current Weather From API • 
  if (latitude.length > 0 && longitude.length > 0) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${key}&units=${units}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&lang=${language}&appid=${key}&units=${units}`;
  };
  let req = await fetch(url);
  let json = await req.json();
  //console.log('json:', json);
  if (json.cod != 200) {
    weatherString = "Error Code "+json.cod+": "+json.message;
    return weatherString;
  };

  // • Get Current Weather Data We Want • 
  let conditions = json.weather[0].description;
  let id = json.weather[0].id;
  let conditionsEm = '';
  if (id > 199 && id < 300) {
    conditionsEm = '⛈️';
  };
  if (id > 299 && id < 500) {
    conditionsEm = '🌦️';
  };
  if (id > 499 && id < 600) {
    conditionsEm = '🌧️';
  };
  if (id > 599 && id < 700) {
    conditionsEm = '❄️';
  };
  if (id > 699 && id < 800) {
    conditionsEm = '🌫️';
  };
  if (id == 771) {
    conditionsEm = '🌀';
  };
  if (id == 781) {
    conditionsEm = '🌪️';
  };
  if (id == 800) {
    conditionsEm = '🔆';
  };
  if (id > 800 && id < 804) {
    conditionsEm = '🌥️';
  };
  if (id == 804) {
    conditionsEm = '☁️';
  };
  conditions = conditions.replace(/^\w|\s\w/g, (c: string) => c.toUpperCase());
  let iconName = json.weather[0].icon;
  const iconApi = await fetch('https://openweathermap.org/img/wn/' + iconName + '.png');
  let iconUrl = iconApi.url;
  const iconApi2x = await fetch('https://openweathermap.org/img/wn/' + iconName + '@2x.png');
  let iconUrl2x = iconApi2x.url;
  let temp = json.main.temp;
  temp = Math.round(temp);
  let feelsLike = json.main.feels_like;
  feelsLike = Math.round(feelsLike);
  let tempMin = json.main.temp_min;
  tempMin = Math.round(tempMin);
  let tempMax = json.main.temp_max;
  tempMax = Math.round(tempMax);
  let pressure = json.main.pressure;
  let humidity = json.main.humidity;
  let seaLevel = json.main.sea_level;
  let groundLevel = json.main.grnd_level;
  let visibility = json.visibility;
  // Winds
  let windSpeed = json.wind.speed;
  let windSpeedms = json.wind.speed;
  if (this.units == "metric") {
    windSpeed = Math.round(windSpeed*3.6);
    windSpeedms = Math.round(windSpeedms);
  } else {
    windSpeed = Math.round(windSpeed);
  }
  let windDirection = json.wind.deg;
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  windDirection = directions[Math.round(windDirection / 45) % 8];
  let windGust = json.wind.gust;
  if (windGust != undefined) {
    if (this.units == "metric") {
      windGust = Math.round(windGust*3.6);
    } else {
      windGust = Math.round(windGust);
    }
  } else {
    windGust = "N/A";
  }

  // Cloud cover
  let clouds = json.clouds.all;
  // Precipitation
  let rain1h;
  let rain3h;
  let snow1h;
  let snow3h;
  let precipitation1h;
  let precipitation3h;
  // Precipitation - Rain
  if (json.rain != undefined) {
    let rainObj = json.rain;
    let keys = Object.keys(rainObj);
    let values = Object.values(rainObj);
    if (keys[0] === "1h") {
      rain1h = values[0];
    } else if (keys[0] === "3h") {
      rain3h = values[0];
    }
    if (keys.length > 1) {
      if (keys[1] === "1h") {
        rain1h = values[1];
      } else if (keys[1] === "3h") {
        rain3h = values[1];
      }
    }
  } else {
    rain1h = 0;
    rain3h = 0;
  }
  if (rain1h === undefined) {rain1h = 0};
  if (rain3h === undefined) {rain3h = 0};
  // Precipitation - Snow
  if (json.snow != undefined) {
    let snowObj = json.snow;
    let keys = Object.keys(snowObj);
    let values = Object.values(snowObj);
    if (keys[0] === "1h") {
      snow1h = values[0];
    } else if (keys[0] === "3h") {
      snow3h = values[0];
    }
    if (keys.length > 1) {
      if (keys[1] === "1h") {
        snow1h = values[1];
      } else if (keys[1] === "3h") {
        snow3h = values[1];
      }
    }
  } else {
    snow1h = 0;
    snow3h = 0;
  }
  if (snow1h === undefined) {snow1h = 0};
  if (snow3h === undefined) {snow3h = 0};
  precipitation1h = rain1h || snow1h;
  precipitation3h = rain3h || snow3h;

  // Date/Time of last weather update from API
  let dt = json.dt;
  let a = new Date(dt * 1000);
  const months1 = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  const months2 = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const months3 = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const months4 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let year1 = a.getFullYear();
  let year2str = String(year1).slice(-2);
  let year2 = Number(year2str);
  let month1 = months1[a.getMonth()];
  let month2 = months2[a.getMonth()];
  let month3 = months3[a.getMonth()];
  let month4 = months4[a.getMonth()];
  let date1 = a.getDate();
  let date2 = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
  let ampm1 = "AM";
  let ampm2 = "am";
  if (a.getHours() > 11) {
    ampm1 = "PM";
    ampm2 = "pm"
  }
  let hour1 = a.getHours();
  let hour2 = a.getHours();
  if (a.getHours() > 12) {
    hour2 = a.getHours() - 12;
  }
  if (a.getHours() == 0) {
    hour1 = 12;
    hour2 = 12;
  }
  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  // Sunrise and Sunset times
  let sr = json.sys.sunrise;
  let b = new Date(sr * 1000);
  let srhour = b.getHours() < 10 ? '0' + b.getHours() : b.getHours();
  let srmin = b.getMinutes() < 10 ? '0' + b.getMinutes() : b.getMinutes();
  let srsec = b.getSeconds() < 10 ? '0' + b.getSeconds() : b.getSeconds();
  let sunrise = srhour + ':' + srmin + ':' + srsec;
  let ss = json.sys.sunset;
  let c = new Date(ss * 1000);
  let sshour = c.getHours() < 10 ? '0' + c.getHours() : c.getHours();
  let ssmin = c.getMinutes() < 10 ? '0' + c.getMinutes() : c.getMinutes();
  let sssec = c.getSeconds() < 10 ? '0' + c.getSeconds() : c.getSeconds();
  let sunset = sshour + ':' + ssmin + ':' + sssec;
  // Location Name
  let name = json.name;
  // Latitude and Longitude
  let lat = json.coord.lat;
  let lon = json.coord.lon;

  // getWeather - Create weather data object 
  weatherData = {
    "status": "ok",
    "conditions": conditions,
    "conditionsEm": conditionsEm,
    "icon": iconUrl,
    "icon2x": iconUrl2x,
    "temp": temp,
    "feelsLike": feelsLike,
    "tempMin": tempMin,
    "tempMax": tempMax,
    "pressure": pressure,
    "humidity": humidity,
    "seaLevel": seaLevel,
    "groundLevel": groundLevel,
    "visibility": visibility,
    "windSpeed": windSpeed,
    "windSpeedms": windSpeedms,
    "windDirection": windDirection,
    "windGust": windGust,
    "clouds": clouds,
    "rain1h": rain1h,
    "rain3h": rain3h,
    "snow1h": snow1h,
    "snow3h": snow3h,
    "precipitation1h": precipitation1h,
    "precipitation3h": precipitation3h,
    "year1": year1,
    "year2": year2,
    "month1": month1,
    "month2": month2,
    "month3": month3,
    "month4": month4,
    "date1": date1,
    "date2": date2,
    "ampm1": ampm1,
    "ampm2": ampm2,
    "hour1": hour1,
    "hour2": hour2,
    "min": min,
    "sec": sec,
    "sunrise": sunrise,
    "sunset": sunset,
    "name": name,
    "latitude": lat,
    "longitude": lon,
    "aqiNum": aqiNumber,
    "aqiStr": aqiString
  }

  // getWeather - Create Formatted weather string 
  weatherString = format.replace(/%desc%/gmi, weatherData.conditions);
  weatherString = weatherString.replace(/%desc-em%/gmi, weatherData.conditionsEm);
  weatherString = weatherString.replace(/%icon%/gmi, `<img src=${weatherData.icon} />`);
  weatherString = weatherString.replace(/%icon2x%/gmi, `<img src=${weatherData.icon} />`);
  weatherString = weatherString.replace(/%temp%/gmi, weatherData.temp);
  weatherString = weatherString.replace(/%feels%/gmi, weatherData.feelsLike);
  weatherString = weatherString.replace(/%tempmin%/gmi, weatherData.tempMin);
  weatherString = weatherString.replace(/%tempmax%/gmi, weatherData.tempMax);
  weatherString = weatherString.replace(/%pressure%/gmi, weatherData.pressure);
  weatherString = weatherString.replace(/%humidity%/gmi, weatherData.humidity);
  weatherString = weatherString.replace(/%pressure-sl%/gmi, weatherData.seaLevel);
  weatherString = weatherString.replace(/%pressure-gl%/gmi, weatherData.groundLevel);
  weatherString = weatherString.replace(/%visibility%/gmi, weatherData.visibility);
  weatherString = weatherString.replace(/%wind-speed%/gmi, weatherData.windSpeed);
  weatherString = weatherString.replace(/%wind-speed-ms%/gmi, weatherData.windSpeedms);
  weatherString = weatherString.replace(/%wind-dir%/gmi, weatherData.windDirection);
  if (weatherData.windGust == "N/A") {
    weatherString = weatherString.replace(/\^.+\^/gmi, "");
  } else {
    weatherString = weatherString.replace(/%wind-gust%/gmi, weatherData.windGust);
    weatherString = weatherString.replace(/\^(.+)\^/gmi, "$1");
  }
  weatherString = weatherString.replace(/%clouds%/gmi, `${weatherData.clouds}`);
  weatherString = weatherString.replace(/%rain1h%/gmi, `${weatherData.rain1h}`);
  weatherString = weatherString.replace(/%rain3h%/gmi, `${weatherData.rain3h}`);
  weatherString = weatherString.replace(/%snow1h%/gmi, `${weatherData.snow1h}`);
  weatherString = weatherString.replace(/%snow3h%/gmi, `${weatherData.snow3h}`);
  weatherString = weatherString.replace(/%precipitation1h%/gmi, `${weatherData.precipitation1h}`);
  weatherString = weatherString.replace(/%precipitation3h%/gmi, `${weatherData.precipitation3h}`);
  weatherString = weatherString.replace(/%dateYear1%/gmi, `${weatherData.year1}`);
  weatherString = weatherString.replace(/%dateYear2%/gmi, `${weatherData.year2}`);
  weatherString = weatherString.replace(/%dateMonth1%/gmi, `${weatherData.month1}`);
  weatherString = weatherString.replace(/%dateMonth2%/gmi, `${weatherData.month2}`);
  weatherString = weatherString.replace(/%dateMonth3%/gmi, `${weatherData.month3}`);
  weatherString = weatherString.replace(/%dateMonth4%/gmi, `${weatherData.month4}`);
  weatherString = weatherString.replace(/%dateDay1%/gmi, `${weatherData.date1}`);
  weatherString = weatherString.replace(/%dateDay2%/gmi, `${weatherData.date2}`);
  weatherString = weatherString.replace(/%ampm1%/gmi, `${weatherData.ampm1}`);
  weatherString = weatherString.replace(/%ampm2%/gmi, `${weatherData.ampm2}`);
  weatherString = weatherString.replace(/%timeH1%/gmi, `${weatherData.hour1}`);
  weatherString = weatherString.replace(/%timeH2%/gmi, `${weatherData.hour2}`);
  weatherString = weatherString.replace(/%timeM%/gmi, `${weatherData.min}`);
  weatherString = weatherString.replace(/%timeS%/gmi, `${weatherData.sec}`);
  weatherString = weatherString.replace(/%sunrise%/gmi, `${weatherData.sunrise}`);
  weatherString = weatherString.replace(/%sunset%/gmi, `${weatherData.sunset}`);
  weatherString = weatherString.replace(/%name%/gmi, `${weatherData.name}`);
  weatherString = weatherString.replace(/%latitude%/gmi, `${weatherData.latitude}`);
  weatherString = weatherString.replace(/%longitude%/gmi, `${weatherData.longitude}`);
  weatherString = weatherString.replace(/%aqinumber%/gmi, `${weatherData.aqiNum}`);
  weatherString = weatherString.replace(/%aqistring%/gmi, `${weatherData.aqiStr}`);

  return weatherString;
}

  // // • getCardinalDirection - Converts the wind direction in degrees to text and returns the string value • 
  // getCardinalDirection(angle: number) {
  //   const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  //   return directions[Math.round(angle / 45) % 8];
  // }
