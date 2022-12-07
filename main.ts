import { Console } from 'console';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TextAreaComponent } from 'obsidian';

interface OpenWeatherSettings {
  location: string;
  key: string;
  units: string;
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
  weatherFormat1: '%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM% ● Current Temp: %temp%°C ● Feels Like: %feels%°C ● %wind-speed% Km/h from the %wind-dir%_ with gusts up to %wind-gust% Km/h_',
  weatherFormat2: '%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM%\nCurrent Temp: %temp%°C ● Feels Like: %feels%°C\n%wind-speed% Km/h from the %wind-dir%_ with gusts up to %wind-gust% Km/h_\nSunrise:%sunrise% ● Sunset%sunset%',
  weatherFormat3: '',
  weatherFormat4: '',
  statusbarActive: true,
  weatherFormatSB: ' 🔸 Weather Updated: %dateMonth3% %dateDay2% - %timeH2%:%timeM% %ampm1% 🔸 %desc% 🔸  🌡 %temp%°C 🔸 Feels Like: %feels%°C 🔸 Wind: %wind-speed% Km/h from the %wind-dir%_ with gusts up to %wind-gust% Km/h_ 🔸 ',
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
  
  // • getWeather - Gets the weather data from the OpenWeather API • 
  async getWeather() {
    let weatherData;
    let weatherString;

  try{
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

    // getWeather - Create weather data object 
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
  }catch(e){
    console.error(e);
    console.log("Error encountered getting weather...")
    weatherData = {"status": "Error encountered getting weather..."};
  }

    // getWeather - Create Formatted weather string 
    weatherString = this.format.replace(/%desc%/g, weatherData.conditions);
    weatherString = weatherString.replace(/%icon%/g, `<img src=${weatherData.icon} />`);
    weatherString = weatherString.replace(/%temp%/g, weatherData.temp);
    weatherString = weatherString.replace(/%feels%/g, weatherData.feelsLike);
    weatherString = weatherString.replace(/%tempmin%/g, weatherData.tempMin);
    weatherString = weatherString.replace(/%tempmax%/g, weatherData.tempMax);
    weatherString = weatherString.replace(/%pressure%/g, weatherData.pressure);
    weatherString = weatherString.replace(/%humidity%/g, weatherData.humidity);
    weatherString = weatherString.replace(/%pressure-sl%/g, weatherData.seaLevel);
    weatherString = weatherString.replace(/%pressure-gl%/g, weatherData.groundLevel);
    weatherString = weatherString.replace(/%visibility%/g, weatherData.visibility);
    weatherString = weatherString.replace(/%wind-speed%/g, weatherData.windSpeed);
    weatherString = weatherString.replace(/%wind-dir%/g, weatherData.windDirection);
    if (weatherData.windGust == "N/A") {
      weatherString = weatherString.replace(/_.+_/g, "");
    } else {
      weatherString = weatherString.replace(/%wind-gust%/g, weatherData.windGust);
      weatherString = weatherString.replace(/_(.+)_/g, "$1");
    }
    weatherString = weatherString.replace(/%dateYear1%/g, `${weatherData.year1}`);
    weatherString = weatherString.replace(/%dateYear2%/g, `${weatherData.year2}`);
    weatherString = weatherString.replace(/%dateMonth1%/g, `${weatherData.month1}`);
    weatherString = weatherString.replace(/%dateMonth2%/g, `${weatherData.month2}`);
    weatherString = weatherString.replace(/%dateMonth3%/g, `${weatherData.month3}`);
    weatherString = weatherString.replace(/%dateMonth4%/g, `${weatherData.month4}`);
    weatherString = weatherString.replace(/%dateDay1%/g, `${weatherData.date1}`);
    weatherString = weatherString.replace(/%dateDay2%/g, `${weatherData.date2}`);
    weatherString = weatherString.replace(/%ampm1%/g, `${weatherData.ampm1}`);
    weatherString = weatherString.replace(/%ampm2%/g, `${weatherData.ampm2}`);
    weatherString = weatherString.replace(/%timeH1%/g, `${weatherData.hour1}`);
    weatherString = weatherString.replace(/%timeH2%/g, `${weatherData.hour2}`);
    weatherString = weatherString.replace(/%timeM%/g, `${weatherData.min}`);
    weatherString = weatherString.replace(/%timeS%/g, `${weatherData.sec}`);
    weatherString = weatherString.replace(/%sunrise%/g, `${weatherData.sunrise}`);
    weatherString = weatherString.replace(/%sunset%/g, `${weatherData.sunset}`);
    weatherString = weatherString.replace(/%name%/g, `${weatherData.name}`);

    // getWeather - Return the weather data object 
    return weatherString;
  }

  // • getWeatherString - Returns a formatted weather string • 
  async getWeatherString() {
    let weatherString = await this.getWeather();
    //console.log('Weather String:', weatherString);
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

    // onload - Load settings 
    await this.loadSettings();

    // onload - This creates an icon in the left ribbon 
    const ribbonIconEl = this.addRibbonIcon('thermometer-snowflake', 'OpenWeather', (evt: MouseEvent) => {
      // Called when the user clicks the icon.
      new Notice('This is a notice!');
    });
    // Perform additional things with the ribbon
    ribbonIconEl.addClass('my-plugin-ribbon-class');

    // onload - This adds a status bar item to the bottom of the app - Does not work on mobile apps 
    this.statusBar = this.addStatusBarItem();
    // this.updateStatusBar();
    if (this.settings.statusbarActive) {
      if (this.settings.key.length == 0 || this.settings.location.length == 0) {
        new Notice("OpenWeather plugin settings are undefined.")
        this.statusBar.setText('');
      } else {
        let wstr = new FormatWeather(this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormatSB);
        let weatherStr = await wstr.getWeatherString();
        this.statusBar.setText(weatherStr);
      }
    } else {
      this.statusBar.setText('');
    }

    // onload - This adds a simple command that can be triggered anywhere 
    this.addCommand({
      id: 'open-sample-modal-simple',
      name: 'Open sample modal (simple)',
      callback: () => {
        new SampleModal(this.app).open();
      }
    });

    // onload - Insert weather format one string 
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

    // onload - Replace template string 
    this.addCommand ({
      id: 'replace-template-string',
      name: 'Replace template string',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat1.length > 0) {
          if (view.data.contains("%weather1%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat1);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather1%/gm, (match) => weatherStr);
            editor.setValue(doc);
            //console.log('Doc: ',doc);
          }
        }
        if (this.settings.weatherFormat2.length > 0) {
          if (view.data.contains("%weather2%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat2);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather2%/gm, (match) => weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat3.length > 0) {
          if (view.data.contains("%weather3%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat3);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather3%/gm, (match) => weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat4.length > 0) {
          if (view.data.contains("%weather4%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
            let weatherStr = await wstr.getWeatherString();
            let doc = editor.getValue().replace(/%weather4%/gm, (match) => weatherStr);
            editor.setValue(doc);
          }
        }
      }
    });

    // onload - Insert weather format two string 
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

    // onload - Insert weather format three string 
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

    // onload - Insert weather format four string 
    this.addCommand ({
      id: 'insert-format-four',
      name: 'Insert weather format four',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat3.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.key, this.settings.units, this.settings.weatherFormat4);
          let weatherStr = await wstr.getWeatherString();
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 4 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - This adds a complex command that can check whether the current state of the app allows execution of the command 
    this.addCommand({
      id: 'open-sample-modal-complex',
      name: 'Open sample modal (complex)',
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
      }
    });

    // onload - This adds a settings tab so the user can configure various aspects of the plugin 
    this.addSettingTab(new OpenWeatherSettingsTab(this.app, this));

    // onload - If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin) 
    // Using this function will automatically remove the event listener when this plugin is disabled
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    //   console.log('click', evt);
    // });

    // onload - When registering intervals, this function will automatically clear the interval when the plugin is disabled 
    let updateFreq = this.settings.statusbarUpdateFreq;
    //console.log('Upd Freq:', updateFreq);
    this.registerInterval(window.setInterval(() => this.updateWeather(), Number(updateFreq) * 60 * 1000));

  }

  // updateWeather - Get weather information from OpenWeather API 
  async updateWeather() {
    if (this.settings.statusbarActive) {
      if (this.settings.key.length == 0 || this.settings.location.length == 0) {
        new Notice("OpenWeather plugin settings are undefined.")
        this.statusBar.setText('');
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
//  │                            ● Class SampleModal ●                             │
//  │                                                                              │
//  │                               • Sample Modal •                               │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
class SampleModal extends Modal {

  constructor(app: App) {
    super(app);
  }

  // • onOpen - Sample Modal Opened Event • 
  onOpen() {
    const {contentEl} = this;
    //contentEl.setText('Woah!');
    contentEl.createEl('h2', {text: "Select Weather Format String to Insert"});
    contentEl.createEl('hr');
    contentEl.createEl('h3', {text: "Weather format one"});
    contentEl.createEl("button", {text: "Insert"});
      
  }


  // • onClose - Sample Modal Closed Event • 
  onClose() {
    const {contentEl} = this;
    contentEl.empty();
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

    // OpenWeatherSettingsTab - H2 Header - Settings for calling OpenWeather API 
    containerEl.createEl('h2', {text: 'Settings for calling OpenWeather API'});

    new Setting(containerEl)
      .setName('Enter Location')
      .setDesc('Name of the city you want to retrieve weather for')
      .addText(text => text
        .setPlaceholder('Enter city Eg. edmonton')
        .setValue(this.plugin.settings.location)
        .onChange(async (value) => {
          //console.log('Location: ' + value);
          this.plugin.settings.location = value;
          await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName('OpenWeather API Key')
      .setDesc('A free OpenWeather API key is required for the plugin to work. Go to https://openweathermap.org to register and get a key')
      .addText(text => text
        .setPlaceholder('Enter OpenWeather API Key')
        .setValue(this.plugin.settings.key)
        .onChange(async (value) => {
          //console.log('OpenWeather API Key: ' + value);
          this.plugin.settings.key = value;
          await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Units of Measurement")
      .setDesc("Units of measurement. Standard, Metric and Imperial units are available")
      .addDropdown(dropDown => {
        dropDown.addOption('standard', 'Standard');
        dropDown.addOption('metric', 'Metric');
        dropDown.addOption('imperial', 'Imperial');
        dropDown.onChange(async (value) => {
          //console.log('Units of measurement: ' + value);
          this.plugin.settings.units = value;
          await this.plugin.saveSettings();
        })
      .setValue(this.plugin.settings.units)
      });

    // OpenWeatherSettingsTab - H2 Header - Weather Strings Formatting (Up to 4 Strings are Available) 
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


    // OpenWeatherSettingsTab - H2 Header - Show Weather in Statusbar Options 
    containerEl.createEl('h2', {text: 'Show Weather in Statusbar Options'});

    new Setting(containerEl)
    .setName('Show Weather in Statusbar')
    .setDesc('Enable weather display in statusbar')
    .addToggle(toggle => toggle
      .setValue(this.plugin.settings.statusbarActive)
      .onChange(async (value) => {
        this.plugin.settings.statusbarActive = value;
        await this.plugin.saveSettings();
        this.plugin.updateWeather();
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
        this.plugin.updateWeather();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Update Frequency")
      .setDesc("Update frequency for the weather information displayed on the statusbar")
      .addDropdown(dropDown => {
        dropDown.addOption('1', 'Every Minute');
        dropDown.addOption('5', 'Every 5 Minutes');
        dropDown.addOption('10', 'Every 10 Minutes');
        dropDown.addOption('15', 'Every 15 Minutes');
        dropDown.addOption('20', 'Every 20 Minutes');
        dropDown.addOption('30', 'Every 30 Minutes');
        dropDown.addOption('60', 'Every Hour');
        dropDown.onChange(async (value) => {
          //console.log('Statusbar Update Frequency: ' + value);
          this.plugin.settings.statusbarUpdateFreq = value;
          await this.plugin.saveSettings();
          this.plugin.updateWeather();
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
