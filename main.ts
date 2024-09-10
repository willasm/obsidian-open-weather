import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TextAreaComponent, TAbstractFile, TFolder, SuggestModal, Platform, FileSystemAdapter } from 'obsidian';
import getCurrentWeather from './getCurrentWeather';
import getForecastWeather from './getForecastWeather';
import * as fs from 'fs';
import * as path from 'path';
//const path = require('path');

let displayErrorMsg = true;

interface OpenWeatherSettings {
  location: string;
  latitude: string;
  longitude: string;
  key: string;
  units: string;
  language: string;
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
  latitude: '',
  longitude: '',
  key: '',
  units: 'metric',
  language: 'en',
  excludeFolder: '',
  weatherFormat1: '%desc% • Current Temp: %temp%°C • Feels Like: %feels%°C\n',
  weatherFormat2: '%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM% %ampm1%\nCurrent Temp: %temp%°C • Feels Like: %feels%°C\nWind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^\nSunrise: %sunrise% • Sunset: %sunset%\n',
  weatherFormat3: `%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%
&nbsp;Recorded Temp: %temp% • Felt like: %feels%
&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^
&nbsp;Sunrise: %sunrise% • Sunset: %sunset%`,
  weatherFormat4: `%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%
&nbsp;Current Temp: %temp% • Feels like: %feels%
&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^
&nbsp;Sunrise: %sunrise% • Sunset: %sunset%`,
//  weatherFormat3: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
//  weatherFormat4: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Current Temp: %temp% • Feels like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
  statusbarActive: true,
  weatherFormatSB: ' | %desc% | Current Temp: %temp%°C | Feels Like: %feels%°C | ',
  statusbarUpdateFreq: "15"
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                           ● Class FormatWeather ●                            │
//  │                                                                              │
//  │  • Get Current Weather From OpenWeather API and Return a Formatted String •  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
class FormatWeather {
  location: String;
  latitude: String;
  longitude: String;
  key: string
  units: string
  language: string
  format: string
  
  constructor(location: string, latitude: string, longitude: string, key: string, units: string, language: string, format: string) {
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.key = key;
    this.units = units;
    this.language = language;
    this.format = format;
  }
  
  // • getWeather - Get the weather data from the OpenWeather API • 
  async getWeather():Promise<any> {
    let weatherStr = await getCurrentWeather(this.key, this.latitude, this.longitude, this.language, this.units, this.format);
    let forecastWeatherStr = await getForecastWeather(this.key, this.latitude, this.longitude, this.language, this.units, weatherStr);
    return(forecastWeatherStr);
  }

  // • getWeatherString - Returns a formatted weather string • 
  async getWeatherString() {
    try {
      let weatherString = await this.getWeather();
      return weatherString;
    } catch (error) {
      console.log('Error',error);
      let weatherString = "Failed to fetch weather data";
      return weatherString;
    }
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
  plugin: any;

  // • onload - Configure resources needed by the plugin • 
  async onload() {

    // onload - Load settings 
    await this.loadSettings();
// weatherFormat3: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
// weatherFormat4: '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Current Temp: %temp% • Feels like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%',
    if (this.settings.weatherFormat3 == '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%') {
      this.settings.weatherFormat3 = `%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%  
&nbsp;Recorded Temp: %temp% • Felt like: %feels%  
&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^  
&nbsp;Sunrise: %sunrise% • Sunset: %sunset%`;
      await this.saveSettings();
    };
    if (this.settings.weatherFormat4 == '%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%') {
      this.settings.weatherFormat4 = `%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%  
&nbsp;Recorded Temp: %temp% • Felt like: %feels%  
&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^  
&nbsp;Sunrise: %sunrise% • Sunset: %sunset%`;
      await this.saveSettings();
    };
    let configDir = app.vault.configDir;
    let dataJsonPath = "";
    let dataJsonFilePath = "";
    let adapter = app.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
      dataJsonPath = path.join(adapter.getBasePath(),configDir,'plugins','open-weather');
      dataJsonFilePath = path.join(adapter.getBasePath(),configDir,'plugins','open-weather','data.json');
    };
    let dataJson = await JSON.parse(fs.readFileSync(dataJsonFilePath, 'utf-8'));
    console.log('>>>>>>> TESTING\n');
    //console.log('settings:\n', this.settings);
    if (dataJson.weatherString1) {
      fs.renameSync(dataJsonFilePath, path.join(dataJsonPath, 'data.json.bkp'));
      delete dataJson.weatherString1
      delete dataJson.weatherString2
      delete dataJson.weatherString3
      delete dataJson.weatherString4
      delete dataJson.weatherStringSB
      fs.writeFileSync(dataJsonFilePath, JSON.stringify(dataJson, null, 2));
      await this.loadSettings();
      await this.saveSettings();
      //console.log('dataJson:\n', dataJson);
    };
    //await this.onPick.bind(this, this.plugin, this.settings);
    //OpenWeather.prototype.onPick.bind(this.settings.location);
    //await this.onload.bind(this, this.plugin, this.settings);

    // onload - This creates an icon in the left ribbon 
    this.addRibbonIcon('thermometer-snowflake', 'OpenWeather', (evt: MouseEvent) => {
      // Called when the user clicks the icon.
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) {
        new Notice("Open a Markdown file first.");
        return;
      }
      new InsertWeatherPicker(this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat1, this.settings.weatherFormat2, this.settings.weatherFormat3, this.settings.weatherFormat4).open();
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
        let wstr = new FormatWeather(this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormatSB);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
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
            let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat1);
            let weatherStr = await wstr.getWeatherString();
            if (weatherStr.length == 0) {return};
            let doc = editor.getValue().replace(/%weather1%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat2.length > 0) {
          if (view.data.contains("%weather2%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat2);
            let weatherStr = await wstr.getWeatherString();
            if (weatherStr.length == 0) {return};
            let doc = editor.getValue().replace(/%weather2%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat3.length > 0) {
          if (view.data.contains("%weather3%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat3);
            let weatherStr = await wstr.getWeatherString();
            if (weatherStr.length == 0) {return};
            let doc = editor.getValue().replace(/%weather3%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
        if (this.settings.weatherFormat4.length > 0) {
          if (view.data.contains("%weather4%")) {
            let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat4);
            let weatherStr = await wstr.getWeatherString();
            if (weatherStr.length == 0) {return};
            let doc = editor.getValue().replace(/%weather4%/gmi, weatherStr);
            editor.setValue(doc);
          }
        }
      }
    });

    // onload - Insert weather string one 
    this.addCommand ({
      id: 'insert-string-one',
      name: 'Insert weather string one',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat1.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat1);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length == 0) {return};
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 1 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather string two 
    this.addCommand ({
      id: 'insert-string-two',
      name: 'Insert weather string two',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat2.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat2);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length == 0) {return};
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 2 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather string three 
    this.addCommand ({
      id: 'insert-string-three',
      name: 'Insert weather string three',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat3.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat3);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length == 0) {return};
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 3 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - Insert weather string four 
    this.addCommand ({
      id: 'insert-string-four',
      name: 'Insert weather string four',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        if (this.settings.weatherFormat4.length > 0) {
          let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat4);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length == 0) {return};
          editor.replaceSelection(`${weatherStr}`);
        } else {
          new Notice('Weather string 4 is undefined! Please add a definition for it in the OpenWeather plugin settings.', 5000);
        }
      }
    });

    // onload - This adds a settings tab so the user can configure various aspects of the plugin 
    this.addSettingTab(new OpenWeatherSettingsTab(this.app, this, this.settings));

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
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat1);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_2').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_2')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat2);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_3').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_3')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat3);
        let weatherStr = await wstr.getWeatherString();
        divEl.innerHTML = weatherStr;
      }
      if(document.getElementsByClassName('weather_current_4').length === 1) {
        const divEl = document.getElementsByClassName('weather_current_4')[0];
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat4);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        divEl.innerHTML = weatherStr;
      }
    }
      
  // • replaceTemplateStrings - Replace any template strings in current file • 
  async replaceTemplateStrings() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    const file = app.workspace.getActiveFile();
    if (view.file.parent.path.includes(this.settings.excludeFolder)) return;    // Ignore this folder and any subfolders for Template String Replacement
    let editor = view.getViewData();
    if (editor == null) return;
    if (this.settings.weatherFormat1.length > 0) {
      if (editor.contains("%weather1%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat1);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        editor = editor.replace(/%weather1%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat2.length > 0) {
      if (editor.contains("%weather2%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat2);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        editor = editor.replace(/%weather2%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat3.length > 0) {
      if (editor.contains("%weather3%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat3);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
        editor = editor.replace(/%weather3%/gmi, weatherStr);
        file?.vault.modify(file, editor);
      }
    }
    if (this.settings.weatherFormat4.length > 0) {
      if (editor.contains("%weather4%")) {
        let wstr = new FormatWeather (this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormat4);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
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
        let wstr = new FormatWeather(this.settings.location, this.settings.latitude, this.settings.longitude, this.settings.key, this.settings.units, this.settings.language, this.settings.weatherFormatSB);
        let weatherStr = await wstr.getWeatherString();
        if (weatherStr.length == 0) {return};
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

  // • onPick - Callback for pick city suggester • 
  async onPick(picked: any, settings:any) {
//    this.settings = settings;
//    console.log('Finally got here!!!!!!', this.settings.location);

    let name = picked.name;
    let lat = picked.lat;
    let lon = picked.lon;
    // this.settings.location = name;
    // this.settings.latitude = lat;
    // this.settings.longitude = lon;
    
    // Input event for update to input boxes location, lattitude and longitude
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      composed: true,
      inputType: 'insertText',
      data: 'your_data'
    });
  
    // Update location, latitude and longitude with the data from selected city
    // HACK: Have not been able to get `this` to work from this method so forced to
    // update them directly. Need to find a way to fix this - .bind() did not work for me?
    let inputEls = document.getElementsByTagName("input");
    for (let idx = 0; idx < inputEls.length; idx++) {
      if (inputEls[idx].placeholder == "Enter city Eg. Chicago or South Bend,WA,US") {
        inputEls[idx].value = name;
        inputEls[idx].dispatchEvent(inputEvent);
      };
      if (inputEls[idx].placeholder == "53.5501") {
        inputEls[idx].value = lat;
        inputEls[idx].dispatchEvent(inputEvent);
      };
      if (inputEls[idx].placeholder == "-113.4687") {
        inputEls[idx].value = lon;
        inputEls[idx].dispatchEvent(inputEvent);
      };
    };
    //await this.plugin.saveSettings();
    //await this.plugin.updateWeather();
    //OpenWeather.prototype.saveSettings();
    //OpenWeather.prototype.updateWeather();
    //this.saveSettings();
    //this.saveSettings();
    //this.updateWeather();
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
  latitude: string;
  longitude: string;
  key: string;
  units: string;
  language: string;
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

  constructor(location: string, latitude: string, longitude: string, key: string, units: string, language: string, weatherFormat1: string, weatherFormat2: string, weatherFormat3: string, weatherFormat4: string) {
    super(app);
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.key = key;
    this.units = units;
    this.language = language;
    this.weatherFormat1 = weatherFormat1;
    this.weatherFormat2 = weatherFormat2;
    this.weatherFormat3 = weatherFormat3;
    this.weatherFormat4 = weatherFormat4;
  }

  async getSuggestions(query: string): Promise<Commands[]> {
    ALL_COMMANDS = [];
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view?.getViewType() === 'markdown') {
      const md = view as MarkdownView;
      if (md.getMode() === 'source') {
        if (this.weatherFormat1.length > 0) {
          let wstr = new FormatWeather (this.location, this.latitude, this.longitude, this.key, this.units, this.language, this.weatherFormat1);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length > 0) {
            this.weatherFormat1 = weatherStr;
            ALL_COMMANDS.push({command: "Insert Weather String - 1", format: this.weatherFormat1})
          } else {
            this.weatherFormat1 = "";
            return ALL_COMMANDS.filter((command) =>
            command.command.toLowerCase().includes(query.toLowerCase())
            );
          }
        }
        if (this.weatherFormat2.length > 0) {
          let wstr = new FormatWeather (this.location, this.latitude, this.longitude, this.key, this.units, this.language, this.weatherFormat2);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length > 0) {
            this.weatherFormat2 = weatherStr;
            ALL_COMMANDS.push({command: "Insert Weather String - 2", format: this.weatherFormat2})
          } else {
            this.weatherFormat2 = "";
            return ALL_COMMANDS.filter((command) =>
            command.command.toLowerCase().includes(query.toLowerCase())
            );
          }
        }
        if (this.weatherFormat3.length > 0) {
          let wstr = new FormatWeather (this.location, this.latitude, this.longitude, this.key, this.units, this.language, this.weatherFormat3);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length > 0) {
            this.weatherFormat3 = weatherStr;
            ALL_COMMANDS.push({command: "Insert Weather String - 3", format: this.weatherFormat3})
          } else {
            this.weatherFormat3 = "";
            return ALL_COMMANDS.filter((command) =>
            command.command.toLowerCase().includes(query.toLowerCase())
            );
          }
        }
        if (this.weatherFormat4.length > 0) {
          let wstr = new FormatWeather (this.location, this.latitude, this.longitude, this.key, this.units, this.language, this.weatherFormat4);
          let weatherStr = await wstr.getWeatherString();
          if (weatherStr.length > 0) {
            this.weatherFormat4 = weatherStr;
            ALL_COMMANDS.push({command: "Insert Weather String - 4", format: this.weatherFormat4})
          } else {
            this.weatherFormat4 = "";
            return ALL_COMMANDS.filter((command) =>
            command.command.toLowerCase().includes(query.toLowerCase())
            );
          }
        }
        ALL_COMMANDS.push({command: "Replace Template Strings", format: "Replace all occurences of %weather1%, %weather2%, %weather3% and %weather4%\nin the current document."})
      } else {
        new Notice("Please enter edit mode to insert weather strings.");
      }
    }
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
    this.command = command.command
    this.format = command.format
    this.close();
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    const file = app.workspace.getActiveFile();
    let editor = view.getViewData();
    if (editor == null) return;
    if (command.command == 'Replace Template Strings') {
      if (this.weatherFormat1.length > 0) {
        editor = editor.replace(/%weather1%/gmi, this.weatherFormat1);
        view.setViewData(editor,false);
        file?.vault.modify(file, editor);
      } else {
        return;
      }
      if (this.weatherFormat2.length > 0) {
        editor = editor.replace(/%weather2%/gmi, this.weatherFormat2);
        file?.vault.modify(file, editor);
      } else {
        return;
      }
      if (this.weatherFormat3.length > 0) {
        editor = editor.replace(/%weather3%/gmi, this.weatherFormat3);
        file?.vault.modify(file, editor);
      } else {
        return;
      }
      if (this.weatherFormat4.length > 0) {
        editor = editor.replace(/%weather4%/gmi, this.weatherFormat4);
        file?.vault.modify(file, editor);
      } else {
        return;
      }
    } else {
      view.editor.replaceSelection(this.format);
    }
  }
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Class CitySearchResultPicker ●                       │
//  │                                                                              │
//  │             • Displays City Search Results in a Suggest Modal •              │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
interface CommandsCity {
  city: string;
  coords: string;
  index: number;
  selection: object;
}

let ALL_CITY_COMMANDS: { city: string; coords: string; index: number; selection: object }[] = [];

class CitySearchResultPicker extends SuggestModal<CommandsCity> implements CitySearchResultPicker {
  private json: object;
  private settings: any;

  constructor(json: object, settings:any) {
    super(app);
    this.json = json;
    this.settings = settings;
  }

  async getSuggestions(query: string): Promise<CommandsCity[]> {
    ALL_CITY_COMMANDS = [];
    // {
    //   "name": "Hell",
    //   "lat": 42.4347571,
    //   "lon": -83.9849477,
    //   "country": "US",
    //   "state": "Michigan"
    // },

    // Setup choices based on the list of cities returned from the Geocoding API
    let cityObjCount = Object.keys(this.json).length;
    let values = Object.values(this.json);
    for (let i = 0; i < cityObjCount; i++) {
      let city = values[i].name;
      let state = values[i].state;
      if (state == undefined) {state = ""};
      let country = values[i].country;
      if (country == undefined) {country = ""};
      let locationStr = city+" "+state+" "+country;
      let coords = "Latitude: "+values[i].lat+" "+"Longitude: "+values[i].lon;
      ALL_CITY_COMMANDS.push({city: locationStr, coords: coords, index: i, selection: values[i]});
    }
    let retry = "None of these match? Try again...";
    let redo = "Select to perform another search";
    ALL_CITY_COMMANDS.push({city: retry, coords: redo, index: 9999, selection: {}});
    return ALL_CITY_COMMANDS.filter((command) =>
      command.city.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Renders each suggestion item.
  renderSuggestion(command: CommandsCity, el: HTMLElement) {
    el.createEl("div", { text: command.city });
    el.createEl("small", { text: command.coords });
  }

  // Perform action on the selected suggestion.
  onChooseSuggestion(command: CommandsCity, evt: MouseEvent | KeyboardEvent) {
    if (command.index == 9999) {return};    // User selected retry
    OpenWeather.prototype.onPick(command.selection,this.settings);
  }
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Class OpenWeatherSettingsTab ●                       │
//  │                                                                              │
//  │                        • Open Weather Settings Tab •                         │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
class OpenWeatherSettingsTab extends PluginSettingTab {
  plugin: OpenWeather;
  citySearch: string;
  cityObj: object;
  jsonCities: object;
  settings:any

  constructor(app: App, plugin: OpenWeather, settings:any) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = settings;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();
    let citySearch: string = this.plugin.settings.location;

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

		new Setting(containerEl)
			.setName('View on Github')
			.addButton(cb => {
				cb.setButtonText('GitHub Readme.md');
        cb.setTooltip('Visit OpenWeather Readme.md for detailed plugin information');
				cb.onClick(() => {
          window.open(`https://github.com/willasm/obsidian-open-weather/#openweather-plugin-for-obsidian`, '_blank');
				});
			})
			.addButton(cb => {
				cb.setButtonText('Example.md');
        cb.setTooltip('A detailed explanation of how I use the plugin in my daily note');
				cb.onClick(() => {
          window.open(`https://github.com/willasm/obsidian-open-weather/blob/master/EXAMPLE.md`, '_blank');
				});
			})
			.addButton(cb => {
				cb.setButtonText('Report Issue');
        cb.setTooltip('Have any questions or comments? Feel free to post them here');
				cb.onClick(() => {
          window.open(`https://github.com/willasm/obsidian-open-weather/issues`, '_blank');
				});
			})

    // OpenWeatherSettingsTab - H2 Header - OpenWeather API Authentication key (required)
    containerEl.createEl('h2', {text: 'OpenWeather API Authentication key (required)'});

    new Setting(containerEl)
      .setName('OpenWeather API key')
      .setDesc('A free OpenWeather API key is required for the plugin to work. Go to https://openweathermap.org to register and get a key')
      .addText(text => text
        .setPlaceholder('Enter OpenWeather API key')
        .setValue(this.plugin.settings.key)
        .onChange(async (value) => {
          this.plugin.settings.key = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    // OpenWeatherSettingsTab - H2 Header - Location
    containerEl.createEl('h2', {text: 'Location (required)'});

    new Setting(containerEl)
      .setName('Use Geocoding API to get location (recommended)')
      .setDesc('The Geocoding API returns the requested locations name, state, country, latitude and longitude')
      .addText(text => text
        .setPlaceholder('City name to search for')
        //.setValue(this.plugin.settings.location)
        .onChange(async (value) => {
          citySearch = value;
      }))
			.addButton(cb => {
				cb.setButtonText('Get location');
        //cb.setCta();
				cb.onClick(async () => {
          let key = this.plugin.settings.key;
           //let city = citySearch;
          if (key.length == 0) {
            new Notice("OpenWeather API key is required");
          } else {
            let url;
            url = `https://api.openweathermap.org/geo/1.0/direct?q=${citySearch}&limit=5&appid=${key}`;
            let req = await fetch(url);
            let jsonCitiesObj = await req.json();
            new CitySearchResultPicker(jsonCitiesObj,this.settings).open();
          }
        })
      });

    new Setting(containerEl)
      .setName('Enter location')
      .setDesc('Name of the city you want to retrieve weather for. Also supports {city name},{country code} or {city name},{state code},{country code} Eg. South Bend,WA,US Please note that searching by states available only for the USA locations')
      .addText(text => text
        .setPlaceholder('Enter city Eg. Chicago or South Bend,WA,US')
        .setValue(this.plugin.settings.location)
        .onChange(async (value) => {
          this.plugin.settings.location = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    new Setting(containerEl)
      .setName('Enter latitude')
      .setDesc('Please note that API requests by city name have been deprecated although they are still available for use. The preferred method is to use latitude and longitude.')
      .addText(text => text
        .setPlaceholder('53.5501')
        .setValue(this.plugin.settings.latitude)
        .onChange(async (value) => {
          this.plugin.settings.latitude = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    new Setting(containerEl)
      .setName('Enter longitude')
      .setDesc('Please note that API requests by city name have been deprecated although they are still available for use. The preferred method is to use latitude and longitude.')
      .addText(text => text
        .setPlaceholder('-113.4687')
        .setValue(this.plugin.settings.longitude)
        .onChange(async (value) => {
          this.plugin.settings.longitude = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        }));

    // OpenWeatherSettingsTab - H2 Header - General preferences
    containerEl.createEl('h2', {text: 'General preferences'});

    new Setting(containerEl)
      .setName("Units of measurement")
      .setDesc("Units of measurement. Metric, Imperial and Standard units are available")
      .addDropdown(dropDown => {
        dropDown.addOption('metric', 'Metric');
        dropDown.addOption('imperial', 'Imperial');
        dropDown.addOption('standard', 'Standard');
        dropDown.onChange(async (value) => {
          this.plugin.settings.units = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
        })
      .setValue(this.plugin.settings.units);
      });

    new Setting(containerEl)
      .setName("Language")
      .setDesc("Supported languages available Note: This only affects text returned from the OpenWeather API")
      .addDropdown(dropDown => {
        dropDown.addOption('af', 'Afrikaans');
        dropDown.addOption('al', 'Albanian');
        dropDown.addOption('ar', 'Arabic');
        dropDown.addOption('az', 'Azerbaijani');
        dropDown.addOption('bg', 'Bulgarian');
        dropDown.addOption('ca', 'Catalan');
        dropDown.addOption('cz', 'Czech');
        dropDown.addOption('da', 'Danish');
        dropDown.addOption('de', 'German');
        dropDown.addOption('el', 'Greek');
        dropDown.addOption('en', 'English');
        dropDown.addOption('eu', 'Basque');
        dropDown.addOption('fa', 'Persian (Farsi)');
        dropDown.addOption('fi', 'Finnish');
        dropDown.addOption('fr', 'French');
        dropDown.addOption('gl', 'Galician');
        dropDown.addOption('he', 'Hebrew');
        dropDown.addOption('hi', 'Hindi');
        dropDown.addOption('hr', 'Croatian');
        dropDown.addOption('hu', 'Hungarian');
        dropDown.addOption('id', 'Indonesian');
        dropDown.addOption('it', 'Italian');
        dropDown.addOption('ja', 'Japanese');
        dropDown.addOption('kr', 'Korean');
        dropDown.addOption('la', 'Latvian');
        dropDown.addOption('lt', 'Lithuanian');
        dropDown.addOption('mk', 'Macedonian');
        dropDown.addOption('no', 'Norwegian');
        dropDown.addOption('nl', 'Dutch');
        dropDown.addOption('pl', 'Polish');
        dropDown.addOption('pt', 'Portuguese');
        dropDown.addOption('pt_br', 'Português Brasil');
        dropDown.addOption('ro', 'Romanian');
        dropDown.addOption('ru', 'Russian');
        dropDown.addOption('sv', 'Swedish');
        dropDown.addOption('sk', 'Slovak');
        dropDown.addOption('sl', 'Slovenian');
        dropDown.addOption('sp', 'Spanish');
        dropDown.addOption('sr', 'Serbian');
        dropDown.addOption('th', 'Thai');
        dropDown.addOption('tr', 'Turkish');
        dropDown.addOption('ua', 'Ukrainian');
        dropDown.addOption('vi', 'Vietnamese');
        dropDown.addOption('zh_cn', 'Chinese Simplified');
        dropDown.addOption('zh_tw', 'Chinese Traditional');
        dropDown.addOption('zu', 'Zulu');
        dropDown.onChange(async (value) => {
        this.plugin.settings.language = value;
        await this.plugin.saveSettings();
        await this.plugin.updateWeather();
        })
      .setValue(this.plugin.settings.language);
      });

    // OpenWeatherSettingsTab - H2 Header - Exclude Folder (Exclude Folder for Template String Replacement) 
    containerEl.createEl('h2', {text: 'Folder to exclude from automatic template strings replacement'});

    new Setting(containerEl)
      .setName("Exclude folder")
      .setDesc("Folder to exclude from automatic template string replacement")
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

    // OpenWeatherSettingsTab - H2 Header - Weather Strings Formatting (4 Strings are Available) 
    containerEl.createEl('h2', {text: 'Weather strings formatting (4 strings are available)'});

    new Setting(containerEl)
      .setName("Weather string 1")
      .setDesc("Feel free to change this to whatever you like. See the README.md on Github for all available macros.")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather string 1')
        .setValue(this.plugin.settings.weatherFormat1)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat1 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather string 2")
      .setDesc("Feel free to change this to whatever you like. See the README.md on Github for all available macros.")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather string 2')
        .setValue(this.plugin.settings.weatherFormat2)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat2 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather string 3")
      .setDesc("Feel free to change this to whatever you like. See the README.md on Github for all available macros.")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather string 3')
        .setValue(this.plugin.settings.weatherFormat3)
        .onChange(async (value) => {
          this.plugin.settings.weatherFormat3 = value;
          await this.plugin.saveSettings();
      })
      textArea.inputEl.setAttr("rows", 10);
      textArea.inputEl.setAttr("cols", 60);
    });

    new Setting(containerEl)
      .setName("Weather string 4")
      .setDesc("Feel free to change this to whatever you like. See the README.md on Github for all available macros.")
      .addTextArea((textArea: TextAreaComponent) => {
        textArea
        .setPlaceholder('Weather string 4')
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
      containerEl.createEl('h2', {text: 'Show weather in statusbar options'});

      new Setting(containerEl)
      .setName('Show weather in statusbar')
      .setDesc('Enable weather display in statusbar')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.statusbarActive)
        .onChange(async (value) => {
          this.plugin.settings.statusbarActive = value;
          await this.plugin.saveSettings();
          await this.plugin.updateWeather();
      }));

      new Setting(containerEl)
      .setName("Weather string format statusbar")
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

    // OpenWeatherSettingsTab - H2 Header - Show Weather in Statusbar and Dynamic DIV's update frequency
    containerEl.createEl('h2', {text: `Weather update frequency`});

    new Setting(containerEl)
      .setName("Update frequency")
      .setDesc("Update frequency for weather information displayed on the statusbar and in dynamic DIV's")
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
};

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
// wind.speedms %wind-speed-ms%
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
