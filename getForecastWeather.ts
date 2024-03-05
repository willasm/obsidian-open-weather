import { fromUnixTime } from "date-fns"
//import { format } from "date-fns";
//import { getFullYear } from "date-fns";
//import { setDefaultOptions } from "date-fns";

// • getForecastWeather - Returns Air Qulity Index From API • 
export default async function getForecastWeather(key:any, latitude:any, longitude:any, language:any, units:any, format:any) {
  let weatherData;
  let weatherString;
  let url;
  let aqiNumber;
  let aqiString;
  let localeJson = {};

  // • Get Air Quality Index From API • 
  // let urlAQI = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`
  // if (latitude.length > 0 && longitude.length > 0 && key.length > 0) {
  //   let reqAQI = await fetch(urlAQI);
  //   let jsonAQI = await reqAQI.json();
  //   console.log('jsonAQI:', jsonAQI);
  //   if (jsonAQI.cod) {
  //     aqiNumber = 0;
  //     aqiString = "Air Quality Index is Not Available";
  //   } else {
  //     const aqiStringsArr = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  //     aqiNumber = jsonAQI.list[0].main.aqi;
  //     aqiString = aqiStringsArr[aqiNumber-1]
  //   };
  // } else {
  //   aqiNumber = 0;
  //   aqiString = "Air Quality Index is Not Available";
  // };

  // • Get Forecast Weather From API • 
  if (latitude.length > 0 && longitude.length > 0) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${key}&units=${units}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${this}&lang=${this}&appid=${key}&units=${units}`;
  };
  let req = await fetch(url);
  let json = await req.json();
  console.log('json:', json);
  if (json.cod != 200) {
    weatherString = "Error Code "+json.cod+": "+json.message;
    return weatherString;
  };

  // • Get Forecast Weather Data We Want With Local Time • 
  let listCount = json.cnt;
  let listForecasts = [];
  let todayDates = new Date().getDate();
  //  Add all 40 json entries into local array
  for (let idx = 0; idx < listCount; idx++) {
    let forecastObj = {
      "clouds": 0,
      "fyear": "",
      "fmonth": "",
      "fdate": "",
      "fhours": "",
      "fmins": "",
      "fsecs": "",
      "dt_localtime": "",   // year+'-'+month+'-'+date+' '+hours+':'+mins+':'+secs
      "d_localtime": "",    // year+'-'+month+'-'+date
      "ds_localtime": "",   // month+'-'+date
      "t_localtime": "",    // hours+':'+mins+':'+secs
      "ts_localtime": "",   // hours+':'+mins
      "main": {
        "feels_like": 0,
        "grnd_level": 0,
        "humidity": 0,
        "pressure": 0,
        "sea_level": 0,
        "temp": 0,
        "temp_kf": 0,
        "temp_max": 0,
        "temp_min": 0,
      },
      "pop": 0,
      "snow": 0,
      "rain": 0,
      "pod": "",    // Part of the day (n - night, d - day)
      "visibility": 0,
      "weather": {
        [0]:
          {
            "description": "",
            "descriptionem": "",
            "icon": "",
            "iconurl": "",
            "iconurl2x": "",
            "id": 0,
            "main": "",
          }
      },
      "wind": {
        "deg": 0,
        "dir": "",
        "gust": 0,
        "gustms": 0,
        "speed": 0,
        "speedms": 0
      }
    };

    // • Get Date and Time With Local Time • 
    let unix_timestamp = json.list[idx].dt;
    forecastObj.clouds = json.list[idx].clouds.all;
    let year = fromUnixTime(unix_timestamp).getFullYear().toString();
    forecastObj.fyear = year;
    let m = fromUnixTime(unix_timestamp).getMonth()+1;
    let month = '0'+m.toString().slice(-2);
    forecastObj.fmonth = month;
    let date = '0'+fromUnixTime(unix_timestamp).getDate();
    date = date.slice(-2);
    forecastObj.fdate = date;
    let hours = '0'+fromUnixTime(unix_timestamp).getHours();
    hours = hours.slice(-2);
    forecastObj.fhours = hours;
    let mins = '0'+fromUnixTime(unix_timestamp).getMinutes();
    mins = mins.slice(-2);
    forecastObj.fmins = mins;
    let secs = '0'+fromUnixTime(unix_timestamp).getSeconds();
    secs = secs.slice(-2);
    forecastObj.fsecs = secs;
    forecastObj.dt_localtime = year+'-'+month+'-'+date+' '+hours+':'+mins+':'+secs;
    forecastObj.d_localtime = year+'-'+month+'-'+date;
    forecastObj.ds_localtime = month+'-'+date;
    forecastObj.t_localtime = hours+':'+mins+':'+secs;
    forecastObj.ts_localtime = hours+':'+mins;

    forecastObj.main = json.list[idx].main;
    forecastObj.pop = json.list[idx].pop * 100;
    if (json.list[idx].rain == undefined) {
      forecastObj.rain = 0.0;
    } else {
      forecastObj.rain = json.list[idx].rain["3h"]
    };
    if (json.list[idx].snow == undefined) {
      forecastObj.snow = 0.0;
    } else {
      forecastObj.snow = json.list[idx].snow["3h"]
    };
    forecastObj.visibility = json.list[idx].visibility;
    forecastObj.pod = json.list[idx].sys.pod;
    forecastObj.weather = json.list[idx].weather;
    let id = json.list[idx].weather[0].id;
    let description = json.list[idx].weather[0].description.replace(/^\w|\s\w/g, (c: string) => c.toUpperCase());
    forecastObj.weather[0].description = description;
    let descriptionEm = '';
    if (id > 199 && id < 300) {
      descriptionEm = '⛈️';
    };
    if (id > 299 && id < 500) {
      descriptionEm = '🌦️';
    };
    if (id > 499 && id < 600) {
      descriptionEm = '🌧️';
    };
    if (id > 599 && id < 700) {
      descriptionEm = '❄️';
    };
    if (id > 699 && id < 800) {
      descriptionEm = '🌫️';
    };
    if (id == 771) {
      descriptionEm = '🌀';
    };
    if (id == 781) {
      descriptionEm = '🌪️';
    };
    if (id == 800) {
      descriptionEm = '🔆';
    };
    if (id > 800 && id < 804) {
      descriptionEm = '🌥️';
    };
    if (id == 804) {
      descriptionEm = '☁️';
    };
    forecastObj.weather[0].descriptionem = descriptionEm;
    let iconName = json.list[idx].weather[0].icon;
    const iconApi = await fetch('https://openweathermap.org/img/wn/' + iconName + '.png');
    const iconApi2x = await fetch('https://openweathermap.org/img/wn/' + iconName + '@2x.png');
    forecastObj.weather[0].iconurl = iconApi.url;
    forecastObj.weather[0].iconurl2x = iconApi2x.url;
  
//    forecastObj.wind = json.list[idx].wind;
    if (json.list[idx].wind == undefined) {
      forecastObj.wind.speed = 0;
      forecastObj.wind.speedms = 0;
      forecastObj.wind.deg = 0;
      forecastObj.wind.dir = "N/A";
      forecastObj.wind.gust = 0;
      forecastObj.wind.gustms = 0;
    };
    if (json.list[idx].wind.speed == undefined) {
      forecastObj.wind.speed = 0;
      forecastObj.wind.speedms = 0;
    } else {
      if (units == "metric") {
      forecastObj.wind.speed = Math.round(json.list[idx].wind.speed*3.6);
      forecastObj.wind.speedms = Math.round(json.list[idx].wind.speed);
      } else {
        forecastObj.wind.speed = Math.round(json.list[idx].wind.speed);
      };
    };
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    if (json.list[idx].wind.deg == undefined) {
      forecastObj.wind.deg = 0;
      forecastObj.wind.dir = 'N/A';
    } else {
      forecastObj.wind.deg = json.list[idx].wind.deg;
      forecastObj.wind.dir = directions[Math.round(json.list[idx].wind.deg / 45) % 8];
    };
    if (json.list[idx].wind.gust == undefined) {
      forecastObj.wind.gust = 0;
    } else {
      if (units == "metric") {
        forecastObj.wind.gust = Math.round(json.list[idx].wind.speed*3.6);
        forecastObj.wind.gustms = Math.round(json.list[idx].wind.gust);
      } else {
        forecastObj.wind.gust = Math.round(json.list[idx].wind.speed);
      };
    };

    // Push this 3 hour forecast to our array
    listForecasts.push(forecastObj);

  };
  console.log('listForecasts:', listForecasts);
  // Build Next Time Slice Strings
  let next12 = listForecasts[0].ds_localtime+' - '+listForecasts[0].ts_localtime+' '+listForecasts[0].weather[0].descriptionem+' '+listForecasts[0].weather[0].description+' Temp: '+Math.round(listForecasts[0].main.temp)+' Feels Like: '+Math.round(listForecasts[0].main.feels_like)+'\n'+
  listForecasts[1].ds_localtime+' - '+listForecasts[1].ts_localtime+' '+listForecasts[1].weather[0].descriptionem+' '+listForecasts[1].weather[0].description+' Temp: '+Math.round(listForecasts[1].main.temp)+' Feels Like: '+Math.round(listForecasts[1].main.feels_like)+'\n'+
  listForecasts[2].ds_localtime+' - '+listForecasts[2].ts_localtime+' '+listForecasts[2].weather[0].descriptionem+' '+listForecasts[2].weather[0].description+' Temp: '+Math.round(listForecasts[2].main.temp)+' Feels Like: '+Math.round(listForecasts[2].main.feels_like)+'\n'+
  listForecasts[3].ds_localtime+' - '+listForecasts[3].ts_localtime+' '+listForecasts[3].weather[0].descriptionem+' '+listForecasts[3].weather[0].description+' Temp: '+Math.round(listForecasts[3].main.temp)+' Feels Like: '+Math.round(listForecasts[3].main.feels_like)+'\n';
  let next24 = next12+listForecasts[4].ds_localtime+' - '+listForecasts[4].ts_localtime+' '+listForecasts[3].weather[0].descriptionem+' '+listForecasts[4].weather[0].description+' Temp: '+Math.round(listForecasts[4].main.temp)+' Feels Like: '+Math.round(listForecasts[4].main.feels_like)+'\n'+
  listForecasts[5].ds_localtime+' - '+listForecasts[5].ts_localtime+' '+listForecasts[5].weather[0].descriptionem+' '+listForecasts[5].weather[0].description+' Temp: '+Math.round(listForecasts[5].main.temp)+' Feels Like: '+Math.round(listForecasts[5].main.feels_like)+'\n'+
  listForecasts[6].ds_localtime+' - '+listForecasts[6].ts_localtime+' '+listForecasts[6].weather[0].descriptionem+' '+listForecasts[6].weather[0].description+' Temp: '+Math.round(listForecasts[6].main.temp)+' Feels Like: '+Math.round(listForecasts[6].main.feels_like)+'\n'+
  listForecasts[7].ds_localtime+' - '+listForecasts[7].ts_localtime+' '+listForecasts[7].weather[0].descriptionem+' '+listForecasts[7].weather[0].description+' Temp: '+Math.round(listForecasts[7].main.temp)+' Feels Like: '+Math.round(listForecasts[6].main.feels_like)+'\n';
  let next48 = next24+listForecasts[8].ds_localtime+' - '+listForecasts[8].ts_localtime+' '+listForecasts[8].weather[0].descriptionem+' '+listForecasts[8].weather[0].description+' Temp: '+Math.round(listForecasts[8].main.temp)+' Feels Like: '+Math.round(listForecasts[8].main.feels_like)+'\n'+
  listForecasts[9].ds_localtime+' - '+listForecasts[9].ts_localtime+' '+listForecasts[9].weather[0].descriptionem+' '+listForecasts[9].weather[0].description+' Temp: '+Math.round(listForecasts[9].main.temp)+' Feels Like: '+Math.round(listForecasts[9].main.feels_like)+'\n'+
  listForecasts[10].ds_localtime+' - '+listForecasts[10].ts_localtime+' '+listForecasts[10].weather[0].descriptionem+' '+listForecasts[10].weather[0].description+' Temp: '+Math.round(listForecasts[10].main.temp)+' Feels Like: '+Math.round(listForecasts[10].main.feels_like)+'\n'+
  listForecasts[11].ds_localtime+' - '+listForecasts[11].ts_localtime+' '+listForecasts[11].weather[0].descriptionem+' '+listForecasts[11].weather[0].description+' Temp: '+Math.round(listForecasts[11].main.temp)+' Feels Like: '+Math.round(listForecasts[11].main.feels_like)+'\n'+
  listForecasts[12].ds_localtime+' - '+listForecasts[12].ts_localtime+' '+listForecasts[12].weather[0].descriptionem+' '+listForecasts[12].weather[0].description+' Temp: '+Math.round(listForecasts[12].main.temp)+' Feels Like: '+Math.round(listForecasts[12].main.feels_like)+'\n'+
  listForecasts[13].ds_localtime+' - '+listForecasts[13].ts_localtime+' '+listForecasts[13].weather[0].descriptionem+' '+listForecasts[13].weather[0].description+' Temp: '+Math.round(listForecasts[13].main.temp)+' Feels Like: '+Math.round(listForecasts[13].main.feels_like)+'\n'+
  listForecasts[14].ds_localtime+' - '+listForecasts[14].ts_localtime+' '+listForecasts[14].weather[0].descriptionem+' '+listForecasts[14].weather[0].description+' Temp: '+Math.round(listForecasts[14].main.temp)+' Feels Like: '+Math.round(listForecasts[14].main.feels_like)+'\n'+
  listForecasts[15].ds_localtime+' - '+listForecasts[15].ts_localtime+' '+listForecasts[15].weather[0].descriptionem+' '+listForecasts[15].weather[0].description+' Temp: '+Math.round(listForecasts[15].main.temp)+' Feels Like: '+Math.round(listForecasts[15].main.feels_like)+'\n';

  // • Set Variables to Expose to Users • 

  // (%fyear_00% ... %fyear_39%)
  let fyear_00 = listForecasts[0].fyear;
  let fyear_01 = listForecasts[1].fyear;
  let fyear_02 = listForecasts[2].fyear;
  let fyear_03 = listForecasts[3].fyear;
  let fyear_04 = listForecasts[4].fyear;
  let fyear_05 = listForecasts[5].fyear;
  let fyear_06 = listForecasts[6].fyear;
  let fyear_07 = listForecasts[7].fyear;
  let fyear_08 = listForecasts[8].fyear;
  let fyear_09 = listForecasts[9].fyear;
  let fyear_10 = listForecasts[10].fyear;
  let fyear_11 = listForecasts[11].fyear;
  let fyear_12 = listForecasts[12].fyear;
  let fyear_13 = listForecasts[13].fyear;
  let fyear_14 = listForecasts[14].fyear;
  let fyear_15 = listForecasts[15].fyear;
  let fyear_16 = listForecasts[16].fyear;
  let fyear_17 = listForecasts[17].fyear;
  let fyear_18 = listForecasts[18].fyear;
  let fyear_19 = listForecasts[19].fyear;
  let fyear_20 = listForecasts[20].fyear;
  let fyear_21 = listForecasts[21].fyear;
  let fyear_22 = listForecasts[22].fyear;
  let fyear_23 = listForecasts[23].fyear;
  let fyear_24 = listForecasts[24].fyear;
  let fyear_25 = listForecasts[25].fyear;
  let fyear_26 = listForecasts[26].fyear;
  let fyear_27 = listForecasts[27].fyear;
  let fyear_28 = listForecasts[28].fyear;
  let fyear_29 = listForecasts[29].fyear;
  let fyear_30 = listForecasts[30].fyear;
  let fyear_31 = listForecasts[31].fyear;
  let fyear_32 = listForecasts[32].fyear;
  let fyear_33 = listForecasts[33].fyear;
  let fyear_34 = listForecasts[34].fyear;
  let fyear_35 = listForecasts[35].fyear;
  let fyear_36 = listForecasts[36].fyear;
  let fyear_37 = listForecasts[37].fyear;
  let fyear_38 = listForecasts[38].fyear;
  let fyear_39 = listForecasts[39].fyear;

  // (%fmonth_00% ... %fmonth_39%)
  let fmonth_00 = listForecasts[0].fmonth;
  let fmonth_01 = listForecasts[1].fmonth;
  let fmonth_02 = listForecasts[2].fmonth;
  let fmonth_03 = listForecasts[3].fmonth;
  let fmonth_04 = listForecasts[4].fmonth;
  let fmonth_05 = listForecasts[5].fmonth;
  let fmonth_06 = listForecasts[6].fmonth;
  let fmonth_07 = listForecasts[7].fmonth;
  let fmonth_08 = listForecasts[8].fmonth;
  let fmonth_09 = listForecasts[9].fmonth;
  let fmonth_10 = listForecasts[10].fmonth;
  let fmonth_11 = listForecasts[11].fmonth;
  let fmonth_12 = listForecasts[12].fmonth;
  let fmonth_13 = listForecasts[13].fmonth;
  let fmonth_14 = listForecasts[14].fmonth;
  let fmonth_15 = listForecasts[15].fmonth;
  let fmonth_16 = listForecasts[16].fmonth;
  let fmonth_17 = listForecasts[17].fmonth;
  let fmonth_18 = listForecasts[18].fmonth;
  let fmonth_19 = listForecasts[19].fmonth;
  let fmonth_20 = listForecasts[20].fmonth;
  let fmonth_21 = listForecasts[21].fmonth;
  let fmonth_22 = listForecasts[22].fmonth;
  let fmonth_23 = listForecasts[23].fmonth;
  let fmonth_24 = listForecasts[24].fmonth;
  let fmonth_25 = listForecasts[25].fmonth;
  let fmonth_26 = listForecasts[26].fmonth;
  let fmonth_27 = listForecasts[27].fmonth;
  let fmonth_28 = listForecasts[28].fmonth;
  let fmonth_29 = listForecasts[29].fmonth;
  let fmonth_30 = listForecasts[30].fmonth;
  let fmonth_31 = listForecasts[31].fmonth;
  let fmonth_32 = listForecasts[32].fmonth;
  let fmonth_33 = listForecasts[33].fmonth;
  let fmonth_34 = listForecasts[34].fmonth;
  let fmonth_35 = listForecasts[35].fmonth;
  let fmonth_36 = listForecasts[36].fmonth;
  let fmonth_37 = listForecasts[37].fmonth;
  let fmonth_38 = listForecasts[38].fmonth;
  let fmonth_39 = listForecasts[39].fmonth;

  // (%fdate_00% ... %fdate_39%)
  let fdate_00 = listForecasts[0].fdate;
  let fdate_01 = listForecasts[1].fdate;
  let fdate_02 = listForecasts[2].fdate;
  let fdate_03 = listForecasts[3].fdate;
  let fdate_04 = listForecasts[4].fdate;
  let fdate_05 = listForecasts[5].fdate;
  let fdate_06 = listForecasts[6].fdate;
  let fdate_07 = listForecasts[7].fdate;
  let fdate_08 = listForecasts[8].fdate;
  let fdate_09 = listForecasts[9].fdate;
  let fdate_10 = listForecasts[10].fdate;
  let fdate_11 = listForecasts[11].fdate;
  let fdate_12 = listForecasts[12].fdate;
  let fdate_13 = listForecasts[13].fdate;
  let fdate_14 = listForecasts[14].fdate;
  let fdate_15 = listForecasts[15].fdate;
  let fdate_16 = listForecasts[16].fdate;
  let fdate_17 = listForecasts[17].fdate;
  let fdate_18 = listForecasts[18].fdate;
  let fdate_19 = listForecasts[19].fdate;
  let fdate_20 = listForecasts[20].fdate;
  let fdate_21 = listForecasts[21].fdate;
  let fdate_22 = listForecasts[22].fdate;
  let fdate_23 = listForecasts[23].fdate;
  let fdate_24 = listForecasts[24].fdate;
  let fdate_25 = listForecasts[25].fdate;
  let fdate_26 = listForecasts[26].fdate;
  let fdate_27 = listForecasts[27].fdate;
  let fdate_28 = listForecasts[28].fdate;
  let fdate_29 = listForecasts[29].fdate;
  let fdate_30 = listForecasts[30].fdate;
  let fdate_31 = listForecasts[31].fdate;
  let fdate_32 = listForecasts[32].fdate;
  let fdate_33 = listForecasts[33].fdate;
  let fdate_34 = listForecasts[34].fdate;
  let fdate_35 = listForecasts[35].fdate;
  let fdate_36 = listForecasts[36].fdate;
  let fdate_37 = listForecasts[37].fdate;
  let fdate_38 = listForecasts[38].fdate;
  let fdate_39 = listForecasts[39].fdate;

  // (%fhours_00% ... %fhours_39%)
  let fhours_00 = listForecasts[0].fhours;
  let fhours_01 = listForecasts[1].fhours;
  let fhours_02 = listForecasts[2].fhours;
  let fhours_03 = listForecasts[3].fhours;
  let fhours_04 = listForecasts[4].fhours;
  let fhours_05 = listForecasts[5].fhours;
  let fhours_06 = listForecasts[6].fhours;
  let fhours_07 = listForecasts[7].fhours;
  let fhours_08 = listForecasts[8].fhours;
  let fhours_09 = listForecasts[9].fhours;
  let fhours_10 = listForecasts[10].fhours;
  let fhours_11 = listForecasts[11].fhours;
  let fhours_12 = listForecasts[12].fhours;
  let fhours_13 = listForecasts[13].fhours;
  let fhours_14 = listForecasts[14].fhours;
  let fhours_15 = listForecasts[15].fhours;
  let fhours_16 = listForecasts[16].fhours;
  let fhours_17 = listForecasts[17].fhours;
  let fhours_18 = listForecasts[18].fhours;
  let fhours_19 = listForecasts[19].fhours;
  let fhours_20 = listForecasts[20].fhours;
  let fhours_21 = listForecasts[21].fhours;
  let fhours_22 = listForecasts[22].fhours;
  let fhours_23 = listForecasts[23].fhours;
  let fhours_24 = listForecasts[24].fhours;
  let fhours_25 = listForecasts[25].fhours;
  let fhours_26 = listForecasts[26].fhours;
  let fhours_27 = listForecasts[27].fhours;
  let fhours_28 = listForecasts[28].fhours;
  let fhours_29 = listForecasts[29].fhours;
  let fhours_30 = listForecasts[30].fhours;
  let fhours_31 = listForecasts[31].fhours;
  let fhours_32 = listForecasts[32].fhours;
  let fhours_33 = listForecasts[33].fhours;
  let fhours_34 = listForecasts[34].fhours;
  let fhours_35 = listForecasts[35].fhours;
  let fhours_36 = listForecasts[36].fhours;
  let fhours_37 = listForecasts[37].fhours;
  let fhours_38 = listForecasts[38].fhours;
  let fhours_39 = listForecasts[39].fhours;

  // (%fmins_00% ... %fmins_39%)
  let fmins_00 = listForecasts[0].fmins;
  let fmins_01 = listForecasts[1].fmins;
  let fmins_02 = listForecasts[2].fmins;
  let fmins_03 = listForecasts[3].fmins;
  let fmins_04 = listForecasts[4].fmins;
  let fmins_05 = listForecasts[5].fmins;
  let fmins_06 = listForecasts[6].fmins;
  let fmins_07 = listForecasts[7].fmins;
  let fmins_08 = listForecasts[8].fmins;
  let fmins_09 = listForecasts[9].fmins;
  let fmins_10 = listForecasts[10].fmins;
  let fmins_11 = listForecasts[11].fmins;
  let fmins_12 = listForecasts[12].fmins;
  let fmins_13 = listForecasts[13].fmins;
  let fmins_14 = listForecasts[14].fmins;
  let fmins_15 = listForecasts[15].fmins;
  let fmins_16 = listForecasts[16].fmins;
  let fmins_17 = listForecasts[17].fmins;
  let fmins_18 = listForecasts[18].fmins;
  let fmins_19 = listForecasts[19].fmins;
  let fmins_20 = listForecasts[20].fmins;
  let fmins_21 = listForecasts[21].fmins;
  let fmins_22 = listForecasts[22].fmins;
  let fmins_23 = listForecasts[23].fmins;
  let fmins_24 = listForecasts[24].fmins;
  let fmins_25 = listForecasts[25].fmins;
  let fmins_26 = listForecasts[26].fmins;
  let fmins_27 = listForecasts[27].fmins;
  let fmins_28 = listForecasts[28].fmins;
  let fmins_29 = listForecasts[29].fmins;
  let fmins_30 = listForecasts[30].fmins;
  let fmins_31 = listForecasts[31].fmins;
  let fmins_32 = listForecasts[32].fmins;
  let fmins_33 = listForecasts[33].fmins;
  let fmins_34 = listForecasts[34].fmins;
  let fmins_35 = listForecasts[35].fmins;
  let fmins_36 = listForecasts[36].fmins;
  let fmins_37 = listForecasts[37].fmins;
  let fmins_38 = listForecasts[38].fmins;
  let fmins_39 = listForecasts[39].fmins;

  // (%fsecs_00% ... %fsecs_39%)
  let fsecs_00 = listForecasts[0].fsecs;
  let fsecs_01 = listForecasts[1].fsecs;
  let fsecs_02 = listForecasts[2].fsecs;
  let fsecs_03 = listForecasts[3].fsecs;
  let fsecs_04 = listForecasts[4].fsecs;
  let fsecs_05 = listForecasts[5].fsecs;
  let fsecs_06 = listForecasts[6].fsecs;
  let fsecs_07 = listForecasts[7].fsecs;
  let fsecs_08 = listForecasts[8].fsecs;
  let fsecs_09 = listForecasts[9].fsecs;
  let fsecs_10 = listForecasts[10].fsecs;
  let fsecs_11 = listForecasts[11].fsecs;
  let fsecs_12 = listForecasts[12].fsecs;
  let fsecs_13 = listForecasts[13].fsecs;
  let fsecs_14 = listForecasts[14].fsecs;
  let fsecs_15 = listForecasts[15].fsecs;
  let fsecs_16 = listForecasts[16].fsecs;
  let fsecs_17 = listForecasts[17].fsecs;
  let fsecs_18 = listForecasts[18].fsecs;
  let fsecs_19 = listForecasts[19].fsecs;
  let fsecs_20 = listForecasts[20].fsecs;
  let fsecs_21 = listForecasts[21].fsecs;
  let fsecs_22 = listForecasts[22].fsecs;
  let fsecs_23 = listForecasts[23].fsecs;
  let fsecs_24 = listForecasts[24].fsecs;
  let fsecs_25 = listForecasts[25].fsecs;
  let fsecs_26 = listForecasts[26].fsecs;
  let fsecs_27 = listForecasts[27].fsecs;
  let fsecs_28 = listForecasts[28].fsecs;
  let fsecs_29 = listForecasts[29].fsecs;
  let fsecs_30 = listForecasts[30].fsecs;
  let fsecs_31 = listForecasts[31].fsecs;
  let fsecs_32 = listForecasts[32].fsecs;
  let fsecs_33 = listForecasts[33].fsecs;
  let fsecs_34 = listForecasts[34].fsecs;
  let fsecs_35 = listForecasts[35].fsecs;
  let fsecs_36 = listForecasts[36].fsecs;
  let fsecs_37 = listForecasts[37].fsecs;
  let fsecs_38 = listForecasts[38].fsecs;
  let fsecs_39 = listForecasts[39].fsecs;

  // (%dt_localtime_00% ... %dt_localtime_39%)
  let dt_localtime_00 = listForecasts[0].dt_localtime;
  let dt_localtime_01 = listForecasts[1].dt_localtime;
  let dt_localtime_02 = listForecasts[2].dt_localtime;
  let dt_localtime_03 = listForecasts[3].dt_localtime;
  let dt_localtime_04 = listForecasts[4].dt_localtime;
  let dt_localtime_05 = listForecasts[5].dt_localtime;
  let dt_localtime_06 = listForecasts[6].dt_localtime;
  let dt_localtime_07 = listForecasts[7].dt_localtime;
  let dt_localtime_08 = listForecasts[8].dt_localtime;
  let dt_localtime_09 = listForecasts[9].dt_localtime;
  let dt_localtime_10 = listForecasts[10].dt_localtime;
  let dt_localtime_11 = listForecasts[11].dt_localtime;
  let dt_localtime_12 = listForecasts[12].dt_localtime;
  let dt_localtime_13 = listForecasts[13].dt_localtime;
  let dt_localtime_14 = listForecasts[14].dt_localtime;
  let dt_localtime_15 = listForecasts[15].dt_localtime;
  let dt_localtime_16 = listForecasts[16].dt_localtime;
  let dt_localtime_17 = listForecasts[17].dt_localtime;
  let dt_localtime_18 = listForecasts[18].dt_localtime;
  let dt_localtime_19 = listForecasts[19].dt_localtime;
  let dt_localtime_20 = listForecasts[20].dt_localtime;
  let dt_localtime_21 = listForecasts[21].dt_localtime;
  let dt_localtime_22 = listForecasts[22].dt_localtime;
  let dt_localtime_23 = listForecasts[23].dt_localtime;
  let dt_localtime_24 = listForecasts[24].dt_localtime;
  let dt_localtime_25 = listForecasts[25].dt_localtime;
  let dt_localtime_26 = listForecasts[26].dt_localtime;
  let dt_localtime_27 = listForecasts[27].dt_localtime;
  let dt_localtime_28 = listForecasts[28].dt_localtime;
  let dt_localtime_29 = listForecasts[29].dt_localtime;
  let dt_localtime_30 = listForecasts[30].dt_localtime;
  let dt_localtime_31 = listForecasts[31].dt_localtime;
  let dt_localtime_32 = listForecasts[32].dt_localtime;
  let dt_localtime_33 = listForecasts[33].dt_localtime;
  let dt_localtime_34 = listForecasts[34].dt_localtime;
  let dt_localtime_35 = listForecasts[35].dt_localtime;
  let dt_localtime_36 = listForecasts[36].dt_localtime;
  let dt_localtime_37 = listForecasts[37].dt_localtime;
  let dt_localtime_38 = listForecasts[38].dt_localtime;
  let dt_localtime_39 = listForecasts[39].dt_localtime;

  // (%d_localtime_00% ... %d_localtime_39%)
  let d_localtime_00 = listForecasts[0].d_localtime;
  let d_localtime_01 = listForecasts[1].d_localtime;
  let d_localtime_02 = listForecasts[2].d_localtime;
  let d_localtime_03 = listForecasts[3].d_localtime;
  let d_localtime_04 = listForecasts[4].d_localtime;
  let d_localtime_05 = listForecasts[5].d_localtime;
  let d_localtime_06 = listForecasts[6].d_localtime;
  let d_localtime_07 = listForecasts[7].d_localtime;
  let d_localtime_08 = listForecasts[8].d_localtime;
  let d_localtime_09 = listForecasts[9].d_localtime;
  let d_localtime_10 = listForecasts[10].d_localtime;
  let d_localtime_11 = listForecasts[11].d_localtime;
  let d_localtime_12 = listForecasts[12].d_localtime;
  let d_localtime_13 = listForecasts[13].d_localtime;
  let d_localtime_14 = listForecasts[14].d_localtime;
  let d_localtime_15 = listForecasts[15].d_localtime;
  let d_localtime_16 = listForecasts[16].d_localtime;
  let d_localtime_17 = listForecasts[17].d_localtime;
  let d_localtime_18 = listForecasts[18].d_localtime;
  let d_localtime_19 = listForecasts[19].d_localtime;
  let d_localtime_20 = listForecasts[20].d_localtime;
  let d_localtime_21 = listForecasts[21].d_localtime;
  let d_localtime_22 = listForecasts[22].d_localtime;
  let d_localtime_23 = listForecasts[23].d_localtime;
  let d_localtime_24 = listForecasts[24].d_localtime;
  let d_localtime_25 = listForecasts[25].d_localtime;
  let d_localtime_26 = listForecasts[26].d_localtime;
  let d_localtime_27 = listForecasts[27].d_localtime;
  let d_localtime_28 = listForecasts[28].d_localtime;
  let d_localtime_29 = listForecasts[29].d_localtime;
  let d_localtime_30 = listForecasts[30].d_localtime;
  let d_localtime_31 = listForecasts[31].d_localtime;
  let d_localtime_32 = listForecasts[32].d_localtime;
  let d_localtime_33 = listForecasts[33].d_localtime;
  let d_localtime_34 = listForecasts[34].d_localtime;
  let d_localtime_35 = listForecasts[35].d_localtime;
  let d_localtime_36 = listForecasts[36].d_localtime;
  let d_localtime_37 = listForecasts[37].d_localtime;
  let d_localtime_38 = listForecasts[38].d_localtime;
  let d_localtime_39 = listForecasts[39].d_localtime;

  // (%ds_localtime_00% ... %ds_localtime_39%)
  let ds_localtime_00 = listForecasts[0].ds_localtime;
  let ds_localtime_01 = listForecasts[1].ds_localtime;
  let ds_localtime_02 = listForecasts[2].ds_localtime;
  let ds_localtime_03 = listForecasts[3].ds_localtime;
  let ds_localtime_04 = listForecasts[4].ds_localtime;
  let ds_localtime_05 = listForecasts[5].ds_localtime;
  let ds_localtime_06 = listForecasts[6].ds_localtime;
  let ds_localtime_07 = listForecasts[7].ds_localtime;
  let ds_localtime_08 = listForecasts[8].ds_localtime;
  let ds_localtime_09 = listForecasts[9].ds_localtime;
  let ds_localtime_10 = listForecasts[10].ds_localtime;
  let ds_localtime_11 = listForecasts[11].ds_localtime;
  let ds_localtime_12 = listForecasts[12].ds_localtime;
  let ds_localtime_13 = listForecasts[13].ds_localtime;
  let ds_localtime_14 = listForecasts[14].ds_localtime;
  let ds_localtime_15 = listForecasts[15].ds_localtime;
  let ds_localtime_16 = listForecasts[16].ds_localtime;
  let ds_localtime_17 = listForecasts[17].ds_localtime;
  let ds_localtime_18 = listForecasts[18].ds_localtime;
  let ds_localtime_19 = listForecasts[19].ds_localtime;
  let ds_localtime_20 = listForecasts[20].ds_localtime;
  let ds_localtime_21 = listForecasts[21].ds_localtime;
  let ds_localtime_22 = listForecasts[22].ds_localtime;
  let ds_localtime_23 = listForecasts[23].ds_localtime;
  let ds_localtime_24 = listForecasts[24].ds_localtime;
  let ds_localtime_25 = listForecasts[25].ds_localtime;
  let ds_localtime_26 = listForecasts[26].ds_localtime;
  let ds_localtime_27 = listForecasts[27].ds_localtime;
  let ds_localtime_28 = listForecasts[28].ds_localtime;
  let ds_localtime_29 = listForecasts[29].ds_localtime;
  let ds_localtime_30 = listForecasts[30].ds_localtime;
  let ds_localtime_31 = listForecasts[31].ds_localtime;
  let ds_localtime_32 = listForecasts[32].ds_localtime;
  let ds_localtime_33 = listForecasts[33].ds_localtime;
  let ds_localtime_34 = listForecasts[34].ds_localtime;
  let ds_localtime_35 = listForecasts[35].ds_localtime;
  let ds_localtime_36 = listForecasts[36].ds_localtime;
  let ds_localtime_37 = listForecasts[37].ds_localtime;
  let ds_localtime_38 = listForecasts[38].ds_localtime;
  let ds_localtime_39 = listForecasts[39].ds_localtime;

  // (%t_localtime_00% ... %t_localtime_39%)
  let t_localtime_00 = listForecasts[0].t_localtime;
  let t_localtime_01 = listForecasts[1].t_localtime;
  let t_localtime_02 = listForecasts[2].t_localtime;
  let t_localtime_03 = listForecasts[3].t_localtime;
  let t_localtime_04 = listForecasts[4].t_localtime;
  let t_localtime_05 = listForecasts[5].t_localtime;
  let t_localtime_06 = listForecasts[6].t_localtime;
  let t_localtime_07 = listForecasts[7].t_localtime;
  let t_localtime_08 = listForecasts[8].t_localtime;
  let t_localtime_09 = listForecasts[9].t_localtime;
  let t_localtime_10 = listForecasts[10].t_localtime;
  let t_localtime_11 = listForecasts[11].t_localtime;
  let t_localtime_12 = listForecasts[12].t_localtime;
  let t_localtime_13 = listForecasts[13].t_localtime;
  let t_localtime_14 = listForecasts[14].t_localtime;
  let t_localtime_15 = listForecasts[15].t_localtime;
  let t_localtime_16 = listForecasts[16].t_localtime;
  let t_localtime_17 = listForecasts[17].t_localtime;
  let t_localtime_18 = listForecasts[18].t_localtime;
  let t_localtime_19 = listForecasts[19].t_localtime;
  let t_localtime_20 = listForecasts[20].t_localtime;
  let t_localtime_21 = listForecasts[21].t_localtime;
  let t_localtime_22 = listForecasts[22].t_localtime;
  let t_localtime_23 = listForecasts[23].t_localtime;
  let t_localtime_24 = listForecasts[24].t_localtime;
  let t_localtime_25 = listForecasts[25].t_localtime;
  let t_localtime_26 = listForecasts[26].t_localtime;
  let t_localtime_27 = listForecasts[27].t_localtime;
  let t_localtime_28 = listForecasts[28].t_localtime;
  let t_localtime_29 = listForecasts[29].t_localtime;
  let t_localtime_30 = listForecasts[30].t_localtime;
  let t_localtime_31 = listForecasts[31].t_localtime;
  let t_localtime_32 = listForecasts[32].t_localtime;
  let t_localtime_33 = listForecasts[33].t_localtime;
  let t_localtime_34 = listForecasts[34].t_localtime;
  let t_localtime_35 = listForecasts[35].t_localtime;
  let t_localtime_36 = listForecasts[36].t_localtime;
  let t_localtime_37 = listForecasts[37].t_localtime;
  let t_localtime_38 = listForecasts[38].t_localtime;
  let t_localtime_39 = listForecasts[39].t_localtime;

  // (%ts_localtime_00% ... %ts_localtime_39%)
  let ts_localtime_00 = listForecasts[0].ts_localtime;
  let ts_localtime_01 = listForecasts[1].ts_localtime;
  let ts_localtime_02 = listForecasts[2].ts_localtime;
  let ts_localtime_03 = listForecasts[3].ts_localtime;
  let ts_localtime_04 = listForecasts[4].ts_localtime;
  let ts_localtime_05 = listForecasts[5].ts_localtime;
  let ts_localtime_06 = listForecasts[6].ts_localtime;
  let ts_localtime_07 = listForecasts[7].ts_localtime;
  let ts_localtime_08 = listForecasts[8].ts_localtime;
  let ts_localtime_09 = listForecasts[9].ts_localtime;
  let ts_localtime_10 = listForecasts[10].ts_localtime;
  let ts_localtime_11 = listForecasts[11].ts_localtime;
  let ts_localtime_12 = listForecasts[12].ts_localtime;
  let ts_localtime_13 = listForecasts[13].ts_localtime;
  let ts_localtime_14 = listForecasts[14].ts_localtime;
  let ts_localtime_15 = listForecasts[15].ts_localtime;
  let ts_localtime_16 = listForecasts[16].ts_localtime;
  let ts_localtime_17 = listForecasts[17].ts_localtime;
  let ts_localtime_18 = listForecasts[18].ts_localtime;
  let ts_localtime_19 = listForecasts[19].ts_localtime;
  let ts_localtime_20 = listForecasts[20].ts_localtime;
  let ts_localtime_21 = listForecasts[21].ts_localtime;
  let ts_localtime_22 = listForecasts[22].ts_localtime;
  let ts_localtime_23 = listForecasts[23].ts_localtime;
  let ts_localtime_24 = listForecasts[24].ts_localtime;
  let ts_localtime_25 = listForecasts[25].ts_localtime;
  let ts_localtime_26 = listForecasts[26].ts_localtime;
  let ts_localtime_27 = listForecasts[27].ts_localtime;
  let ts_localtime_28 = listForecasts[28].ts_localtime;
  let ts_localtime_29 = listForecasts[29].ts_localtime;
  let ts_localtime_30 = listForecasts[30].ts_localtime;
  let ts_localtime_31 = listForecasts[31].ts_localtime;
  let ts_localtime_32 = listForecasts[32].ts_localtime;
  let ts_localtime_33 = listForecasts[33].ts_localtime;
  let ts_localtime_34 = listForecasts[34].ts_localtime;
  let ts_localtime_35 = listForecasts[35].ts_localtime;
  let ts_localtime_36 = listForecasts[36].ts_localtime;
  let ts_localtime_37 = listForecasts[37].ts_localtime;
  let ts_localtime_38 = listForecasts[38].ts_localtime;
  let ts_localtime_39 = listForecasts[39].ts_localtime;

  // (%ftemp_00% ... %ftemp_39%)
  let ftemp_00 = Math.round(listForecasts[0].main.temp);
  let ftemp_01 = Math.round(listForecasts[1].main.temp);
  let ftemp_02 = Math.round(listForecasts[2].main.temp);
  let ftemp_03 = Math.round(listForecasts[3].main.temp);
  let ftemp_04 = Math.round(listForecasts[4].main.temp);
  let ftemp_05 = Math.round(listForecasts[5].main.temp);
  let ftemp_06 = Math.round(listForecasts[6].main.temp);
  let ftemp_07 = Math.round(listForecasts[7].main.temp);
  let ftemp_08 = Math.round(listForecasts[8].main.temp);
  let ftemp_09 = Math.round(listForecasts[9].main.temp);
  let ftemp_10 = Math.round(listForecasts[10].main.temp);
  let ftemp_11 = Math.round(listForecasts[11].main.temp);
  let ftemp_12 = Math.round(listForecasts[12].main.temp);
  let ftemp_13 = Math.round(listForecasts[13].main.temp);
  let ftemp_14 = Math.round(listForecasts[14].main.temp);
  let ftemp_15 = Math.round(listForecasts[15].main.temp);
  let ftemp_16 = Math.round(listForecasts[16].main.temp);
  let ftemp_17 = Math.round(listForecasts[17].main.temp);
  let ftemp_18 = Math.round(listForecasts[18].main.temp);
  let ftemp_19 = Math.round(listForecasts[19].main.temp);
  let ftemp_20 = Math.round(listForecasts[20].main.temp);
  let ftemp_21 = Math.round(listForecasts[21].main.temp);
  let ftemp_22 = Math.round(listForecasts[22].main.temp);
  let ftemp_23 = Math.round(listForecasts[23].main.temp);
  let ftemp_24 = Math.round(listForecasts[24].main.temp);
  let ftemp_25 = Math.round(listForecasts[25].main.temp);
  let ftemp_26 = Math.round(listForecasts[26].main.temp);
  let ftemp_27 = Math.round(listForecasts[27].main.temp);
  let ftemp_28 = Math.round(listForecasts[28].main.temp);
  let ftemp_29 = Math.round(listForecasts[29].main.temp);
  let ftemp_30 = Math.round(listForecasts[30].main.temp);
  let ftemp_31 = Math.round(listForecasts[31].main.temp);
  let ftemp_32 = Math.round(listForecasts[32].main.temp);
  let ftemp_33 = Math.round(listForecasts[33].main.temp);
  let ftemp_34 = Math.round(listForecasts[34].main.temp);
  let ftemp_35 = Math.round(listForecasts[35].main.temp);
  let ftemp_36 = Math.round(listForecasts[36].main.temp);
  let ftemp_37 = Math.round(listForecasts[37].main.temp);
  let ftemp_38 = Math.round(listForecasts[38].main.temp);
  let ftemp_39 = Math.round(listForecasts[39].main.temp);

  // (%ffeels_00% ... %ffeels_39%) 
  let ffeelslike_00 = Math.round(listForecasts[0].main.feels_like);
  let ffeelslike_01 = Math.round(listForecasts[1].main.feels_like);
  let ffeelslike_02 = Math.round(listForecasts[2].main.feels_like);
  let ffeelslike_03 = Math.round(listForecasts[3].main.feels_like);
  let ffeelslike_04 = Math.round(listForecasts[4].main.feels_like);
  let ffeelslike_05 = Math.round(listForecasts[5].main.feels_like);
  let ffeelslike_06 = Math.round(listForecasts[6].main.feels_like);
  let ffeelslike_07 = Math.round(listForecasts[7].main.feels_like);
  let ffeelslike_08 = Math.round(listForecasts[8].main.feels_like);
  let ffeelslike_09 = Math.round(listForecasts[9].main.feels_like);
  let ffeelslike_10 = Math.round(listForecasts[10].main.feels_like);
  let ffeelslike_11 = Math.round(listForecasts[11].main.feels_like);
  let ffeelslike_12 = Math.round(listForecasts[12].main.feels_like);
  let ffeelslike_13 = Math.round(listForecasts[13].main.feels_like);
  let ffeelslike_14 = Math.round(listForecasts[14].main.feels_like);
  let ffeelslike_15 = Math.round(listForecasts[15].main.feels_like);
  let ffeelslike_16 = Math.round(listForecasts[16].main.feels_like);
  let ffeelslike_17 = Math.round(listForecasts[17].main.feels_like);
  let ffeelslike_18 = Math.round(listForecasts[18].main.feels_like);
  let ffeelslike_19 = Math.round(listForecasts[19].main.feels_like);
  let ffeelslike_20 = Math.round(listForecasts[20].main.feels_like);
  let ffeelslike_21 = Math.round(listForecasts[21].main.feels_like);
  let ffeelslike_22 = Math.round(listForecasts[22].main.feels_like);
  let ffeelslike_23 = Math.round(listForecasts[23].main.feels_like);
  let ffeelslike_24 = Math.round(listForecasts[24].main.feels_like);
  let ffeelslike_25 = Math.round(listForecasts[25].main.feels_like);
  let ffeelslike_26 = Math.round(listForecasts[26].main.feels_like);
  let ffeelslike_27 = Math.round(listForecasts[27].main.feels_like);
  let ffeelslike_28 = Math.round(listForecasts[28].main.feels_like);
  let ffeelslike_29 = Math.round(listForecasts[29].main.feels_like);
  let ffeelslike_30 = Math.round(listForecasts[30].main.feels_like);
  let ffeelslike_31 = Math.round(listForecasts[31].main.feels_like);
  let ffeelslike_32 = Math.round(listForecasts[32].main.feels_like);
  let ffeelslike_33 = Math.round(listForecasts[33].main.feels_like);
  let ffeelslike_34 = Math.round(listForecasts[34].main.feels_like);
  let ffeelslike_35 = Math.round(listForecasts[35].main.feels_like);
  let ffeelslike_36 = Math.round(listForecasts[36].main.feels_like);
  let ffeelslike_37 = Math.round(listForecasts[37].main.feels_like);
  let ffeelslike_38 = Math.round(listForecasts[38].main.feels_like);
  let ffeelslike_39 = Math.round(listForecasts[39].main.feels_like);

  // (%fclouds_00% ... %fclouds_39%)
  let fclouds_00 = listForecasts[0].clouds;
  let fclouds_01 = listForecasts[1].clouds;
  let fclouds_02 = listForecasts[2].clouds;
  let fclouds_03 = listForecasts[3].clouds;
  let fclouds_04 = listForecasts[4].clouds;
  let fclouds_05 = listForecasts[5].clouds;
  let fclouds_06 = listForecasts[6].clouds;
  let fclouds_07 = listForecasts[7].clouds;
  let fclouds_08 = listForecasts[8].clouds;
  let fclouds_09 = listForecasts[9].clouds;
  let fclouds_10 = listForecasts[10].clouds;
  let fclouds_11 = listForecasts[11].clouds;
  let fclouds_12 = listForecasts[12].clouds;
  let fclouds_13 = listForecasts[13].clouds;
  let fclouds_14 = listForecasts[14].clouds;
  let fclouds_15 = listForecasts[15].clouds;
  let fclouds_16 = listForecasts[16].clouds;
  let fclouds_17 = listForecasts[17].clouds;
  let fclouds_18 = listForecasts[18].clouds;
  let fclouds_19 = listForecasts[19].clouds;
  let fclouds_20 = listForecasts[20].clouds;
  let fclouds_21 = listForecasts[21].clouds;
  let fclouds_22 = listForecasts[22].clouds;
  let fclouds_23 = listForecasts[23].clouds;
  let fclouds_24 = listForecasts[24].clouds;
  let fclouds_25 = listForecasts[25].clouds;
  let fclouds_26 = listForecasts[26].clouds;
  let fclouds_27 = listForecasts[27].clouds;
  let fclouds_28 = listForecasts[28].clouds;
  let fclouds_29 = listForecasts[29].clouds;
  let fclouds_30 = listForecasts[30].clouds;
  let fclouds_31 = listForecasts[31].clouds;
  let fclouds_32 = listForecasts[32].clouds;
  let fclouds_33 = listForecasts[33].clouds;
  let fclouds_34 = listForecasts[34].clouds;
  let fclouds_35 = listForecasts[35].clouds;
  let fclouds_36 = listForecasts[36].clouds;
  let fclouds_37 = listForecasts[37].clouds;
  let fclouds_38 = listForecasts[38].clouds;
  let fclouds_39 = listForecasts[39].clouds;

  // (%fpop_00% ... %fpop_39%)
  let fpop_00 = listForecasts[0].pop
  let fpop_01 = listForecasts[1].pop
  let fpop_02 = listForecasts[2].pop
  let fpop_03 = listForecasts[3].pop
  let fpop_04 = listForecasts[4].pop
  let fpop_05 = listForecasts[5].pop
  let fpop_06 = listForecasts[6].pop
  let fpop_07 = listForecasts[7].pop
  let fpop_08 = listForecasts[8].pop
  let fpop_09 = listForecasts[9].pop
  let fpop_10 = listForecasts[10].pop;
  let fpop_11 = listForecasts[11].pop;
  let fpop_12 = listForecasts[12].pop;
  let fpop_13 = listForecasts[13].pop;
  let fpop_14 = listForecasts[14].pop;
  let fpop_15 = listForecasts[15].pop;
  let fpop_16 = listForecasts[16].pop;
  let fpop_17 = listForecasts[17].pop;
  let fpop_18 = listForecasts[18].pop;
  let fpop_19 = listForecasts[19].pop;
  let fpop_20 = listForecasts[20].pop;
  let fpop_21 = listForecasts[21].pop;
  let fpop_22 = listForecasts[22].pop;
  let fpop_23 = listForecasts[23].pop;
  let fpop_24 = listForecasts[24].pop;
  let fpop_25 = listForecasts[25].pop;
  let fpop_26 = listForecasts[26].pop;
  let fpop_27 = listForecasts[27].pop;
  let fpop_28 = listForecasts[28].pop;
  let fpop_29 = listForecasts[29].pop;
  let fpop_30 = listForecasts[30].pop;
  let fpop_31 = listForecasts[31].pop;
  let fpop_32 = listForecasts[32].pop;
  let fpop_33 = listForecasts[33].pop;
  let fpop_34 = listForecasts[34].pop;
  let fpop_35 = listForecasts[35].pop;
  let fpop_36 = listForecasts[36].pop;
  let fpop_37 = listForecasts[37].pop;
  let fpop_38 = listForecasts[38].pop;
  let fpop_39 = listForecasts[39].pop;

  // (%fpod_00% ... %fpod_39%)
  let fpod_00 = listForecasts[0].pod
  let fpod_01 = listForecasts[1].pod
  let fpod_02 = listForecasts[2].pod
  let fpod_03 = listForecasts[3].pod
  let fpod_04 = listForecasts[4].pod
  let fpod_05 = listForecasts[5].pod
  let fpod_06 = listForecasts[6].pod
  let fpod_07 = listForecasts[7].pod
  let fpod_08 = listForecasts[8].pod
  let fpod_09 = listForecasts[9].pod
  let fpod_10 = listForecasts[10].pod;
  let fpod_11 = listForecasts[11].pod;
  let fpod_12 = listForecasts[12].pod;
  let fpod_13 = listForecasts[13].pod;
  let fpod_14 = listForecasts[14].pod;
  let fpod_15 = listForecasts[15].pod;
  let fpod_16 = listForecasts[16].pod;
  let fpod_17 = listForecasts[17].pod;
  let fpod_18 = listForecasts[18].pod;
  let fpod_19 = listForecasts[19].pod;
  let fpod_20 = listForecasts[20].pod;
  let fpod_21 = listForecasts[21].pod;
  let fpod_22 = listForecasts[22].pod;
  let fpod_23 = listForecasts[23].pod;
  let fpod_24 = listForecasts[24].pod;
  let fpod_25 = listForecasts[25].pod;
  let fpod_26 = listForecasts[26].pod;
  let fpod_27 = listForecasts[27].pod;
  let fpod_28 = listForecasts[28].pod;
  let fpod_29 = listForecasts[29].pod;
  let fpod_30 = listForecasts[30].pod;
  let fpod_31 = listForecasts[31].pod;
  let fpod_32 = listForecasts[32].pod;
  let fpod_33 = listForecasts[33].pod;
  let fpod_34 = listForecasts[34].pod;
  let fpod_35 = listForecasts[35].pod;
  let fpod_36 = listForecasts[36].pod;
  let fpod_37 = listForecasts[37].pod;
  let fpod_38 = listForecasts[38].pod;
  let fpod_39 = listForecasts[39].pod;

  // (%fvis_00% ... %fvis_39%)
  let fvis_00 = listForecasts[0].visibility
  let fvis_01 = listForecasts[1].visibility
  let fvis_02 = listForecasts[2].visibility
  let fvis_03 = listForecasts[3].visibility
  let fvis_04 = listForecasts[4].visibility
  let fvis_05 = listForecasts[5].visibility
  let fvis_06 = listForecasts[6].visibility
  let fvis_07 = listForecasts[7].visibility
  let fvis_08 = listForecasts[8].visibility
  let fvis_09 = listForecasts[9].visibility
  let fvis_10 = listForecasts[10].visibility;
  let fvis_11 = listForecasts[11].visibility;
  let fvis_12 = listForecasts[12].visibility;
  let fvis_13 = listForecasts[13].visibility;
  let fvis_14 = listForecasts[14].visibility;
  let fvis_15 = listForecasts[15].visibility;
  let fvis_16 = listForecasts[16].visibility;
  let fvis_17 = listForecasts[17].visibility;
  let fvis_18 = listForecasts[18].visibility;
  let fvis_19 = listForecasts[19].visibility;
  let fvis_20 = listForecasts[20].visibility;
  let fvis_21 = listForecasts[21].visibility;
  let fvis_22 = listForecasts[22].visibility;
  let fvis_23 = listForecasts[23].visibility;
  let fvis_24 = listForecasts[24].visibility;
  let fvis_25 = listForecasts[25].visibility;
  let fvis_26 = listForecasts[26].visibility;
  let fvis_27 = listForecasts[27].visibility;
  let fvis_28 = listForecasts[28].visibility;
  let fvis_29 = listForecasts[29].visibility;
  let fvis_30 = listForecasts[30].visibility;
  let fvis_31 = listForecasts[31].visibility;
  let fvis_32 = listForecasts[32].visibility;
  let fvis_33 = listForecasts[33].visibility;
  let fvis_34 = listForecasts[34].visibility;
  let fvis_35 = listForecasts[35].visibility;
  let fvis_36 = listForecasts[36].visibility;
  let fvis_37 = listForecasts[37].visibility;
  let fvis_38 = listForecasts[38].visibility;
  let fvis_39 = listForecasts[39].visibility;

  // (%fhum_00% ... %fhum_39%)
  let fhum_00 = listForecasts[0].main.humidity
  let fhum_01 = listForecasts[1].main.humidity
  let fhum_02 = listForecasts[2].main.humidity
  let fhum_03 = listForecasts[3].main.humidity
  let fhum_04 = listForecasts[4].main.humidity
  let fhum_05 = listForecasts[5].main.humidity
  let fhum_06 = listForecasts[6].main.humidity
  let fhum_07 = listForecasts[7].main.humidity
  let fhum_08 = listForecasts[8].main.humidity
  let fhum_09 = listForecasts[9].main.humidity
  let fhum_10 = listForecasts[10].main.humidity;
  let fhum_11 = listForecasts[11].main.humidity;
  let fhum_12 = listForecasts[12].main.humidity;
  let fhum_13 = listForecasts[13].main.humidity;
  let fhum_14 = listForecasts[14].main.humidity;
  let fhum_15 = listForecasts[15].main.humidity;
  let fhum_16 = listForecasts[16].main.humidity;
  let fhum_17 = listForecasts[17].main.humidity;
  let fhum_18 = listForecasts[18].main.humidity;
  let fhum_19 = listForecasts[19].main.humidity;
  let fhum_20 = listForecasts[20].main.humidity;
  let fhum_21 = listForecasts[21].main.humidity;
  let fhum_22 = listForecasts[22].main.humidity;
  let fhum_23 = listForecasts[23].main.humidity;
  let fhum_24 = listForecasts[24].main.humidity;
  let fhum_25 = listForecasts[25].main.humidity;
  let fhum_26 = listForecasts[26].main.humidity;
  let fhum_27 = listForecasts[27].main.humidity;
  let fhum_28 = listForecasts[28].main.humidity;
  let fhum_29 = listForecasts[29].main.humidity;
  let fhum_30 = listForecasts[30].main.humidity;
  let fhum_31 = listForecasts[31].main.humidity;
  let fhum_32 = listForecasts[32].main.humidity;
  let fhum_33 = listForecasts[33].main.humidity;
  let fhum_34 = listForecasts[34].main.humidity;
  let fhum_35 = listForecasts[35].main.humidity;
  let fhum_36 = listForecasts[36].main.humidity;
  let fhum_37 = listForecasts[37].main.humidity;
  let fhum_38 = listForecasts[38].main.humidity;
  let fhum_39 = listForecasts[39].main.humidity;

  // (%ftempmax_00% ... %ftempmax_39%)
  let ftempmax_00 = Math.round(listForecasts[0].main.temp_max)
  let ftempmax_01 = Math.round(listForecasts[1].main.temp_max)
  let ftempmax_02 = Math.round(listForecasts[2].main.temp_max)
  let ftempmax_03 = Math.round(listForecasts[3].main.temp_max)
  let ftempmax_04 = Math.round(listForecasts[4].main.temp_max)
  let ftempmax_05 = Math.round(listForecasts[5].main.temp_max)
  let ftempmax_06 = Math.round(listForecasts[6].main.temp_max)
  let ftempmax_07 = Math.round(listForecasts[7].main.temp_max)
  let ftempmax_08 = Math.round(listForecasts[8].main.temp_max)
  let ftempmax_09 = Math.round(listForecasts[9].main.temp_max)
  let ftempmax_10 = Math.round(listForecasts[10].main.temp_max);
  let ftempmax_11 = Math.round(listForecasts[11].main.temp_max);
  let ftempmax_12 = Math.round(listForecasts[12].main.temp_max);
  let ftempmax_13 = Math.round(listForecasts[13].main.temp_max);
  let ftempmax_14 = Math.round(listForecasts[14].main.temp_max);
  let ftempmax_15 = Math.round(listForecasts[15].main.temp_max);
  let ftempmax_16 = Math.round(listForecasts[16].main.temp_max);
  let ftempmax_17 = Math.round(listForecasts[17].main.temp_max);
  let ftempmax_18 = Math.round(listForecasts[18].main.temp_max);
  let ftempmax_19 = Math.round(listForecasts[19].main.temp_max);
  let ftempmax_20 = Math.round(listForecasts[20].main.temp_max);
  let ftempmax_21 = Math.round(listForecasts[21].main.temp_max);
  let ftempmax_22 = Math.round(listForecasts[22].main.temp_max);
  let ftempmax_23 = Math.round(listForecasts[23].main.temp_max);
  let ftempmax_24 = Math.round(listForecasts[24].main.temp_max);
  let ftempmax_25 = Math.round(listForecasts[25].main.temp_max);
  let ftempmax_26 = Math.round(listForecasts[26].main.temp_max);
  let ftempmax_27 = Math.round(listForecasts[27].main.temp_max);
  let ftempmax_28 = Math.round(listForecasts[28].main.temp_max);
  let ftempmax_29 = Math.round(listForecasts[29].main.temp_max);
  let ftempmax_30 = Math.round(listForecasts[30].main.temp_max);
  let ftempmax_31 = Math.round(listForecasts[31].main.temp_max);
  let ftempmax_32 = Math.round(listForecasts[32].main.temp_max);
  let ftempmax_33 = Math.round(listForecasts[33].main.temp_max);
  let ftempmax_34 = Math.round(listForecasts[34].main.temp_max);
  let ftempmax_35 = Math.round(listForecasts[35].main.temp_max);
  let ftempmax_36 = Math.round(listForecasts[36].main.temp_max);
  let ftempmax_37 = Math.round(listForecasts[37].main.temp_max);
  let ftempmax_38 = Math.round(listForecasts[38].main.temp_max);
  let ftempmax_39 = Math.round(listForecasts[39].main.temp_max);

  // (%ftempmin_00% ... %ftempmin_39%)
  let ftempmin_00 = Math.round(listForecasts[0].main.temp_min);
  let ftempmin_01 = Math.round(listForecasts[1].main.temp_min);
  let ftempmin_02 = Math.round(listForecasts[2].main.temp_min);
  let ftempmin_03 = Math.round(listForecasts[3].main.temp_min);
  let ftempmin_04 = Math.round(listForecasts[4].main.temp_min);
  let ftempmin_05 = Math.round(listForecasts[5].main.temp_min);
  let ftempmin_06 = Math.round(listForecasts[6].main.temp_min);
  let ftempmin_07 = Math.round(listForecasts[7].main.temp_min);
  let ftempmin_08 = Math.round(listForecasts[8].main.temp_min);
  let ftempmin_09 = Math.round(listForecasts[9].main.temp_min);
  let ftempmin_10 = Math.round(listForecasts[10].main.temp_min);
  let ftempmin_11 = Math.round(listForecasts[11].main.temp_min);
  let ftempmin_12 = Math.round(listForecasts[12].main.temp_min);
  let ftempmin_13 = Math.round(listForecasts[13].main.temp_min);
  let ftempmin_14 = Math.round(listForecasts[14].main.temp_min);
  let ftempmin_15 = Math.round(listForecasts[15].main.temp_min);
  let ftempmin_16 = Math.round(listForecasts[16].main.temp_min);
  let ftempmin_17 = Math.round(listForecasts[17].main.temp_min);
  let ftempmin_18 = Math.round(listForecasts[18].main.temp_min);
  let ftempmin_19 = Math.round(listForecasts[19].main.temp_min);
  let ftempmin_20 = Math.round(listForecasts[20].main.temp_min);
  let ftempmin_21 = Math.round(listForecasts[21].main.temp_min);
  let ftempmin_22 = Math.round(listForecasts[22].main.temp_min);
  let ftempmin_23 = Math.round(listForecasts[23].main.temp_min);
  let ftempmin_24 = Math.round(listForecasts[24].main.temp_min);
  let ftempmin_25 = Math.round(listForecasts[25].main.temp_min);
  let ftempmin_26 = Math.round(listForecasts[26].main.temp_min);
  let ftempmin_27 = Math.round(listForecasts[27].main.temp_min);
  let ftempmin_28 = Math.round(listForecasts[28].main.temp_min);
  let ftempmin_29 = Math.round(listForecasts[29].main.temp_min);
  let ftempmin_30 = Math.round(listForecasts[30].main.temp_min);
  let ftempmin_31 = Math.round(listForecasts[31].main.temp_min);
  let ftempmin_32 = Math.round(listForecasts[32].main.temp_min);
  let ftempmin_33 = Math.round(listForecasts[33].main.temp_min);
  let ftempmin_34 = Math.round(listForecasts[34].main.temp_min);
  let ftempmin_35 = Math.round(listForecasts[35].main.temp_min);
  let ftempmin_36 = Math.round(listForecasts[36].main.temp_min);
  let ftempmin_37 = Math.round(listForecasts[37].main.temp_min);
  let ftempmin_38 = Math.round(listForecasts[38].main.temp_min);
  let ftempmin_39 = Math.round(listForecasts[39].main.temp_min);

  // (%fground_00% ... %fground_39%)
  let fground_00 = listForecasts[0].main.grnd_level;
  let fground_01 = listForecasts[1].main.grnd_level;
  let fground_02 = listForecasts[2].main.grnd_level;
  let fground_03 = listForecasts[3].main.grnd_level;
  let fground_04 = listForecasts[4].main.grnd_level;
  let fground_05 = listForecasts[5].main.grnd_level;
  let fground_06 = listForecasts[6].main.grnd_level;
  let fground_07 = listForecasts[7].main.grnd_level;
  let fground_08 = listForecasts[8].main.grnd_level;
  let fground_09 = listForecasts[9].main.grnd_level;
  let fground_10 = listForecasts[10].main.grnd_level;
  let fground_11 = listForecasts[11].main.grnd_level;
  let fground_12 = listForecasts[12].main.grnd_level;
  let fground_13 = listForecasts[13].main.grnd_level;
  let fground_14 = listForecasts[14].main.grnd_level;
  let fground_15 = listForecasts[15].main.grnd_level;
  let fground_16 = listForecasts[16].main.grnd_level;
  let fground_17 = listForecasts[17].main.grnd_level;
  let fground_18 = listForecasts[18].main.grnd_level;
  let fground_19 = listForecasts[19].main.grnd_level;
  let fground_20 = listForecasts[20].main.grnd_level;
  let fground_21 = listForecasts[21].main.grnd_level;
  let fground_22 = listForecasts[22].main.grnd_level;
  let fground_23 = listForecasts[23].main.grnd_level;
  let fground_24 = listForecasts[24].main.grnd_level;
  let fground_25 = listForecasts[25].main.grnd_level;
  let fground_26 = listForecasts[26].main.grnd_level;
  let fground_27 = listForecasts[27].main.grnd_level;
  let fground_28 = listForecasts[28].main.grnd_level;
  let fground_29 = listForecasts[29].main.grnd_level;
  let fground_30 = listForecasts[30].main.grnd_level;
  let fground_31 = listForecasts[31].main.grnd_level;
  let fground_32 = listForecasts[32].main.grnd_level;
  let fground_33 = listForecasts[33].main.grnd_level;
  let fground_34 = listForecasts[34].main.grnd_level;
  let fground_35 = listForecasts[35].main.grnd_level;
  let fground_36 = listForecasts[36].main.grnd_level;
  let fground_37 = listForecasts[37].main.grnd_level;
  let fground_38 = listForecasts[38].main.grnd_level;
  let fground_39 = listForecasts[39].main.grnd_level;

  // (%fsea_00% ... %fsea_39%)
  let fsea_00 = listForecasts[0].main.sea_level;
  let fsea_01 = listForecasts[1].main.sea_level;
  let fsea_02 = listForecasts[2].main.sea_level;
  let fsea_03 = listForecasts[3].main.sea_level;
  let fsea_04 = listForecasts[4].main.sea_level;
  let fsea_05 = listForecasts[5].main.sea_level;
  let fsea_06 = listForecasts[6].main.sea_level;
  let fsea_07 = listForecasts[7].main.sea_level;
  let fsea_08 = listForecasts[8].main.sea_level;
  let fsea_09 = listForecasts[9].main.sea_level;
  let fsea_10 = listForecasts[10].main.sea_level;
  let fsea_11 = listForecasts[11].main.sea_level;
  let fsea_12 = listForecasts[12].main.sea_level;
  let fsea_13 = listForecasts[13].main.sea_level;
  let fsea_14 = listForecasts[14].main.sea_level;
  let fsea_15 = listForecasts[15].main.sea_level;
  let fsea_16 = listForecasts[16].main.sea_level;
  let fsea_17 = listForecasts[17].main.sea_level;
  let fsea_18 = listForecasts[18].main.sea_level;
  let fsea_19 = listForecasts[19].main.sea_level;
  let fsea_20 = listForecasts[20].main.sea_level;
  let fsea_21 = listForecasts[21].main.sea_level;
  let fsea_22 = listForecasts[22].main.sea_level;
  let fsea_23 = listForecasts[23].main.sea_level;
  let fsea_24 = listForecasts[24].main.sea_level;
  let fsea_25 = listForecasts[25].main.sea_level;
  let fsea_26 = listForecasts[26].main.sea_level;
  let fsea_27 = listForecasts[27].main.sea_level;
  let fsea_28 = listForecasts[28].main.sea_level;
  let fsea_29 = listForecasts[29].main.sea_level;
  let fsea_30 = listForecasts[30].main.sea_level;
  let fsea_31 = listForecasts[31].main.sea_level;
  let fsea_32 = listForecasts[32].main.sea_level;
  let fsea_33 = listForecasts[33].main.sea_level;
  let fsea_34 = listForecasts[34].main.sea_level;
  let fsea_35 = listForecasts[35].main.sea_level;
  let fsea_36 = listForecasts[36].main.sea_level;
  let fsea_37 = listForecasts[37].main.sea_level;
  let fsea_38 = listForecasts[38].main.sea_level;
  let fsea_39 = listForecasts[39].main.sea_level;

  // (%fdesc_00% ... %fdesc_39%)
  let fdesc_00 = listForecasts[0].weather[0].description;
  let fdesc_01 = listForecasts[1].weather[0].description;
  let fdesc_02 = listForecasts[2].weather[0].description;
  let fdesc_03 = listForecasts[3].weather[0].description;
  let fdesc_04 = listForecasts[4].weather[0].description;
  let fdesc_05 = listForecasts[5].weather[0].description;
  let fdesc_06 = listForecasts[6].weather[0].description;
  let fdesc_07 = listForecasts[7].weather[0].description;
  let fdesc_08 = listForecasts[8].weather[0].description;
  let fdesc_09 = listForecasts[9].weather[0].description;
  let fdesc_10 = listForecasts[10].weather[0].description;
  let fdesc_11 = listForecasts[11].weather[0].description;
  let fdesc_12 = listForecasts[12].weather[0].description;
  let fdesc_13 = listForecasts[13].weather[0].description;
  let fdesc_14 = listForecasts[14].weather[0].description;
  let fdesc_15 = listForecasts[15].weather[0].description;
  let fdesc_16 = listForecasts[16].weather[0].description;
  let fdesc_17 = listForecasts[17].weather[0].description;
  let fdesc_18 = listForecasts[18].weather[0].description;
  let fdesc_19 = listForecasts[19].weather[0].description;
  let fdesc_20 = listForecasts[20].weather[0].description;
  let fdesc_21 = listForecasts[21].weather[0].description;
  let fdesc_22 = listForecasts[22].weather[0].description;
  let fdesc_23 = listForecasts[23].weather[0].description;
  let fdesc_24 = listForecasts[24].weather[0].description;
  let fdesc_25 = listForecasts[25].weather[0].description;
  let fdesc_26 = listForecasts[26].weather[0].description;
  let fdesc_27 = listForecasts[27].weather[0].description;
  let fdesc_28 = listForecasts[28].weather[0].description;
  let fdesc_29 = listForecasts[29].weather[0].description;
  let fdesc_30 = listForecasts[30].weather[0].description;
  let fdesc_31 = listForecasts[31].weather[0].description;
  let fdesc_32 = listForecasts[32].weather[0].description;
  let fdesc_33 = listForecasts[33].weather[0].description;
  let fdesc_34 = listForecasts[34].weather[0].description;
  let fdesc_35 = listForecasts[35].weather[0].description;
  let fdesc_36 = listForecasts[36].weather[0].description;
  let fdesc_37 = listForecasts[37].weather[0].description;
  let fdesc_38 = listForecasts[38].weather[0].description;
  let fdesc_39 = listForecasts[39].weather[0].description;

  // (%fmaindesc_00% ... %fmaindesc_39%)
  let fmaindesc_00 = listForecasts[0].weather[0].main;
  let fmaindesc_01 = listForecasts[1].weather[0].main;
  let fmaindesc_02 = listForecasts[2].weather[0].main;
  let fmaindesc_03 = listForecasts[3].weather[0].main;
  let fmaindesc_04 = listForecasts[4].weather[0].main;
  let fmaindesc_05 = listForecasts[5].weather[0].main;
  let fmaindesc_06 = listForecasts[6].weather[0].main;
  let fmaindesc_07 = listForecasts[7].weather[0].main;
  let fmaindesc_08 = listForecasts[8].weather[0].main;
  let fmaindesc_09 = listForecasts[9].weather[0].main;
  let fmaindesc_10 = listForecasts[10].weather[0].main;
  let fmaindesc_11 = listForecasts[11].weather[0].main;
  let fmaindesc_12 = listForecasts[12].weather[0].main;
  let fmaindesc_13 = listForecasts[13].weather[0].main;
  let fmaindesc_14 = listForecasts[14].weather[0].main;
  let fmaindesc_15 = listForecasts[15].weather[0].main;
  let fmaindesc_16 = listForecasts[16].weather[0].main;
  let fmaindesc_17 = listForecasts[17].weather[0].main;
  let fmaindesc_18 = listForecasts[18].weather[0].main;
  let fmaindesc_19 = listForecasts[19].weather[0].main;
  let fmaindesc_20 = listForecasts[20].weather[0].main;
  let fmaindesc_21 = listForecasts[21].weather[0].main;
  let fmaindesc_22 = listForecasts[22].weather[0].main;
  let fmaindesc_23 = listForecasts[23].weather[0].main;
  let fmaindesc_24 = listForecasts[24].weather[0].main;
  let fmaindesc_25 = listForecasts[25].weather[0].main;
  let fmaindesc_26 = listForecasts[26].weather[0].main;
  let fmaindesc_27 = listForecasts[27].weather[0].main;
  let fmaindesc_28 = listForecasts[28].weather[0].main;
  let fmaindesc_29 = listForecasts[29].weather[0].main;
  let fmaindesc_30 = listForecasts[30].weather[0].main;
  let fmaindesc_31 = listForecasts[31].weather[0].main;
  let fmaindesc_32 = listForecasts[32].weather[0].main;
  let fmaindesc_33 = listForecasts[33].weather[0].main;
  let fmaindesc_34 = listForecasts[34].weather[0].main;
  let fmaindesc_35 = listForecasts[35].weather[0].main;
  let fmaindesc_36 = listForecasts[36].weather[0].main;
  let fmaindesc_37 = listForecasts[37].weather[0].main;
  let fmaindesc_38 = listForecasts[38].weather[0].main;
  let fmaindesc_39 = listForecasts[39].weather[0].main;

  // (%fdescem_00% ... %fdescem_39%)
  let fdescem_00 = listForecasts[0].weather[0].descriptionem;
  let fdescem_01 = listForecasts[1].weather[0].descriptionem;
  let fdescem_02 = listForecasts[2].weather[0].descriptionem;
  let fdescem_03 = listForecasts[3].weather[0].descriptionem;
  let fdescem_04 = listForecasts[4].weather[0].descriptionem;
  let fdescem_05 = listForecasts[5].weather[0].descriptionem;
  let fdescem_06 = listForecasts[6].weather[0].descriptionem;
  let fdescem_07 = listForecasts[7].weather[0].descriptionem;
  let fdescem_08 = listForecasts[8].weather[0].descriptionem;
  let fdescem_09 = listForecasts[9].weather[0].descriptionem;
  let fdescem_10 = listForecasts[10].weather[0].descriptionem;
  let fdescem_11 = listForecasts[11].weather[0].descriptionem;
  let fdescem_12 = listForecasts[12].weather[0].descriptionem;
  let fdescem_13 = listForecasts[13].weather[0].descriptionem;
  let fdescem_14 = listForecasts[14].weather[0].descriptionem;
  let fdescem_15 = listForecasts[15].weather[0].descriptionem;
  let fdescem_16 = listForecasts[16].weather[0].descriptionem;
  let fdescem_17 = listForecasts[17].weather[0].descriptionem;
  let fdescem_18 = listForecasts[18].weather[0].descriptionem;
  let fdescem_19 = listForecasts[19].weather[0].descriptionem;
  let fdescem_20 = listForecasts[20].weather[0].descriptionem;
  let fdescem_21 = listForecasts[21].weather[0].descriptionem;
  let fdescem_22 = listForecasts[22].weather[0].descriptionem;
  let fdescem_23 = listForecasts[23].weather[0].descriptionem;
  let fdescem_24 = listForecasts[24].weather[0].descriptionem;
  let fdescem_25 = listForecasts[25].weather[0].descriptionem;
  let fdescem_26 = listForecasts[26].weather[0].descriptionem;
  let fdescem_27 = listForecasts[27].weather[0].descriptionem;
  let fdescem_28 = listForecasts[28].weather[0].descriptionem;
  let fdescem_29 = listForecasts[29].weather[0].descriptionem;
  let fdescem_30 = listForecasts[30].weather[0].descriptionem;
  let fdescem_31 = listForecasts[31].weather[0].descriptionem;
  let fdescem_32 = listForecasts[32].weather[0].descriptionem;
  let fdescem_33 = listForecasts[33].weather[0].descriptionem;
  let fdescem_34 = listForecasts[34].weather[0].descriptionem;
  let fdescem_35 = listForecasts[35].weather[0].descriptionem;
  let fdescem_36 = listForecasts[36].weather[0].descriptionem;
  let fdescem_37 = listForecasts[37].weather[0].descriptionem;
  let fdescem_38 = listForecasts[38].weather[0].descriptionem;
  let fdescem_39 = listForecasts[39].weather[0].descriptionem;

  // (%ficonurl_00% ... %ficonurl_39%)
  let ficonurl_00 = listForecasts[0].weather[0].iconurl;
  let ficonurl_01 = listForecasts[1].weather[0].iconurl;
  let ficonurl_02 = listForecasts[2].weather[0].iconurl;
  let ficonurl_03 = listForecasts[3].weather[0].iconurl;
  let ficonurl_04 = listForecasts[4].weather[0].iconurl;
  let ficonurl_05 = listForecasts[5].weather[0].iconurl;
  let ficonurl_06 = listForecasts[6].weather[0].iconurl;
  let ficonurl_07 = listForecasts[7].weather[0].iconurl;
  let ficonurl_08 = listForecasts[8].weather[0].iconurl;
  let ficonurl_09 = listForecasts[9].weather[0].iconurl;
  let ficonurl_10 = listForecasts[10].weather[0].iconurl;
  let ficonurl_11 = listForecasts[11].weather[0].iconurl;
  let ficonurl_12 = listForecasts[12].weather[0].iconurl;
  let ficonurl_13 = listForecasts[13].weather[0].iconurl;
  let ficonurl_14 = listForecasts[14].weather[0].iconurl;
  let ficonurl_15 = listForecasts[15].weather[0].iconurl;
  let ficonurl_16 = listForecasts[16].weather[0].iconurl;
  let ficonurl_17 = listForecasts[17].weather[0].iconurl;
  let ficonurl_18 = listForecasts[18].weather[0].iconurl;
  let ficonurl_19 = listForecasts[19].weather[0].iconurl;
  let ficonurl_20 = listForecasts[20].weather[0].iconurl;
  let ficonurl_21 = listForecasts[21].weather[0].iconurl;
  let ficonurl_22 = listForecasts[22].weather[0].iconurl;
  let ficonurl_23 = listForecasts[23].weather[0].iconurl;
  let ficonurl_24 = listForecasts[24].weather[0].iconurl;
  let ficonurl_25 = listForecasts[25].weather[0].iconurl;
  let ficonurl_26 = listForecasts[26].weather[0].iconurl;
  let ficonurl_27 = listForecasts[27].weather[0].iconurl;
  let ficonurl_28 = listForecasts[28].weather[0].iconurl;
  let ficonurl_29 = listForecasts[29].weather[0].iconurl;
  let ficonurl_30 = listForecasts[30].weather[0].iconurl;
  let ficonurl_31 = listForecasts[31].weather[0].iconurl;
  let ficonurl_32 = listForecasts[32].weather[0].iconurl;
  let ficonurl_33 = listForecasts[33].weather[0].iconurl;
  let ficonurl_34 = listForecasts[34].weather[0].iconurl;
  let ficonurl_35 = listForecasts[35].weather[0].iconurl;
  let ficonurl_36 = listForecasts[36].weather[0].iconurl;
  let ficonurl_37 = listForecasts[37].weather[0].iconurl;
  let ficonurl_38 = listForecasts[38].weather[0].iconurl;
  let ficonurl_39 = listForecasts[39].weather[0].iconurl;

  // (%ficonurl2x_00% ... %ficonurl2x_39%)
  let ficonurl2x_00 = listForecasts[0].weather[0].iconurl2x;
  let ficonurl2x_01 = listForecasts[1].weather[0].iconurl2x;
  let ficonurl2x_02 = listForecasts[2].weather[0].iconurl2x;
  let ficonurl2x_03 = listForecasts[3].weather[0].iconurl2x;
  let ficonurl2x_04 = listForecasts[4].weather[0].iconurl2x;
  let ficonurl2x_05 = listForecasts[5].weather[0].iconurl2x;
  let ficonurl2x_06 = listForecasts[6].weather[0].iconurl2x;
  let ficonurl2x_07 = listForecasts[7].weather[0].iconurl2x;
  let ficonurl2x_08 = listForecasts[8].weather[0].iconurl2x;
  let ficonurl2x_09 = listForecasts[9].weather[0].iconurl2x;
  let ficonurl2x_10 = listForecasts[10].weather[0].iconurl2x;
  let ficonurl2x_11 = listForecasts[11].weather[0].iconurl2x;
  let ficonurl2x_12 = listForecasts[12].weather[0].iconurl2x;
  let ficonurl2x_13 = listForecasts[13].weather[0].iconurl2x;
  let ficonurl2x_14 = listForecasts[14].weather[0].iconurl2x;
  let ficonurl2x_15 = listForecasts[15].weather[0].iconurl2x;
  let ficonurl2x_16 = listForecasts[16].weather[0].iconurl2x;
  let ficonurl2x_17 = listForecasts[17].weather[0].iconurl2x;
  let ficonurl2x_18 = listForecasts[18].weather[0].iconurl2x;
  let ficonurl2x_19 = listForecasts[19].weather[0].iconurl2x;
  let ficonurl2x_20 = listForecasts[20].weather[0].iconurl2x;
  let ficonurl2x_21 = listForecasts[21].weather[0].iconurl2x;
  let ficonurl2x_22 = listForecasts[22].weather[0].iconurl2x;
  let ficonurl2x_23 = listForecasts[23].weather[0].iconurl2x;
  let ficonurl2x_24 = listForecasts[24].weather[0].iconurl2x;
  let ficonurl2x_25 = listForecasts[25].weather[0].iconurl2x;
  let ficonurl2x_26 = listForecasts[26].weather[0].iconurl2x;
  let ficonurl2x_27 = listForecasts[27].weather[0].iconurl2x;
  let ficonurl2x_28 = listForecasts[28].weather[0].iconurl2x;
  let ficonurl2x_29 = listForecasts[29].weather[0].iconurl2x;
  let ficonurl2x_30 = listForecasts[30].weather[0].iconurl2x;
  let ficonurl2x_31 = listForecasts[31].weather[0].iconurl2x;
  let ficonurl2x_32 = listForecasts[32].weather[0].iconurl2x;
  let ficonurl2x_33 = listForecasts[33].weather[0].iconurl2x;
  let ficonurl2x_34 = listForecasts[34].weather[0].iconurl2x;
  let ficonurl2x_35 = listForecasts[35].weather[0].iconurl2x;
  let ficonurl2x_36 = listForecasts[36].weather[0].iconurl2x;
  let ficonurl2x_37 = listForecasts[37].weather[0].iconurl2x;
  let ficonurl2x_38 = listForecasts[38].weather[0].iconurl2x;
  let ficonurl2x_39 = listForecasts[39].weather[0].iconurl2x;

  // (%fwindspeed_00% ... %fwindspeed_39%)
  let fwindspeed_00 = listForecasts[0].wind.speed;
  let fwindspeed_01 = listForecasts[1].wind.speed;
  let fwindspeed_02 = listForecasts[2].wind.speed;
  let fwindspeed_03 = listForecasts[3].wind.speed;
  let fwindspeed_04 = listForecasts[4].wind.speed;
  let fwindspeed_05 = listForecasts[5].wind.speed;
  let fwindspeed_06 = listForecasts[6].wind.speed;
  let fwindspeed_07 = listForecasts[7].wind.speed;
  let fwindspeed_08 = listForecasts[8].wind.speed;
  let fwindspeed_09 = listForecasts[9].wind.speed;
  let fwindspeed_10 = listForecasts[10].wind.speed;
  let fwindspeed_11 = listForecasts[11].wind.speed;
  let fwindspeed_12 = listForecasts[12].wind.speed;
  let fwindspeed_13 = listForecasts[13].wind.speed;
  let fwindspeed_14 = listForecasts[14].wind.speed;
  let fwindspeed_15 = listForecasts[15].wind.speed;
  let fwindspeed_16 = listForecasts[16].wind.speed;
  let fwindspeed_17 = listForecasts[17].wind.speed;
  let fwindspeed_18 = listForecasts[18].wind.speed;
  let fwindspeed_19 = listForecasts[19].wind.speed;
  let fwindspeed_20 = listForecasts[20].wind.speed;
  let fwindspeed_21 = listForecasts[21].wind.speed;
  let fwindspeed_22 = listForecasts[22].wind.speed;
  let fwindspeed_23 = listForecasts[23].wind.speed;
  let fwindspeed_24 = listForecasts[24].wind.speed;
  let fwindspeed_25 = listForecasts[25].wind.speed;
  let fwindspeed_26 = listForecasts[26].wind.speed;
  let fwindspeed_27 = listForecasts[27].wind.speed;
  let fwindspeed_28 = listForecasts[28].wind.speed;
  let fwindspeed_29 = listForecasts[29].wind.speed;
  let fwindspeed_30 = listForecasts[30].wind.speed;
  let fwindspeed_31 = listForecasts[31].wind.speed;
  let fwindspeed_32 = listForecasts[32].wind.speed;
  let fwindspeed_33 = listForecasts[33].wind.speed;
  let fwindspeed_34 = listForecasts[34].wind.speed;
  let fwindspeed_35 = listForecasts[35].wind.speed;
  let fwindspeed_36 = listForecasts[36].wind.speed;
  let fwindspeed_37 = listForecasts[37].wind.speed;
  let fwindspeed_38 = listForecasts[38].wind.speed;
  let fwindspeed_39 = listForecasts[39].wind.speed;

  // (%fwindspeedms_00% ... %fwindspeedms_39%)
  let fwindspeedms_00 = listForecasts[0].wind.speedms;
  let fwindspeedms_01 = listForecasts[1].wind.speedms;
  let fwindspeedms_02 = listForecasts[2].wind.speedms;
  let fwindspeedms_03 = listForecasts[3].wind.speedms;
  let fwindspeedms_04 = listForecasts[4].wind.speedms;
  let fwindspeedms_05 = listForecasts[5].wind.speedms;
  let fwindspeedms_06 = listForecasts[6].wind.speedms;
  let fwindspeedms_07 = listForecasts[7].wind.speedms;
  let fwindspeedms_08 = listForecasts[8].wind.speedms;
  let fwindspeedms_09 = listForecasts[9].wind.speedms;
  let fwindspeedms_10 = listForecasts[10].wind.speedms;
  let fwindspeedms_11 = listForecasts[11].wind.speedms;
  let fwindspeedms_12 = listForecasts[12].wind.speedms;
  let fwindspeedms_13 = listForecasts[13].wind.speedms;
  let fwindspeedms_14 = listForecasts[14].wind.speedms;
  let fwindspeedms_15 = listForecasts[15].wind.speedms;
  let fwindspeedms_16 = listForecasts[16].wind.speedms;
  let fwindspeedms_17 = listForecasts[17].wind.speedms;
  let fwindspeedms_18 = listForecasts[18].wind.speedms;
  let fwindspeedms_19 = listForecasts[19].wind.speedms;
  let fwindspeedms_20 = listForecasts[20].wind.speedms;
  let fwindspeedms_21 = listForecasts[21].wind.speedms;
  let fwindspeedms_22 = listForecasts[22].wind.speedms;
  let fwindspeedms_23 = listForecasts[23].wind.speedms;
  let fwindspeedms_24 = listForecasts[24].wind.speedms;
  let fwindspeedms_25 = listForecasts[25].wind.speedms;
  let fwindspeedms_26 = listForecasts[26].wind.speedms;
  let fwindspeedms_27 = listForecasts[27].wind.speedms;
  let fwindspeedms_28 = listForecasts[28].wind.speedms;
  let fwindspeedms_29 = listForecasts[29].wind.speedms;
  let fwindspeedms_30 = listForecasts[30].wind.speedms;
  let fwindspeedms_31 = listForecasts[31].wind.speedms;
  let fwindspeedms_32 = listForecasts[32].wind.speedms;
  let fwindspeedms_33 = listForecasts[33].wind.speedms;
  let fwindspeedms_34 = listForecasts[34].wind.speedms;
  let fwindspeedms_35 = listForecasts[35].wind.speedms;
  let fwindspeedms_36 = listForecasts[36].wind.speedms;
  let fwindspeedms_37 = listForecasts[37].wind.speedms;
  let fwindspeedms_38 = listForecasts[38].wind.speedms;
  let fwindspeedms_39 = listForecasts[39].wind.speedms;

  // (%fwinddeg_00% ... %fwindspeeddeg_39%)
  let fwinddeg_00 = listForecasts[0].wind.deg;
  let fwinddeg_01 = listForecasts[1].wind.deg;
  let fwinddeg_02 = listForecasts[2].wind.deg;
  let fwinddeg_03 = listForecasts[3].wind.deg;
  let fwinddeg_04 = listForecasts[4].wind.deg;
  let fwinddeg_05 = listForecasts[5].wind.deg;
  let fwinddeg_06 = listForecasts[6].wind.deg;
  let fwinddeg_07 = listForecasts[7].wind.deg;
  let fwinddeg_08 = listForecasts[8].wind.deg;
  let fwinddeg_09 = listForecasts[9].wind.deg;
  let fwinddeg_10 = listForecasts[10].wind.deg;
  let fwinddeg_11 = listForecasts[11].wind.deg;
  let fwinddeg_12 = listForecasts[12].wind.deg;
  let fwinddeg_13 = listForecasts[13].wind.deg;
  let fwinddeg_14 = listForecasts[14].wind.deg;
  let fwinddeg_15 = listForecasts[15].wind.deg;
  let fwinddeg_16 = listForecasts[16].wind.deg;
  let fwinddeg_17 = listForecasts[17].wind.deg;
  let fwinddeg_18 = listForecasts[18].wind.deg;
  let fwinddeg_19 = listForecasts[19].wind.deg;
  let fwinddeg_20 = listForecasts[20].wind.deg;
  let fwinddeg_21 = listForecasts[21].wind.deg;
  let fwinddeg_22 = listForecasts[22].wind.deg;
  let fwinddeg_23 = listForecasts[23].wind.deg;
  let fwinddeg_24 = listForecasts[24].wind.deg;
  let fwinddeg_25 = listForecasts[25].wind.deg;
  let fwinddeg_26 = listForecasts[26].wind.deg;
  let fwinddeg_27 = listForecasts[27].wind.deg;
  let fwinddeg_28 = listForecasts[28].wind.deg;
  let fwinddeg_29 = listForecasts[29].wind.deg;
  let fwinddeg_30 = listForecasts[30].wind.deg;
  let fwinddeg_31 = listForecasts[31].wind.deg;
  let fwinddeg_32 = listForecasts[32].wind.deg;
  let fwinddeg_33 = listForecasts[33].wind.deg;
  let fwinddeg_34 = listForecasts[34].wind.deg;
  let fwinddeg_35 = listForecasts[35].wind.deg;
  let fwinddeg_36 = listForecasts[36].wind.deg;
  let fwinddeg_37 = listForecasts[37].wind.deg;
  let fwinddeg_38 = listForecasts[38].wind.deg;
  let fwinddeg_39 = listForecasts[39].wind.deg;

  //(%fwinddir_00% ... %fwinddir_39%)
  let fwinddir_00 = listForecasts[0].wind.dir;
  let fwinddir_01 = listForecasts[1].wind.dir;
  let fwinddir_02 = listForecasts[2].wind.dir;
  let fwinddir_03 = listForecasts[3].wind.dir;
  let fwinddir_04 = listForecasts[4].wind.dir;
  let fwinddir_05 = listForecasts[5].wind.dir;
  let fwinddir_06 = listForecasts[6].wind.dir;
  let fwinddir_07 = listForecasts[7].wind.dir;
  let fwinddir_08 = listForecasts[8].wind.dir;
  let fwinddir_09 = listForecasts[9].wind.dir;
  let fwinddir_10 = listForecasts[10].wind.dir;
  let fwinddir_11 = listForecasts[11].wind.dir;
  let fwinddir_12 = listForecasts[12].wind.dir;
  let fwinddir_13 = listForecasts[13].wind.dir;
  let fwinddir_14 = listForecasts[14].wind.dir;
  let fwinddir_15 = listForecasts[15].wind.dir;
  let fwinddir_16 = listForecasts[16].wind.dir;
  let fwinddir_17 = listForecasts[17].wind.dir;
  let fwinddir_18 = listForecasts[18].wind.dir;
  let fwinddir_19 = listForecasts[19].wind.dir;
  let fwinddir_20 = listForecasts[20].wind.dir;
  let fwinddir_21 = listForecasts[21].wind.dir;
  let fwinddir_22 = listForecasts[22].wind.dir;
  let fwinddir_23 = listForecasts[23].wind.dir;
  let fwinddir_24 = listForecasts[24].wind.dir;
  let fwinddir_25 = listForecasts[25].wind.dir;
  let fwinddir_26 = listForecasts[26].wind.dir;
  let fwinddir_27 = listForecasts[27].wind.dir;
  let fwinddir_28 = listForecasts[28].wind.dir;
  let fwinddir_29 = listForecasts[29].wind.dir;
  let fwinddir_30 = listForecasts[30].wind.dir;
  let fwinddir_31 = listForecasts[31].wind.dir;
  let fwinddir_32 = listForecasts[32].wind.dir;
  let fwinddir_33 = listForecasts[33].wind.dir;
  let fwinddir_34 = listForecasts[34].wind.dir;
  let fwinddir_35 = listForecasts[35].wind.dir;
  let fwinddir_36 = listForecasts[36].wind.dir;
  let fwinddir_37 = listForecasts[37].wind.dir;
  let fwinddir_38 = listForecasts[38].wind.dir;
  let fwinddir_39 = listForecasts[39].wind.dir;

  // (%fwindgust_00% ... %fwindgust_39%)
  let fwindgust_00 = listForecasts[0].wind.gust;
  let fwindgust_01 = listForecasts[1].wind.gust;
  let fwindgust_02 = listForecasts[2].wind.gust;
  let fwindgust_03 = listForecasts[3].wind.gust;
  let fwindgust_04 = listForecasts[4].wind.gust;
  let fwindgust_05 = listForecasts[5].wind.gust;
  let fwindgust_06 = listForecasts[6].wind.gust;
  let fwindgust_07 = listForecasts[7].wind.gust;
  let fwindgust_08 = listForecasts[8].wind.gust;
  let fwindgust_09 = listForecasts[9].wind.gust;
  let fwindgust_10 = listForecasts[10].wind.gust;
  let fwindgust_11 = listForecasts[11].wind.gust;
  let fwindgust_12 = listForecasts[12].wind.gust;
  let fwindgust_13 = listForecasts[13].wind.gust;
  let fwindgust_14 = listForecasts[14].wind.gust;
  let fwindgust_15 = listForecasts[15].wind.gust;
  let fwindgust_16 = listForecasts[16].wind.gust;
  let fwindgust_17 = listForecasts[17].wind.gust;
  let fwindgust_18 = listForecasts[18].wind.gust;
  let fwindgust_19 = listForecasts[19].wind.gust;
  let fwindgust_20 = listForecasts[20].wind.gust;
  let fwindgust_21 = listForecasts[21].wind.gust;
  let fwindgust_22 = listForecasts[22].wind.gust;
  let fwindgust_23 = listForecasts[23].wind.gust;
  let fwindgust_24 = listForecasts[24].wind.gust;
  let fwindgust_25 = listForecasts[25].wind.gust;
  let fwindgust_26 = listForecasts[26].wind.gust;
  let fwindgust_27 = listForecasts[27].wind.gust;
  let fwindgust_28 = listForecasts[28].wind.gust;
  let fwindgust_29 = listForecasts[29].wind.gust;
  let fwindgust_30 = listForecasts[30].wind.gust;
  let fwindgust_31 = listForecasts[31].wind.gust;
  let fwindgust_32 = listForecasts[32].wind.gust;
  let fwindgust_33 = listForecasts[33].wind.gust;
  let fwindgust_34 = listForecasts[34].wind.gust;
  let fwindgust_35 = listForecasts[35].wind.gust;
  let fwindgust_36 = listForecasts[36].wind.gust;
  let fwindgust_37 = listForecasts[37].wind.gust;
  let fwindgust_38 = listForecasts[38].wind.gust;
  let fwindgust_39 = listForecasts[39].wind.gust;

  // (%fwindgustms_00% ... %fwindgustms_39%)
  let fwindgustms_00 = listForecasts[0].wind.gustms;
  let fwindgustms_01 = listForecasts[1].wind.gustms;
  let fwindgustms_02 = listForecasts[2].wind.gustms;
  let fwindgustms_03 = listForecasts[3].wind.gustms;
  let fwindgustms_04 = listForecasts[4].wind.gustms;
  let fwindgustms_05 = listForecasts[5].wind.gustms;
  let fwindgustms_06 = listForecasts[6].wind.gustms;
  let fwindgustms_07 = listForecasts[7].wind.gustms;
  let fwindgustms_08 = listForecasts[8].wind.gustms;
  let fwindgustms_09 = listForecasts[9].wind.gustms;
  let fwindgustms_10 = listForecasts[10].wind.gustms;
  let fwindgustms_11 = listForecasts[11].wind.gustms;
  let fwindgustms_12 = listForecasts[12].wind.gustms;
  let fwindgustms_13 = listForecasts[13].wind.gustms;
  let fwindgustms_14 = listForecasts[14].wind.gustms;
  let fwindgustms_15 = listForecasts[15].wind.gustms;
  let fwindgustms_16 = listForecasts[16].wind.gustms;
  let fwindgustms_17 = listForecasts[17].wind.gustms;
  let fwindgustms_18 = listForecasts[18].wind.gustms;
  let fwindgustms_19 = listForecasts[19].wind.gustms;
  let fwindgustms_20 = listForecasts[20].wind.gustms;
  let fwindgustms_21 = listForecasts[21].wind.gustms;
  let fwindgustms_22 = listForecasts[22].wind.gustms;
  let fwindgustms_23 = listForecasts[23].wind.gustms;
  let fwindgustms_24 = listForecasts[24].wind.gustms;
  let fwindgustms_25 = listForecasts[25].wind.gustms;
  let fwindgustms_26 = listForecasts[26].wind.gustms;
  let fwindgustms_27 = listForecasts[27].wind.gustms;
  let fwindgustms_28 = listForecasts[28].wind.gustms;
  let fwindgustms_29 = listForecasts[29].wind.gustms;
  let fwindgustms_30 = listForecasts[30].wind.gustms;
  let fwindgustms_31 = listForecasts[31].wind.gustms;
  let fwindgustms_32 = listForecasts[32].wind.gustms;
  let fwindgustms_33 = listForecasts[33].wind.gustms;
  let fwindgustms_34 = listForecasts[34].wind.gustms;
  let fwindgustms_35 = listForecasts[35].wind.gustms;
  let fwindgustms_36 = listForecasts[36].wind.gustms;
  let fwindgustms_37 = listForecasts[37].wind.gustms;
  let fwindgustms_38 = listForecasts[38].wind.gustms;
  let fwindgustms_39 = listForecasts[39].wind.gustms;

  // getWeather - Create weather data object 
  weatherData = {
    "fyear_00": fyear_00,
    "fyear_01": fyear_01,
    "fyear_02": fyear_02,
    "fyear_03": fyear_03,
    "fyear_04": fyear_04,
    "fyear_05": fyear_05,
    "fyear_06": fyear_06,
    "fyear_07": fyear_07,
    "fyear_08": fyear_08,
    "fyear_09": fyear_09,
    "fyear_10": fyear_10,
    "fyear_11": fyear_11,
    "fyear_12": fyear_12,
    "fyear_13": fyear_13,
    "fyear_14": fyear_14,
    "fyear_15": fyear_15,
    "fyear_16": fyear_16,
    "fyear_17": fyear_17,
    "fyear_18": fyear_18,
    "fyear_19": fyear_19,
    "fyear_20": fyear_20,
    "fyear_21": fyear_21,
    "fyear_22": fyear_22,
    "fyear_23": fyear_23,
    "fyear_24": fyear_24,
    "fyear_25": fyear_25,
    "fyear_26": fyear_26,
    "fyear_27": fyear_27,
    "fyear_28": fyear_28,
    "fyear_29": fyear_29,
    "fyear_30": fyear_30,
    "fyear_31": fyear_31,
    "fyear_32": fyear_32,
    "fyear_33": fyear_33,
    "fyear_34": fyear_34,
    "fyear_35": fyear_35,
    "fyear_36": fyear_36,
    "fyear_37": fyear_37,
    "fyear_38": fyear_38,
    "fyear_39": fyear_39,

    "fmonth_00": fmonth_00,
    "fmonth_01": fmonth_01,
    "fmonth_02": fmonth_02,
    "fmonth_03": fmonth_03,
    "fmonth_04": fmonth_04,
    "fmonth_05": fmonth_05,
    "fmonth_06": fmonth_06,
    "fmonth_07": fmonth_07,
    "fmonth_08": fmonth_08,
    "fmonth_09": fmonth_09,
    "fmonth_10": fmonth_10,
    "fmonth_11": fmonth_11,
    "fmonth_12": fmonth_12,
    "fmonth_13": fmonth_13,
    "fmonth_14": fmonth_14,
    "fmonth_15": fmonth_15,
    "fmonth_16": fmonth_16,
    "fmonth_17": fmonth_17,
    "fmonth_18": fmonth_18,
    "fmonth_19": fmonth_19,
    "fmonth_20": fmonth_20,
    "fmonth_21": fmonth_21,
    "fmonth_22": fmonth_22,
    "fmonth_23": fmonth_23,
    "fmonth_24": fmonth_24,
    "fmonth_25": fmonth_25,
    "fmonth_26": fmonth_26,
    "fmonth_27": fmonth_27,
    "fmonth_28": fmonth_28,
    "fmonth_29": fmonth_29,
    "fmonth_30": fmonth_30,
    "fmonth_31": fmonth_31,
    "fmonth_32": fmonth_32,
    "fmonth_33": fmonth_33,
    "fmonth_34": fmonth_34,
    "fmonth_35": fmonth_35,
    "fmonth_36": fmonth_36,
    "fmonth_37": fmonth_37,
    "fmonth_38": fmonth_38,
    "fmonth_39": fmonth_39,

    "fdate_00": fdate_00,
    "fdate_01": fdate_01,
    "fdate_02": fdate_02,
    "fdate_03": fdate_03,
    "fdate_04": fdate_04,
    "fdate_05": fdate_05,
    "fdate_06": fdate_06,
    "fdate_07": fdate_07,
    "fdate_08": fdate_08,
    "fdate_09": fdate_09,
    "fdate_10": fdate_10,
    "fdate_11": fdate_11,
    "fdate_12": fdate_12,
    "fdate_13": fdate_13,
    "fdate_14": fdate_14,
    "fdate_15": fdate_15,
    "fdate_16": fdate_16,
    "fdate_17": fdate_17,
    "fdate_18": fdate_18,
    "fdate_19": fdate_19,
    "fdate_20": fdate_20,
    "fdate_21": fdate_21,
    "fdate_22": fdate_22,
    "fdate_23": fdate_23,
    "fdate_24": fdate_24,
    "fdate_25": fdate_25,
    "fdate_26": fdate_26,
    "fdate_27": fdate_27,
    "fdate_28": fdate_28,
    "fdate_29": fdate_29,
    "fdate_30": fdate_30,
    "fdate_31": fdate_31,
    "fdate_32": fdate_32,
    "fdate_33": fdate_33,
    "fdate_34": fdate_34,
    "fdate_35": fdate_35,
    "fdate_36": fdate_36,
    "fdate_37": fdate_37,
    "fdate_38": fdate_38,
    "fdate_39": fdate_39,

    "fhours_00": fhours_00,
    "fhours_01": fhours_01,
    "fhours_02": fhours_02,
    "fhours_03": fhours_03,
    "fhours_04": fhours_04,
    "fhours_05": fhours_05,
    "fhours_06": fhours_06,
    "fhours_07": fhours_07,
    "fhours_08": fhours_08,
    "fhours_09": fhours_09,
    "fhours_10": fhours_10,
    "fhours_11": fhours_11,
    "fhours_12": fhours_12,
    "fhours_13": fhours_13,
    "fhours_14": fhours_14,
    "fhours_15": fhours_15,
    "fhours_16": fhours_16,
    "fhours_17": fhours_17,
    "fhours_18": fhours_18,
    "fhours_19": fhours_19,
    "fhours_20": fhours_20,
    "fhours_21": fhours_21,
    "fhours_22": fhours_22,
    "fhours_23": fhours_23,
    "fhours_24": fhours_24,
    "fhours_25": fhours_25,
    "fhours_26": fhours_26,
    "fhours_27": fhours_27,
    "fhours_28": fhours_28,
    "fhours_29": fhours_29,
    "fhours_30": fhours_30,
    "fhours_31": fhours_31,
    "fhours_32": fhours_32,
    "fhours_33": fhours_33,
    "fhours_34": fhours_34,
    "fhours_35": fhours_35,
    "fhours_36": fhours_36,
    "fhours_37": fhours_37,
    "fhours_38": fhours_38,
    "fhours_39": fhours_39,

    "fmins_00": fmins_00,
    "fmins_01": fmins_01,
    "fmins_02": fmins_02,
    "fmins_03": fmins_03,
    "fmins_04": fmins_04,
    "fmins_05": fmins_05,
    "fmins_06": fmins_06,
    "fmins_07": fmins_07,
    "fmins_08": fmins_08,
    "fmins_09": fmins_09,
    "fmins_10": fmins_10,
    "fmins_11": fmins_11,
    "fmins_12": fmins_12,
    "fmins_13": fmins_13,
    "fmins_14": fmins_14,
    "fmins_15": fmins_15,
    "fmins_16": fmins_16,
    "fmins_17": fmins_17,
    "fmins_18": fmins_18,
    "fmins_19": fmins_19,
    "fmins_20": fmins_20,
    "fmins_21": fmins_21,
    "fmins_22": fmins_22,
    "fmins_23": fmins_23,
    "fmins_24": fmins_24,
    "fmins_25": fmins_25,
    "fmins_26": fmins_26,
    "fmins_27": fmins_27,
    "fmins_28": fmins_28,
    "fmins_29": fmins_29,
    "fmins_30": fmins_30,
    "fmins_31": fmins_31,
    "fmins_32": fmins_32,
    "fmins_33": fmins_33,
    "fmins_34": fmins_34,
    "fmins_35": fmins_35,
    "fmins_36": fmins_36,
    "fmins_37": fmins_37,
    "fmins_38": fmins_38,
    "fmins_39": fmins_39,

    "fsecs_00": fsecs_00,
    "fsecs_01": fsecs_01,
    "fsecs_02": fsecs_02,
    "fsecs_03": fsecs_03,
    "fsecs_04": fsecs_04,
    "fsecs_05": fsecs_05,
    "fsecs_06": fsecs_06,
    "fsecs_07": fsecs_07,
    "fsecs_08": fsecs_08,
    "fsecs_09": fsecs_09,
    "fsecs_10": fsecs_10,
    "fsecs_11": fsecs_11,
    "fsecs_12": fsecs_12,
    "fsecs_13": fsecs_13,
    "fsecs_14": fsecs_14,
    "fsecs_15": fsecs_15,
    "fsecs_16": fsecs_16,
    "fsecs_17": fsecs_17,
    "fsecs_18": fsecs_18,
    "fsecs_19": fsecs_19,
    "fsecs_20": fsecs_20,
    "fsecs_21": fsecs_21,
    "fsecs_22": fsecs_22,
    "fsecs_23": fsecs_23,
    "fsecs_24": fsecs_24,
    "fsecs_25": fsecs_25,
    "fsecs_26": fsecs_26,
    "fsecs_27": fsecs_27,
    "fsecs_28": fsecs_28,
    "fsecs_29": fsecs_29,
    "fsecs_30": fsecs_30,
    "fsecs_31": fsecs_31,
    "fsecs_32": fsecs_32,
    "fsecs_33": fsecs_33,
    "fsecs_34": fsecs_34,
    "fsecs_35": fsecs_35,
    "fsecs_36": fsecs_36,
    "fsecs_37": fsecs_37,
    "fsecs_38": fsecs_38,
    "fsecs_39": fsecs_39,

    "dt_localtime_00": dt_localtime_00,
    "dt_localtime_01": dt_localtime_01,
    "dt_localtime_02": dt_localtime_02,
    "dt_localtime_03": dt_localtime_03,
    "dt_localtime_04": dt_localtime_04,
    "dt_localtime_05": dt_localtime_05,
    "dt_localtime_06": dt_localtime_06,
    "dt_localtime_07": dt_localtime_07,
    "dt_localtime_08": dt_localtime_08,
    "dt_localtime_09": dt_localtime_09,
    "dt_localtime_10": dt_localtime_10,
    "dt_localtime_11": dt_localtime_11,
    "dt_localtime_12": dt_localtime_12,
    "dt_localtime_13": dt_localtime_13,
    "dt_localtime_14": dt_localtime_14,
    "dt_localtime_15": dt_localtime_15,
    "dt_localtime_16": dt_localtime_16,
    "dt_localtime_17": dt_localtime_17,
    "dt_localtime_18": dt_localtime_18,
    "dt_localtime_19": dt_localtime_19,
    "dt_localtime_20": dt_localtime_20,
    "dt_localtime_21": dt_localtime_21,
    "dt_localtime_22": dt_localtime_22,
    "dt_localtime_23": dt_localtime_23,
    "dt_localtime_24": dt_localtime_24,
    "dt_localtime_25": dt_localtime_25,
    "dt_localtime_26": dt_localtime_26,
    "dt_localtime_27": dt_localtime_27,
    "dt_localtime_28": dt_localtime_28,
    "dt_localtime_29": dt_localtime_29,
    "dt_localtime_30": dt_localtime_30,
    "dt_localtime_31": dt_localtime_31,
    "dt_localtime_32": dt_localtime_32,
    "dt_localtime_33": dt_localtime_33,
    "dt_localtime_34": dt_localtime_34,
    "dt_localtime_35": dt_localtime_35,
    "dt_localtime_36": dt_localtime_36,
    "dt_localtime_37": dt_localtime_37,
    "dt_localtime_38": dt_localtime_38,
    "dt_localtime_39": dt_localtime_39,

    "d_localtime_00": d_localtime_00,
    "d_localtime_01": d_localtime_01,
    "d_localtime_02": d_localtime_02,
    "d_localtime_03": d_localtime_03,
    "d_localtime_04": d_localtime_04,
    "d_localtime_05": d_localtime_05,
    "d_localtime_06": d_localtime_06,
    "d_localtime_07": d_localtime_07,
    "d_localtime_08": d_localtime_08,
    "d_localtime_09": d_localtime_09,
    "d_localtime_10": d_localtime_10,
    "d_localtime_11": d_localtime_11,
    "d_localtime_12": d_localtime_12,
    "d_localtime_13": d_localtime_13,
    "d_localtime_14": d_localtime_14,
    "d_localtime_15": d_localtime_15,
    "d_localtime_16": d_localtime_16,
    "d_localtime_17": d_localtime_17,
    "d_localtime_18": d_localtime_18,
    "d_localtime_19": d_localtime_19,
    "d_localtime_20": d_localtime_20,
    "d_localtime_21": d_localtime_21,
    "d_localtime_22": d_localtime_22,
    "d_localtime_23": d_localtime_23,
    "d_localtime_24": d_localtime_24,
    "d_localtime_25": d_localtime_25,
    "d_localtime_26": d_localtime_26,
    "d_localtime_27": d_localtime_27,
    "d_localtime_28": d_localtime_28,
    "d_localtime_29": d_localtime_29,
    "d_localtime_30": d_localtime_30,
    "d_localtime_31": d_localtime_31,
    "d_localtime_32": d_localtime_32,
    "d_localtime_33": d_localtime_33,
    "d_localtime_34": d_localtime_34,
    "d_localtime_35": d_localtime_35,
    "d_localtime_36": d_localtime_36,
    "d_localtime_37": d_localtime_37,
    "d_localtime_38": d_localtime_38,
    "d_localtime_39": d_localtime_39,

    "ds_localtime_00": ds_localtime_00,
    "ds_localtime_01": ds_localtime_01,
    "ds_localtime_02": ds_localtime_02,
    "ds_localtime_03": ds_localtime_03,
    "ds_localtime_04": ds_localtime_04,
    "ds_localtime_05": ds_localtime_05,
    "ds_localtime_06": ds_localtime_06,
    "ds_localtime_07": ds_localtime_07,
    "ds_localtime_08": ds_localtime_08,
    "ds_localtime_09": ds_localtime_09,
    "ds_localtime_10": ds_localtime_10,
    "ds_localtime_11": ds_localtime_11,
    "ds_localtime_12": ds_localtime_12,
    "ds_localtime_13": ds_localtime_13,
    "ds_localtime_14": ds_localtime_14,
    "ds_localtime_15": ds_localtime_15,
    "ds_localtime_16": ds_localtime_16,
    "ds_localtime_17": ds_localtime_17,
    "ds_localtime_18": ds_localtime_18,
    "ds_localtime_19": ds_localtime_19,
    "ds_localtime_20": ds_localtime_20,
    "ds_localtime_21": ds_localtime_21,
    "ds_localtime_22": ds_localtime_22,
    "ds_localtime_23": ds_localtime_23,
    "ds_localtime_24": ds_localtime_24,
    "ds_localtime_25": ds_localtime_25,
    "ds_localtime_26": ds_localtime_26,
    "ds_localtime_27": ds_localtime_27,
    "ds_localtime_28": ds_localtime_28,
    "ds_localtime_29": ds_localtime_29,
    "ds_localtime_30": ds_localtime_30,
    "ds_localtime_31": ds_localtime_31,
    "ds_localtime_32": ds_localtime_32,
    "ds_localtime_33": ds_localtime_33,
    "ds_localtime_34": ds_localtime_34,
    "ds_localtime_35": ds_localtime_35,
    "ds_localtime_36": ds_localtime_36,
    "ds_localtime_37": ds_localtime_37,
    "ds_localtime_38": ds_localtime_38,
    "ds_localtime_39": ds_localtime_39,

    "t_localtime_00": t_localtime_00,
    "t_localtime_01": t_localtime_01,
    "t_localtime_02": t_localtime_02,
    "t_localtime_03": t_localtime_03,
    "t_localtime_04": t_localtime_04,
    "t_localtime_05": t_localtime_05,
    "t_localtime_06": t_localtime_06,
    "t_localtime_07": t_localtime_07,
    "t_localtime_08": t_localtime_08,
    "t_localtime_09": t_localtime_09,
    "t_localtime_10": t_localtime_10,
    "t_localtime_11": t_localtime_11,
    "t_localtime_12": t_localtime_12,
    "t_localtime_13": t_localtime_13,
    "t_localtime_14": t_localtime_14,
    "t_localtime_15": t_localtime_15,
    "t_localtime_16": t_localtime_16,
    "t_localtime_17": t_localtime_17,
    "t_localtime_18": t_localtime_18,
    "t_localtime_19": t_localtime_19,
    "t_localtime_20": t_localtime_20,
    "t_localtime_21": t_localtime_21,
    "t_localtime_22": t_localtime_22,
    "t_localtime_23": t_localtime_23,
    "t_localtime_24": t_localtime_24,
    "t_localtime_25": t_localtime_25,
    "t_localtime_26": t_localtime_26,
    "t_localtime_27": t_localtime_27,
    "t_localtime_28": t_localtime_28,
    "t_localtime_29": t_localtime_29,
    "t_localtime_30": t_localtime_30,
    "t_localtime_31": t_localtime_31,
    "t_localtime_32": t_localtime_32,
    "t_localtime_33": t_localtime_33,
    "t_localtime_34": t_localtime_34,
    "t_localtime_35": t_localtime_35,
    "t_localtime_36": t_localtime_36,
    "t_localtime_37": t_localtime_37,
    "t_localtime_38": t_localtime_38,
    "t_localtime_39": t_localtime_39,

    "ts_localtime_00": ts_localtime_00,
    "ts_localtime_01": ts_localtime_01,
    "ts_localtime_02": ts_localtime_02,
    "ts_localtime_03": ts_localtime_03,
    "ts_localtime_04": ts_localtime_04,
    "ts_localtime_05": ts_localtime_05,
    "ts_localtime_06": ts_localtime_06,
    "ts_localtime_07": ts_localtime_07,
    "ts_localtime_08": ts_localtime_08,
    "ts_localtime_09": ts_localtime_09,
    "ts_localtime_10": ts_localtime_10,
    "ts_localtime_11": ts_localtime_11,
    "ts_localtime_12": ts_localtime_12,
    "ts_localtime_13": ts_localtime_13,
    "ts_localtime_14": ts_localtime_14,
    "ts_localtime_15": ts_localtime_15,
    "ts_localtime_16": ts_localtime_16,
    "ts_localtime_17": ts_localtime_17,
    "ts_localtime_18": ts_localtime_18,
    "ts_localtime_19": ts_localtime_19,
    "ts_localtime_20": ts_localtime_20,
    "ts_localtime_21": ts_localtime_21,
    "ts_localtime_22": ts_localtime_22,
    "ts_localtime_23": ts_localtime_23,
    "ts_localtime_24": ts_localtime_24,
    "ts_localtime_25": ts_localtime_25,
    "ts_localtime_26": ts_localtime_26,
    "ts_localtime_27": ts_localtime_27,
    "ts_localtime_28": ts_localtime_28,
    "ts_localtime_29": ts_localtime_29,
    "ts_localtime_30": ts_localtime_30,
    "ts_localtime_31": ts_localtime_31,
    "ts_localtime_32": ts_localtime_32,
    "ts_localtime_33": ts_localtime_33,
    "ts_localtime_34": ts_localtime_34,
    "ts_localtime_35": ts_localtime_35,
    "ts_localtime_36": ts_localtime_36,
    "ts_localtime_37": ts_localtime_37,
    "ts_localtime_38": ts_localtime_38,
    "ts_localtime_39": ts_localtime_39,

    "ftemp_00": ftemp_00,
    "ftemp_01": ftemp_01,
    "ftemp_02": ftemp_02,
    "ftemp_03": ftemp_03,
    "ftemp_04": ftemp_04,
    "ftemp_05": ftemp_05,
    "ftemp_06": ftemp_06,
    "ftemp_07": ftemp_07,
    "ftemp_08": ftemp_08,
    "ftemp_09": ftemp_09,
    "ftemp_10": ftemp_10,
    "ftemp_11": ftemp_11,
    "ftemp_12": ftemp_12,
    "ftemp_13": ftemp_13,
    "ftemp_14": ftemp_14,
    "ftemp_15": ftemp_15,
    "ftemp_16": ftemp_16,
    "ftemp_17": ftemp_17,
    "ftemp_18": ftemp_18,
    "ftemp_19": ftemp_19,
    "ftemp_20": ftemp_20,
    "ftemp_21": ftemp_21,
    "ftemp_22": ftemp_22,
    "ftemp_23": ftemp_23,
    "ftemp_24": ftemp_24,
    "ftemp_25": ftemp_25,
    "ftemp_26": ftemp_26,
    "ftemp_27": ftemp_27,
    "ftemp_28": ftemp_28,
    "ftemp_29": ftemp_29,
    "ftemp_30": ftemp_30,
    "ftemp_31": ftemp_31,
    "ftemp_32": ftemp_32,
    "ftemp_33": ftemp_33,
    "ftemp_34": ftemp_34,
    "ftemp_35": ftemp_35,
    "ftemp_36": ftemp_36,
    "ftemp_37": ftemp_37,
    "ftemp_38": ftemp_38,
    "ftemp_39": ftemp_39,

    "ffeelslike_00": ffeelslike_00,
    "ffeelslike_01": ffeelslike_01,
    "ffeelslike_02": ffeelslike_02,
    "ffeelslike_03": ffeelslike_03,
    "ffeelslike_04": ffeelslike_04,
    "ffeelslike_05": ffeelslike_05,
    "ffeelslike_06": ffeelslike_06,
    "ffeelslike_07": ffeelslike_07,
    "ffeelslike_08": ffeelslike_08,
    "ffeelslike_09": ffeelslike_09,
    "ffeelslike_10": ffeelslike_10,
    "ffeelslike_11": ffeelslike_11,
    "ffeelslike_12": ffeelslike_12,
    "ffeelslike_13": ffeelslike_13,
    "ffeelslike_14": ffeelslike_14,
    "ffeelslike_15": ffeelslike_15,
    "ffeelslike_16": ffeelslike_16,
    "ffeelslike_17": ffeelslike_17,
    "ffeelslike_18": ffeelslike_18,
    "ffeelslike_19": ffeelslike_19,
    "ffeelslike_20": ffeelslike_20,
    "ffeelslike_21": ffeelslike_21,
    "ffeelslike_22": ffeelslike_22,
    "ffeelslike_23": ffeelslike_23,
    "ffeelslike_24": ffeelslike_24,
    "ffeelslike_25": ffeelslike_25,
    "ffeelslike_26": ffeelslike_26,
    "ffeelslike_27": ffeelslike_27,
    "ffeelslike_28": ffeelslike_28,
    "ffeelslike_29": ffeelslike_29,
    "ffeelslike_30": ffeelslike_30,
    "ffeelslike_31": ffeelslike_31,
    "ffeelslike_32": ffeelslike_32,
    "ffeelslike_33": ffeelslike_33,
    "ffeelslike_34": ffeelslike_34,
    "ffeelslike_35": ffeelslike_35,
    "ffeelslike_36": ffeelslike_36,
    "ffeelslike_37": ffeelslike_37,
    "ffeelslike_38": ffeelslike_38,
    "ffeelslike_39": ffeelslike_39,

    "fclouds_00": fclouds_00,
    "fclouds_01": fclouds_01,
    "fclouds_02": fclouds_02,
    "fclouds_03": fclouds_03,
    "fclouds_04": fclouds_04,
    "fclouds_05": fclouds_05,
    "fclouds_06": fclouds_06,
    "fclouds_07": fclouds_07,
    "fclouds_08": fclouds_08,
    "fclouds_09": fclouds_09,
    "fclouds_10": fclouds_10,
    "fclouds_11": fclouds_11,
    "fclouds_12": fclouds_12,
    "fclouds_13": fclouds_13,
    "fclouds_14": fclouds_14,
    "fclouds_15": fclouds_15,
    "fclouds_16": fclouds_16,
    "fclouds_17": fclouds_17,
    "fclouds_18": fclouds_18,
    "fclouds_19": fclouds_19,
    "fclouds_20": fclouds_20,
    "fclouds_21": fclouds_21,
    "fclouds_22": fclouds_22,
    "fclouds_23": fclouds_23,
    "fclouds_24": fclouds_24,
    "fclouds_25": fclouds_25,
    "fclouds_26": fclouds_26,
    "fclouds_27": fclouds_27,
    "fclouds_28": fclouds_28,
    "fclouds_29": fclouds_29,
    "fclouds_30": fclouds_30,
    "fclouds_31": fclouds_31,
    "fclouds_32": fclouds_32,
    "fclouds_33": fclouds_33,
    "fclouds_34": fclouds_34,
    "fclouds_35": fclouds_35,
    "fclouds_36": fclouds_36,
    "fclouds_37": fclouds_37,
    "fclouds_38": fclouds_38,
    "fclouds_39": fclouds_39,

    "fpop_00": fpop_00,
    "fpop_01": fpop_01,
    "fpop_02": fpop_02,
    "fpop_03": fpop_03,
    "fpop_04": fpop_04,
    "fpop_05": fpop_05,
    "fpop_06": fpop_06,
    "fpop_07": fpop_07,
    "fpop_08": fpop_08,
    "fpop_09": fpop_09,
    "fpop_10": fpop_10,
    "fpop_11": fpop_11,
    "fpop_12": fpop_12,
    "fpop_13": fpop_13,
    "fpop_14": fpop_14,
    "fpop_15": fpop_15,
    "fpop_16": fpop_16,
    "fpop_17": fpop_17,
    "fpop_18": fpop_18,
    "fpop_19": fpop_19,
    "fpop_20": fpop_20,
    "fpop_21": fpop_21,
    "fpop_22": fpop_22,
    "fpop_23": fpop_23,
    "fpop_24": fpop_24,
    "fpop_25": fpop_25,
    "fpop_26": fpop_26,
    "fpop_27": fpop_27,
    "fpop_28": fpop_28,
    "fpop_29": fpop_29,
    "fpop_30": fpop_30,
    "fpop_31": fpop_31,
    "fpop_32": fpop_32,
    "fpop_33": fpop_33,
    "fpop_34": fpop_34,
    "fpop_35": fpop_35,
    "fpop_36": fpop_36,
    "fpop_37": fpop_37,
    "fpop_38": fpop_38,
    "fpop_39": fpop_39,

    "fpod_00": fpod_00,
    "fpod_01": fpod_01,
    "fpod_02": fpod_02,
    "fpod_03": fpod_03,
    "fpod_04": fpod_04,
    "fpod_05": fpod_05,
    "fpod_06": fpod_06,
    "fpod_07": fpod_07,
    "fpod_08": fpod_08,
    "fpod_09": fpod_09,
    "fpod_10": fpod_10,
    "fpod_11": fpod_11,
    "fpod_12": fpod_12,
    "fpod_13": fpod_13,
    "fpod_14": fpod_14,
    "fpod_15": fpod_15,
    "fpod_16": fpod_16,
    "fpod_17": fpod_17,
    "fpod_18": fpod_18,
    "fpod_19": fpod_19,
    "fpod_20": fpod_20,
    "fpod_21": fpod_21,
    "fpod_22": fpod_22,
    "fpod_23": fpod_23,
    "fpod_24": fpod_24,
    "fpod_25": fpod_25,
    "fpod_26": fpod_26,
    "fpod_27": fpod_27,
    "fpod_28": fpod_28,
    "fpod_29": fpod_29,
    "fpod_30": fpod_30,
    "fpod_31": fpod_31,
    "fpod_32": fpod_32,
    "fpod_33": fpod_33,
    "fpod_34": fpod_34,
    "fpod_35": fpod_35,
    "fpod_36": fpod_36,
    "fpod_37": fpod_37,
    "fpod_38": fpod_38,
    "fpod_39": fpod_39,

    "fvis_00": fvis_00,
    "fvis_01": fvis_01,
    "fvis_02": fvis_02,
    "fvis_03": fvis_03,
    "fvis_04": fvis_04,
    "fvis_05": fvis_05,
    "fvis_06": fvis_06,
    "fvis_07": fvis_07,
    "fvis_08": fvis_08,
    "fvis_09": fvis_09,
    "fvis_10": fvis_10,
    "fvis_11": fvis_11,
    "fvis_12": fvis_12,
    "fvis_13": fvis_13,
    "fvis_14": fvis_14,
    "fvis_15": fvis_15,
    "fvis_16": fvis_16,
    "fvis_17": fvis_17,
    "fvis_18": fvis_18,
    "fvis_19": fvis_19,
    "fvis_20": fvis_20,
    "fvis_21": fvis_21,
    "fvis_22": fvis_22,
    "fvis_23": fvis_23,
    "fvis_24": fvis_24,
    "fvis_25": fvis_25,
    "fvis_26": fvis_26,
    "fvis_27": fvis_27,
    "fvis_28": fvis_28,
    "fvis_29": fvis_29,
    "fvis_30": fvis_30,
    "fvis_31": fvis_31,
    "fvis_32": fvis_32,
    "fvis_33": fvis_33,
    "fvis_34": fvis_34,
    "fvis_35": fvis_35,
    "fvis_36": fvis_36,
    "fvis_37": fvis_37,
    "fvis_38": fvis_38,
    "fvis_39": fvis_39,

    "fhum_00": fhum_00,
    "fhum_01": fhum_01,
    "fhum_02": fhum_02,
    "fhum_03": fhum_03,
    "fhum_04": fhum_04,
    "fhum_05": fhum_05,
    "fhum_06": fhum_06,
    "fhum_07": fhum_07,
    "fhum_08": fhum_08,
    "fhum_09": fhum_09,
    "fhum_10": fhum_10,
    "fhum_11": fhum_11,
    "fhum_12": fhum_12,
    "fhum_13": fhum_13,
    "fhum_14": fhum_14,
    "fhum_15": fhum_15,
    "fhum_16": fhum_16,
    "fhum_17": fhum_17,
    "fhum_18": fhum_18,
    "fhum_19": fhum_19,
    "fhum_20": fhum_20,
    "fhum_21": fhum_21,
    "fhum_22": fhum_22,
    "fhum_23": fhum_23,
    "fhum_24": fhum_24,
    "fhum_25": fhum_25,
    "fhum_26": fhum_26,
    "fhum_27": fhum_27,
    "fhum_28": fhum_28,
    "fhum_29": fhum_29,
    "fhum_30": fhum_30,
    "fhum_31": fhum_31,
    "fhum_32": fhum_32,
    "fhum_33": fhum_33,
    "fhum_34": fhum_34,
    "fhum_35": fhum_35,
    "fhum_36": fhum_36,
    "fhum_37": fhum_37,
    "fhum_38": fhum_38,
    "fhum_39": fhum_39,

    "ftempmax_00": ftempmax_00,
    "ftempmax_01": ftempmax_01,
    "ftempmax_02": ftempmax_02,
    "ftempmax_03": ftempmax_03,
    "ftempmax_04": ftempmax_04,
    "ftempmax_05": ftempmax_05,
    "ftempmax_06": ftempmax_06,
    "ftempmax_07": ftempmax_07,
    "ftempmax_08": ftempmax_08,
    "ftempmax_09": ftempmax_09,
    "ftempmax_10": ftempmax_10,
    "ftempmax_11": ftempmax_11,
    "ftempmax_12": ftempmax_12,
    "ftempmax_13": ftempmax_13,
    "ftempmax_14": ftempmax_14,
    "ftempmax_15": ftempmax_15,
    "ftempmax_16": ftempmax_16,
    "ftempmax_17": ftempmax_17,
    "ftempmax_18": ftempmax_18,
    "ftempmax_19": ftempmax_19,
    "ftempmax_20": ftempmax_20,
    "ftempmax_21": ftempmax_21,
    "ftempmax_22": ftempmax_22,
    "ftempmax_23": ftempmax_23,
    "ftempmax_24": ftempmax_24,
    "ftempmax_25": ftempmax_25,
    "ftempmax_26": ftempmax_26,
    "ftempmax_27": ftempmax_27,
    "ftempmax_28": ftempmax_28,
    "ftempmax_29": ftempmax_29,
    "ftempmax_30": ftempmax_30,
    "ftempmax_31": ftempmax_31,
    "ftempmax_32": ftempmax_32,
    "ftempmax_33": ftempmax_33,
    "ftempmax_34": ftempmax_34,
    "ftempmax_35": ftempmax_35,
    "ftempmax_36": ftempmax_36,
    "ftempmax_37": ftempmax_37,
    "ftempmax_38": ftempmax_38,
    "ftempmax_39": ftempmax_39,

    "ftempmin_00": ftempmin_00,
    "ftempmin_01": ftempmin_01,
    "ftempmin_02": ftempmin_02,
    "ftempmin_03": ftempmin_03,
    "ftempmin_04": ftempmin_04,
    "ftempmin_05": ftempmin_05,
    "ftempmin_06": ftempmin_06,
    "ftempmin_07": ftempmin_07,
    "ftempmin_08": ftempmin_08,
    "ftempmin_09": ftempmin_09,
    "ftempmin_10": ftempmin_10,
    "ftempmin_11": ftempmin_11,
    "ftempmin_12": ftempmin_12,
    "ftempmin_13": ftempmin_13,
    "ftempmin_14": ftempmin_14,
    "ftempmin_15": ftempmin_15,
    "ftempmin_16": ftempmin_16,
    "ftempmin_17": ftempmin_17,
    "ftempmin_18": ftempmin_18,
    "ftempmin_19": ftempmin_19,
    "ftempmin_20": ftempmin_20,
    "ftempmin_21": ftempmin_21,
    "ftempmin_22": ftempmin_22,
    "ftempmin_23": ftempmin_23,
    "ftempmin_24": ftempmin_24,
    "ftempmin_25": ftempmin_25,
    "ftempmin_26": ftempmin_26,
    "ftempmin_27": ftempmin_27,
    "ftempmin_28": ftempmin_28,
    "ftempmin_29": ftempmin_29,
    "ftempmin_30": ftempmin_30,
    "ftempmin_31": ftempmin_31,
    "ftempmin_32": ftempmin_32,
    "ftempmin_33": ftempmin_33,
    "ftempmin_34": ftempmin_34,
    "ftempmin_35": ftempmin_35,
    "ftempmin_36": ftempmin_36,
    "ftempmin_37": ftempmin_37,
    "ftempmin_38": ftempmin_38,
    "ftempmin_39": ftempmin_39,

    "fground_00": fground_00,
    "fground_01": fground_01,
    "fground_02": fground_02,
    "fground_03": fground_03,
    "fground_04": fground_04,
    "fground_05": fground_05,
    "fground_06": fground_06,
    "fground_07": fground_07,
    "fground_08": fground_08,
    "fground_09": fground_09,
    "fground_10": fground_10,
    "fground_11": fground_11,
    "fground_12": fground_12,
    "fground_13": fground_13,
    "fground_14": fground_14,
    "fground_15": fground_15,
    "fground_16": fground_16,
    "fground_17": fground_17,
    "fground_18": fground_18,
    "fground_19": fground_19,
    "fground_20": fground_20,
    "fground_21": fground_21,
    "fground_22": fground_22,
    "fground_23": fground_23,
    "fground_24": fground_24,
    "fground_25": fground_25,
    "fground_26": fground_26,
    "fground_27": fground_27,
    "fground_28": fground_28,
    "fground_29": fground_29,
    "fground_30": fground_30,
    "fground_31": fground_31,
    "fground_32": fground_32,
    "fground_33": fground_33,
    "fground_34": fground_34,
    "fground_35": fground_35,
    "fground_36": fground_36,
    "fground_37": fground_37,
    "fground_38": fground_38,
    "fground_39": fground_39,

    "fsea_00": fsea_00,
    "fsea_01": fsea_01,
    "fsea_02": fsea_02,
    "fsea_03": fsea_03,
    "fsea_04": fsea_04,
    "fsea_05": fsea_05,
    "fsea_06": fsea_06,
    "fsea_07": fsea_07,
    "fsea_08": fsea_08,
    "fsea_09": fsea_09,
    "fsea_10": fsea_10,
    "fsea_11": fsea_11,
    "fsea_12": fsea_12,
    "fsea_13": fsea_13,
    "fsea_14": fsea_14,
    "fsea_15": fsea_15,
    "fsea_16": fsea_16,
    "fsea_17": fsea_17,
    "fsea_18": fsea_18,
    "fsea_19": fsea_19,
    "fsea_20": fsea_20,
    "fsea_21": fsea_21,
    "fsea_22": fsea_22,
    "fsea_23": fsea_23,
    "fsea_24": fsea_24,
    "fsea_25": fsea_25,
    "fsea_26": fsea_26,
    "fsea_27": fsea_27,
    "fsea_28": fsea_28,
    "fsea_29": fsea_29,
    "fsea_30": fsea_30,
    "fsea_31": fsea_31,
    "fsea_32": fsea_32,
    "fsea_33": fsea_33,
    "fsea_34": fsea_34,
    "fsea_35": fsea_35,
    "fsea_36": fsea_36,
    "fsea_37": fsea_37,
    "fsea_38": fsea_38,
    "fsea_39": fsea_39,

    "fdesc_00": fdesc_00,
    "fdesc_01": fdesc_01,
    "fdesc_02": fdesc_02,
    "fdesc_03": fdesc_03,
    "fdesc_04": fdesc_04,
    "fdesc_05": fdesc_05,
    "fdesc_06": fdesc_06,
    "fdesc_07": fdesc_07,
    "fdesc_08": fdesc_08,
    "fdesc_09": fdesc_09,
    "fdesc_10": fdesc_10,
    "fdesc_11": fdesc_11,
    "fdesc_12": fdesc_12,
    "fdesc_13": fdesc_13,
    "fdesc_14": fdesc_14,
    "fdesc_15": fdesc_15,
    "fdesc_16": fdesc_16,
    "fdesc_17": fdesc_17,
    "fdesc_18": fdesc_18,
    "fdesc_19": fdesc_19,
    "fdesc_20": fdesc_20,
    "fdesc_21": fdesc_21,
    "fdesc_22": fdesc_22,
    "fdesc_23": fdesc_23,
    "fdesc_24": fdesc_24,
    "fdesc_25": fdesc_25,
    "fdesc_26": fdesc_26,
    "fdesc_27": fdesc_27,
    "fdesc_28": fdesc_28,
    "fdesc_29": fdesc_29,
    "fdesc_30": fdesc_30,
    "fdesc_31": fdesc_31,
    "fdesc_32": fdesc_32,
    "fdesc_33": fdesc_33,
    "fdesc_34": fdesc_34,
    "fdesc_35": fdesc_35,
    "fdesc_36": fdesc_36,
    "fdesc_37": fdesc_37,
    "fdesc_38": fdesc_38,
    "fdesc_39": fdesc_39,

    "fmaindesc_00": fmaindesc_00,
    "fmaindesc_01": fmaindesc_01,
    "fmaindesc_02": fmaindesc_02,
    "fmaindesc_03": fmaindesc_03,
    "fmaindesc_04": fmaindesc_04,
    "fmaindesc_05": fmaindesc_05,
    "fmaindesc_06": fmaindesc_06,
    "fmaindesc_07": fmaindesc_07,
    "fmaindesc_08": fmaindesc_08,
    "fmaindesc_09": fmaindesc_09,
    "fmaindesc_10": fmaindesc_10,
    "fmaindesc_11": fmaindesc_11,
    "fmaindesc_12": fmaindesc_12,
    "fmaindesc_13": fmaindesc_13,
    "fmaindesc_14": fmaindesc_14,
    "fmaindesc_15": fmaindesc_15,
    "fmaindesc_16": fmaindesc_16,
    "fmaindesc_17": fmaindesc_17,
    "fmaindesc_18": fmaindesc_18,
    "fmaindesc_19": fmaindesc_19,
    "fmaindesc_20": fmaindesc_20,
    "fmaindesc_21": fmaindesc_21,
    "fmaindesc_22": fmaindesc_22,
    "fmaindesc_23": fmaindesc_23,
    "fmaindesc_24": fmaindesc_24,
    "fmaindesc_25": fmaindesc_25,
    "fmaindesc_26": fmaindesc_26,
    "fmaindesc_27": fmaindesc_27,
    "fmaindesc_28": fmaindesc_28,
    "fmaindesc_29": fmaindesc_29,
    "fmaindesc_30": fmaindesc_30,
    "fmaindesc_31": fmaindesc_31,
    "fmaindesc_32": fmaindesc_32,
    "fmaindesc_33": fmaindesc_33,
    "fmaindesc_34": fmaindesc_34,
    "fmaindesc_35": fmaindesc_35,
    "fmaindesc_36": fmaindesc_36,
    "fmaindesc_37": fmaindesc_37,
    "fmaindesc_38": fmaindesc_38,
    "fmaindesc_39": fmaindesc_39,

    "fdescem_00": fdescem_00,
    "fdescem_01": fdescem_01,
    "fdescem_02": fdescem_02,
    "fdescem_03": fdescem_03,
    "fdescem_04": fdescem_04,
    "fdescem_05": fdescem_05,
    "fdescem_06": fdescem_06,
    "fdescem_07": fdescem_07,
    "fdescem_08": fdescem_08,
    "fdescem_09": fdescem_09,
    "fdescem_10": fdescem_10,
    "fdescem_11": fdescem_11,
    "fdescem_12": fdescem_12,
    "fdescem_13": fdescem_13,
    "fdescem_14": fdescem_14,
    "fdescem_15": fdescem_15,
    "fdescem_16": fdescem_16,
    "fdescem_17": fdescem_17,
    "fdescem_18": fdescem_18,
    "fdescem_19": fdescem_19,
    "fdescem_20": fdescem_20,
    "fdescem_21": fdescem_21,
    "fdescem_22": fdescem_22,
    "fdescem_23": fdescem_23,
    "fdescem_24": fdescem_24,
    "fdescem_25": fdescem_25,
    "fdescem_26": fdescem_26,
    "fdescem_27": fdescem_27,
    "fdescem_28": fdescem_28,
    "fdescem_29": fdescem_29,
    "fdescem_30": fdescem_30,
    "fdescem_31": fdescem_31,
    "fdescem_32": fdescem_32,
    "fdescem_33": fdescem_33,
    "fdescem_34": fdescem_34,
    "fdescem_35": fdescem_35,
    "fdescem_36": fdescem_36,
    "fdescem_37": fdescem_37,
    "fdescem_38": fdescem_38,
    "fdescem_39": fdescem_39,

    "ficonurl_00": ficonurl_00,
    "ficonurl_01": ficonurl_01,
    "ficonurl_02": ficonurl_02,
    "ficonurl_03": ficonurl_03,
    "ficonurl_04": ficonurl_04,
    "ficonurl_05": ficonurl_05,
    "ficonurl_06": ficonurl_06,
    "ficonurl_07": ficonurl_07,
    "ficonurl_08": ficonurl_08,
    "ficonurl_09": ficonurl_09,
    "ficonurl_10": ficonurl_10,
    "ficonurl_11": ficonurl_11,
    "ficonurl_12": ficonurl_12,
    "ficonurl_13": ficonurl_13,
    "ficonurl_14": ficonurl_14,
    "ficonurl_15": ficonurl_15,
    "ficonurl_16": ficonurl_16,
    "ficonurl_17": ficonurl_17,
    "ficonurl_18": ficonurl_18,
    "ficonurl_19": ficonurl_19,
    "ficonurl_20": ficonurl_20,
    "ficonurl_21": ficonurl_21,
    "ficonurl_22": ficonurl_22,
    "ficonurl_23": ficonurl_23,
    "ficonurl_24": ficonurl_24,
    "ficonurl_25": ficonurl_25,
    "ficonurl_26": ficonurl_26,
    "ficonurl_27": ficonurl_27,
    "ficonurl_28": ficonurl_28,
    "ficonurl_29": ficonurl_29,
    "ficonurl_30": ficonurl_30,
    "ficonurl_31": ficonurl_31,
    "ficonurl_32": ficonurl_32,
    "ficonurl_33": ficonurl_33,
    "ficonurl_34": ficonurl_34,
    "ficonurl_35": ficonurl_35,
    "ficonurl_36": ficonurl_36,
    "ficonurl_37": ficonurl_37,
    "ficonurl_38": ficonurl_38,
    "ficonurl_39": ficonurl_39,

    "ficonurl2x_00": ficonurl2x_00,
    "ficonurl2x_01": ficonurl2x_01,
    "ficonurl2x_02": ficonurl2x_02,
    "ficonurl2x_03": ficonurl2x_03,
    "ficonurl2x_04": ficonurl2x_04,
    "ficonurl2x_05": ficonurl2x_05,
    "ficonurl2x_06": ficonurl2x_06,
    "ficonurl2x_07": ficonurl2x_07,
    "ficonurl2x_08": ficonurl2x_08,
    "ficonurl2x_09": ficonurl2x_09,
    "ficonurl2x_10": ficonurl2x_10,
    "ficonurl2x_11": ficonurl2x_11,
    "ficonurl2x_12": ficonurl2x_12,
    "ficonurl2x_13": ficonurl2x_13,
    "ficonurl2x_14": ficonurl2x_14,
    "ficonurl2x_15": ficonurl2x_15,
    "ficonurl2x_16": ficonurl2x_16,
    "ficonurl2x_17": ficonurl2x_17,
    "ficonurl2x_18": ficonurl2x_18,
    "ficonurl2x_19": ficonurl2x_19,
    "ficonurl2x_20": ficonurl2x_20,
    "ficonurl2x_21": ficonurl2x_21,
    "ficonurl2x_22": ficonurl2x_22,
    "ficonurl2x_23": ficonurl2x_23,
    "ficonurl2x_24": ficonurl2x_24,
    "ficonurl2x_25": ficonurl2x_25,
    "ficonurl2x_26": ficonurl2x_26,
    "ficonurl2x_27": ficonurl2x_27,
    "ficonurl2x_28": ficonurl2x_28,
    "ficonurl2x_29": ficonurl2x_29,
    "ficonurl2x_30": ficonurl2x_30,
    "ficonurl2x_31": ficonurl2x_31,
    "ficonurl2x_32": ficonurl2x_32,
    "ficonurl2x_33": ficonurl2x_33,
    "ficonurl2x_34": ficonurl2x_34,
    "ficonurl2x_35": ficonurl2x_35,
    "ficonurl2x_36": ficonurl2x_36,
    "ficonurl2x_37": ficonurl2x_37,
    "ficonurl2x_38": ficonurl2x_38,
    "ficonurl2x_39": ficonurl2x_39,

    "fwindspeed_00": fwindspeed_00,
    "fwindspeed_01": fwindspeed_01,
    "fwindspeed_02": fwindspeed_02,
    "fwindspeed_03": fwindspeed_03,
    "fwindspeed_04": fwindspeed_04,
    "fwindspeed_05": fwindspeed_05,
    "fwindspeed_06": fwindspeed_06,
    "fwindspeed_07": fwindspeed_07,
    "fwindspeed_08": fwindspeed_08,
    "fwindspeed_09": fwindspeed_09,
    "fwindspeed_10": fwindspeed_10,
    "fwindspeed_11": fwindspeed_11,
    "fwindspeed_12": fwindspeed_12,
    "fwindspeed_13": fwindspeed_13,
    "fwindspeed_14": fwindspeed_14,
    "fwindspeed_15": fwindspeed_15,
    "fwindspeed_16": fwindspeed_16,
    "fwindspeed_17": fwindspeed_17,
    "fwindspeed_18": fwindspeed_18,
    "fwindspeed_19": fwindspeed_19,
    "fwindspeed_20": fwindspeed_20,
    "fwindspeed_21": fwindspeed_21,
    "fwindspeed_22": fwindspeed_22,
    "fwindspeed_23": fwindspeed_23,
    "fwindspeed_24": fwindspeed_24,
    "fwindspeed_25": fwindspeed_25,
    "fwindspeed_26": fwindspeed_26,
    "fwindspeed_27": fwindspeed_27,
    "fwindspeed_28": fwindspeed_28,
    "fwindspeed_29": fwindspeed_29,
    "fwindspeed_30": fwindspeed_30,
    "fwindspeed_31": fwindspeed_31,
    "fwindspeed_32": fwindspeed_32,
    "fwindspeed_33": fwindspeed_33,
    "fwindspeed_34": fwindspeed_34,
    "fwindspeed_35": fwindspeed_35,
    "fwindspeed_36": fwindspeed_36,
    "fwindspeed_37": fwindspeed_37,
    "fwindspeed_38": fwindspeed_38,
    "fwindspeed_39": fwindspeed_39,

    "fwindspeedms_00": fwindspeedms_00,
    "fwindspeedms_01": fwindspeedms_01,
    "fwindspeedms_02": fwindspeedms_02,
    "fwindspeedms_03": fwindspeedms_03,
    "fwindspeedms_04": fwindspeedms_04,
    "fwindspeedms_05": fwindspeedms_05,
    "fwindspeedms_06": fwindspeedms_06,
    "fwindspeedms_07": fwindspeedms_07,
    "fwindspeedms_08": fwindspeedms_08,
    "fwindspeedms_09": fwindspeedms_09,
    "fwindspeedms_10": fwindspeedms_10,
    "fwindspeedms_11": fwindspeedms_11,
    "fwindspeedms_12": fwindspeedms_12,
    "fwindspeedms_13": fwindspeedms_13,
    "fwindspeedms_14": fwindspeedms_14,
    "fwindspeedms_15": fwindspeedms_15,
    "fwindspeedms_16": fwindspeedms_16,
    "fwindspeedms_17": fwindspeedms_17,
    "fwindspeedms_18": fwindspeedms_18,
    "fwindspeedms_19": fwindspeedms_19,
    "fwindspeedms_20": fwindspeedms_20,
    "fwindspeedms_21": fwindspeedms_21,
    "fwindspeedms_22": fwindspeedms_22,
    "fwindspeedms_23": fwindspeedms_23,
    "fwindspeedms_24": fwindspeedms_24,
    "fwindspeedms_25": fwindspeedms_25,
    "fwindspeedms_26": fwindspeedms_26,
    "fwindspeedms_27": fwindspeedms_27,
    "fwindspeedms_28": fwindspeedms_28,
    "fwindspeedms_29": fwindspeedms_29,
    "fwindspeedms_30": fwindspeedms_30,
    "fwindspeedms_31": fwindspeedms_31,
    "fwindspeedms_32": fwindspeedms_32,
    "fwindspeedms_33": fwindspeedms_33,
    "fwindspeedms_34": fwindspeedms_34,
    "fwindspeedms_35": fwindspeedms_35,
    "fwindspeedms_36": fwindspeedms_36,
    "fwindspeedms_37": fwindspeedms_37,
    "fwindspeedms_38": fwindspeedms_38,
    "fwindspeedms_39": fwindspeedms_39,

    "fwinddeg_00": fwinddeg_00,
    "fwinddeg_01": fwinddeg_01,
    "fwinddeg_02": fwinddeg_02,
    "fwinddeg_03": fwinddeg_03,
    "fwinddeg_04": fwinddeg_04,
    "fwinddeg_05": fwinddeg_05,
    "fwinddeg_06": fwinddeg_06,
    "fwinddeg_07": fwinddeg_07,
    "fwinddeg_08": fwinddeg_08,
    "fwinddeg_09": fwinddeg_09,
    "fwinddeg_10": fwinddeg_10,
    "fwinddeg_11": fwinddeg_11,
    "fwinddeg_12": fwinddeg_12,
    "fwinddeg_13": fwinddeg_13,
    "fwinddeg_14": fwinddeg_14,
    "fwinddeg_15": fwinddeg_15,
    "fwinddeg_16": fwinddeg_16,
    "fwinddeg_17": fwinddeg_17,
    "fwinddeg_18": fwinddeg_18,
    "fwinddeg_19": fwinddeg_19,
    "fwinddeg_20": fwinddeg_20,
    "fwinddeg_21": fwinddeg_21,
    "fwinddeg_22": fwinddeg_22,
    "fwinddeg_23": fwinddeg_23,
    "fwinddeg_24": fwinddeg_24,
    "fwinddeg_25": fwinddeg_25,
    "fwinddeg_26": fwinddeg_26,
    "fwinddeg_27": fwinddeg_27,
    "fwinddeg_28": fwinddeg_28,
    "fwinddeg_29": fwinddeg_29,
    "fwinddeg_30": fwinddeg_30,
    "fwinddeg_31": fwinddeg_31,
    "fwinddeg_32": fwinddeg_32,
    "fwinddeg_33": fwinddeg_33,
    "fwinddeg_34": fwinddeg_34,
    "fwinddeg_35": fwinddeg_35,
    "fwinddeg_36": fwinddeg_36,
    "fwinddeg_37": fwinddeg_37,
    "fwinddeg_38": fwinddeg_38,
    "fwinddeg_39": fwinddeg_39,

    "fwinddir_00": fwinddir_00,
    "fwinddir_01": fwinddir_01,
    "fwinddir_02": fwinddir_02,
    "fwinddir_03": fwinddir_03,
    "fwinddir_04": fwinddir_04,
    "fwinddir_05": fwinddir_05,
    "fwinddir_06": fwinddir_06,
    "fwinddir_07": fwinddir_07,
    "fwinddir_08": fwinddir_08,
    "fwinddir_09": fwinddir_09,
    "fwinddir_10": fwinddir_10,
    "fwinddir_11": fwinddir_11,
    "fwinddir_12": fwinddir_12,
    "fwinddir_13": fwinddir_13,
    "fwinddir_14": fwinddir_14,
    "fwinddir_15": fwinddir_15,
    "fwinddir_16": fwinddir_16,
    "fwinddir_17": fwinddir_17,
    "fwinddir_18": fwinddir_18,
    "fwinddir_19": fwinddir_19,
    "fwinddir_20": fwinddir_20,
    "fwinddir_21": fwinddir_21,
    "fwinddir_22": fwinddir_22,
    "fwinddir_23": fwinddir_23,
    "fwinddir_24": fwinddir_24,
    "fwinddir_25": fwinddir_25,
    "fwinddir_26": fwinddir_26,
    "fwinddir_27": fwinddir_27,
    "fwinddir_28": fwinddir_28,
    "fwinddir_29": fwinddir_29,
    "fwinddir_30": fwinddir_30,
    "fwinddir_31": fwinddir_31,
    "fwinddir_32": fwinddir_32,
    "fwinddir_33": fwinddir_33,
    "fwinddir_34": fwinddir_34,
    "fwinddir_35": fwinddir_35,
    "fwinddir_36": fwinddir_36,
    "fwinddir_37": fwinddir_37,
    "fwinddir_38": fwinddir_38,
    "fwinddir_39": fwinddir_39,

    "fwindgust_00": fwindgust_00,
    "fwindgust_01": fwindgust_01,
    "fwindgust_02": fwindgust_02,
    "fwindgust_03": fwindgust_03,
    "fwindgust_04": fwindgust_04,
    "fwindgust_05": fwindgust_05,
    "fwindgust_06": fwindgust_06,
    "fwindgust_07": fwindgust_07,
    "fwindgust_08": fwindgust_08,
    "fwindgust_09": fwindgust_09,
    "fwindgust_10": fwindgust_10,
    "fwindgust_11": fwindgust_11,
    "fwindgust_12": fwindgust_12,
    "fwindgust_13": fwindgust_13,
    "fwindgust_14": fwindgust_14,
    "fwindgust_15": fwindgust_15,
    "fwindgust_16": fwindgust_16,
    "fwindgust_17": fwindgust_17,
    "fwindgust_18": fwindgust_18,
    "fwindgust_19": fwindgust_19,
    "fwindgust_20": fwindgust_20,
    "fwindgust_21": fwindgust_21,
    "fwindgust_22": fwindgust_22,
    "fwindgust_23": fwindgust_23,
    "fwindgust_24": fwindgust_24,
    "fwindgust_25": fwindgust_25,
    "fwindgust_26": fwindgust_26,
    "fwindgust_27": fwindgust_27,
    "fwindgust_28": fwindgust_28,
    "fwindgust_29": fwindgust_29,
    "fwindgust_30": fwindgust_30,
    "fwindgust_31": fwindgust_31,
    "fwindgust_32": fwindgust_32,
    "fwindgust_33": fwindgust_33,
    "fwindgust_34": fwindgust_34,
    "fwindgust_35": fwindgust_35,
    "fwindgust_36": fwindgust_36,
    "fwindgust_37": fwindgust_37,
    "fwindgust_38": fwindgust_38,
    "fwindgust_39": fwindgust_39,

    "fwindgustms_00": fwindgustms_00,
    "fwindgustms_01": fwindgustms_01,
    "fwindgustms_02": fwindgustms_02,
    "fwindgustms_03": fwindgustms_03,
    "fwindgustms_04": fwindgustms_04,
    "fwindgustms_05": fwindgustms_05,
    "fwindgustms_06": fwindgustms_06,
    "fwindgustms_07": fwindgustms_07,
    "fwindgustms_08": fwindgustms_08,
    "fwindgustms_09": fwindgustms_09,
    "fwindgustms_10": fwindgustms_10,
    "fwindgustms_11": fwindgustms_11,
    "fwindgustms_12": fwindgustms_12,
    "fwindgustms_13": fwindgustms_13,
    "fwindgustms_14": fwindgustms_14,
    "fwindgustms_15": fwindgustms_15,
    "fwindgustms_16": fwindgustms_16,
    "fwindgustms_17": fwindgustms_17,
    "fwindgustms_18": fwindgustms_18,
    "fwindgustms_19": fwindgustms_19,
    "fwindgustms_20": fwindgustms_20,
    "fwindgustms_21": fwindgustms_21,
    "fwindgustms_22": fwindgustms_22,
    "fwindgustms_23": fwindgustms_23,
    "fwindgustms_24": fwindgustms_24,
    "fwindgustms_25": fwindgustms_25,
    "fwindgustms_26": fwindgustms_26,
    "fwindgustms_27": fwindgustms_27,
    "fwindgustms_28": fwindgustms_28,
    "fwindgustms_29": fwindgustms_29,
    "fwindgustms_30": fwindgustms_30,
    "fwindgustms_31": fwindgustms_31,
    "fwindgustms_32": fwindgustms_32,
    "fwindgustms_33": fwindgustms_33,
    "fwindgustms_34": fwindgustms_34,
    "fwindgustms_35": fwindgustms_35,
    "fwindgustms_36": fwindgustms_36,
    "fwindgustms_37": fwindgustms_37,
    "fwindgustms_38": fwindgustms_38,
    "fwindgustms_39": fwindgustms_39,

  };
    
    // getWeather - Create Formatted weather string 
    let tempStr1 = format.replace(/%fyear_00%/gmi, weatherData.ftemp_00);
    tempStr1 = tempStr1.replace(/%fyear_01%/gmi, weatherData.fyear_01);
    tempStr1 = tempStr1.replace(/%fyear_02%/gmi, weatherData.fyear_02);
    tempStr1 = tempStr1.replace(/%fyear_03%/gmi, weatherData.fyear_03);
    tempStr1 = tempStr1.replace(/%fyear_04%/gmi, weatherData.fyear_04);
    tempStr1 = tempStr1.replace(/%fyear_05%/gmi, weatherData.fyear_05);
    tempStr1 = tempStr1.replace(/%fyear_06%/gmi, weatherData.fyear_06);
    tempStr1 = tempStr1.replace(/%fyear_07%/gmi, weatherData.fyear_07);
    tempStr1 = tempStr1.replace(/%fyear_08%/gmi, weatherData.fyear_08);
    tempStr1 = tempStr1.replace(/%fyear_09%/gmi, weatherData.fyear_09);
    tempStr1 = tempStr1.replace(/%fyear_10%/gmi, weatherData.fyear_10);
    tempStr1 = tempStr1.replace(/%fyear_11%/gmi, weatherData.fyear_11);
    tempStr1 = tempStr1.replace(/%fyear_12%/gmi, weatherData.fyear_12);
    tempStr1 = tempStr1.replace(/%fyear_13%/gmi, weatherData.fyear_13);
    tempStr1 = tempStr1.replace(/%fyear_14%/gmi, weatherData.fyear_14);
    tempStr1 = tempStr1.replace(/%fyear_15%/gmi, weatherData.fyear_15);
    tempStr1 = tempStr1.replace(/%fyear_16%/gmi, weatherData.fyear_16);
    tempStr1 = tempStr1.replace(/%fyear_17%/gmi, weatherData.fyear_17);
    tempStr1 = tempStr1.replace(/%fyear_18%/gmi, weatherData.fyear_18);
    tempStr1 = tempStr1.replace(/%fyear_19%/gmi, weatherData.fyear_19);
    tempStr1 = tempStr1.replace(/%fyear_20%/gmi, weatherData.fyear_20);
    tempStr1 = tempStr1.replace(/%fyear_21%/gmi, weatherData.fyear_21);
    tempStr1 = tempStr1.replace(/%fyear_22%/gmi, weatherData.fyear_22);
    tempStr1 = tempStr1.replace(/%fyear_23%/gmi, weatherData.fyear_23);
    tempStr1 = tempStr1.replace(/%fyear_24%/gmi, weatherData.fyear_24);
    tempStr1 = tempStr1.replace(/%fyear_25%/gmi, weatherData.fyear_25);
    tempStr1 = tempStr1.replace(/%fyear_26%/gmi, weatherData.fyear_26);
    tempStr1 = tempStr1.replace(/%fyear_27%/gmi, weatherData.fyear_27);
    tempStr1 = tempStr1.replace(/%fyear_28%/gmi, weatherData.fyear_28);
    tempStr1 = tempStr1.replace(/%fyear_29%/gmi, weatherData.fyear_29);
    tempStr1 = tempStr1.replace(/%fyear_30%/gmi, weatherData.fyear_30);
    tempStr1 = tempStr1.replace(/%fyear_31%/gmi, weatherData.fyear_31);
    tempStr1 = tempStr1.replace(/%fyear_32%/gmi, weatherData.fyear_32);
    tempStr1 = tempStr1.replace(/%fyear_33%/gmi, weatherData.fyear_33);
    tempStr1 = tempStr1.replace(/%fyear_34%/gmi, weatherData.fyear_34);
    tempStr1 = tempStr1.replace(/%fyear_35%/gmi, weatherData.fyear_35);
    tempStr1 = tempStr1.replace(/%fyear_36%/gmi, weatherData.fyear_36);
    tempStr1 = tempStr1.replace(/%fyear_37%/gmi, weatherData.fyear_37);
    tempStr1 = tempStr1.replace(/%fyear_38%/gmi, weatherData.fyear_38);
    tempStr1 = tempStr1.replace(/%fyear_39%/gmi, weatherData.fyear_39);
    let tempStr2 = tempStr1.replace(/%fmonth_00%/gmi, weatherData.fmonth_00);
    tempStr2 = tempStr2.replace(/%fmonth_01%/gmi, weatherData.fmonth_01);
    tempStr2 = tempStr2.replace(/%fmonth_02%/gmi, weatherData.fmonth_02);
    tempStr2 = tempStr2.replace(/%fmonth_03%/gmi, weatherData.fmonth_03);
    tempStr2 = tempStr2.replace(/%fmonth_04%/gmi, weatherData.fmonth_04);
    tempStr2 = tempStr2.replace(/%fmonth_05%/gmi, weatherData.fmonth_05);
    tempStr2 = tempStr2.replace(/%fmonth_06%/gmi, weatherData.fmonth_06);
    tempStr2 = tempStr2.replace(/%fmonth_07%/gmi, weatherData.fmonth_07);
    tempStr2 = tempStr2.replace(/%fmonth_08%/gmi, weatherData.fmonth_08);
    tempStr2 = tempStr2.replace(/%fmonth_09%/gmi, weatherData.fmonth_09);
    tempStr2 = tempStr2.replace(/%fmonth_10%/gmi, weatherData.fmonth_10);
    tempStr2 = tempStr2.replace(/%fmonth_11%/gmi, weatherData.fmonth_11);
    tempStr2 = tempStr2.replace(/%fmonth_12%/gmi, weatherData.fmonth_12);
    tempStr2 = tempStr2.replace(/%fmonth_13%/gmi, weatherData.fmonth_13);
    tempStr2 = tempStr2.replace(/%fmonth_14%/gmi, weatherData.fmonth_14);
    tempStr2 = tempStr2.replace(/%fmonth_15%/gmi, weatherData.fmonth_15);
    tempStr2 = tempStr2.replace(/%fmonth_16%/gmi, weatherData.fmonth_16);
    tempStr2 = tempStr2.replace(/%fmonth_17%/gmi, weatherData.fmonth_17);
    tempStr2 = tempStr2.replace(/%fmonth_18%/gmi, weatherData.fmonth_18);
    tempStr2 = tempStr2.replace(/%fmonth_19%/gmi, weatherData.fmonth_19);
    tempStr2 = tempStr2.replace(/%fmonth_20%/gmi, weatherData.fmonth_20);
    tempStr2 = tempStr2.replace(/%fmonth_21%/gmi, weatherData.fmonth_21);
    tempStr2 = tempStr2.replace(/%fmonth_22%/gmi, weatherData.fmonth_22);
    tempStr2 = tempStr2.replace(/%fmonth_23%/gmi, weatherData.fmonth_23);
    tempStr2 = tempStr2.replace(/%fmonth_24%/gmi, weatherData.fmonth_24);
    tempStr2 = tempStr2.replace(/%fmonth_25%/gmi, weatherData.fmonth_25);
    tempStr2 = tempStr2.replace(/%fmonth_26%/gmi, weatherData.fmonth_26);
    tempStr2 = tempStr2.replace(/%fmonth_27%/gmi, weatherData.fmonth_27);
    tempStr2 = tempStr2.replace(/%fmonth_28%/gmi, weatherData.fmonth_28);
    tempStr2 = tempStr2.replace(/%fmonth_29%/gmi, weatherData.fmonth_29);
    tempStr2 = tempStr2.replace(/%fmonth_30%/gmi, weatherData.fmonth_30);
    tempStr2 = tempStr2.replace(/%fmonth_31%/gmi, weatherData.fmonth_31);
    tempStr2 = tempStr2.replace(/%fmonth_32%/gmi, weatherData.fmonth_32);
    tempStr2 = tempStr2.replace(/%fmonth_33%/gmi, weatherData.fmonth_33);
    tempStr2 = tempStr2.replace(/%fmonth_34%/gmi, weatherData.fmonth_34);
    tempStr2 = tempStr2.replace(/%fmonth_35%/gmi, weatherData.fmonth_35);
    tempStr2 = tempStr2.replace(/%fmonth_36%/gmi, weatherData.fmonth_36);
    tempStr2 = tempStr2.replace(/%fmonth_37%/gmi, weatherData.fmonth_37);
    tempStr2 = tempStr2.replace(/%fmonth_38%/gmi, weatherData.fmonth_38);
    tempStr2 = tempStr2.replace(/%fmonth_39%/gmi, weatherData.fmonth_39);

    let tempStr3 = tempStr2.replace(/%fdate_00%/gmi, weatherData.fdate_00);
    tempStr3 = tempStr3.replace(/%fdate_01%/gmi, weatherData.fdate_01);
    tempStr3 = tempStr3.replace(/%fdate_02%/gmi, weatherData.fdate_02);
    tempStr3 = tempStr3.replace(/%fdate_03%/gmi, weatherData.fdate_03);
    tempStr3 = tempStr3.replace(/%fdate_04%/gmi, weatherData.fdate_04);
    tempStr3 = tempStr3.replace(/%fdate_05%/gmi, weatherData.fdate_05);
    tempStr3 = tempStr3.replace(/%fdate_06%/gmi, weatherData.fdate_06);
    tempStr3 = tempStr3.replace(/%fdate_07%/gmi, weatherData.fdate_07);
    tempStr3 = tempStr3.replace(/%fdate_08%/gmi, weatherData.fdate_08);
    tempStr3 = tempStr3.replace(/%fdate_09%/gmi, weatherData.fdate_09);
    tempStr3 = tempStr3.replace(/%fdate_10%/gmi, weatherData.fdate_10);
    tempStr3 = tempStr3.replace(/%fdate_11%/gmi, weatherData.fdate_11);
    tempStr3 = tempStr3.replace(/%fdate_12%/gmi, weatherData.fdate_12);
    tempStr3 = tempStr3.replace(/%fdate_13%/gmi, weatherData.fdate_13);
    tempStr3 = tempStr3.replace(/%fdate_14%/gmi, weatherData.fdate_14);
    tempStr3 = tempStr3.replace(/%fdate_15%/gmi, weatherData.fdate_15);
    tempStr3 = tempStr3.replace(/%fdate_16%/gmi, weatherData.fdate_16);
    tempStr3 = tempStr3.replace(/%fdate_17%/gmi, weatherData.fdate_17);
    tempStr3 = tempStr3.replace(/%fdate_18%/gmi, weatherData.fdate_18);
    tempStr3 = tempStr3.replace(/%fdate_19%/gmi, weatherData.fdate_19);
    tempStr3 = tempStr3.replace(/%fdate_20%/gmi, weatherData.fdate_20);
    tempStr3 = tempStr3.replace(/%fdate_21%/gmi, weatherData.fdate_21);
    tempStr3 = tempStr3.replace(/%fdate_22%/gmi, weatherData.fdate_22);
    tempStr3 = tempStr3.replace(/%fdate_23%/gmi, weatherData.fdate_23);
    tempStr3 = tempStr3.replace(/%fdate_24%/gmi, weatherData.fdate_24);
    tempStr3 = tempStr3.replace(/%fdate_25%/gmi, weatherData.fdate_25);
    tempStr3 = tempStr3.replace(/%fdate_26%/gmi, weatherData.fdate_26);
    tempStr3 = tempStr3.replace(/%fdate_27%/gmi, weatherData.fdate_27);
    tempStr3 = tempStr3.replace(/%fdate_28%/gmi, weatherData.fdate_28);
    tempStr3 = tempStr3.replace(/%fdate_29%/gmi, weatherData.fdate_29);
    tempStr3 = tempStr3.replace(/%fdate_30%/gmi, weatherData.fdate_30);
    tempStr3 = tempStr3.replace(/%fdate_31%/gmi, weatherData.fdate_31);
    tempStr3 = tempStr3.replace(/%fdate_32%/gmi, weatherData.fdate_32);
    tempStr3 = tempStr3.replace(/%fdate_33%/gmi, weatherData.fdate_33);
    tempStr3 = tempStr3.replace(/%fdate_34%/gmi, weatherData.fdate_34);
    tempStr3 = tempStr3.replace(/%fdate_35%/gmi, weatherData.fdate_35);
    tempStr3 = tempStr3.replace(/%fdate_36%/gmi, weatherData.fdate_36);
    tempStr3 = tempStr3.replace(/%fdate_37%/gmi, weatherData.fdate_37);
    tempStr3 = tempStr3.replace(/%fdate_38%/gmi, weatherData.fdate_38);
    tempStr3 = tempStr3.replace(/%fdate_39%/gmi, weatherData.fdate_39);

    let tempStr4 = tempStr3.replace(/%fhours_00%/gmi, weatherData.fhours_00);
    tempStr4 = tempStr4.replace(/%fhours_01%/gmi, weatherData.fhours_01);
    tempStr4 = tempStr4.replace(/%fhours_02%/gmi, weatherData.fhours_02);
    tempStr4 = tempStr4.replace(/%fhours_03%/gmi, weatherData.fhours_03);
    tempStr4 = tempStr4.replace(/%fhours_04%/gmi, weatherData.fhours_04);
    tempStr4 = tempStr4.replace(/%fhours_05%/gmi, weatherData.fhours_05);
    tempStr4 = tempStr4.replace(/%fhours_06%/gmi, weatherData.fhours_06);
    tempStr4 = tempStr4.replace(/%fhours_07%/gmi, weatherData.fhours_07);
    tempStr4 = tempStr4.replace(/%fhours_08%/gmi, weatherData.fhours_08);
    tempStr4 = tempStr4.replace(/%fhours_09%/gmi, weatherData.fhours_09);
    tempStr4 = tempStr4.replace(/%fhours_10%/gmi, weatherData.fhours_10);
    tempStr4 = tempStr4.replace(/%fhours_11%/gmi, weatherData.fhours_11);
    tempStr4 = tempStr4.replace(/%fhours_12%/gmi, weatherData.fhours_12);
    tempStr4 = tempStr4.replace(/%fhours_13%/gmi, weatherData.fhours_13);
    tempStr4 = tempStr4.replace(/%fhours_14%/gmi, weatherData.fhours_14);
    tempStr4 = tempStr4.replace(/%fhours_15%/gmi, weatherData.fhours_15);
    tempStr4 = tempStr4.replace(/%fhours_16%/gmi, weatherData.fhours_16);
    tempStr4 = tempStr4.replace(/%fhours_17%/gmi, weatherData.fhours_17);
    tempStr4 = tempStr4.replace(/%fhours_18%/gmi, weatherData.fhours_18);
    tempStr4 = tempStr4.replace(/%fhours_19%/gmi, weatherData.fhours_19);
    tempStr4 = tempStr4.replace(/%fhours_20%/gmi, weatherData.fhours_20);
    tempStr4 = tempStr4.replace(/%fhours_21%/gmi, weatherData.fhours_21);
    tempStr4 = tempStr4.replace(/%fhours_22%/gmi, weatherData.fhours_22);
    tempStr4 = tempStr4.replace(/%fhours_23%/gmi, weatherData.fhours_23);
    tempStr4 = tempStr4.replace(/%fhours_24%/gmi, weatherData.fhours_24);
    tempStr4 = tempStr4.replace(/%fhours_25%/gmi, weatherData.fhours_25);
    tempStr4 = tempStr4.replace(/%fhours_26%/gmi, weatherData.fhours_26);
    tempStr4 = tempStr4.replace(/%fhours_27%/gmi, weatherData.fhours_27);
    tempStr4 = tempStr4.replace(/%fhours_28%/gmi, weatherData.fhours_28);
    tempStr4 = tempStr4.replace(/%fhours_29%/gmi, weatherData.fhours_29);
    tempStr4 = tempStr4.replace(/%fhours_30%/gmi, weatherData.fhours_30);
    tempStr4 = tempStr4.replace(/%fhours_31%/gmi, weatherData.fhours_31);
    tempStr4 = tempStr4.replace(/%fhours_32%/gmi, weatherData.fhours_32);
    tempStr4 = tempStr4.replace(/%fhours_33%/gmi, weatherData.fhours_33);
    tempStr4 = tempStr4.replace(/%fhours_34%/gmi, weatherData.fhours_34);
    tempStr4 = tempStr4.replace(/%fhours_35%/gmi, weatherData.fhours_35);
    tempStr4 = tempStr4.replace(/%fhours_36%/gmi, weatherData.fhours_36);
    tempStr4 = tempStr4.replace(/%fhours_37%/gmi, weatherData.fhours_37);
    tempStr4 = tempStr4.replace(/%fhours_38%/gmi, weatherData.fhours_38);
    tempStr4 = tempStr4.replace(/%fhours_39%/gmi, weatherData.fhours_39);

    let tempStr5 = tempStr4.replace(/%fmins_00%/gmi, weatherData.fmins_00);
    tempStr5 = tempStr5.replace(/%fmins_01%/gmi, weatherData.fmins_01);
    tempStr5 = tempStr5.replace(/%fmins_02%/gmi, weatherData.fmins_02);
    tempStr5 = tempStr5.replace(/%fmins_03%/gmi, weatherData.fmins_03);
    tempStr5 = tempStr5.replace(/%fmins_04%/gmi, weatherData.fmins_04);
    tempStr5 = tempStr5.replace(/%fmins_05%/gmi, weatherData.fmins_05);
    tempStr5 = tempStr5.replace(/%fmins_06%/gmi, weatherData.fmins_06);
    tempStr5 = tempStr5.replace(/%fmins_07%/gmi, weatherData.fmins_07);
    tempStr5 = tempStr5.replace(/%fmins_08%/gmi, weatherData.fmins_08);
    tempStr5 = tempStr5.replace(/%fmins_09%/gmi, weatherData.fmins_09);
    tempStr5 = tempStr5.replace(/%fmins_10%/gmi, weatherData.fmins_10);
    tempStr5 = tempStr5.replace(/%fmins_11%/gmi, weatherData.fmins_11);
    tempStr5 = tempStr5.replace(/%fmins_12%/gmi, weatherData.fmins_12);
    tempStr5 = tempStr5.replace(/%fmins_13%/gmi, weatherData.fmins_13);
    tempStr5 = tempStr5.replace(/%fmins_14%/gmi, weatherData.fmins_14);
    tempStr5 = tempStr5.replace(/%fmins_15%/gmi, weatherData.fmins_15);
    tempStr5 = tempStr5.replace(/%fmins_16%/gmi, weatherData.fmins_16);
    tempStr5 = tempStr5.replace(/%fmins_17%/gmi, weatherData.fmins_17);
    tempStr5 = tempStr5.replace(/%fmins_18%/gmi, weatherData.fmins_18);
    tempStr5 = tempStr5.replace(/%fmins_19%/gmi, weatherData.fmins_19);
    tempStr5 = tempStr5.replace(/%fmins_20%/gmi, weatherData.fmins_20);
    tempStr5 = tempStr5.replace(/%fmins_21%/gmi, weatherData.fmins_21);
    tempStr5 = tempStr5.replace(/%fmins_22%/gmi, weatherData.fmins_22);
    tempStr5 = tempStr5.replace(/%fmins_23%/gmi, weatherData.fmins_23);
    tempStr5 = tempStr5.replace(/%fmins_24%/gmi, weatherData.fmins_24);
    tempStr5 = tempStr5.replace(/%fmins_25%/gmi, weatherData.fmins_25);
    tempStr5 = tempStr5.replace(/%fmins_26%/gmi, weatherData.fmins_26);
    tempStr5 = tempStr5.replace(/%fmins_27%/gmi, weatherData.fmins_27);
    tempStr5 = tempStr5.replace(/%fmins_28%/gmi, weatherData.fmins_28);
    tempStr5 = tempStr5.replace(/%fmins_29%/gmi, weatherData.fmins_29);
    tempStr5 = tempStr5.replace(/%fmins_30%/gmi, weatherData.fmins_30);
    tempStr5 = tempStr5.replace(/%fmins_31%/gmi, weatherData.fmins_31);
    tempStr5 = tempStr5.replace(/%fmins_32%/gmi, weatherData.fmins_32);
    tempStr5 = tempStr5.replace(/%fmins_33%/gmi, weatherData.fmins_33);
    tempStr5 = tempStr5.replace(/%fmins_34%/gmi, weatherData.fmins_34);
    tempStr5 = tempStr5.replace(/%fmins_35%/gmi, weatherData.fmins_35);
    tempStr5 = tempStr5.replace(/%fmins_36%/gmi, weatherData.fmins_36);
    tempStr5 = tempStr5.replace(/%fmins_37%/gmi, weatherData.fmins_37);
    tempStr5 = tempStr5.replace(/%fmins_38%/gmi, weatherData.fmins_38);
    tempStr5 = tempStr5.replace(/%fmins_39%/gmi, weatherData.fmins_39);

    let tempStr6 = tempStr5.replace(/%fsecs_00%/gmi, weatherData.fsecs_00);
    tempStr6 = tempStr6.replace(/%fsecs_01%/gmi, weatherData.fsecs_01);
    tempStr6 = tempStr6.replace(/%fsecs_02%/gmi, weatherData.fsecs_02);
    tempStr6 = tempStr6.replace(/%fsecs_03%/gmi, weatherData.fsecs_03);
    tempStr6 = tempStr6.replace(/%fsecs_04%/gmi, weatherData.fsecs_04);
    tempStr6 = tempStr6.replace(/%fsecs_05%/gmi, weatherData.fsecs_05);
    tempStr6 = tempStr6.replace(/%fsecs_06%/gmi, weatherData.fsecs_06);
    tempStr6 = tempStr6.replace(/%fsecs_07%/gmi, weatherData.fsecs_07);
    tempStr6 = tempStr6.replace(/%fsecs_08%/gmi, weatherData.fsecs_08);
    tempStr6 = tempStr6.replace(/%fsecs_09%/gmi, weatherData.fsecs_09);
    tempStr6 = tempStr6.replace(/%fsecs_10%/gmi, weatherData.fsecs_10);
    tempStr6 = tempStr6.replace(/%fsecs_11%/gmi, weatherData.fsecs_11);
    tempStr6 = tempStr6.replace(/%fsecs_12%/gmi, weatherData.fsecs_12);
    tempStr6 = tempStr6.replace(/%fsecs_13%/gmi, weatherData.fsecs_13);
    tempStr6 = tempStr6.replace(/%fsecs_14%/gmi, weatherData.fsecs_14);
    tempStr6 = tempStr6.replace(/%fsecs_15%/gmi, weatherData.fsecs_15);
    tempStr6 = tempStr6.replace(/%fsecs_16%/gmi, weatherData.fsecs_16);
    tempStr6 = tempStr6.replace(/%fsecs_17%/gmi, weatherData.fsecs_17);
    tempStr6 = tempStr6.replace(/%fsecs_18%/gmi, weatherData.fsecs_18);
    tempStr6 = tempStr6.replace(/%fsecs_19%/gmi, weatherData.fsecs_19);
    tempStr6 = tempStr6.replace(/%fsecs_20%/gmi, weatherData.fsecs_20);
    tempStr6 = tempStr6.replace(/%fsecs_21%/gmi, weatherData.fsecs_21);
    tempStr6 = tempStr6.replace(/%fsecs_22%/gmi, weatherData.fsecs_22);
    tempStr6 = tempStr6.replace(/%fsecs_23%/gmi, weatherData.fsecs_23);
    tempStr6 = tempStr6.replace(/%fsecs_24%/gmi, weatherData.fsecs_24);
    tempStr6 = tempStr6.replace(/%fsecs_25%/gmi, weatherData.fsecs_25);
    tempStr6 = tempStr6.replace(/%fsecs_26%/gmi, weatherData.fsecs_26);
    tempStr6 = tempStr6.replace(/%fsecs_27%/gmi, weatherData.fsecs_27);
    tempStr6 = tempStr6.replace(/%fsecs_28%/gmi, weatherData.fsecs_28);
    tempStr6 = tempStr6.replace(/%fsecs_29%/gmi, weatherData.fsecs_29);
    tempStr6 = tempStr6.replace(/%fsecs_30%/gmi, weatherData.fsecs_30);
    tempStr6 = tempStr6.replace(/%fsecs_31%/gmi, weatherData.fsecs_31);
    tempStr6 = tempStr6.replace(/%fsecs_32%/gmi, weatherData.fsecs_32);
    tempStr6 = tempStr6.replace(/%fsecs_33%/gmi, weatherData.fsecs_33);
    tempStr6 = tempStr6.replace(/%fsecs_34%/gmi, weatherData.fsecs_34);
    tempStr6 = tempStr6.replace(/%fsecs_35%/gmi, weatherData.fsecs_35);
    tempStr6 = tempStr6.replace(/%fsecs_36%/gmi, weatherData.fsecs_36);
    tempStr6 = tempStr6.replace(/%fsecs_37%/gmi, weatherData.fsecs_37);
    tempStr6 = tempStr6.replace(/%fsecs_38%/gmi, weatherData.fsecs_38);
    tempStr6 = tempStr6.replace(/%fsecs_39%/gmi, weatherData.fsecs_39);

    let tempStr7 = tempStr6.replace(/%dt_localtime_00%/gmi, weatherData.dt_localtime_00);
    tempStr7 = tempStr7.replace(/%dt_localtime_01%/gmi, weatherData.dt_localtime_01);
    tempStr7 = tempStr7.replace(/%dt_localtime_02%/gmi, weatherData.dt_localtime_02);
    tempStr7 = tempStr7.replace(/%dt_localtime_03%/gmi, weatherData.dt_localtime_03);
    tempStr7 = tempStr7.replace(/%dt_localtime_04%/gmi, weatherData.dt_localtime_04);
    tempStr7 = tempStr7.replace(/%dt_localtime_05%/gmi, weatherData.dt_localtime_05);
    tempStr7 = tempStr7.replace(/%dt_localtime_06%/gmi, weatherData.dt_localtime_06);
    tempStr7 = tempStr7.replace(/%dt_localtime_07%/gmi, weatherData.dt_localtime_07);
    tempStr7 = tempStr7.replace(/%dt_localtime_08%/gmi, weatherData.dt_localtime_08);
    tempStr7 = tempStr7.replace(/%dt_localtime_09%/gmi, weatherData.dt_localtime_09);
    tempStr7 = tempStr7.replace(/%dt_localtime_10%/gmi, weatherData.dt_localtime_10);
    tempStr7 = tempStr7.replace(/%dt_localtime_11%/gmi, weatherData.dt_localtime_11);
    tempStr7 = tempStr7.replace(/%dt_localtime_12%/gmi, weatherData.dt_localtime_12);
    tempStr7 = tempStr7.replace(/%dt_localtime_13%/gmi, weatherData.dt_localtime_13);
    tempStr7 = tempStr7.replace(/%dt_localtime_14%/gmi, weatherData.dt_localtime_14);
    tempStr7 = tempStr7.replace(/%dt_localtime_15%/gmi, weatherData.dt_localtime_15);
    tempStr7 = tempStr7.replace(/%dt_localtime_16%/gmi, weatherData.dt_localtime_16);
    tempStr7 = tempStr7.replace(/%dt_localtime_17%/gmi, weatherData.dt_localtime_17);
    tempStr7 = tempStr7.replace(/%dt_localtime_18%/gmi, weatherData.dt_localtime_18);
    tempStr7 = tempStr7.replace(/%dt_localtime_19%/gmi, weatherData.dt_localtime_19);
    tempStr7 = tempStr7.replace(/%dt_localtime_20%/gmi, weatherData.dt_localtime_20);
    tempStr7 = tempStr7.replace(/%dt_localtime_21%/gmi, weatherData.dt_localtime_21);
    tempStr7 = tempStr7.replace(/%dt_localtime_22%/gmi, weatherData.dt_localtime_22);
    tempStr7 = tempStr7.replace(/%dt_localtime_23%/gmi, weatherData.dt_localtime_23);
    tempStr7 = tempStr7.replace(/%dt_localtime_24%/gmi, weatherData.dt_localtime_24);
    tempStr7 = tempStr7.replace(/%dt_localtime_25%/gmi, weatherData.dt_localtime_25);
    tempStr7 = tempStr7.replace(/%dt_localtime_26%/gmi, weatherData.dt_localtime_26);
    tempStr7 = tempStr7.replace(/%dt_localtime_27%/gmi, weatherData.dt_localtime_27);
    tempStr7 = tempStr7.replace(/%dt_localtime_28%/gmi, weatherData.dt_localtime_28);
    tempStr7 = tempStr7.replace(/%dt_localtime_29%/gmi, weatherData.dt_localtime_29);
    tempStr7 = tempStr7.replace(/%dt_localtime_30%/gmi, weatherData.dt_localtime_30);
    tempStr7 = tempStr7.replace(/%dt_localtime_31%/gmi, weatherData.dt_localtime_31);
    tempStr7 = tempStr7.replace(/%dt_localtime_32%/gmi, weatherData.dt_localtime_32);
    tempStr7 = tempStr7.replace(/%dt_localtime_33%/gmi, weatherData.dt_localtime_33);
    tempStr7 = tempStr7.replace(/%dt_localtime_34%/gmi, weatherData.dt_localtime_34);
    tempStr7 = tempStr7.replace(/%dt_localtime_35%/gmi, weatherData.dt_localtime_35);
    tempStr7 = tempStr7.replace(/%dt_localtime_36%/gmi, weatherData.dt_localtime_36);
    tempStr7 = tempStr7.replace(/%dt_localtime_37%/gmi, weatherData.dt_localtime_37);
    tempStr7 = tempStr7.replace(/%dt_localtime_38%/gmi, weatherData.dt_localtime_38);
    tempStr7 = tempStr7.replace(/%dt_localtime_39%/gmi, weatherData.dt_localtime_39);

    let tempStr8 = tempStr7.replace(/%d_localtime_00%/gmi, weatherData.d_localtime_00);
    tempStr8 = tempStr8.replace(/%d_localtime_01%/gmi, weatherData.d_localtime_01);
    tempStr8 = tempStr8.replace(/%d_localtime_02%/gmi, weatherData.d_localtime_02);
    tempStr8 = tempStr8.replace(/%d_localtime_03%/gmi, weatherData.d_localtime_03);
    tempStr8 = tempStr8.replace(/%d_localtime_04%/gmi, weatherData.d_localtime_04);
    tempStr8 = tempStr8.replace(/%d_localtime_05%/gmi, weatherData.d_localtime_05);
    tempStr8 = tempStr8.replace(/%d_localtime_06%/gmi, weatherData.d_localtime_06);
    tempStr8 = tempStr8.replace(/%d_localtime_07%/gmi, weatherData.d_localtime_07);
    tempStr8 = tempStr8.replace(/%d_localtime_08%/gmi, weatherData.d_localtime_08);
    tempStr8 = tempStr8.replace(/%d_localtime_09%/gmi, weatherData.d_localtime_09);
    tempStr8 = tempStr8.replace(/%d_localtime_10%/gmi, weatherData.d_localtime_10);
    tempStr8 = tempStr8.replace(/%d_localtime_11%/gmi, weatherData.d_localtime_11);
    tempStr8 = tempStr8.replace(/%d_localtime_12%/gmi, weatherData.d_localtime_12);
    tempStr8 = tempStr8.replace(/%d_localtime_13%/gmi, weatherData.d_localtime_13);
    tempStr8 = tempStr8.replace(/%d_localtime_14%/gmi, weatherData.d_localtime_14);
    tempStr8 = tempStr8.replace(/%d_localtime_15%/gmi, weatherData.d_localtime_15);
    tempStr8 = tempStr8.replace(/%d_localtime_16%/gmi, weatherData.d_localtime_16);
    tempStr8 = tempStr8.replace(/%d_localtime_17%/gmi, weatherData.d_localtime_17);
    tempStr8 = tempStr8.replace(/%d_localtime_18%/gmi, weatherData.d_localtime_18);
    tempStr8 = tempStr8.replace(/%d_localtime_19%/gmi, weatherData.d_localtime_19);
    tempStr8 = tempStr8.replace(/%d_localtime_20%/gmi, weatherData.d_localtime_20);
    tempStr8 = tempStr8.replace(/%d_localtime_21%/gmi, weatherData.d_localtime_21);
    tempStr8 = tempStr8.replace(/%d_localtime_22%/gmi, weatherData.d_localtime_22);
    tempStr8 = tempStr8.replace(/%d_localtime_23%/gmi, weatherData.d_localtime_23);
    tempStr8 = tempStr8.replace(/%d_localtime_24%/gmi, weatherData.d_localtime_24);
    tempStr8 = tempStr8.replace(/%d_localtime_25%/gmi, weatherData.d_localtime_25);
    tempStr8 = tempStr8.replace(/%d_localtime_26%/gmi, weatherData.d_localtime_26);
    tempStr8 = tempStr8.replace(/%d_localtime_27%/gmi, weatherData.d_localtime_27);
    tempStr8 = tempStr8.replace(/%d_localtime_28%/gmi, weatherData.d_localtime_28);
    tempStr8 = tempStr8.replace(/%d_localtime_29%/gmi, weatherData.d_localtime_29);
    tempStr8 = tempStr8.replace(/%d_localtime_30%/gmi, weatherData.d_localtime_30);
    tempStr8 = tempStr8.replace(/%d_localtime_31%/gmi, weatherData.d_localtime_31);
    tempStr8 = tempStr8.replace(/%d_localtime_32%/gmi, weatherData.d_localtime_32);
    tempStr8 = tempStr8.replace(/%d_localtime_33%/gmi, weatherData.d_localtime_33);
    tempStr8 = tempStr8.replace(/%d_localtime_34%/gmi, weatherData.d_localtime_34);
    tempStr8 = tempStr8.replace(/%d_localtime_35%/gmi, weatherData.d_localtime_35);
    tempStr8 = tempStr8.replace(/%d_localtime_36%/gmi, weatherData.d_localtime_36);
    tempStr8 = tempStr8.replace(/%d_localtime_37%/gmi, weatherData.d_localtime_37);
    tempStr8 = tempStr8.replace(/%d_localtime_38%/gmi, weatherData.d_localtime_38);
    tempStr8 = tempStr8.replace(/%d_localtime_39%/gmi, weatherData.d_localtime_39);

    let tempStr9 = tempStr8.replace(/%ds_localtime_00%/gmi, weatherData.ds_localtime_00);
    tempStr9 = tempStr9.replace(/%ds_localtime_01%/gmi, weatherData.ds_localtime_01);
    tempStr9 = tempStr9.replace(/%ds_localtime_02%/gmi, weatherData.ds_localtime_02);
    tempStr9 = tempStr9.replace(/%ds_localtime_03%/gmi, weatherData.ds_localtime_03);
    tempStr9 = tempStr9.replace(/%ds_localtime_04%/gmi, weatherData.ds_localtime_04);
    tempStr9 = tempStr9.replace(/%ds_localtime_05%/gmi, weatherData.ds_localtime_05);
    tempStr9 = tempStr9.replace(/%ds_localtime_06%/gmi, weatherData.ds_localtime_06);
    tempStr9 = tempStr9.replace(/%ds_localtime_07%/gmi, weatherData.ds_localtime_07);
    tempStr9 = tempStr9.replace(/%ds_localtime_08%/gmi, weatherData.ds_localtime_08);
    tempStr9 = tempStr9.replace(/%ds_localtime_09%/gmi, weatherData.ds_localtime_09);
    tempStr9 = tempStr9.replace(/%ds_localtime_10%/gmi, weatherData.ds_localtime_10);
    tempStr9 = tempStr9.replace(/%ds_localtime_11%/gmi, weatherData.ds_localtime_11);
    tempStr9 = tempStr9.replace(/%ds_localtime_12%/gmi, weatherData.ds_localtime_12);
    tempStr9 = tempStr9.replace(/%ds_localtime_13%/gmi, weatherData.ds_localtime_13);
    tempStr9 = tempStr9.replace(/%ds_localtime_14%/gmi, weatherData.ds_localtime_14);
    tempStr9 = tempStr9.replace(/%ds_localtime_15%/gmi, weatherData.ds_localtime_15);
    tempStr9 = tempStr9.replace(/%ds_localtime_16%/gmi, weatherData.ds_localtime_16);
    tempStr9 = tempStr9.replace(/%ds_localtime_17%/gmi, weatherData.ds_localtime_17);
    tempStr9 = tempStr9.replace(/%ds_localtime_18%/gmi, weatherData.ds_localtime_18);
    tempStr9 = tempStr9.replace(/%ds_localtime_19%/gmi, weatherData.ds_localtime_19);
    tempStr9 = tempStr9.replace(/%ds_localtime_20%/gmi, weatherData.ds_localtime_20);
    tempStr9 = tempStr9.replace(/%ds_localtime_21%/gmi, weatherData.ds_localtime_21);
    tempStr9 = tempStr9.replace(/%ds_localtime_22%/gmi, weatherData.ds_localtime_22);
    tempStr9 = tempStr9.replace(/%ds_localtime_23%/gmi, weatherData.ds_localtime_23);
    tempStr9 = tempStr9.replace(/%ds_localtime_24%/gmi, weatherData.ds_localtime_24);
    tempStr9 = tempStr9.replace(/%ds_localtime_25%/gmi, weatherData.ds_localtime_25);
    tempStr9 = tempStr9.replace(/%ds_localtime_26%/gmi, weatherData.ds_localtime_26);
    tempStr9 = tempStr9.replace(/%ds_localtime_27%/gmi, weatherData.ds_localtime_27);
    tempStr9 = tempStr9.replace(/%ds_localtime_28%/gmi, weatherData.ds_localtime_28);
    tempStr9 = tempStr9.replace(/%ds_localtime_29%/gmi, weatherData.ds_localtime_29);
    tempStr9 = tempStr9.replace(/%ds_localtime_30%/gmi, weatherData.ds_localtime_30);
    tempStr9 = tempStr9.replace(/%ds_localtime_31%/gmi, weatherData.ds_localtime_31);
    tempStr9 = tempStr9.replace(/%ds_localtime_32%/gmi, weatherData.ds_localtime_32);
    tempStr9 = tempStr9.replace(/%ds_localtime_33%/gmi, weatherData.ds_localtime_33);
    tempStr9 = tempStr9.replace(/%ds_localtime_34%/gmi, weatherData.ds_localtime_34);
    tempStr9 = tempStr9.replace(/%ds_localtime_35%/gmi, weatherData.ds_localtime_35);
    tempStr9 = tempStr9.replace(/%ds_localtime_36%/gmi, weatherData.ds_localtime_36);
    tempStr9 = tempStr9.replace(/%ds_localtime_37%/gmi, weatherData.ds_localtime_37);
    tempStr9 = tempStr9.replace(/%ds_localtime_38%/gmi, weatherData.ds_localtime_38);
    tempStr9 = tempStr9.replace(/%ds_localtime_39%/gmi, weatherData.ds_localtime_39);

    let tempStr10 = tempStr9.replace(/%t_localtime_00%/gmi, weatherData.t_localtime_00);
    tempStr10 = tempStr10.replace(/%t_localtime_01%/gmi, weatherData.t_localtime_01);
    tempStr10 = tempStr10.replace(/%t_localtime_02%/gmi, weatherData.t_localtime_02);
    tempStr10 = tempStr10.replace(/%t_localtime_03%/gmi, weatherData.t_localtime_03);
    tempStr10 = tempStr10.replace(/%t_localtime_04%/gmi, weatherData.t_localtime_04);
    tempStr10 = tempStr10.replace(/%t_localtime_05%/gmi, weatherData.t_localtime_05);
    tempStr10 = tempStr10.replace(/%t_localtime_06%/gmi, weatherData.t_localtime_06);
    tempStr10 = tempStr10.replace(/%t_localtime_07%/gmi, weatherData.t_localtime_07);
    tempStr10 = tempStr10.replace(/%t_localtime_08%/gmi, weatherData.t_localtime_08);
    tempStr10 = tempStr10.replace(/%t_localtime_09%/gmi, weatherData.t_localtime_09);
    tempStr10 = tempStr10.replace(/%t_localtime_10%/gmi, weatherData.t_localtime_10);
    tempStr10 = tempStr10.replace(/%t_localtime_11%/gmi, weatherData.t_localtime_11);
    tempStr10 = tempStr10.replace(/%t_localtime_12%/gmi, weatherData.t_localtime_12);
    tempStr10 = tempStr10.replace(/%t_localtime_13%/gmi, weatherData.t_localtime_13);
    tempStr10 = tempStr10.replace(/%t_localtime_14%/gmi, weatherData.t_localtime_14);
    tempStr10 = tempStr10.replace(/%t_localtime_15%/gmi, weatherData.t_localtime_15);
    tempStr10 = tempStr10.replace(/%t_localtime_16%/gmi, weatherData.t_localtime_16);
    tempStr10 = tempStr10.replace(/%t_localtime_17%/gmi, weatherData.t_localtime_17);
    tempStr10 = tempStr10.replace(/%t_localtime_18%/gmi, weatherData.t_localtime_18);
    tempStr10 = tempStr10.replace(/%t_localtime_19%/gmi, weatherData.t_localtime_19);
    tempStr10 = tempStr10.replace(/%t_localtime_20%/gmi, weatherData.t_localtime_20);
    tempStr10 = tempStr10.replace(/%t_localtime_21%/gmi, weatherData.t_localtime_21);
    tempStr10 = tempStr10.replace(/%t_localtime_22%/gmi, weatherData.t_localtime_22);
    tempStr10 = tempStr10.replace(/%t_localtime_23%/gmi, weatherData.t_localtime_23);
    tempStr10 = tempStr10.replace(/%t_localtime_24%/gmi, weatherData.t_localtime_24);
    tempStr10 = tempStr10.replace(/%t_localtime_25%/gmi, weatherData.t_localtime_25);
    tempStr10 = tempStr10.replace(/%t_localtime_26%/gmi, weatherData.t_localtime_26);
    tempStr10 = tempStr10.replace(/%t_localtime_27%/gmi, weatherData.t_localtime_27);
    tempStr10 = tempStr10.replace(/%t_localtime_28%/gmi, weatherData.t_localtime_28);
    tempStr10 = tempStr10.replace(/%t_localtime_29%/gmi, weatherData.t_localtime_29);
    tempStr10 = tempStr10.replace(/%t_localtime_30%/gmi, weatherData.t_localtime_30);
    tempStr10 = tempStr10.replace(/%t_localtime_31%/gmi, weatherData.t_localtime_31);
    tempStr10 = tempStr10.replace(/%t_localtime_32%/gmi, weatherData.t_localtime_32);
    tempStr10 = tempStr10.replace(/%t_localtime_33%/gmi, weatherData.t_localtime_33);
    tempStr10 = tempStr10.replace(/%t_localtime_34%/gmi, weatherData.t_localtime_34);
    tempStr10 = tempStr10.replace(/%t_localtime_35%/gmi, weatherData.t_localtime_35);
    tempStr10 = tempStr10.replace(/%t_localtime_36%/gmi, weatherData.t_localtime_36);
    tempStr10 = tempStr10.replace(/%t_localtime_37%/gmi, weatherData.t_localtime_37);
    tempStr10 = tempStr10.replace(/%t_localtime_38%/gmi, weatherData.t_localtime_38);
    tempStr10 = tempStr10.replace(/%t_localtime_39%/gmi, weatherData.t_localtime_39);

    let tempStr11 = tempStr10.replace(/%ts_localtime_00%/gmi, weatherData.ts_localtime_00);
    tempStr11 = tempStr11.replace(/%ts_localtime_01%/gmi, weatherData.ts_localtime_01);
    tempStr11 = tempStr11.replace(/%ts_localtime_02%/gmi, weatherData.ts_localtime_02);
    tempStr11 = tempStr11.replace(/%ts_localtime_03%/gmi, weatherData.ts_localtime_03);
    tempStr11 = tempStr11.replace(/%ts_localtime_04%/gmi, weatherData.ts_localtime_04);
    tempStr11 = tempStr11.replace(/%ts_localtime_05%/gmi, weatherData.ts_localtime_05);
    tempStr11 = tempStr11.replace(/%ts_localtime_06%/gmi, weatherData.ts_localtime_06);
    tempStr11 = tempStr11.replace(/%ts_localtime_07%/gmi, weatherData.ts_localtime_07);
    tempStr11 = tempStr11.replace(/%ts_localtime_08%/gmi, weatherData.ts_localtime_08);
    tempStr11 = tempStr11.replace(/%ts_localtime_09%/gmi, weatherData.ts_localtime_09);
    tempStr11 = tempStr11.replace(/%ts_localtime_10%/gmi, weatherData.ts_localtime_10);
    tempStr11 = tempStr11.replace(/%ts_localtime_11%/gmi, weatherData.ts_localtime_11);
    tempStr11 = tempStr11.replace(/%ts_localtime_12%/gmi, weatherData.ts_localtime_12);
    tempStr11 = tempStr11.replace(/%ts_localtime_13%/gmi, weatherData.ts_localtime_13);
    tempStr11 = tempStr11.replace(/%ts_localtime_14%/gmi, weatherData.ts_localtime_14);
    tempStr11 = tempStr11.replace(/%ts_localtime_15%/gmi, weatherData.ts_localtime_15);
    tempStr11 = tempStr11.replace(/%ts_localtime_16%/gmi, weatherData.ts_localtime_16);
    tempStr11 = tempStr11.replace(/%ts_localtime_17%/gmi, weatherData.ts_localtime_17);
    tempStr11 = tempStr11.replace(/%ts_localtime_18%/gmi, weatherData.ts_localtime_18);
    tempStr11 = tempStr11.replace(/%ts_localtime_19%/gmi, weatherData.ts_localtime_19);
    tempStr11 = tempStr11.replace(/%ts_localtime_20%/gmi, weatherData.ts_localtime_20);
    tempStr11 = tempStr11.replace(/%ts_localtime_21%/gmi, weatherData.ts_localtime_21);
    tempStr11 = tempStr11.replace(/%ts_localtime_22%/gmi, weatherData.ts_localtime_22);
    tempStr11 = tempStr11.replace(/%ts_localtime_23%/gmi, weatherData.ts_localtime_23);
    tempStr11 = tempStr11.replace(/%ts_localtime_24%/gmi, weatherData.ts_localtime_24);
    tempStr11 = tempStr11.replace(/%ts_localtime_25%/gmi, weatherData.ts_localtime_25);
    tempStr11 = tempStr11.replace(/%ts_localtime_26%/gmi, weatherData.ts_localtime_26);
    tempStr11 = tempStr11.replace(/%ts_localtime_27%/gmi, weatherData.ts_localtime_27);
    tempStr11 = tempStr11.replace(/%ts_localtime_28%/gmi, weatherData.ts_localtime_28);
    tempStr11 = tempStr11.replace(/%ts_localtime_29%/gmi, weatherData.ts_localtime_29);
    tempStr11 = tempStr11.replace(/%ts_localtime_30%/gmi, weatherData.ts_localtime_30);
    tempStr11 = tempStr11.replace(/%ts_localtime_31%/gmi, weatherData.ts_localtime_31);
    tempStr11 = tempStr11.replace(/%ts_localtime_32%/gmi, weatherData.ts_localtime_32);
    tempStr11 = tempStr11.replace(/%ts_localtime_33%/gmi, weatherData.ts_localtime_33);
    tempStr11 = tempStr11.replace(/%ts_localtime_34%/gmi, weatherData.ts_localtime_34);
    tempStr11 = tempStr11.replace(/%ts_localtime_35%/gmi, weatherData.ts_localtime_35);
    tempStr11 = tempStr11.replace(/%ts_localtime_36%/gmi, weatherData.ts_localtime_36);
    tempStr11 = tempStr11.replace(/%ts_localtime_37%/gmi, weatherData.ts_localtime_37);
    tempStr11 = tempStr11.replace(/%ts_localtime_38%/gmi, weatherData.ts_localtime_38);
    tempStr11 = tempStr11.replace(/%ts_localtime_39%/gmi, weatherData.ts_localtime_39);

    let tempStr12 = tempStr11.replace(/%ftemp_00%/gmi, weatherData.ftemp_00);
    tempStr12 = tempStr12.replace(/%ftemp_01%/gmi, weatherData.ftemp_01);
    tempStr12 = tempStr12.replace(/%ftemp_02%/gmi, weatherData.ftemp_02);
    tempStr12 = tempStr12.replace(/%ftemp_03%/gmi, weatherData.ftemp_03);
    tempStr12 = tempStr12.replace(/%ftemp_04%/gmi, weatherData.ftemp_04);
    tempStr12 = tempStr12.replace(/%ftemp_05%/gmi, weatherData.ftemp_05);
    tempStr12 = tempStr12.replace(/%ftemp_06%/gmi, weatherData.ftemp_06);
    tempStr12 = tempStr12.replace(/%ftemp_07%/gmi, weatherData.ftemp_07);
    tempStr12 = tempStr12.replace(/%ftemp_08%/gmi, weatherData.ftemp_08);
    tempStr12 = tempStr12.replace(/%ftemp_09%/gmi, weatherData.ftemp_09);
    tempStr12 = tempStr12.replace(/%ftemp_10%/gmi, weatherData.ftemp_10);
    tempStr12 = tempStr12.replace(/%ftemp_11%/gmi, weatherData.ftemp_11);
    tempStr12 = tempStr12.replace(/%ftemp_12%/gmi, weatherData.ftemp_12);
    tempStr12 = tempStr12.replace(/%ftemp_13%/gmi, weatherData.ftemp_13);
    tempStr12 = tempStr12.replace(/%ftemp_14%/gmi, weatherData.ftemp_14);
    tempStr12 = tempStr12.replace(/%ftemp_15%/gmi, weatherData.ftemp_15);
    tempStr12 = tempStr12.replace(/%ftemp_16%/gmi, weatherData.ftemp_16);
    tempStr12 = tempStr12.replace(/%ftemp_17%/gmi, weatherData.ftemp_17);
    tempStr12 = tempStr12.replace(/%ftemp_18%/gmi, weatherData.ftemp_18);
    tempStr12 = tempStr12.replace(/%ftemp_19%/gmi, weatherData.ftemp_19);
    tempStr12 = tempStr12.replace(/%ftemp_20%/gmi, weatherData.ftemp_20);
    tempStr12 = tempStr12.replace(/%ftemp_21%/gmi, weatherData.ftemp_21);
    tempStr12 = tempStr12.replace(/%ftemp_22%/gmi, weatherData.ftemp_22);
    tempStr12 = tempStr12.replace(/%ftemp_23%/gmi, weatherData.ftemp_23);
    tempStr12 = tempStr12.replace(/%ftemp_24%/gmi, weatherData.ftemp_24);
    tempStr12 = tempStr12.replace(/%ftemp_25%/gmi, weatherData.ftemp_25);
    tempStr12 = tempStr12.replace(/%ftemp_26%/gmi, weatherData.ftemp_26);
    tempStr12 = tempStr12.replace(/%ftemp_27%/gmi, weatherData.ftemp_27);
    tempStr12 = tempStr12.replace(/%ftemp_28%/gmi, weatherData.ftemp_28);
    tempStr12 = tempStr12.replace(/%ftemp_29%/gmi, weatherData.ftemp_29);
    tempStr12 = tempStr12.replace(/%ftemp_30%/gmi, weatherData.ftemp_30);
    tempStr12 = tempStr12.replace(/%ftemp_31%/gmi, weatherData.ftemp_31);
    tempStr12 = tempStr12.replace(/%ftemp_32%/gmi, weatherData.ftemp_32);
    tempStr12 = tempStr12.replace(/%ftemp_33%/gmi, weatherData.ftemp_33);
    tempStr12 = tempStr12.replace(/%ftemp_34%/gmi, weatherData.ftemp_34);
    tempStr12 = tempStr12.replace(/%ftemp_35%/gmi, weatherData.ftemp_35);
    tempStr12 = tempStr12.replace(/%ftemp_36%/gmi, weatherData.ftemp_36);
    tempStr12 = tempStr12.replace(/%ftemp_37%/gmi, weatherData.ftemp_37);
    tempStr12 = tempStr12.replace(/%ftemp_38%/gmi, weatherData.ftemp_38);
    tempStr12 = tempStr12.replace(/%ftemp_39%/gmi, weatherData.ftemp_39);
 
    let tempStr13 = tempStr12.replace(/%ffeels_00%/gmi, weatherData.ffeelslike_00);
    tempStr13 = tempStr13.replace(/%ffeels_01%/gmi, weatherData.ffeelslike_01);
    tempStr13 = tempStr13.replace(/%ffeels_02%/gmi, weatherData.ffeelslike_02);
    tempStr13 = tempStr13.replace(/%ffeels_03%/gmi, weatherData.ffeelslike_03);
    tempStr13 = tempStr13.replace(/%ffeels_04%/gmi, weatherData.ffeelslike_04);
    tempStr13 = tempStr13.replace(/%ffeels_05%/gmi, weatherData.ffeelslike_05);
    tempStr13 = tempStr13.replace(/%ffeels_06%/gmi, weatherData.ffeelslike_06);
    tempStr13 = tempStr13.replace(/%ffeels_07%/gmi, weatherData.ffeelslike_07);
    tempStr13 = tempStr13.replace(/%ffeels_08%/gmi, weatherData.ffeelslike_08);
    tempStr13 = tempStr13.replace(/%ffeels_09%/gmi, weatherData.ffeelslike_09);
    tempStr13 = tempStr13.replace(/%ffeels_10%/gmi, weatherData.ffeelslike_10);
    tempStr13 = tempStr13.replace(/%ffeels_11%/gmi, weatherData.ffeelslike_11);
    tempStr13 = tempStr13.replace(/%ffeels_12%/gmi, weatherData.ffeelslike_12);
    tempStr13 = tempStr13.replace(/%ffeels_13%/gmi, weatherData.ffeelslike_13);
    tempStr13 = tempStr13.replace(/%ffeels_14%/gmi, weatherData.ffeelslike_14);
    tempStr13 = tempStr13.replace(/%ffeels_15%/gmi, weatherData.ffeelslike_15);
    tempStr13 = tempStr13.replace(/%ffeels_16%/gmi, weatherData.ffeelslike_16);
    tempStr13 = tempStr13.replace(/%ffeels_17%/gmi, weatherData.ffeelslike_17);
    tempStr13 = tempStr13.replace(/%ffeels_18%/gmi, weatherData.ffeelslike_18);
    tempStr13 = tempStr13.replace(/%ffeels_19%/gmi, weatherData.ffeelslike_19);
    tempStr13 = tempStr13.replace(/%ffeels_20%/gmi, weatherData.ffeelslike_20);
    tempStr13 = tempStr13.replace(/%ffeels_21%/gmi, weatherData.ffeelslike_21);
    tempStr13 = tempStr13.replace(/%ffeels_22%/gmi, weatherData.ffeelslike_22);
    tempStr13 = tempStr13.replace(/%ffeels_23%/gmi, weatherData.ffeelslike_23);
    tempStr13 = tempStr13.replace(/%ffeels_24%/gmi, weatherData.ffeelslike_24);
    tempStr13 = tempStr13.replace(/%ffeels_25%/gmi, weatherData.ffeelslike_25);
    tempStr13 = tempStr13.replace(/%ffeels_26%/gmi, weatherData.ffeelslike_26);
    tempStr13 = tempStr13.replace(/%ffeels_27%/gmi, weatherData.ffeelslike_27);
    tempStr13 = tempStr13.replace(/%ffeels_28%/gmi, weatherData.ffeelslike_28);
    tempStr13 = tempStr13.replace(/%ffeels_29%/gmi, weatherData.ffeelslike_29);
    tempStr13 = tempStr13.replace(/%ffeels_30%/gmi, weatherData.ffeelslike_30);
    tempStr13 = tempStr13.replace(/%ffeels_31%/gmi, weatherData.ffeelslike_31);
    tempStr13 = tempStr13.replace(/%ffeels_32%/gmi, weatherData.ffeelslike_32);
    tempStr13 = tempStr13.replace(/%ffeels_33%/gmi, weatherData.ffeelslike_33);
    tempStr13 = tempStr13.replace(/%ffeels_34%/gmi, weatherData.ffeelslike_34);
    tempStr13 = tempStr13.replace(/%ffeels_35%/gmi, weatherData.ffeelslike_35);
    tempStr13 = tempStr13.replace(/%ffeels_36%/gmi, weatherData.ffeelslike_36);
    tempStr13 = tempStr13.replace(/%ffeels_37%/gmi, weatherData.ffeelslike_37);
    tempStr13 = tempStr13.replace(/%ffeels_38%/gmi, weatherData.ffeelslike_38);
    tempStr13 = tempStr13.replace(/%ffeels_39%/gmi, weatherData.ffeelslike_39);

    let tempStr14 = tempStr13.replace(/%fclouds_00%/gmi, weatherData.fclouds_00);
    tempStr14 = tempStr14.replace(/%fclouds_01%/gmi, weatherData.fclouds_01);
    tempStr14 = tempStr14.replace(/%fclouds_02%/gmi, weatherData.fclouds_02);
    tempStr14 = tempStr14.replace(/%fclouds_03%/gmi, weatherData.fclouds_03);
    tempStr14 = tempStr14.replace(/%fclouds_04%/gmi, weatherData.fclouds_04);
    tempStr14 = tempStr14.replace(/%fclouds_05%/gmi, weatherData.fclouds_05);
    tempStr14 = tempStr14.replace(/%fclouds_06%/gmi, weatherData.fclouds_06);
    tempStr14 = tempStr14.replace(/%fclouds_07%/gmi, weatherData.fclouds_07);
    tempStr14 = tempStr14.replace(/%fclouds_08%/gmi, weatherData.fclouds_08);
    tempStr14 = tempStr14.replace(/%fclouds_09%/gmi, weatherData.fclouds_09);
    tempStr14 = tempStr14.replace(/%fclouds_10%/gmi, weatherData.fclouds_10);
    tempStr14 = tempStr14.replace(/%fclouds_11%/gmi, weatherData.fclouds_11);
    tempStr14 = tempStr14.replace(/%fclouds_12%/gmi, weatherData.fclouds_12);
    tempStr14 = tempStr14.replace(/%fclouds_13%/gmi, weatherData.fclouds_13);
    tempStr14 = tempStr14.replace(/%fclouds_14%/gmi, weatherData.fclouds_14);
    tempStr14 = tempStr14.replace(/%fclouds_15%/gmi, weatherData.fclouds_15);
    tempStr14 = tempStr14.replace(/%fclouds_16%/gmi, weatherData.fclouds_16);
    tempStr14 = tempStr14.replace(/%fclouds_17%/gmi, weatherData.fclouds_17);
    tempStr14 = tempStr14.replace(/%fclouds_18%/gmi, weatherData.fclouds_18);
    tempStr14 = tempStr14.replace(/%fclouds_19%/gmi, weatherData.fclouds_19);
    tempStr14 = tempStr14.replace(/%fclouds_20%/gmi, weatherData.fclouds_20);
    tempStr14 = tempStr14.replace(/%fclouds_21%/gmi, weatherData.fclouds_21);
    tempStr14 = tempStr14.replace(/%fclouds_22%/gmi, weatherData.fclouds_22);
    tempStr14 = tempStr14.replace(/%fclouds_23%/gmi, weatherData.fclouds_23);
    tempStr14 = tempStr14.replace(/%fclouds_24%/gmi, weatherData.fclouds_24);
    tempStr14 = tempStr14.replace(/%fclouds_25%/gmi, weatherData.fclouds_25);
    tempStr14 = tempStr14.replace(/%fclouds_26%/gmi, weatherData.fclouds_26);
    tempStr14 = tempStr14.replace(/%fclouds_27%/gmi, weatherData.fclouds_27);
    tempStr14 = tempStr14.replace(/%fclouds_28%/gmi, weatherData.fclouds_28);
    tempStr14 = tempStr14.replace(/%fclouds_29%/gmi, weatherData.fclouds_29);
    tempStr14 = tempStr14.replace(/%fclouds_30%/gmi, weatherData.fclouds_30);
    tempStr14 = tempStr14.replace(/%fclouds_31%/gmi, weatherData.fclouds_31);
    tempStr14 = tempStr14.replace(/%fclouds_32%/gmi, weatherData.fclouds_32);
    tempStr14 = tempStr14.replace(/%fclouds_33%/gmi, weatherData.fclouds_33);
    tempStr14 = tempStr14.replace(/%fclouds_34%/gmi, weatherData.fclouds_34);
    tempStr14 = tempStr14.replace(/%fclouds_35%/gmi, weatherData.fclouds_35);
    tempStr14 = tempStr14.replace(/%fclouds_36%/gmi, weatherData.fclouds_36);
    tempStr14 = tempStr14.replace(/%fclouds_37%/gmi, weatherData.fclouds_37);
    tempStr14 = tempStr14.replace(/%fclouds_38%/gmi, weatherData.fclouds_38);
    tempStr14 = tempStr14.replace(/%fclouds_39%/gmi, weatherData.fclouds_39);

    let tempStr15 = tempStr14.replace(/%fpop_00%/gmi, weatherData.fpop_00);
    tempStr15 = tempStr15.replace(/%fpop_01%/gmi, weatherData.fpop_01);
    tempStr15 = tempStr15.replace(/%fpop_02%/gmi, weatherData.fpop_02);
    tempStr15 = tempStr15.replace(/%fpop_03%/gmi, weatherData.fpop_03);
    tempStr15 = tempStr15.replace(/%fpop_04%/gmi, weatherData.fpop_04);
    tempStr15 = tempStr15.replace(/%fpop_05%/gmi, weatherData.fpop_05);
    tempStr15 = tempStr15.replace(/%fpop_06%/gmi, weatherData.fpop_06);
    tempStr15 = tempStr15.replace(/%fpop_07%/gmi, weatherData.fpop_07);
    tempStr15 = tempStr15.replace(/%fpop_08%/gmi, weatherData.fpop_08);
    tempStr15 = tempStr15.replace(/%fpop_09%/gmi, weatherData.fpop_09);
    tempStr15 = tempStr15.replace(/%fpop_10%/gmi, weatherData.fpop_10);
    tempStr15 = tempStr15.replace(/%fpop_11%/gmi, weatherData.fpop_11);
    tempStr15 = tempStr15.replace(/%fpop_12%/gmi, weatherData.fpop_12);
    tempStr15 = tempStr15.replace(/%fpop_13%/gmi, weatherData.fpop_13);
    tempStr15 = tempStr15.replace(/%fpop_14%/gmi, weatherData.fpop_14);
    tempStr15 = tempStr15.replace(/%fpop_15%/gmi, weatherData.fpop_15);
    tempStr15 = tempStr15.replace(/%fpop_16%/gmi, weatherData.fpop_16);
    tempStr15 = tempStr15.replace(/%fpop_17%/gmi, weatherData.fpop_17);
    tempStr15 = tempStr15.replace(/%fpop_18%/gmi, weatherData.fpop_18);
    tempStr15 = tempStr15.replace(/%fpop_19%/gmi, weatherData.fpop_19);
    tempStr15 = tempStr15.replace(/%fpop_20%/gmi, weatherData.fpop_20);
    tempStr15 = tempStr15.replace(/%fpop_21%/gmi, weatherData.fpop_21);
    tempStr15 = tempStr15.replace(/%fpop_22%/gmi, weatherData.fpop_22);
    tempStr15 = tempStr15.replace(/%fpop_23%/gmi, weatherData.fpop_23);
    tempStr15 = tempStr15.replace(/%fpop_24%/gmi, weatherData.fpop_24);
    tempStr15 = tempStr15.replace(/%fpop_25%/gmi, weatherData.fpop_25);
    tempStr15 = tempStr15.replace(/%fpop_26%/gmi, weatherData.fpop_26);
    tempStr15 = tempStr15.replace(/%fpop_27%/gmi, weatherData.fpop_27);
    tempStr15 = tempStr15.replace(/%fpop_28%/gmi, weatherData.fpop_28);
    tempStr15 = tempStr15.replace(/%fpop_29%/gmi, weatherData.fpop_29);
    tempStr15 = tempStr15.replace(/%fpop_30%/gmi, weatherData.fpop_30);
    tempStr15 = tempStr15.replace(/%fpop_31%/gmi, weatherData.fpop_31);
    tempStr15 = tempStr15.replace(/%fpop_32%/gmi, weatherData.fpop_32);
    tempStr15 = tempStr15.replace(/%fpop_33%/gmi, weatherData.fpop_33);
    tempStr15 = tempStr15.replace(/%fpop_34%/gmi, weatherData.fpop_34);
    tempStr15 = tempStr15.replace(/%fpop_35%/gmi, weatherData.fpop_35);
    tempStr15 = tempStr15.replace(/%fpop_36%/gmi, weatherData.fpop_36);
    tempStr15 = tempStr15.replace(/%fpop_37%/gmi, weatherData.fpop_37);
    tempStr15 = tempStr15.replace(/%fpop_38%/gmi, weatherData.fpop_38);
    tempStr15 = tempStr15.replace(/%fpop_39%/gmi, weatherData.fpop_39);

    let tempStr16 = tempStr15.replace(/%fpod_00%/gmi, weatherData.fpod_00);
    tempStr16 = tempStr16.replace(/%fpod_01%/gmi, weatherData.fpod_01);
    tempStr16 = tempStr16.replace(/%fpod_02%/gmi, weatherData.fpod_02);
    tempStr16 = tempStr16.replace(/%fpod_03%/gmi, weatherData.fpod_03);
    tempStr16 = tempStr16.replace(/%fpod_04%/gmi, weatherData.fpod_04);
    tempStr16 = tempStr16.replace(/%fpod_05%/gmi, weatherData.fpod_05);
    tempStr16 = tempStr16.replace(/%fpod_06%/gmi, weatherData.fpod_06);
    tempStr16 = tempStr16.replace(/%fpod_07%/gmi, weatherData.fpod_07);
    tempStr16 = tempStr16.replace(/%fpod_08%/gmi, weatherData.fpod_08);
    tempStr16 = tempStr16.replace(/%fpod_09%/gmi, weatherData.fpod_09);
    tempStr16 = tempStr16.replace(/%fpod_10%/gmi, weatherData.fpod_10);
    tempStr16 = tempStr16.replace(/%fpod_11%/gmi, weatherData.fpod_11);
    tempStr16 = tempStr16.replace(/%fpod_12%/gmi, weatherData.fpod_12);
    tempStr16 = tempStr16.replace(/%fpod_13%/gmi, weatherData.fpod_13);
    tempStr16 = tempStr16.replace(/%fpod_14%/gmi, weatherData.fpod_14);
    tempStr16 = tempStr16.replace(/%fpod_15%/gmi, weatherData.fpod_15);
    tempStr16 = tempStr16.replace(/%fpod_16%/gmi, weatherData.fpod_16);
    tempStr16 = tempStr16.replace(/%fpod_17%/gmi, weatherData.fpod_17);
    tempStr16 = tempStr16.replace(/%fpod_18%/gmi, weatherData.fpod_18);
    tempStr16 = tempStr16.replace(/%fpod_19%/gmi, weatherData.fpod_19);
    tempStr16 = tempStr16.replace(/%fpod_20%/gmi, weatherData.fpod_20);
    tempStr16 = tempStr16.replace(/%fpod_21%/gmi, weatherData.fpod_21);
    tempStr16 = tempStr16.replace(/%fpod_22%/gmi, weatherData.fpod_22);
    tempStr16 = tempStr16.replace(/%fpod_23%/gmi, weatherData.fpod_23);
    tempStr16 = tempStr16.replace(/%fpod_24%/gmi, weatherData.fpod_24);
    tempStr16 = tempStr16.replace(/%fpod_25%/gmi, weatherData.fpod_25);
    tempStr16 = tempStr16.replace(/%fpod_26%/gmi, weatherData.fpod_26);
    tempStr16 = tempStr16.replace(/%fpod_27%/gmi, weatherData.fpod_27);
    tempStr16 = tempStr16.replace(/%fpod_28%/gmi, weatherData.fpod_28);
    tempStr16 = tempStr16.replace(/%fpod_29%/gmi, weatherData.fpod_29);
    tempStr16 = tempStr16.replace(/%fpod_30%/gmi, weatherData.fpod_30);
    tempStr16 = tempStr16.replace(/%fpod_31%/gmi, weatherData.fpod_31);
    tempStr16 = tempStr16.replace(/%fpod_32%/gmi, weatherData.fpod_32);
    tempStr16 = tempStr16.replace(/%fpod_33%/gmi, weatherData.fpod_33);
    tempStr16 = tempStr16.replace(/%fpod_34%/gmi, weatherData.fpod_34);
    tempStr16 = tempStr16.replace(/%fpod_35%/gmi, weatherData.fpod_35);
    tempStr16 = tempStr16.replace(/%fpod_36%/gmi, weatherData.fpod_36);
    tempStr16 = tempStr16.replace(/%fpod_37%/gmi, weatherData.fpod_37);
    tempStr16 = tempStr16.replace(/%fpod_38%/gmi, weatherData.fpod_38);
    tempStr16 = tempStr16.replace(/%fpod_39%/gmi, weatherData.fpod_39);

    let tempStr17 = tempStr16.replace(/%fvis_00%/gmi, weatherData.fvis_00);
    tempStr17 = tempStr17.replace(/%fvis_01%/gmi, weatherData.fvis_01);
    tempStr17 = tempStr17.replace(/%fvis_02%/gmi, weatherData.fvis_02);
    tempStr17 = tempStr17.replace(/%fvis_03%/gmi, weatherData.fvis_03);
    tempStr17 = tempStr17.replace(/%fvis_04%/gmi, weatherData.fvis_04);
    tempStr17 = tempStr17.replace(/%fvis_05%/gmi, weatherData.fvis_05);
    tempStr17 = tempStr17.replace(/%fvis_06%/gmi, weatherData.fvis_06);
    tempStr17 = tempStr17.replace(/%fvis_07%/gmi, weatherData.fvis_07);
    tempStr17 = tempStr17.replace(/%fvis_08%/gmi, weatherData.fvis_08);
    tempStr17 = tempStr17.replace(/%fvis_09%/gmi, weatherData.fvis_09);
    tempStr17 = tempStr17.replace(/%fvis_10%/gmi, weatherData.fvis_10);
    tempStr17 = tempStr17.replace(/%fvis_11%/gmi, weatherData.fvis_11);
    tempStr17 = tempStr17.replace(/%fvis_12%/gmi, weatherData.fvis_12);
    tempStr17 = tempStr17.replace(/%fvis_13%/gmi, weatherData.fvis_13);
    tempStr17 = tempStr17.replace(/%fvis_14%/gmi, weatherData.fvis_14);
    tempStr17 = tempStr17.replace(/%fvis_15%/gmi, weatherData.fvis_15);
    tempStr17 = tempStr17.replace(/%fvis_16%/gmi, weatherData.fvis_16);
    tempStr17 = tempStr17.replace(/%fvis_17%/gmi, weatherData.fvis_17);
    tempStr17 = tempStr17.replace(/%fvis_18%/gmi, weatherData.fvis_18);
    tempStr17 = tempStr17.replace(/%fvis_19%/gmi, weatherData.fvis_19);
    tempStr17 = tempStr17.replace(/%fvis_20%/gmi, weatherData.fvis_20);
    tempStr17 = tempStr17.replace(/%fvis_21%/gmi, weatherData.fvis_21);
    tempStr17 = tempStr17.replace(/%fvis_22%/gmi, weatherData.fvis_22);
    tempStr17 = tempStr17.replace(/%fvis_23%/gmi, weatherData.fvis_23);
    tempStr17 = tempStr17.replace(/%fvis_24%/gmi, weatherData.fvis_24);
    tempStr17 = tempStr17.replace(/%fvis_25%/gmi, weatherData.fvis_25);
    tempStr17 = tempStr17.replace(/%fvis_26%/gmi, weatherData.fvis_26);
    tempStr17 = tempStr17.replace(/%fvis_27%/gmi, weatherData.fvis_27);
    tempStr17 = tempStr17.replace(/%fvis_28%/gmi, weatherData.fvis_28);
    tempStr17 = tempStr17.replace(/%fvis_29%/gmi, weatherData.fvis_29);
    tempStr17 = tempStr17.replace(/%fvis_30%/gmi, weatherData.fvis_30);
    tempStr17 = tempStr17.replace(/%fvis_31%/gmi, weatherData.fvis_31);
    tempStr17 = tempStr17.replace(/%fvis_32%/gmi, weatherData.fvis_32);
    tempStr17 = tempStr17.replace(/%fvis_33%/gmi, weatherData.fvis_33);
    tempStr17 = tempStr17.replace(/%fvis_34%/gmi, weatherData.fvis_34);
    tempStr17 = tempStr17.replace(/%fvis_35%/gmi, weatherData.fvis_35);
    tempStr17 = tempStr17.replace(/%fvis_36%/gmi, weatherData.fvis_36);
    tempStr17 = tempStr17.replace(/%fvis_37%/gmi, weatherData.fvis_37);
    tempStr17 = tempStr17.replace(/%fvis_38%/gmi, weatherData.fvis_38);
    tempStr17 = tempStr17.replace(/%fvis_39%/gmi, weatherData.fvis_39);

    let tempStr18 = tempStr17.replace(/%fhum_00%/gmi, weatherData.fhum_00);
    tempStr18 = tempStr18.replace(/%fhum_01%/gmi, weatherData.fhum_01);
    tempStr18 = tempStr18.replace(/%fhum_02%/gmi, weatherData.fhum_02);
    tempStr18 = tempStr18.replace(/%fhum_03%/gmi, weatherData.fhum_03);
    tempStr18 = tempStr18.replace(/%fhum_04%/gmi, weatherData.fhum_04);
    tempStr18 = tempStr18.replace(/%fhum_05%/gmi, weatherData.fhum_05);
    tempStr18 = tempStr18.replace(/%fhum_06%/gmi, weatherData.fhum_06);
    tempStr18 = tempStr18.replace(/%fhum_07%/gmi, weatherData.fhum_07);
    tempStr18 = tempStr18.replace(/%fhum_08%/gmi, weatherData.fhum_08);
    tempStr18 = tempStr18.replace(/%fhum_09%/gmi, weatherData.fhum_09);
    tempStr18 = tempStr18.replace(/%fhum_10%/gmi, weatherData.fhum_10);
    tempStr18 = tempStr18.replace(/%fhum_11%/gmi, weatherData.fhum_11);
    tempStr18 = tempStr18.replace(/%fhum_12%/gmi, weatherData.fhum_12);
    tempStr18 = tempStr18.replace(/%fhum_13%/gmi, weatherData.fhum_13);
    tempStr18 = tempStr18.replace(/%fhum_14%/gmi, weatherData.fhum_14);
    tempStr18 = tempStr18.replace(/%fhum_15%/gmi, weatherData.fhum_15);
    tempStr18 = tempStr18.replace(/%fhum_16%/gmi, weatherData.fhum_16);
    tempStr18 = tempStr18.replace(/%fhum_17%/gmi, weatherData.fhum_17);
    tempStr18 = tempStr18.replace(/%fhum_18%/gmi, weatherData.fhum_18);
    tempStr18 = tempStr18.replace(/%fhum_19%/gmi, weatherData.fhum_19);
    tempStr18 = tempStr18.replace(/%fhum_20%/gmi, weatherData.fhum_20);
    tempStr18 = tempStr18.replace(/%fhum_21%/gmi, weatherData.fhum_21);
    tempStr18 = tempStr18.replace(/%fhum_22%/gmi, weatherData.fhum_22);
    tempStr18 = tempStr18.replace(/%fhum_23%/gmi, weatherData.fhum_23);
    tempStr18 = tempStr18.replace(/%fhum_24%/gmi, weatherData.fhum_24);
    tempStr18 = tempStr18.replace(/%fhum_25%/gmi, weatherData.fhum_25);
    tempStr18 = tempStr18.replace(/%fhum_26%/gmi, weatherData.fhum_26);
    tempStr18 = tempStr18.replace(/%fhum_27%/gmi, weatherData.fhum_27);
    tempStr18 = tempStr18.replace(/%fhum_28%/gmi, weatherData.fhum_28);
    tempStr18 = tempStr18.replace(/%fhum_29%/gmi, weatherData.fhum_29);
    tempStr18 = tempStr18.replace(/%fhum_30%/gmi, weatherData.fhum_30);
    tempStr18 = tempStr18.replace(/%fhum_31%/gmi, weatherData.fhum_31);
    tempStr18 = tempStr18.replace(/%fhum_32%/gmi, weatherData.fhum_32);
    tempStr18 = tempStr18.replace(/%fhum_33%/gmi, weatherData.fhum_33);
    tempStr18 = tempStr18.replace(/%fhum_34%/gmi, weatherData.fhum_34);
    tempStr18 = tempStr18.replace(/%fhum_35%/gmi, weatherData.fhum_35);
    tempStr18 = tempStr18.replace(/%fhum_36%/gmi, weatherData.fhum_36);
    tempStr18 = tempStr18.replace(/%fhum_37%/gmi, weatherData.fhum_37);
    tempStr18 = tempStr18.replace(/%fhum_38%/gmi, weatherData.fhum_38);
    tempStr18 = tempStr18.replace(/%fhum_39%/gmi, weatherData.fhum_39);

    let tempStr19 = tempStr18.replace(/%ftempmax_00%/gmi, weatherData.ftempmax_00);
    tempStr19 = tempStr19.replace(/%ftempmax_01%/gmi, weatherData.ftempmax_01);
    tempStr19 = tempStr19.replace(/%ftempmax_02%/gmi, weatherData.ftempmax_02);
    tempStr19 = tempStr19.replace(/%ftempmax_03%/gmi, weatherData.ftempmax_03);
    tempStr19 = tempStr19.replace(/%ftempmax_04%/gmi, weatherData.ftempmax_04);
    tempStr19 = tempStr19.replace(/%ftempmax_05%/gmi, weatherData.ftempmax_05);
    tempStr19 = tempStr19.replace(/%ftempmax_06%/gmi, weatherData.ftempmax_06);
    tempStr19 = tempStr19.replace(/%ftempmax_07%/gmi, weatherData.ftempmax_07);
    tempStr19 = tempStr19.replace(/%ftempmax_08%/gmi, weatherData.ftempmax_08);
    tempStr19 = tempStr19.replace(/%ftempmax_09%/gmi, weatherData.ftempmax_09);
    tempStr19 = tempStr19.replace(/%ftempmax_10%/gmi, weatherData.ftempmax_10);
    tempStr19 = tempStr19.replace(/%ftempmax_11%/gmi, weatherData.ftempmax_11);
    tempStr19 = tempStr19.replace(/%ftempmax_12%/gmi, weatherData.ftempmax_12);
    tempStr19 = tempStr19.replace(/%ftempmax_13%/gmi, weatherData.ftempmax_13);
    tempStr19 = tempStr19.replace(/%ftempmax_14%/gmi, weatherData.ftempmax_14);
    tempStr19 = tempStr19.replace(/%ftempmax_15%/gmi, weatherData.ftempmax_15);
    tempStr19 = tempStr19.replace(/%ftempmax_16%/gmi, weatherData.ftempmax_16);
    tempStr19 = tempStr19.replace(/%ftempmax_17%/gmi, weatherData.ftempmax_17);
    tempStr19 = tempStr19.replace(/%ftempmax_18%/gmi, weatherData.ftempmax_18);
    tempStr19 = tempStr19.replace(/%ftempmax_19%/gmi, weatherData.ftempmax_19);
    tempStr19 = tempStr19.replace(/%ftempmax_20%/gmi, weatherData.ftempmax_20);
    tempStr19 = tempStr19.replace(/%ftempmax_21%/gmi, weatherData.ftempmax_21);
    tempStr19 = tempStr19.replace(/%ftempmax_22%/gmi, weatherData.ftempmax_22);
    tempStr19 = tempStr19.replace(/%ftempmax_23%/gmi, weatherData.ftempmax_23);
    tempStr19 = tempStr19.replace(/%ftempmax_24%/gmi, weatherData.ftempmax_24);
    tempStr19 = tempStr19.replace(/%ftempmax_25%/gmi, weatherData.ftempmax_25);
    tempStr19 = tempStr19.replace(/%ftempmax_26%/gmi, weatherData.ftempmax_26);
    tempStr19 = tempStr19.replace(/%ftempmax_27%/gmi, weatherData.ftempmax_27);
    tempStr19 = tempStr19.replace(/%ftempmax_28%/gmi, weatherData.ftempmax_28);
    tempStr19 = tempStr19.replace(/%ftempmax_29%/gmi, weatherData.ftempmax_29);
    tempStr19 = tempStr19.replace(/%ftempmax_30%/gmi, weatherData.ftempmax_30);
    tempStr19 = tempStr19.replace(/%ftempmax_31%/gmi, weatherData.ftempmax_31);
    tempStr19 = tempStr19.replace(/%ftempmax_32%/gmi, weatherData.ftempmax_32);
    tempStr19 = tempStr19.replace(/%ftempmax_33%/gmi, weatherData.ftempmax_33);
    tempStr19 = tempStr19.replace(/%ftempmax_34%/gmi, weatherData.ftempmax_34);
    tempStr19 = tempStr19.replace(/%ftempmax_35%/gmi, weatherData.ftempmax_35);
    tempStr19 = tempStr19.replace(/%ftempmax_36%/gmi, weatherData.ftempmax_36);
    tempStr19 = tempStr19.replace(/%ftempmax_37%/gmi, weatherData.ftempmax_37);
    tempStr19 = tempStr19.replace(/%ftempmax_38%/gmi, weatherData.ftempmax_38);
    tempStr19 = tempStr19.replace(/%ftempmax_39%/gmi, weatherData.ftempmax_39);

    let tempStr20 = tempStr19.replace(/%ftempmin_00%/gmi, weatherData.ftempmin_00);
    tempStr20 = tempStr20.replace(/%ftempmin_01%/gmi, weatherData.ftempmin_01);
    tempStr20 = tempStr20.replace(/%ftempmin_02%/gmi, weatherData.ftempmin_02);
    tempStr20 = tempStr20.replace(/%ftempmin_03%/gmi, weatherData.ftempmin_03);
    tempStr20 = tempStr20.replace(/%ftempmin_04%/gmi, weatherData.ftempmin_04);
    tempStr20 = tempStr20.replace(/%ftempmin_05%/gmi, weatherData.ftempmin_05);
    tempStr20 = tempStr20.replace(/%ftempmin_06%/gmi, weatherData.ftempmin_06);
    tempStr20 = tempStr20.replace(/%ftempmin_07%/gmi, weatherData.ftempmin_07);
    tempStr20 = tempStr20.replace(/%ftempmin_08%/gmi, weatherData.ftempmin_08);
    tempStr20 = tempStr20.replace(/%ftempmin_09%/gmi, weatherData.ftempmin_09);
    tempStr20 = tempStr20.replace(/%ftempmin_10%/gmi, weatherData.ftempmin_10);
    tempStr20 = tempStr20.replace(/%ftempmin_11%/gmi, weatherData.ftempmin_11);
    tempStr20 = tempStr20.replace(/%ftempmin_12%/gmi, weatherData.ftempmin_12);
    tempStr20 = tempStr20.replace(/%ftempmin_13%/gmi, weatherData.ftempmin_13);
    tempStr20 = tempStr20.replace(/%ftempmin_14%/gmi, weatherData.ftempmin_14);
    tempStr20 = tempStr20.replace(/%ftempmin_15%/gmi, weatherData.ftempmin_15);
    tempStr20 = tempStr20.replace(/%ftempmin_16%/gmi, weatherData.ftempmin_16);
    tempStr20 = tempStr20.replace(/%ftempmin_17%/gmi, weatherData.ftempmin_17);
    tempStr20 = tempStr20.replace(/%ftempmin_18%/gmi, weatherData.ftempmin_18);
    tempStr20 = tempStr20.replace(/%ftempmin_19%/gmi, weatherData.ftempmin_19);
    tempStr20 = tempStr20.replace(/%ftempmin_20%/gmi, weatherData.ftempmin_20);
    tempStr20 = tempStr20.replace(/%ftempmin_21%/gmi, weatherData.ftempmin_21);
    tempStr20 = tempStr20.replace(/%ftempmin_22%/gmi, weatherData.ftempmin_22);
    tempStr20 = tempStr20.replace(/%ftempmin_23%/gmi, weatherData.ftempmin_23);
    tempStr20 = tempStr20.replace(/%ftempmin_24%/gmi, weatherData.ftempmin_24);
    tempStr20 = tempStr20.replace(/%ftempmin_25%/gmi, weatherData.ftempmin_25);
    tempStr20 = tempStr20.replace(/%ftempmin_26%/gmi, weatherData.ftempmin_26);
    tempStr20 = tempStr20.replace(/%ftempmin_27%/gmi, weatherData.ftempmin_27);
    tempStr20 = tempStr20.replace(/%ftempmin_28%/gmi, weatherData.ftempmin_28);
    tempStr20 = tempStr20.replace(/%ftempmin_29%/gmi, weatherData.ftempmin_29);
    tempStr20 = tempStr20.replace(/%ftempmin_30%/gmi, weatherData.ftempmin_30);
    tempStr20 = tempStr20.replace(/%ftempmin_31%/gmi, weatherData.ftempmin_31);
    tempStr20 = tempStr20.replace(/%ftempmin_32%/gmi, weatherData.ftempmin_32);
    tempStr20 = tempStr20.replace(/%ftempmin_33%/gmi, weatherData.ftempmin_33);
    tempStr20 = tempStr20.replace(/%ftempmin_34%/gmi, weatherData.ftempmin_34);
    tempStr20 = tempStr20.replace(/%ftempmin_35%/gmi, weatherData.ftempmin_35);
    tempStr20 = tempStr20.replace(/%ftempmin_36%/gmi, weatherData.ftempmin_36);
    tempStr20 = tempStr20.replace(/%ftempmin_37%/gmi, weatherData.ftempmin_37);
    tempStr20 = tempStr20.replace(/%ftempmin_38%/gmi, weatherData.ftempmin_38);
    tempStr20 = tempStr20.replace(/%ftempmin_39%/gmi, weatherData.ftempmin_39);

    let tempStr21 = tempStr20.replace(/%fground_00%/gmi, weatherData.fground_00);
    tempStr21 = tempStr21.replace(/%fground_01%/gmi, weatherData.fground_01);
    tempStr21 = tempStr21.replace(/%fground_02%/gmi, weatherData.fground_02);
    tempStr21 = tempStr21.replace(/%fground_03%/gmi, weatherData.fground_03);
    tempStr21 = tempStr21.replace(/%fground_04%/gmi, weatherData.fground_04);
    tempStr21 = tempStr21.replace(/%fground_05%/gmi, weatherData.fground_05);
    tempStr21 = tempStr21.replace(/%fground_06%/gmi, weatherData.fground_06);
    tempStr21 = tempStr21.replace(/%fground_07%/gmi, weatherData.fground_07);
    tempStr21 = tempStr21.replace(/%fground_08%/gmi, weatherData.fground_08);
    tempStr21 = tempStr21.replace(/%fground_09%/gmi, weatherData.fground_09);
    tempStr21 = tempStr21.replace(/%fground_10%/gmi, weatherData.fground_10);
    tempStr21 = tempStr21.replace(/%fground_11%/gmi, weatherData.fground_11);
    tempStr21 = tempStr21.replace(/%fground_12%/gmi, weatherData.fground_12);
    tempStr21 = tempStr21.replace(/%fground_13%/gmi, weatherData.fground_13);
    tempStr21 = tempStr21.replace(/%fground_14%/gmi, weatherData.fground_14);
    tempStr21 = tempStr21.replace(/%fground_15%/gmi, weatherData.fground_15);
    tempStr21 = tempStr21.replace(/%fground_16%/gmi, weatherData.fground_16);
    tempStr21 = tempStr21.replace(/%fground_17%/gmi, weatherData.fground_17);
    tempStr21 = tempStr21.replace(/%fground_18%/gmi, weatherData.fground_18);
    tempStr21 = tempStr21.replace(/%fground_19%/gmi, weatherData.fground_19);
    tempStr21 = tempStr21.replace(/%fground_20%/gmi, weatherData.fground_20);
    tempStr21 = tempStr21.replace(/%fground_21%/gmi, weatherData.fground_21);
    tempStr21 = tempStr21.replace(/%fground_22%/gmi, weatherData.fground_22);
    tempStr21 = tempStr21.replace(/%fground_23%/gmi, weatherData.fground_23);
    tempStr21 = tempStr21.replace(/%fground_24%/gmi, weatherData.fground_24);
    tempStr21 = tempStr21.replace(/%fground_25%/gmi, weatherData.fground_25);
    tempStr21 = tempStr21.replace(/%fground_26%/gmi, weatherData.fground_26);
    tempStr21 = tempStr21.replace(/%fground_27%/gmi, weatherData.fground_27);
    tempStr21 = tempStr21.replace(/%fground_28%/gmi, weatherData.fground_28);
    tempStr21 = tempStr21.replace(/%fground_29%/gmi, weatherData.fground_29);
    tempStr21 = tempStr21.replace(/%fground_30%/gmi, weatherData.fground_30);
    tempStr21 = tempStr21.replace(/%fground_31%/gmi, weatherData.fground_31);
    tempStr21 = tempStr21.replace(/%fground_32%/gmi, weatherData.fground_32);
    tempStr21 = tempStr21.replace(/%fground_33%/gmi, weatherData.fground_33);
    tempStr21 = tempStr21.replace(/%fground_34%/gmi, weatherData.fground_34);
    tempStr21 = tempStr21.replace(/%fground_35%/gmi, weatherData.fground_35);
    tempStr21 = tempStr21.replace(/%fground_36%/gmi, weatherData.fground_36);
    tempStr21 = tempStr21.replace(/%fground_37%/gmi, weatherData.fground_37);
    tempStr21 = tempStr21.replace(/%fground_38%/gmi, weatherData.fground_38);
    tempStr21 = tempStr21.replace(/%fground_39%/gmi, weatherData.fground_39);

    let tempStr22 = tempStr21.replace(/%fsea_00%/gmi, weatherData.fsea_00);
    tempStr22 = tempStr22.replace(/%fsea_01%/gmi, weatherData.fsea_01);
    tempStr22 = tempStr22.replace(/%fsea_02%/gmi, weatherData.fsea_02);
    tempStr22 = tempStr22.replace(/%fsea_03%/gmi, weatherData.fsea_03);
    tempStr22 = tempStr22.replace(/%fsea_04%/gmi, weatherData.fsea_04);
    tempStr22 = tempStr22.replace(/%fsea_05%/gmi, weatherData.fsea_05);
    tempStr22 = tempStr22.replace(/%fsea_06%/gmi, weatherData.fsea_06);
    tempStr22 = tempStr22.replace(/%fsea_07%/gmi, weatherData.fsea_07);
    tempStr22 = tempStr22.replace(/%fsea_08%/gmi, weatherData.fsea_08);
    tempStr22 = tempStr22.replace(/%fsea_09%/gmi, weatherData.fsea_09);
    tempStr22 = tempStr22.replace(/%fsea_10%/gmi, weatherData.fsea_10);
    tempStr22 = tempStr22.replace(/%fsea_11%/gmi, weatherData.fsea_11);
    tempStr22 = tempStr22.replace(/%fsea_12%/gmi, weatherData.fsea_12);
    tempStr22 = tempStr22.replace(/%fsea_13%/gmi, weatherData.fsea_13);
    tempStr22 = tempStr22.replace(/%fsea_14%/gmi, weatherData.fsea_14);
    tempStr22 = tempStr22.replace(/%fsea_15%/gmi, weatherData.fsea_15);
    tempStr22 = tempStr22.replace(/%fsea_16%/gmi, weatherData.fsea_16);
    tempStr22 = tempStr22.replace(/%fsea_17%/gmi, weatherData.fsea_17);
    tempStr22 = tempStr22.replace(/%fsea_18%/gmi, weatherData.fsea_18);
    tempStr22 = tempStr22.replace(/%fsea_19%/gmi, weatherData.fsea_19);
    tempStr22 = tempStr22.replace(/%fsea_20%/gmi, weatherData.fsea_20);
    tempStr22 = tempStr22.replace(/%fsea_21%/gmi, weatherData.fsea_21);
    tempStr22 = tempStr22.replace(/%fsea_22%/gmi, weatherData.fsea_22);
    tempStr22 = tempStr22.replace(/%fsea_23%/gmi, weatherData.fsea_23);
    tempStr22 = tempStr22.replace(/%fsea_24%/gmi, weatherData.fsea_24);
    tempStr22 = tempStr22.replace(/%fsea_25%/gmi, weatherData.fsea_25);
    tempStr22 = tempStr22.replace(/%fsea_26%/gmi, weatherData.fsea_26);
    tempStr22 = tempStr22.replace(/%fsea_27%/gmi, weatherData.fsea_27);
    tempStr22 = tempStr22.replace(/%fsea_28%/gmi, weatherData.fsea_28);
    tempStr22 = tempStr22.replace(/%fsea_29%/gmi, weatherData.fsea_29);
    tempStr22 = tempStr22.replace(/%fsea_30%/gmi, weatherData.fsea_30);
    tempStr22 = tempStr22.replace(/%fsea_31%/gmi, weatherData.fsea_31);
    tempStr22 = tempStr22.replace(/%fsea_32%/gmi, weatherData.fsea_32);
    tempStr22 = tempStr22.replace(/%fsea_33%/gmi, weatherData.fsea_33);
    tempStr22 = tempStr22.replace(/%fsea_34%/gmi, weatherData.fsea_34);
    tempStr22 = tempStr22.replace(/%fsea_35%/gmi, weatherData.fsea_35);
    tempStr22 = tempStr22.replace(/%fsea_36%/gmi, weatherData.fsea_36);
    tempStr22 = tempStr22.replace(/%fsea_37%/gmi, weatherData.fsea_37);
    tempStr22 = tempStr22.replace(/%fsea_38%/gmi, weatherData.fsea_38);
    tempStr22 = tempStr22.replace(/%fsea_39%/gmi, weatherData.fsea_39);

    let tempStr23 = tempStr22.replace(/%fdesc_00%/gmi, weatherData.fdesc_00);
    tempStr23 = tempStr23.replace(/%fdesc_01%/gmi, weatherData.fdesc_01);
    tempStr23 = tempStr23.replace(/%fdesc_02%/gmi, weatherData.fdesc_02);
    tempStr23 = tempStr23.replace(/%fdesc_03%/gmi, weatherData.fdesc_03);
    tempStr23 = tempStr23.replace(/%fdesc_04%/gmi, weatherData.fdesc_04);
    tempStr23 = tempStr23.replace(/%fdesc_05%/gmi, weatherData.fdesc_05);
    tempStr23 = tempStr23.replace(/%fdesc_06%/gmi, weatherData.fdesc_06);
    tempStr23 = tempStr23.replace(/%fdesc_07%/gmi, weatherData.fdesc_07);
    tempStr23 = tempStr23.replace(/%fdesc_08%/gmi, weatherData.fdesc_08);
    tempStr23 = tempStr23.replace(/%fdesc_09%/gmi, weatherData.fdesc_09);
    tempStr23 = tempStr23.replace(/%fdesc_10%/gmi, weatherData.fdesc_10);
    tempStr23 = tempStr23.replace(/%fdesc_11%/gmi, weatherData.fdesc_11);
    tempStr23 = tempStr23.replace(/%fdesc_12%/gmi, weatherData.fdesc_12);
    tempStr23 = tempStr23.replace(/%fdesc_13%/gmi, weatherData.fdesc_13);
    tempStr23 = tempStr23.replace(/%fdesc_14%/gmi, weatherData.fdesc_14);
    tempStr23 = tempStr23.replace(/%fdesc_15%/gmi, weatherData.fdesc_15);
    tempStr23 = tempStr23.replace(/%fdesc_16%/gmi, weatherData.fdesc_16);
    tempStr23 = tempStr23.replace(/%fdesc_17%/gmi, weatherData.fdesc_17);
    tempStr23 = tempStr23.replace(/%fdesc_18%/gmi, weatherData.fdesc_18);
    tempStr23 = tempStr23.replace(/%fdesc_19%/gmi, weatherData.fdesc_19);
    tempStr23 = tempStr23.replace(/%fdesc_20%/gmi, weatherData.fdesc_20);
    tempStr23 = tempStr23.replace(/%fdesc_21%/gmi, weatherData.fdesc_21);
    tempStr23 = tempStr23.replace(/%fdesc_22%/gmi, weatherData.fdesc_22);
    tempStr23 = tempStr23.replace(/%fdesc_23%/gmi, weatherData.fdesc_23);
    tempStr23 = tempStr23.replace(/%fdesc_24%/gmi, weatherData.fdesc_24);
    tempStr23 = tempStr23.replace(/%fdesc_25%/gmi, weatherData.fdesc_25);
    tempStr23 = tempStr23.replace(/%fdesc_26%/gmi, weatherData.fdesc_26);
    tempStr23 = tempStr23.replace(/%fdesc_27%/gmi, weatherData.fdesc_27);
    tempStr23 = tempStr23.replace(/%fdesc_28%/gmi, weatherData.fdesc_28);
    tempStr23 = tempStr23.replace(/%fdesc_29%/gmi, weatherData.fdesc_29);
    tempStr23 = tempStr23.replace(/%fdesc_30%/gmi, weatherData.fdesc_30);
    tempStr23 = tempStr23.replace(/%fdesc_31%/gmi, weatherData.fdesc_31);
    tempStr23 = tempStr23.replace(/%fdesc_32%/gmi, weatherData.fdesc_32);
    tempStr23 = tempStr23.replace(/%fdesc_33%/gmi, weatherData.fdesc_33);
    tempStr23 = tempStr23.replace(/%fdesc_34%/gmi, weatherData.fdesc_34);
    tempStr23 = tempStr23.replace(/%fdesc_35%/gmi, weatherData.fdesc_35);
    tempStr23 = tempStr23.replace(/%fdesc_36%/gmi, weatherData.fdesc_36);
    tempStr23 = tempStr23.replace(/%fdesc_37%/gmi, weatherData.fdesc_37);
    tempStr23 = tempStr23.replace(/%fdesc_38%/gmi, weatherData.fdesc_38);
    tempStr23 = tempStr23.replace(/%fdesc_39%/gmi, weatherData.fdesc_39);

    let tempStr24 = tempStr23.replace(/%fmaindesc_00%/gmi, weatherData.fmaindesc_00);
    tempStr24 = tempStr24.replace(/%fmaindesc_01%/gmi, weatherData.fmaindesc_01);
    tempStr24 = tempStr24.replace(/%fmaindesc_02%/gmi, weatherData.fmaindesc_02);
    tempStr24 = tempStr24.replace(/%fmaindesc_03%/gmi, weatherData.fmaindesc_03);
    tempStr24 = tempStr24.replace(/%fmaindesc_04%/gmi, weatherData.fmaindesc_04);
    tempStr24 = tempStr24.replace(/%fmaindesc_05%/gmi, weatherData.fmaindesc_05);
    tempStr24 = tempStr24.replace(/%fmaindesc_06%/gmi, weatherData.fmaindesc_06);
    tempStr24 = tempStr24.replace(/%fmaindesc_07%/gmi, weatherData.fmaindesc_07);
    tempStr24 = tempStr24.replace(/%fmaindesc_08%/gmi, weatherData.fmaindesc_08);
    tempStr24 = tempStr24.replace(/%fmaindesc_09%/gmi, weatherData.fmaindesc_09);
    tempStr24 = tempStr24.replace(/%fmaindesc_10%/gmi, weatherData.fmaindesc_10);
    tempStr24 = tempStr24.replace(/%fmaindesc_11%/gmi, weatherData.fmaindesc_11);
    tempStr24 = tempStr24.replace(/%fmaindesc_12%/gmi, weatherData.fmaindesc_12);
    tempStr24 = tempStr24.replace(/%fmaindesc_13%/gmi, weatherData.fmaindesc_13);
    tempStr24 = tempStr24.replace(/%fmaindesc_14%/gmi, weatherData.fmaindesc_14);
    tempStr24 = tempStr24.replace(/%fmaindesc_15%/gmi, weatherData.fmaindesc_15);
    tempStr24 = tempStr24.replace(/%fmaindesc_16%/gmi, weatherData.fmaindesc_16);
    tempStr24 = tempStr24.replace(/%fmaindesc_17%/gmi, weatherData.fmaindesc_17);
    tempStr24 = tempStr24.replace(/%fmaindesc_18%/gmi, weatherData.fmaindesc_18);
    tempStr24 = tempStr24.replace(/%fmaindesc_19%/gmi, weatherData.fmaindesc_19);
    tempStr24 = tempStr24.replace(/%fmaindesc_20%/gmi, weatherData.fmaindesc_20);
    tempStr24 = tempStr24.replace(/%fmaindesc_21%/gmi, weatherData.fmaindesc_21);
    tempStr24 = tempStr24.replace(/%fmaindesc_22%/gmi, weatherData.fmaindesc_22);
    tempStr24 = tempStr24.replace(/%fmaindesc_23%/gmi, weatherData.fmaindesc_23);
    tempStr24 = tempStr24.replace(/%fmaindesc_24%/gmi, weatherData.fmaindesc_24);
    tempStr24 = tempStr24.replace(/%fmaindesc_25%/gmi, weatherData.fmaindesc_25);
    tempStr24 = tempStr24.replace(/%fmaindesc_26%/gmi, weatherData.fmaindesc_26);
    tempStr24 = tempStr24.replace(/%fmaindesc_27%/gmi, weatherData.fmaindesc_27);
    tempStr24 = tempStr24.replace(/%fmaindesc_28%/gmi, weatherData.fmaindesc_28);
    tempStr24 = tempStr24.replace(/%fmaindesc_29%/gmi, weatherData.fmaindesc_29);
    tempStr24 = tempStr24.replace(/%fmaindesc_30%/gmi, weatherData.fmaindesc_30);
    tempStr24 = tempStr24.replace(/%fmaindesc_31%/gmi, weatherData.fmaindesc_31);
    tempStr24 = tempStr24.replace(/%fmaindesc_32%/gmi, weatherData.fmaindesc_32);
    tempStr24 = tempStr24.replace(/%fmaindesc_33%/gmi, weatherData.fmaindesc_33);
    tempStr24 = tempStr24.replace(/%fmaindesc_34%/gmi, weatherData.fmaindesc_34);
    tempStr24 = tempStr24.replace(/%fmaindesc_35%/gmi, weatherData.fmaindesc_35);
    tempStr24 = tempStr24.replace(/%fmaindesc_36%/gmi, weatherData.fmaindesc_36);
    tempStr24 = tempStr24.replace(/%fmaindesc_37%/gmi, weatherData.fmaindesc_37);
    tempStr24 = tempStr24.replace(/%fmaindesc_38%/gmi, weatherData.fmaindesc_38);
    tempStr24 = tempStr24.replace(/%fmaindesc_39%/gmi, weatherData.fmaindesc_39);

    let tempStr25 = tempStr24.replace(/%fdescem_00%/gmi, weatherData.fdescem_00);
    tempStr25 = tempStr25.replace(/%fdescem_01%/gmi, weatherData.fdescem_01);
    tempStr25 = tempStr25.replace(/%fdescem_02%/gmi, weatherData.fdescem_02);
    tempStr25 = tempStr25.replace(/%fdescem_03%/gmi, weatherData.fdescem_03);
    tempStr25 = tempStr25.replace(/%fdescem_04%/gmi, weatherData.fdescem_04);
    tempStr25 = tempStr25.replace(/%fdescem_05%/gmi, weatherData.fdescem_05);
    tempStr25 = tempStr25.replace(/%fdescem_06%/gmi, weatherData.fdescem_06);
    tempStr25 = tempStr25.replace(/%fdescem_07%/gmi, weatherData.fdescem_07);
    tempStr25 = tempStr25.replace(/%fdescem_08%/gmi, weatherData.fdescem_08);
    tempStr25 = tempStr25.replace(/%fdescem_09%/gmi, weatherData.fdescem_09);
    tempStr25 = tempStr25.replace(/%fdescem_10%/gmi, weatherData.fdescem_10);
    tempStr25 = tempStr25.replace(/%fdescem_11%/gmi, weatherData.fdescem_11);
    tempStr25 = tempStr25.replace(/%fdescem_12%/gmi, weatherData.fdescem_12);
    tempStr25 = tempStr25.replace(/%fdescem_13%/gmi, weatherData.fdescem_13);
    tempStr25 = tempStr25.replace(/%fdescem_14%/gmi, weatherData.fdescem_14);
    tempStr25 = tempStr25.replace(/%fdescem_15%/gmi, weatherData.fdescem_15);
    tempStr25 = tempStr25.replace(/%fdescem_16%/gmi, weatherData.fdescem_16);
    tempStr25 = tempStr25.replace(/%fdescem_17%/gmi, weatherData.fdescem_17);
    tempStr25 = tempStr25.replace(/%fdescem_18%/gmi, weatherData.fdescem_18);
    tempStr25 = tempStr25.replace(/%fdescem_19%/gmi, weatherData.fdescem_19);
    tempStr25 = tempStr25.replace(/%fdescem_20%/gmi, weatherData.fdescem_20);
    tempStr25 = tempStr25.replace(/%fdescem_21%/gmi, weatherData.fdescem_21);
    tempStr25 = tempStr25.replace(/%fdescem_22%/gmi, weatherData.fdescem_22);
    tempStr25 = tempStr25.replace(/%fdescem_23%/gmi, weatherData.fdescem_23);
    tempStr25 = tempStr25.replace(/%fdescem_24%/gmi, weatherData.fdescem_24);
    tempStr25 = tempStr25.replace(/%fdescem_25%/gmi, weatherData.fdescem_25);
    tempStr25 = tempStr25.replace(/%fdescem_26%/gmi, weatherData.fdescem_26);
    tempStr25 = tempStr25.replace(/%fdescem_27%/gmi, weatherData.fdescem_27);
    tempStr25 = tempStr25.replace(/%fdescem_28%/gmi, weatherData.fdescem_28);
    tempStr25 = tempStr25.replace(/%fdescem_29%/gmi, weatherData.fdescem_29);
    tempStr25 = tempStr25.replace(/%fdescem_30%/gmi, weatherData.fdescem_30);
    tempStr25 = tempStr25.replace(/%fdescem_31%/gmi, weatherData.fdescem_31);
    tempStr25 = tempStr25.replace(/%fdescem_32%/gmi, weatherData.fdescem_32);
    tempStr25 = tempStr25.replace(/%fdescem_33%/gmi, weatherData.fdescem_33);
    tempStr25 = tempStr25.replace(/%fdescem_34%/gmi, weatherData.fdescem_34);
    tempStr25 = tempStr25.replace(/%fdescem_35%/gmi, weatherData.fdescem_35);
    tempStr25 = tempStr25.replace(/%fdescem_36%/gmi, weatherData.fdescem_36);
    tempStr25 = tempStr25.replace(/%fdescem_37%/gmi, weatherData.fdescem_37);
    tempStr25 = tempStr25.replace(/%fdescem_38%/gmi, weatherData.fdescem_38);
    tempStr25 = tempStr25.replace(/%fdescem_39%/gmi, weatherData.fdescem_39);

    let tempStr26 = tempStr25.replace(/%ficonurl_00%/gmi, weatherData.ficonurl_00);
    tempStr26 = tempStr26.replace(/%ficonurl_01%/gmi, weatherData.ficonurl_01);
    tempStr26 = tempStr26.replace(/%ficonurl_02%/gmi, weatherData.ficonurl_02);
    tempStr26 = tempStr26.replace(/%ficonurl_03%/gmi, weatherData.ficonurl_03);
    tempStr26 = tempStr26.replace(/%ficonurl_04%/gmi, weatherData.ficonurl_04);
    tempStr26 = tempStr26.replace(/%ficonurl_05%/gmi, weatherData.ficonurl_05);
    tempStr26 = tempStr26.replace(/%ficonurl_06%/gmi, weatherData.ficonurl_06);
    tempStr26 = tempStr26.replace(/%ficonurl_07%/gmi, weatherData.ficonurl_07);
    tempStr26 = tempStr26.replace(/%ficonurl_08%/gmi, weatherData.ficonurl_08);
    tempStr26 = tempStr26.replace(/%ficonurl_09%/gmi, weatherData.ficonurl_09);
    tempStr26 = tempStr26.replace(/%ficonurl_10%/gmi, weatherData.ficonurl_10);
    tempStr26 = tempStr26.replace(/%ficonurl_11%/gmi, weatherData.ficonurl_11);
    tempStr26 = tempStr26.replace(/%ficonurl_12%/gmi, weatherData.ficonurl_12);
    tempStr26 = tempStr26.replace(/%ficonurl_13%/gmi, weatherData.ficonurl_13);
    tempStr26 = tempStr26.replace(/%ficonurl_14%/gmi, weatherData.ficonurl_14);
    tempStr26 = tempStr26.replace(/%ficonurl_15%/gmi, weatherData.ficonurl_15);
    tempStr26 = tempStr26.replace(/%ficonurl_16%/gmi, weatherData.ficonurl_16);
    tempStr26 = tempStr26.replace(/%ficonurl_17%/gmi, weatherData.ficonurl_17);
    tempStr26 = tempStr26.replace(/%ficonurl_18%/gmi, weatherData.ficonurl_18);
    tempStr26 = tempStr26.replace(/%ficonurl_19%/gmi, weatherData.ficonurl_19);
    tempStr26 = tempStr26.replace(/%ficonurl_20%/gmi, weatherData.ficonurl_20);
    tempStr26 = tempStr26.replace(/%ficonurl_21%/gmi, weatherData.ficonurl_21);
    tempStr26 = tempStr26.replace(/%ficonurl_22%/gmi, weatherData.ficonurl_22);
    tempStr26 = tempStr26.replace(/%ficonurl_23%/gmi, weatherData.ficonurl_23);
    tempStr26 = tempStr26.replace(/%ficonurl_24%/gmi, weatherData.ficonurl_24);
    tempStr26 = tempStr26.replace(/%ficonurl_25%/gmi, weatherData.ficonurl_25);
    tempStr26 = tempStr26.replace(/%ficonurl_26%/gmi, weatherData.ficonurl_26);
    tempStr26 = tempStr26.replace(/%ficonurl_27%/gmi, weatherData.ficonurl_27);
    tempStr26 = tempStr26.replace(/%ficonurl_28%/gmi, weatherData.ficonurl_28);
    tempStr26 = tempStr26.replace(/%ficonurl_29%/gmi, weatherData.ficonurl_29);
    tempStr26 = tempStr26.replace(/%ficonurl_30%/gmi, weatherData.ficonurl_30);
    tempStr26 = tempStr26.replace(/%ficonurl_31%/gmi, weatherData.ficonurl_31);
    tempStr26 = tempStr26.replace(/%ficonurl_32%/gmi, weatherData.ficonurl_32);
    tempStr26 = tempStr26.replace(/%ficonurl_33%/gmi, weatherData.ficonurl_33);
    tempStr26 = tempStr26.replace(/%ficonurl_34%/gmi, weatherData.ficonurl_34);
    tempStr26 = tempStr26.replace(/%ficonurl_35%/gmi, weatherData.ficonurl_35);
    tempStr26 = tempStr26.replace(/%ficonurl_36%/gmi, weatherData.ficonurl_36);
    tempStr26 = tempStr26.replace(/%ficonurl_37%/gmi, weatherData.ficonurl_37);
    tempStr26 = tempStr26.replace(/%ficonurl_38%/gmi, weatherData.ficonurl_38);
    tempStr26 = tempStr26.replace(/%ficonurl_39%/gmi, weatherData.ficonurl_39);

    let tempStr27 = tempStr26.replace(/%ficonurl2x_00%/gmi, weatherData.ficonurl2x_00);
    tempStr27 = tempStr27.replace(/%ficonurl2x_01%/gmi, weatherData.ficonurl2x_01);
    tempStr27 = tempStr27.replace(/%ficonurl2x_02%/gmi, weatherData.ficonurl2x_02);
    tempStr27 = tempStr27.replace(/%ficonurl2x_03%/gmi, weatherData.ficonurl2x_03);
    tempStr27 = tempStr27.replace(/%ficonurl2x_04%/gmi, weatherData.ficonurl2x_04);
    tempStr27 = tempStr27.replace(/%ficonurl2x_05%/gmi, weatherData.ficonurl2x_05);
    tempStr27 = tempStr27.replace(/%ficonurl2x_06%/gmi, weatherData.ficonurl2x_06);
    tempStr27 = tempStr27.replace(/%ficonurl2x_07%/gmi, weatherData.ficonurl2x_07);
    tempStr27 = tempStr27.replace(/%ficonurl2x_08%/gmi, weatherData.ficonurl2x_08);
    tempStr27 = tempStr27.replace(/%ficonurl2x_09%/gmi, weatherData.ficonurl2x_09);
    tempStr27 = tempStr27.replace(/%ficonurl2x_10%/gmi, weatherData.ficonurl2x_10);
    tempStr27 = tempStr27.replace(/%ficonurl2x_11%/gmi, weatherData.ficonurl2x_11);
    tempStr27 = tempStr27.replace(/%ficonurl2x_12%/gmi, weatherData.ficonurl2x_12);
    tempStr27 = tempStr27.replace(/%ficonurl2x_13%/gmi, weatherData.ficonurl2x_13);
    tempStr27 = tempStr27.replace(/%ficonurl2x_14%/gmi, weatherData.ficonurl2x_14);
    tempStr27 = tempStr27.replace(/%ficonurl2x_15%/gmi, weatherData.ficonurl2x_15);
    tempStr27 = tempStr27.replace(/%ficonurl2x_16%/gmi, weatherData.ficonurl2x_16);
    tempStr27 = tempStr27.replace(/%ficonurl2x_17%/gmi, weatherData.ficonurl2x_17);
    tempStr27 = tempStr27.replace(/%ficonurl2x_18%/gmi, weatherData.ficonurl2x_18);
    tempStr27 = tempStr27.replace(/%ficonurl2x_19%/gmi, weatherData.ficonurl2x_19);
    tempStr27 = tempStr27.replace(/%ficonurl2x_20%/gmi, weatherData.ficonurl2x_20);
    tempStr27 = tempStr27.replace(/%ficonurl2x_21%/gmi, weatherData.ficonurl2x_21);
    tempStr27 = tempStr27.replace(/%ficonurl2x_22%/gmi, weatherData.ficonurl2x_22);
    tempStr27 = tempStr27.replace(/%ficonurl2x_23%/gmi, weatherData.ficonurl2x_23);
    tempStr27 = tempStr27.replace(/%ficonurl2x_24%/gmi, weatherData.ficonurl2x_24);
    tempStr27 = tempStr27.replace(/%ficonurl2x_25%/gmi, weatherData.ficonurl2x_25);
    tempStr27 = tempStr27.replace(/%ficonurl2x_26%/gmi, weatherData.ficonurl2x_26);
    tempStr27 = tempStr27.replace(/%ficonurl2x_27%/gmi, weatherData.ficonurl2x_27);
    tempStr27 = tempStr27.replace(/%ficonurl2x_28%/gmi, weatherData.ficonurl2x_28);
    tempStr27 = tempStr27.replace(/%ficonurl2x_29%/gmi, weatherData.ficonurl2x_29);
    tempStr27 = tempStr27.replace(/%ficonurl2x_30%/gmi, weatherData.ficonurl2x_30);
    tempStr27 = tempStr27.replace(/%ficonurl2x_31%/gmi, weatherData.ficonurl2x_31);
    tempStr27 = tempStr27.replace(/%ficonurl2x_32%/gmi, weatherData.ficonurl2x_32);
    tempStr27 = tempStr27.replace(/%ficonurl2x_33%/gmi, weatherData.ficonurl2x_33);
    tempStr27 = tempStr27.replace(/%ficonurl2x_34%/gmi, weatherData.ficonurl2x_34);
    tempStr27 = tempStr27.replace(/%ficonurl2x_35%/gmi, weatherData.ficonurl2x_35);
    tempStr27 = tempStr27.replace(/%ficonurl2x_36%/gmi, weatherData.ficonurl2x_36);
    tempStr27 = tempStr27.replace(/%ficonurl2x_37%/gmi, weatherData.ficonurl2x_37);
    tempStr27 = tempStr27.replace(/%ficonurl2x_38%/gmi, weatherData.ficonurl2x_38);
    tempStr27 = tempStr27.replace(/%ficonurl2x_39%/gmi, weatherData.ficonurl2x_39);

    let tempStr28 = tempStr27.replace(/%fwindspeed_00%/gmi, weatherData.fwindspeed_00);
    tempStr28 = tempStr28.replace(/%fwindspeed_01%/gmi, weatherData.fwindspeed_01);
    tempStr28 = tempStr28.replace(/%fwindspeed_02%/gmi, weatherData.fwindspeed_02);
    tempStr28 = tempStr28.replace(/%fwindspeed_03%/gmi, weatherData.fwindspeed_03);
    tempStr28 = tempStr28.replace(/%fwindspeed_04%/gmi, weatherData.fwindspeed_04);
    tempStr28 = tempStr28.replace(/%fwindspeed_05%/gmi, weatherData.fwindspeed_05);
    tempStr28 = tempStr28.replace(/%fwindspeed_06%/gmi, weatherData.fwindspeed_06);
    tempStr28 = tempStr28.replace(/%fwindspeed_07%/gmi, weatherData.fwindspeed_07);
    tempStr28 = tempStr28.replace(/%fwindspeed_08%/gmi, weatherData.fwindspeed_08);
    tempStr28 = tempStr28.replace(/%fwindspeed_09%/gmi, weatherData.fwindspeed_09);
    tempStr28 = tempStr28.replace(/%fwindspeed_10%/gmi, weatherData.fwindspeed_10);
    tempStr28 = tempStr28.replace(/%fwindspeed_11%/gmi, weatherData.fwindspeed_11);
    tempStr28 = tempStr28.replace(/%fwindspeed_12%/gmi, weatherData.fwindspeed_12);
    tempStr28 = tempStr28.replace(/%fwindspeed_13%/gmi, weatherData.fwindspeed_13);
    tempStr28 = tempStr28.replace(/%fwindspeed_14%/gmi, weatherData.fwindspeed_14);
    tempStr28 = tempStr28.replace(/%fwindspeed_15%/gmi, weatherData.fwindspeed_15);
    tempStr28 = tempStr28.replace(/%fwindspeed_16%/gmi, weatherData.fwindspeed_16);
    tempStr28 = tempStr28.replace(/%fwindspeed_17%/gmi, weatherData.fwindspeed_17);
    tempStr28 = tempStr28.replace(/%fwindspeed_18%/gmi, weatherData.fwindspeed_18);
    tempStr28 = tempStr28.replace(/%fwindspeed_19%/gmi, weatherData.fwindspeed_19);
    tempStr28 = tempStr28.replace(/%fwindspeed_20%/gmi, weatherData.fwindspeed_20);
    tempStr28 = tempStr28.replace(/%fwindspeed_21%/gmi, weatherData.fwindspeed_21);
    tempStr28 = tempStr28.replace(/%fwindspeed_22%/gmi, weatherData.fwindspeed_22);
    tempStr28 = tempStr28.replace(/%fwindspeed_23%/gmi, weatherData.fwindspeed_23);
    tempStr28 = tempStr28.replace(/%fwindspeed_24%/gmi, weatherData.fwindspeed_24);
    tempStr28 = tempStr28.replace(/%fwindspeed_25%/gmi, weatherData.fwindspeed_25);
    tempStr28 = tempStr28.replace(/%fwindspeed_26%/gmi, weatherData.fwindspeed_26);
    tempStr28 = tempStr28.replace(/%fwindspeed_27%/gmi, weatherData.fwindspeed_27);
    tempStr28 = tempStr28.replace(/%fwindspeed_28%/gmi, weatherData.fwindspeed_28);
    tempStr28 = tempStr28.replace(/%fwindspeed_29%/gmi, weatherData.fwindspeed_29);
    tempStr28 = tempStr28.replace(/%fwindspeed_30%/gmi, weatherData.fwindspeed_30);
    tempStr28 = tempStr28.replace(/%fwindspeed_31%/gmi, weatherData.fwindspeed_31);
    tempStr28 = tempStr28.replace(/%fwindspeed_32%/gmi, weatherData.fwindspeed_32);
    tempStr28 = tempStr28.replace(/%fwindspeed_33%/gmi, weatherData.fwindspeed_33);
    tempStr28 = tempStr28.replace(/%fwindspeed_34%/gmi, weatherData.fwindspeed_34);
    tempStr28 = tempStr28.replace(/%fwindspeed_35%/gmi, weatherData.fwindspeed_35);
    tempStr28 = tempStr28.replace(/%fwindspeed_36%/gmi, weatherData.fwindspeed_36);
    tempStr28 = tempStr28.replace(/%fwindspeed_37%/gmi, weatherData.fwindspeed_37);
    tempStr28 = tempStr28.replace(/%fwindspeed_38%/gmi, weatherData.fwindspeed_38);
    tempStr28 = tempStr28.replace(/%fwindspeed_39%/gmi, weatherData.fwindspeed_39);

    let tempStr29 = tempStr28.replace(/%fwindspeedms_00%/gmi, weatherData.fwindspeedms_00);
    tempStr29 = tempStr29.replace(/%fwindspeedms_01%/gmi, weatherData.fwindspeedms_01);
    tempStr29 = tempStr29.replace(/%fwindspeedms_02%/gmi, weatherData.fwindspeedms_02);
    tempStr29 = tempStr29.replace(/%fwindspeedms_03%/gmi, weatherData.fwindspeedms_03);
    tempStr29 = tempStr29.replace(/%fwindspeedms_04%/gmi, weatherData.fwindspeedms_04);
    tempStr29 = tempStr29.replace(/%fwindspeedms_05%/gmi, weatherData.fwindspeedms_05);
    tempStr29 = tempStr29.replace(/%fwindspeedms_06%/gmi, weatherData.fwindspeedms_06);
    tempStr29 = tempStr29.replace(/%fwindspeedms_07%/gmi, weatherData.fwindspeedms_07);
    tempStr29 = tempStr29.replace(/%fwindspeedms_08%/gmi, weatherData.fwindspeedms_08);
    tempStr29 = tempStr29.replace(/%fwindspeedms_09%/gmi, weatherData.fwindspeedms_09);
    tempStr29 = tempStr29.replace(/%fwindspeedms_10%/gmi, weatherData.fwindspeedms_10);
    tempStr29 = tempStr29.replace(/%fwindspeedms_11%/gmi, weatherData.fwindspeedms_11);
    tempStr29 = tempStr29.replace(/%fwindspeedms_12%/gmi, weatherData.fwindspeedms_12);
    tempStr29 = tempStr29.replace(/%fwindspeedms_13%/gmi, weatherData.fwindspeedms_13);
    tempStr29 = tempStr29.replace(/%fwindspeedms_14%/gmi, weatherData.fwindspeedms_14);
    tempStr29 = tempStr29.replace(/%fwindspeedms_15%/gmi, weatherData.fwindspeedms_15);
    tempStr29 = tempStr29.replace(/%fwindspeedms_16%/gmi, weatherData.fwindspeedms_16);
    tempStr29 = tempStr29.replace(/%fwindspeedms_17%/gmi, weatherData.fwindspeedms_17);
    tempStr29 = tempStr29.replace(/%fwindspeedms_18%/gmi, weatherData.fwindspeedms_18);
    tempStr29 = tempStr29.replace(/%fwindspeedms_19%/gmi, weatherData.fwindspeedms_19);
    tempStr29 = tempStr29.replace(/%fwindspeedms_20%/gmi, weatherData.fwindspeedms_20);
    tempStr29 = tempStr29.replace(/%fwindspeedms_21%/gmi, weatherData.fwindspeedms_21);
    tempStr29 = tempStr29.replace(/%fwindspeedms_22%/gmi, weatherData.fwindspeedms_22);
    tempStr29 = tempStr29.replace(/%fwindspeedms_23%/gmi, weatherData.fwindspeedms_23);
    tempStr29 = tempStr29.replace(/%fwindspeedms_24%/gmi, weatherData.fwindspeedms_24);
    tempStr29 = tempStr29.replace(/%fwindspeedms_25%/gmi, weatherData.fwindspeedms_25);
    tempStr29 = tempStr29.replace(/%fwindspeedms_26%/gmi, weatherData.fwindspeedms_26);
    tempStr29 = tempStr29.replace(/%fwindspeedms_27%/gmi, weatherData.fwindspeedms_27);
    tempStr29 = tempStr29.replace(/%fwindspeedms_28%/gmi, weatherData.fwindspeedms_28);
    tempStr29 = tempStr29.replace(/%fwindspeedms_29%/gmi, weatherData.fwindspeedms_29);
    tempStr29 = tempStr29.replace(/%fwindspeedms_30%/gmi, weatherData.fwindspeedms_30);
    tempStr29 = tempStr29.replace(/%fwindspeedms_31%/gmi, weatherData.fwindspeedms_31);
    tempStr29 = tempStr29.replace(/%fwindspeedms_32%/gmi, weatherData.fwindspeedms_32);
    tempStr29 = tempStr29.replace(/%fwindspeedms_33%/gmi, weatherData.fwindspeedms_33);
    tempStr29 = tempStr29.replace(/%fwindspeedms_34%/gmi, weatherData.fwindspeedms_34);
    tempStr29 = tempStr29.replace(/%fwindspeedms_35%/gmi, weatherData.fwindspeedms_35);
    tempStr29 = tempStr29.replace(/%fwindspeedms_36%/gmi, weatherData.fwindspeedms_36);
    tempStr29 = tempStr29.replace(/%fwindspeedms_37%/gmi, weatherData.fwindspeedms_37);
    tempStr29 = tempStr29.replace(/%fwindspeedms_38%/gmi, weatherData.fwindspeedms_38);
    tempStr29 = tempStr29.replace(/%fwindspeedms_39%/gmi, weatherData.fwindspeedms_39);

    let tempStr30 = tempStr29.replace(/%fwinddeg_00%/gmi, weatherData.fwinddeg_00);
    tempStr30 = tempStr30.replace(/%fwinddeg_01%/gmi, weatherData.fwinddeg_01);
    tempStr30 = tempStr30.replace(/%fwinddeg_02%/gmi, weatherData.fwinddeg_02);
    tempStr30 = tempStr30.replace(/%fwinddeg_03%/gmi, weatherData.fwinddeg_03);
    tempStr30 = tempStr30.replace(/%fwinddeg_04%/gmi, weatherData.fwinddeg_04);
    tempStr30 = tempStr30.replace(/%fwinddeg_05%/gmi, weatherData.fwinddeg_05);
    tempStr30 = tempStr30.replace(/%fwinddeg_06%/gmi, weatherData.fwinddeg_06);
    tempStr30 = tempStr30.replace(/%fwinddeg_07%/gmi, weatherData.fwinddeg_07);
    tempStr30 = tempStr30.replace(/%fwinddeg_08%/gmi, weatherData.fwinddeg_08);
    tempStr30 = tempStr30.replace(/%fwinddeg_09%/gmi, weatherData.fwinddeg_09);
    tempStr30 = tempStr30.replace(/%fwinddeg_10%/gmi, weatherData.fwinddeg_10);
    tempStr30 = tempStr30.replace(/%fwinddeg_11%/gmi, weatherData.fwinddeg_11);
    tempStr30 = tempStr30.replace(/%fwinddeg_12%/gmi, weatherData.fwinddeg_12);
    tempStr30 = tempStr30.replace(/%fwinddeg_13%/gmi, weatherData.fwinddeg_13);
    tempStr30 = tempStr30.replace(/%fwinddeg_14%/gmi, weatherData.fwinddeg_14);
    tempStr30 = tempStr30.replace(/%fwinddeg_15%/gmi, weatherData.fwinddeg_15);
    tempStr30 = tempStr30.replace(/%fwinddeg_16%/gmi, weatherData.fwinddeg_16);
    tempStr30 = tempStr30.replace(/%fwinddeg_17%/gmi, weatherData.fwinddeg_17);
    tempStr30 = tempStr30.replace(/%fwinddeg_18%/gmi, weatherData.fwinddeg_18);
    tempStr30 = tempStr30.replace(/%fwinddeg_19%/gmi, weatherData.fwinddeg_19);
    tempStr30 = tempStr30.replace(/%fwinddeg_20%/gmi, weatherData.fwinddeg_20);
    tempStr30 = tempStr30.replace(/%fwinddeg_21%/gmi, weatherData.fwinddeg_21);
    tempStr30 = tempStr30.replace(/%fwinddeg_22%/gmi, weatherData.fwinddeg_22);
    tempStr30 = tempStr30.replace(/%fwinddeg_23%/gmi, weatherData.fwinddeg_23);
    tempStr30 = tempStr30.replace(/%fwinddeg_24%/gmi, weatherData.fwinddeg_24);
    tempStr30 = tempStr30.replace(/%fwinddeg_25%/gmi, weatherData.fwinddeg_25);
    tempStr30 = tempStr30.replace(/%fwinddeg_26%/gmi, weatherData.fwinddeg_26);
    tempStr30 = tempStr30.replace(/%fwinddeg_27%/gmi, weatherData.fwinddeg_27);
    tempStr30 = tempStr30.replace(/%fwinddeg_28%/gmi, weatherData.fwinddeg_28);
    tempStr30 = tempStr30.replace(/%fwinddeg_29%/gmi, weatherData.fwinddeg_29);
    tempStr30 = tempStr30.replace(/%fwinddeg_30%/gmi, weatherData.fwinddeg_30);
    tempStr30 = tempStr30.replace(/%fwinddeg_31%/gmi, weatherData.fwinddeg_31);
    tempStr30 = tempStr30.replace(/%fwinddeg_32%/gmi, weatherData.fwinddeg_32);
    tempStr30 = tempStr30.replace(/%fwinddeg_33%/gmi, weatherData.fwinddeg_33);
    tempStr30 = tempStr30.replace(/%fwinddeg_34%/gmi, weatherData.fwinddeg_34);
    tempStr30 = tempStr30.replace(/%fwinddeg_35%/gmi, weatherData.fwinddeg_35);
    tempStr30 = tempStr30.replace(/%fwinddeg_36%/gmi, weatherData.fwinddeg_36);
    tempStr30 = tempStr30.replace(/%fwinddeg_37%/gmi, weatherData.fwinddeg_37);
    tempStr30 = tempStr30.replace(/%fwinddeg_38%/gmi, weatherData.fwinddeg_38);
    tempStr30 = tempStr30.replace(/%fwinddeg_39%/gmi, weatherData.fwinddeg_39);

    let tempStr31 = tempStr30.replace(/%fwinddir_00%/gmi, weatherData.fwinddir_00);
    tempStr31 = tempStr31.replace(/%fwinddir_01%/gmi, weatherData.fwinddir_01);
    tempStr31 = tempStr31.replace(/%fwinddir_02%/gmi, weatherData.fwinddir_02);
    tempStr31 = tempStr31.replace(/%fwinddir_03%/gmi, weatherData.fwinddir_03);
    tempStr31 = tempStr31.replace(/%fwinddir_04%/gmi, weatherData.fwinddir_04);
    tempStr31 = tempStr31.replace(/%fwinddir_05%/gmi, weatherData.fwinddir_05);
    tempStr31 = tempStr31.replace(/%fwinddir_06%/gmi, weatherData.fwinddir_06);
    tempStr31 = tempStr31.replace(/%fwinddir_07%/gmi, weatherData.fwinddir_07);
    tempStr31 = tempStr31.replace(/%fwinddir_08%/gmi, weatherData.fwinddir_08);
    tempStr31 = tempStr31.replace(/%fwinddir_09%/gmi, weatherData.fwinddir_09);
    tempStr31 = tempStr31.replace(/%fwinddir_10%/gmi, weatherData.fwinddir_10);
    tempStr31 = tempStr31.replace(/%fwinddir_11%/gmi, weatherData.fwinddir_11);
    tempStr31 = tempStr31.replace(/%fwinddir_12%/gmi, weatherData.fwinddir_12);
    tempStr31 = tempStr31.replace(/%fwinddir_13%/gmi, weatherData.fwinddir_13);
    tempStr31 = tempStr31.replace(/%fwinddir_14%/gmi, weatherData.fwinddir_14);
    tempStr31 = tempStr31.replace(/%fwinddir_15%/gmi, weatherData.fwinddir_15);
    tempStr31 = tempStr31.replace(/%fwinddir_16%/gmi, weatherData.fwinddir_16);
    tempStr31 = tempStr31.replace(/%fwinddir_17%/gmi, weatherData.fwinddir_17);
    tempStr31 = tempStr31.replace(/%fwinddir_18%/gmi, weatherData.fwinddir_18);
    tempStr31 = tempStr31.replace(/%fwinddir_19%/gmi, weatherData.fwinddir_19);
    tempStr31 = tempStr31.replace(/%fwinddir_20%/gmi, weatherData.fwinddir_20);
    tempStr31 = tempStr31.replace(/%fwinddir_21%/gmi, weatherData.fwinddir_21);
    tempStr31 = tempStr31.replace(/%fwinddir_22%/gmi, weatherData.fwinddir_22);
    tempStr31 = tempStr31.replace(/%fwinddir_23%/gmi, weatherData.fwinddir_23);
    tempStr31 = tempStr31.replace(/%fwinddir_24%/gmi, weatherData.fwinddir_24);
    tempStr31 = tempStr31.replace(/%fwinddir_25%/gmi, weatherData.fwinddir_25);
    tempStr31 = tempStr31.replace(/%fwinddir_26%/gmi, weatherData.fwinddir_26);
    tempStr31 = tempStr31.replace(/%fwinddir_27%/gmi, weatherData.fwinddir_27);
    tempStr31 = tempStr31.replace(/%fwinddir_28%/gmi, weatherData.fwinddir_28);
    tempStr31 = tempStr31.replace(/%fwinddir_29%/gmi, weatherData.fwinddir_29);
    tempStr31 = tempStr31.replace(/%fwinddir_30%/gmi, weatherData.fwinddir_30);
    tempStr31 = tempStr31.replace(/%fwinddir_31%/gmi, weatherData.fwinddir_31);
    tempStr31 = tempStr31.replace(/%fwinddir_32%/gmi, weatherData.fwinddir_32);
    tempStr31 = tempStr31.replace(/%fwinddir_33%/gmi, weatherData.fwinddir_33);
    tempStr31 = tempStr31.replace(/%fwinddir_34%/gmi, weatherData.fwinddir_34);
    tempStr31 = tempStr31.replace(/%fwinddir_35%/gmi, weatherData.fwinddir_35);
    tempStr31 = tempStr31.replace(/%fwinddir_36%/gmi, weatherData.fwinddir_36);
    tempStr31 = tempStr31.replace(/%fwinddir_37%/gmi, weatherData.fwinddir_37);
    tempStr31 = tempStr31.replace(/%fwinddir_38%/gmi, weatherData.fwinddir_38);
    tempStr31 = tempStr31.replace(/%fwinddir_39%/gmi, weatherData.fwinddir_39);

    let tempStr32 = tempStr31.replace(/%fwindgust_00%/gmi, weatherData.fwindgust_00);
    tempStr32 = tempStr32.replace(/%fwindgust_01%/gmi, weatherData.fwindgust_01);
    tempStr32 = tempStr32.replace(/%fwindgust_02%/gmi, weatherData.fwindgust_02);
    tempStr32 = tempStr32.replace(/%fwindgust_03%/gmi, weatherData.fwindgust_03);
    tempStr32 = tempStr32.replace(/%fwindgust_04%/gmi, weatherData.fwindgust_04);
    tempStr32 = tempStr32.replace(/%fwindgust_05%/gmi, weatherData.fwindgust_05);
    tempStr32 = tempStr32.replace(/%fwindgust_06%/gmi, weatherData.fwindgust_06);
    tempStr32 = tempStr32.replace(/%fwindgust_07%/gmi, weatherData.fwindgust_07);
    tempStr32 = tempStr32.replace(/%fwindgust_08%/gmi, weatherData.fwindgust_08);
    tempStr32 = tempStr32.replace(/%fwindgust_09%/gmi, weatherData.fwindgust_09);
    tempStr32 = tempStr32.replace(/%fwindgust_10%/gmi, weatherData.fwindgust_10);
    tempStr32 = tempStr32.replace(/%fwindgust_11%/gmi, weatherData.fwindgust_11);
    tempStr32 = tempStr32.replace(/%fwindgust_12%/gmi, weatherData.fwindgust_12);
    tempStr32 = tempStr32.replace(/%fwindgust_13%/gmi, weatherData.fwindgust_13);
    tempStr32 = tempStr32.replace(/%fwindgust_14%/gmi, weatherData.fwindgust_14);
    tempStr32 = tempStr32.replace(/%fwindgust_15%/gmi, weatherData.fwindgust_15);
    tempStr32 = tempStr32.replace(/%fwindgust_16%/gmi, weatherData.fwindgust_16);
    tempStr32 = tempStr32.replace(/%fwindgust_17%/gmi, weatherData.fwindgust_17);
    tempStr32 = tempStr32.replace(/%fwindgust_18%/gmi, weatherData.fwindgust_18);
    tempStr32 = tempStr32.replace(/%fwindgust_19%/gmi, weatherData.fwindgust_19);
    tempStr32 = tempStr32.replace(/%fwindgust_20%/gmi, weatherData.fwindgust_20);
    tempStr32 = tempStr32.replace(/%fwindgust_21%/gmi, weatherData.fwindgust_21);
    tempStr32 = tempStr32.replace(/%fwindgust_22%/gmi, weatherData.fwindgust_22);
    tempStr32 = tempStr32.replace(/%fwindgust_23%/gmi, weatherData.fwindgust_23);
    tempStr32 = tempStr32.replace(/%fwindgust_24%/gmi, weatherData.fwindgust_24);
    tempStr32 = tempStr32.replace(/%fwindgust_25%/gmi, weatherData.fwindgust_25);
    tempStr32 = tempStr32.replace(/%fwindgust_26%/gmi, weatherData.fwindgust_26);
    tempStr32 = tempStr32.replace(/%fwindgust_27%/gmi, weatherData.fwindgust_27);
    tempStr32 = tempStr32.replace(/%fwindgust_28%/gmi, weatherData.fwindgust_28);
    tempStr32 = tempStr32.replace(/%fwindgust_29%/gmi, weatherData.fwindgust_29);
    tempStr32 = tempStr32.replace(/%fwindgust_30%/gmi, weatherData.fwindgust_30);
    tempStr32 = tempStr32.replace(/%fwindgust_31%/gmi, weatherData.fwindgust_31);
    tempStr32 = tempStr32.replace(/%fwindgust_32%/gmi, weatherData.fwindgust_32);
    tempStr32 = tempStr32.replace(/%fwindgust_33%/gmi, weatherData.fwindgust_33);
    tempStr32 = tempStr32.replace(/%fwindgust_34%/gmi, weatherData.fwindgust_34);
    tempStr32 = tempStr32.replace(/%fwindgust_35%/gmi, weatherData.fwindgust_35);
    tempStr32 = tempStr32.replace(/%fwindgust_36%/gmi, weatherData.fwindgust_36);
    tempStr32 = tempStr32.replace(/%fwindgust_37%/gmi, weatherData.fwindgust_37);
    tempStr32 = tempStr32.replace(/%fwindgust_38%/gmi, weatherData.fwindgust_38);
    tempStr32 = tempStr32.replace(/%fwindgust_39%/gmi, weatherData.fwindgust_39);

    let tempStr33 = tempStr32.replace(/%fwindgustms_00%/gmi, weatherData.fwindgustms_00);
    tempStr33 = tempStr33.replace(/%fwindgustms_01%/gmi, weatherData.fwindgustms_01);
    tempStr33 = tempStr33.replace(/%fwindgustms_02%/gmi, weatherData.fwindgustms_02);
    tempStr33 = tempStr33.replace(/%fwindgustms_03%/gmi, weatherData.fwindgustms_03);
    tempStr33 = tempStr33.replace(/%fwindgustms_04%/gmi, weatherData.fwindgustms_04);
    tempStr33 = tempStr33.replace(/%fwindgustms_05%/gmi, weatherData.fwindgustms_05);
    tempStr33 = tempStr33.replace(/%fwindgustms_06%/gmi, weatherData.fwindgustms_06);
    tempStr33 = tempStr33.replace(/%fwindgustms_07%/gmi, weatherData.fwindgustms_07);
    tempStr33 = tempStr33.replace(/%fwindgustms_08%/gmi, weatherData.fwindgustms_08);
    tempStr33 = tempStr33.replace(/%fwindgustms_09%/gmi, weatherData.fwindgustms_09);
    tempStr33 = tempStr33.replace(/%fwindgustms_10%/gmi, weatherData.fwindgustms_10);
    tempStr33 = tempStr33.replace(/%fwindgustms_11%/gmi, weatherData.fwindgustms_11);
    tempStr33 = tempStr33.replace(/%fwindgustms_12%/gmi, weatherData.fwindgustms_12);
    tempStr33 = tempStr33.replace(/%fwindgustms_13%/gmi, weatherData.fwindgustms_13);
    tempStr33 = tempStr33.replace(/%fwindgustms_14%/gmi, weatherData.fwindgustms_14);
    tempStr33 = tempStr33.replace(/%fwindgustms_15%/gmi, weatherData.fwindgustms_15);
    tempStr33 = tempStr33.replace(/%fwindgustms_16%/gmi, weatherData.fwindgustms_16);
    tempStr33 = tempStr33.replace(/%fwindgustms_17%/gmi, weatherData.fwindgustms_17);
    tempStr33 = tempStr33.replace(/%fwindgustms_18%/gmi, weatherData.fwindgustms_18);
    tempStr33 = tempStr33.replace(/%fwindgustms_19%/gmi, weatherData.fwindgustms_19);
    tempStr33 = tempStr33.replace(/%fwindgustms_20%/gmi, weatherData.fwindgustms_20);
    tempStr33 = tempStr33.replace(/%fwindgustms_21%/gmi, weatherData.fwindgustms_21);
    tempStr33 = tempStr33.replace(/%fwindgustms_22%/gmi, weatherData.fwindgustms_22);
    tempStr33 = tempStr33.replace(/%fwindgustms_23%/gmi, weatherData.fwindgustms_23);
    tempStr33 = tempStr33.replace(/%fwindgustms_24%/gmi, weatherData.fwindgustms_24);
    tempStr33 = tempStr33.replace(/%fwindgustms_25%/gmi, weatherData.fwindgustms_25);
    tempStr33 = tempStr33.replace(/%fwindgustms_26%/gmi, weatherData.fwindgustms_26);
    tempStr33 = tempStr33.replace(/%fwindgustms_27%/gmi, weatherData.fwindgustms_27);
    tempStr33 = tempStr33.replace(/%fwindgustms_28%/gmi, weatherData.fwindgustms_28);
    tempStr33 = tempStr33.replace(/%fwindgustms_29%/gmi, weatherData.fwindgustms_29);
    tempStr33 = tempStr33.replace(/%fwindgustms_30%/gmi, weatherData.fwindgustms_30);
    tempStr33 = tempStr33.replace(/%fwindgustms_31%/gmi, weatherData.fwindgustms_31);
    tempStr33 = tempStr33.replace(/%fwindgustms_32%/gmi, weatherData.fwindgustms_32);
    tempStr33 = tempStr33.replace(/%fwindgustms_33%/gmi, weatherData.fwindgustms_33);
    tempStr33 = tempStr33.replace(/%fwindgustms_34%/gmi, weatherData.fwindgustms_34);
    tempStr33 = tempStr33.replace(/%fwindgustms_35%/gmi, weatherData.fwindgustms_35);
    tempStr33 = tempStr33.replace(/%fwindgustms_36%/gmi, weatherData.fwindgustms_36);
    tempStr33 = tempStr33.replace(/%fwindgustms_37%/gmi, weatherData.fwindgustms_37);
    tempStr33 = tempStr33.replace(/%fwindgustms_38%/gmi, weatherData.fwindgustms_38);
    tempStr33 = tempStr33.replace(/%fwindgustms_39%/gmi, weatherData.fwindgustms_39);

    // Replace Next Time Slices
    let tempStr34 = tempStr33.replace(/%next12%/gmi, next12);
    tempStr34 = tempStr34.replace(/%next24%/gmi, next24);
    tempStr34 = tempStr34.replace(/%next48%/gmi, next48);

    return tempStr34;
  
}