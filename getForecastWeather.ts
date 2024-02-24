// • getForecastWeather - Returns Air Qulity Index From API • 
export default async function getForecastWeather(key:any, latitude:any, longitude:any, language:any, units:any, format:any) {
  let weatherData;
  let weatherString;
  let url;
  //console.log('getForecastWeather Called...');

  // • Get Forecast Weather From API • 
  if (latitude.length > 0 && longitude.length > 0) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${key}&units=${units}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${this}&lang=${this}&appid=${key}&units=${units}`;
  };
  let req = await fetch(url);
  let json = await req.json();
  //console.log('json:', json);
  if (json.cod != 200) {
    weatherString = "Error Code "+json.cod+": "+json.message;
    return weatherString;
  };

}