import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TextAreaComponent, TAbstractFile, TFolder, SuggestModal, Platform } from 'obsidian';

let displayErrorMsg = true;

interface OpenWeatherSettings {
  location: string;
  key: string;
  units: string;
  excludeFolder: string;
  weatherFormat1: string;
  weatherFormat2: string;
  weatherFormat3: string;
  weatherFormat4: string;
  statusbarActive: boolean;
  weatherFormatSB: string;
  statusbarUpdateFreq: string;
}

const DEFAULT_SETTINGS: OpenWeatherSettings = {
  location: '',
  key: '',
  units: 'metric',
  excludeFolder: '',
  weatherFormat1: '%desc% • Current Temp: %temp%°C • Feels Like: %feels%°C\n',
  weatherFormat2: '%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM% %ampm1%\nCurrent Temp: %temp%°C • Feels Like: %feels%°C\nWind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^\nSunrise: %sunrise% • Sunset: %sunset%\n',
  weatherFormat3: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
  weatherFormat4: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Current Temp: %temp% • Feels like: %feels%<br>&nbsp;Wind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
  statusbarActive: true,
  weatherFormatSB: ' | %desc% | Current Temp: %temp%°C | Feels Like: %feels%°C | ',
  statusbarUpdateFreq: "15"
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                           ● Class FormatWeather ●                            │
//  │                                                                              │
//  │  • Get current weather from OpenWeather API and return a formatted string •  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
class FormatWeather {
  location: String;
  key: string
  units: string
  format: string
  
  constructor(location: string, key: string, units: string, format: string) {
    this.location = location;
    this.key = key;
    this.units = units;
    this.format = format;
  }
  
  // • getWeather - Get the weather data from the OpenWeather API • 
  async getWeather() {
    let weatherData;
    let weatherString;
    let testData = {"rain": {"3h": 24}}

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&appid=${this.key}&units=${this.units}`;
    let req = await fetch(url);
    let json = await req.json();
    let conditions = json.weather[0].description;
 		conditions = conditions.replace(/^\w|\s\w/g, (c: string) => c.toUpperCase());
    let iconName = json.weather[0].icon;
    const iconApi = await fetch('http://openweathermap.org/img/w/' + iconName + '.png');
    let iconUrl = iconApi.url;
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
    if (this.units == "metric") {
      windSpeed = Math.round(windSpeed*3.6);
    } else {
      windSpeed = Math.round(windSpeed);
    }
    let windDirection = json.wind.deg;
    windDirection = this.getCardinalDirection(windDirection);
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

    // getWeather - Create weather data object 
    weatherData = {
      "status": "ok",
      "conditions": conditions,
      "icon": iconUrl,
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
      "name": name
    }

    // getWeather - Create Formatted weather string 
    weatherString = this.format.replace(/%desc%/gmi, weatherData.conditions);
    weatherString = weatherString.replace(/%icon%/gmi, `<img src=${weatherData.icon} />`);
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

    return weatherString;
  }

  // • getWeatherString - Returns a formatted weather string • 
  async getWeatherString() {
    let weatherString = await this.getWeather();
    return weatherString;
  }

  // • getCardinalDirection - Converts the wind direction in degrees to text and returns the string value • 
  getCardinalDirection(angle: number) {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    return directions[Math.round(angle / 45) % 8];
  }

}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Class OpenWeather ●                             │
//  │                                                                              │
//  │            • The Plugin class defines the lifecycle of a plugin •            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
export default class OpenWeather extends Plugin {
  settings: OpenWeatherSettings;
  statusBar: HTMLElement;
  divEl: HTMLElement;

  // • onload - Configure resources needed by the plugin • 
  async onload() {

    // onload - Load settings 
    await this.loadSettings();

    // onload - This creates an icon in the left ribbon 
    this.addRibbonIcon('thermometer-snowflake', 'OpenWeather', (evt: MouseEvent) => {
      // Called when the user clicks the icon.
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) {
        new Notice("Open a Markdown file first.");
        return;
      }
      if (view.getViewType() === 'markdown') {
        const md = view as MarkdownView;
        if (md.getMode() === 'source') {
          new InsertWeatherPicker(this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1, this.settings.weatherFormat2, this.settings.weatherFormat3, this.settings.weatherFormat4).open();
        } else {
          new Notice("Markdown file must be in source mode to insert weather string.")
        }
      } else {
        new Notice("Open a Markdown file first.")
      }
    });

    // onload - This adds a status bar item to the bottom of the app - Does not work on mobile apps 
    this.statusBar = this.addStatusBarItem();
    if (this.settings.statusbarActive) {
      if (this.settings.key.length == 0 || this.settings.location.length == 0) {
        if (displayErrorMsg) {
          new Notice("OpenWeather plugin settings are undefined, check your settings.", 8000)
          this.statusBar.setText('');
          console.log('Err:', displayErrorMsg);
          displayErrorMsg = false;
        }
      } else {
        let wstr = new FormatWeather(this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormatSB);
        let weatherStr = await wstr.getWeatherString();
        this.statusBar.setText(weatherStr);
      }
    } else {
      this.statusBar.setText('');
    }

    // onload - Replace template strings 
    this.addCommand ({
      id: 'replace-template-string',
      name: 'Replace template strings',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat1.length > 0) {
          if (view.data.contains("%weather1%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather1%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat2.length > 0) {
          if (view.data.contains("%weather2%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat2);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather2%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat3.length > 0) {
          if (view.data.contains("%weather3%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat3);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather3%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat4.length > 0) {
          if (view.data.contains("%weather4%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather4%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
      }
    });

    // onload - Insert weather format one string 
    this.addCommand ({
      id: 'insert-format-one',
      name: 'Insert weather format one',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat1.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1);
          let weatherStr = await wstr.getWeatherString();
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 1 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather format two string 
    this.addCommand ({
      id: 'insert-format-two',
      name: 'Insert weather format two',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat2.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat2);
          let weatherStr = await wstr.getWeatherString();
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 2 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather format three string 
    this.addCommand ({
      id: 'insert-format-three',
      name: 'Insert weather format three',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat3.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat3);
          let weatherStr = await wstr.getWeatherString();
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 3 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather format four string 
    this.addCommand ({
      id: 'insert-format-four',
      name: 'Insert weather format four',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat4.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
          let weatherStr = await wstr.getWeatherString();
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 4 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - This adds a settings tab so the user can configure various aspects of the plugin 
    this.addSettingTab(new OpenWeatherSettingsTab(this.app, this));

    // onload - registerEvent - 'file-open' 
    this.registerEvent(this.app.workspace.on('file-open', async (file) => {
      if (file) {
        await new Promise(r => setTimeout(r, 2000));    // Wait for Templater to do its thing
        await this.replaceTemplateStrings();
        await this.updateCurrentWeatherDiv();
      }
    }));

    // onload - registerEvent - 'layout-change' 
    this.registerEvent(this.app.workspace.on('layout-change', async () => {
      await new Promise(r => setTimeout(r, 2000));    // Wait for Templater to do its thing
      await this.replaceTemplateStrings();
      await this.updateCurrentWeatherDiv();
    }));

    // onload - registerEvent - 'resolved' 
    this.registerEvent(this.app.metadataCache.on('resolved', async () => {
      await this.replaceTemplateStrings();
      await this.updateCurrentWeatherDiv();
    }));

    // onload - When registering intervals, this function will automatically clear the interval when the plugin is disabled 
    let updateFreq = this.settings.statusbarUpdateFreq;
    this.registerInterval(window.setInterval(() => this.updateWeather(), Number(updateFreq) * 60 * 1000));
    this.registerInterval(window.setInterval(() => this.updateCurrentWeatherDiv(), Number(updateFreq) * 60 * 1000));
    
  }

  // • updateCurrentWeatherDiv - Update DIV's with current weather • 
  async updateCurrentWeatherDiv() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
      if(document.getElementsByClassName('weather_current_1').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_1')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1);
        let weatherStr = await wstr.getWeatherString();
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_2').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_2')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat2);
        let weatherStr = await wstr.getWeatherString();
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_3').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_3')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat3);
        let weatherStr = await wstr.getWeatherString();
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_4').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_4')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
        let weatherStr = await wstr.getWeatherString();
        divEl.innerHTML = weatherStr;
      }
    }
      
  // • replaceTemplateStrings - Replace any template strings in current file • 
  async replaceTemplateStrings() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    const file = app.workspace.getActiveFile();
    if (view.file.parent.path === this.settings.excludeFolder) return;    // Ignore this folder for Template String Replacement
    let editor = view.getViewData();
    if (editor == null) return;
    if (this.settings.weatherFormat1.length > 0) {
      if (editor.contains("%weather1%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1);
        let weatherStr = await wstr.getWeatherString();
        editor = editor.replace(/%weather1%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat2.length > 0) {
      if (editor.contains("%weather2%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat2);
        let weatherStr = await wstr.getWeatherString();
        editor = editor.replace(/%weather2%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat3.length > 0) {
      if (editor.contains("%weather3%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat3);
        let weatherStr = await wstr.getWeatherString();
        editor = editor.replace(/%weather3%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat4.length > 0) {
      if (editor.contains("%weather4%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
        let weatherStr = await wstr.getWeatherString();
        editor = editor.replace(/%weather4%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
  }

  // • updateWeather - Get weather information from OpenWeather API • 
  async updateWeather() {
    if (this.settings.statusbarActive) {
      if (this.settings.key.length == 0 || this.settings.location.length == 0) {
        if (displayErrorMsg) {
          new Notice("OpenWeather plugin settings are undefined, check your settings.");
          this.statusBar.setText('');
          displayErrorMsg = false;
        }
      } else {
        let wstr = new FormatWeather(this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormatSB);
        let weatherStr = await wstr.getWeatherString();
        this.statusBar.setText(weatherStr);
      }
    } else {
      this.statusBar.setText('');
    }
  }

  // • onunload - Release any resources configured by the plugin • 
  onunload() {

  }

  // • loadSettings - Load settings from data.json • 
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  // • saveSettings - Save settings from data.json • 
  async saveSettings() {
    await this.saveData(this.settings);
  }
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                         ● Class InsertWeatherModal ●                         │
//  │                                                                              │
//  │             • Insert Weather or Replace Template Strings Modal •             │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
interface Commands {
  command: string;
  format: string;
}

let ALL_COMMANDS: { command: string; format: string; }[] = [];

class InsertWeatherPicker extends SuggestModal<Commands> implements OpenWeatherSettings{
  location: string;
  key: string;
  units: string;
  excludeFolder: string;
  weatherFormat1: string;
  weatherFormat2: string;
  weatherFormat3: string;
  weatherFormat4: string;
  statusbarActive: boolean;
  weatherFormatSB: string;
  statusbarUpdateFreq: string;
  plugin: OpenWeather
  command: string;
  format: string;

  constructor(location: string, key: string, units: string, weatherFormat1: string, weatherFormat2: string, weatherFormat3: string, weatherFormat4: string) {
    super(app);
    this.location = location;
    this.key = key;
    this.units = units;
    this.weatherFormat1 = weatherFormat1;
    this.weatherFormat2 = weatherFormat2;
    this.weatherFormat3 = weatherFormat3;
    this.weatherFormat4 = weatherFormat4;
  }

  async getSuggestions(query: string): Promise<Commands[]> {
    ALL_COMMANDS = [];
    if (this.weatherFormat1.length > 0) {
      let wstr = new FormatWeather (this.location, this.key, this.units, this.weatherFormat1);
      let weatherStr = await wstr.getWeatherString();
      this.weatherFormat1 = weatherStr;
      ALL_COMMANDS.push({command: "Insert Weather String - Format 1", format: this.weatherFormat1})
    }
    if (this.weatherFormat2.length > 0) {
      let wstr = new FormatWeather (this.location, this.key, this.units, this.weatherFormat2);
      let weatherStr = await wstr.getWeatherString();
      this.weatherFormat2 = weatherStr;
      ALL_COMMANDS.push({command: "Insert Weather String - Format 2", format: this.weatherFormat2})
    }
    if (this.weatherFormat3.length > 0) {
      let wstr = new FormatWeather (this.location, this.key, this.units, this.weatherFormat3);
      let weatherStr = await wstr.getWeatherString();
      this.weatherFormat3 = weatherStr;
      ALL_COMMANDS.push({command: "Insert Weather String - Format 3", format: this.weatherFormat3})
    }
    if (this.weatherFormat4.length > 0) {
      let wstr = new FormatWeather (this.location, this.key, this.units, this.weatherFormat4);
      let weatherStr = await wstr.getWeatherString();
      this.weatherFormat4 = weatherStr;
      ALL_COMMANDS.push({command: "Insert Weather String - Format 4", format: this.weatherFormat4})
    }
    ALL_COMMANDS.push({command: "Replace Template Strings", format: "Replace all occurences of %weather1%, %weather2%, %weather3% and %weather4%\nin the current document."})
    return ALL_COMMANDS.filter((command) =>
    command.command.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Renders each suggestion item.
  renderSuggestion(command: Commands, el: HTMLElement) {
    el.createEl("div", { text: command.command });
    el.createEl("small", { text: command.format });
  }

  // Perform action on the selected suggestion.
  async onChooseSuggestion(command: Commands, evt: MouseEvent | KeyboardEvent) {
    //new Notice(`Selected ${command.command}`);
    this.command = command.command
    this.format = command.format
    this.close();
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    if (view.file.parent.path === 'Templates') return;    // TODO: Add this to settings Ignore this folder
    let editor = view.getViewData();
    if (editor == null) return;
    if (command.command == 'Replace Template Strings') {
      if (this.weatherFormat1.length > 0) {
        editor = editor.replace(/%weather1%/gmi, this.weatherFormat1);
        view.setViewData(editor,false);
      }
      if (this.weatherFormat2.length > 0) {
        editor = editor.replace(/%weather2%/gmi, this.weatherFormat2);
        view.setViewData(editor,false);
      }
      if (this.weatherFormat3.length > 0) {
        editor = editor.replace(/%weather3%/gmi, this.weatherFormat3);
        view.setViewData(editor,false);
      }
      if (this.weatherFormat4.length > 0) {
        editor = editor.replace(/%weather4%/gmi, this.weatherFormat4);
        view.setViewData(editor,false);
      }
    } else {
      view.editor.replaceSelection(this.format);
    }
  }
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Class OpenWeatherSettingsTab ●                       │
//  │                                                                              │
//  │                        • Open Weather Settings Tab •                         │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
class OpenWeatherSettingsTab extends PluginSettingTab {
  plugin: OpenWeather;

  constructor(app: App, plugin: OpenWeather) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();

    // Get vault folders for exclude folder dropdown list
    const abstractFiles = app.vault.getAllLoadedFiles();
    const folders: TFolder[] = [];
    abstractFiles.forEach((folder: TAbstractFile) => {
      if (
        folder instanceof TFolder && folder.name.length > 0
      ) {
        folders.push(folder);
      }
    });

    // OpenWeatherSettingsTab - H2 Header - Settings for calling OpenWeather API 
    containerEl.createEl('h2', {text: 'Settings for calling OpenWeather API'});

    new Setting(containerEl)
      .setName('Enter Location')
      .setDesc('Name of the city you want to retrieve weather for')
      .addText(text => text
        .setPlaceholder('Enter city Eg. edmonton')
        .setValue(this.plugin.settings.location)
        .onChange(async (value) => {
          this.plugin.settings.location = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    new Setting(containerEl)
      .setName('OpenWeather API Key')
      .setDesc('A free OpenWeather API key is required for the plugin to work. Go to https://openweathermap.org to register and get a key')
      .addText(text => text
        .setPlaceholder('Enter OpenWeather API Key')
        .setValue(this.plugin.settings.key)
        .onChange(async (value) => {
          this.plugin.settings.key = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    new Setting(containerEl)
      .setName("Units of Measurement")
      .setDesc("Units of measurement. Standard, Metric and Imperial units are available")
      .addDropdown(dropDown => {
        dropDown.addOption('standard', 'Standard');
        dropDown.addOption('metric', 'Metric');
        dropDown.addOption('imperial', 'Imperial');
        dropDown.onChange(async (value) => {
          this.plugin.settings.units = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        })
      .setValue(this.plugin.settings.units);
      });

    // OpenWeatherSettingsTab - H2 Header - Exclude Folder (Exclude Folder for Template String Replacement) 
    containerEl.createEl('br');
    containerEl.createEl('h2', {text: 'Folder to Exclude From Automatic Template Strings Replacement'});

    new Setting(containerEl)
      .setName("Exclude Folder")
      .setDesc("Folder to Exclude from Automatic Template String Replacement")
      .addDropdown(dropDown => {
        folders.forEach(e => {
          dropDown.addOption(e.name,e.name);
        });
        dropDown.onChange(async (value) => {
          this.plugin.settings.excludeFolder = value;
          await this.plugin.saveSettings();
        })
      .setValue(this.plugin.settings.excludeFolder);
      });

    // OpenWeatherSettingsTab - H2 Header - Weather Strings Formatting (Up to 4 Strings are Available) 
    containerEl.createEl('br');
    containerEl.createEl('h2', {text: 'Weather Strings Formatting (Up to 4 Strings are Available)'});

    new Setting(containerEl)
      .setName("Weather String Format 1")
      .setDesc("Weather string format one")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather String Format 1')
        .setValue(this.plugin.settings.weatherFormat1)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat1 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather String Format 2")
      .setDesc("Weather string format two")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather String Format 2')
        .setValue(this.plugin.settings.weatherFormat2)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat2 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather String Format 3")
      .setDesc("Weather string format three")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather String Format 3')
        .setValue(this.plugin.settings.weatherFormat3)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat3 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather String Format 4")
      .setDesc("Weather string format four")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather String Format 4')
        .setValue(this.plugin.settings.weatherFormat4)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat4 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });


    // OpenWeatherSettingsTab - H2 Header - Show Weather in Statusbar Options
    if (Platform.isDesktop) {
      containerEl.createEl('br');
      containerEl.createEl('h2', {text: 'Show Weather in Statusbar Options'});

      new Setting(containerEl)
      .setName('Show Weather in Statusbar')
      .setDesc('Enable weather display in statusbar')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.statusbarActive)
        .onChange(async (value) => {
          this.plugin.settings.statusbarActive = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
      }));

      new Setting(containerEl)
      .setName("Weather String Format Statusbar")
      .setDesc("Weather string format for the statusbar")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Statusbar Weather Format')
        .setValue(this.plugin.settings.weatherFormatSB)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormatSB = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        })
        textArea.inputEl.setAttr("rows", 10);
        textArea.inputEl.setAttr("cols", 60);
      });
    } else {
      this.plugin.settings.statusbarActive = false;   // Set statusbar inactive for mobile
    }

    // OpenWeatherSettingsTab - H2 Header - Show Weather in Statusbar and Dynamic DIV's Delay
    containerEl.createEl('br');
    containerEl.createEl('h2', {text: `Show Weather in Statusbar and Dynamic DIV's Delay`});

    new Setting(containerEl)
      .setName("Update Frequency")
      .setDesc("Update frequency for weather information displayed on the statusbar and dynamic DIV's")
      .addDropdown(dropDown => {
        dropDown.addOption('1', 'Every Minute');
        dropDown.addOption('5', 'Every 5 Minutes');
        dropDown.addOption('10', 'Every 10 Minutes');
        dropDown.addOption('15', 'Every 15 Minutes');
        dropDown.addOption('20', 'Every 20 Minutes');
        dropDown.addOption('30', 'Every 30 Minutes');
        dropDown.addOption('60', 'Every Hour');
        dropDown.onChange(async (value) => {
          this.plugin.settings.statusbarUpdateFreq = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        })
      .setValue(this.plugin.settings.statusbarUpdateFreq)
      });

  }
}

// Weather Placeholders
// ====================
// weather.description %desc%
// weather.icon %icon%
// main.temp %temp%
// main.feels_like %feels%
// main.temp_min %tempmin%
// main.temp_max %tempmax%
// main.pressure %pressure%
// main.humidity %humidity%
// main.sea_level %pressure-sl%
// main.grnd_level %pressure-gl%
// visibility %visibility%
// wind.speed %wind-speed%
// wind.deg %wind-deg%
// wind.gust %wind-gust%
// dt (date time) %date% %time%
// sys.sunrise %sunrise%
// sys.sunset %sunset%

// Example of API response
// =======================
//
// {
//   "coord": {
//     "lon": 10.99,
//     "lat": 44.34
//   },
//   "weather": [
//     {
//       "id": 501,
//       "main": "Rain",
//       "description": "moderate rain",
//       "icon": "10d"
//     }
//   ],
//   "base": "stations",
//   "main": {
//     "temp": 298.48,
//     "feels_like": 298.74,
//     "temp_min": 297.56,
//     "temp_max": 300.05,
//     "pressure": 1015,
//     "humidity": 64,
//     "sea_level": 1015,
//     "grnd_level": 933
//   },
//   "visibility": 10000,
//   "wind": {
//     "speed": 0.62,
//     "deg": 349,
//     "gust": 1.18
//   },
//   "rain": {
//     "1h": 3.16
//   },
//   "clouds": {
//     "all": 100
//   },
//   "dt": 1661870592,
//   "sys": {
//     "type": 2,
//     "id": 2075663,
//     "country": "IT",
//     "sunrise": 1661834187,
//     "sunset": 1661882248
//   },
//   "timezone": 7200,
//   "id": 3163858,
//   "name": "Zocca",
//   "cod": 200
// }
