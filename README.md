# OpenWeather Plugin for Obsidian

## Features
- Display current weather in the statusbar
- Insert current weather into your documents
- Four customizable weather strings available
- Customizable statusbar weather string
- [Template support](#template-support) for automatic weather insertion into your new documents
- [DIV support](#div-support) for dynamic weather

## Default Weather Strings with Example Screenshots

#### **Statusbar String**
`' | %desc% | Current Temp: %temp%°C | Feels Like: %feels%°C | '`

![Statusbar](/images/Statusbar-1.png)

#### **Weather Format String One**
`'%desc% • Current Temp: %temp%°C • Feels Like: %feels%°C\n'`

![Format One](/images/Format1-1.png)

#### **Weather Format String Two**
`'%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM% %ampm1%\nCurrent Temp: %temp%°C • Feels Like: %feels%°C\nWind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^\nSunrise: %sunrise% • Sunset: %sunset%\n'`

![Format Two](/images/Format2-1.png)

#### **Weather Format String Three**
`'%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%'`

![Format Three](/images/Format3-1.png)

#### **Weather Format String Four**
`'%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Current Temp: %temp% • Feels like: %feels%<br>&nbsp;Wind: %wind-speed% Km/h from the %wind-dir%^ with gusts up to %wind-gust% Km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%'`

![Format Four](/images/Format4-1.png)

#### **Format Strings Three & Four within DIV's and styled wih CSS**

Format String Three...

![Format Three](/images/Format3-2.png)

Format String Four...

![Format Four](/images/Format4-2.png)

Note: The `\n`'s are not required when editing these in the settings. Simply enter a `return` to add a new line and the `\n` will be added to the saved settings file. The `<br>`'s in string formats 3 & 4 are required for use in HTML.

See [EXAMPLE.md](EXAMPLE.md) for a demonstration of how I use this in my Daily Template.

## Settings

#### **Enter Location**
Enter your city's name (Required)

#### **OpenWeather API Key**
Enter your OpenWeather API Key here (Required)

_A free OpenWeather API key is required for the plugin to work.
Go to https://openweathermap.org to register and get a key._

_Direct link to signup page https://home.openweathermap.org/users/sign_up_.

#### **Units of Measurement**
Standard, Metric and Imperial units can be selected here. (Note: Standard is in Kelvin, not really useful in most cases)

#### **Weather Strings Formatting**
Define your weather strings here (Up to 4 strings are available)

_Tip: These strings can contain anything you want, not just weather information._

#### **Show Weather in Statusbar**
Toggle display of the current weather in the statusbar on or off

#### **Weather String Format Statusbar**
Define your statusbar weather string here

#### **Update Frequency**
Time interval to update the weather displayed in the statusbar and [DIV's](#div-support) (1, 5, 10, 15, 20, 30 or 60 minutes)

## Weather String Placeholders
These macros contained within the weather string will be replaced with the appropiate data.

- Weather Description `%desc%`
- Weather Icon `%icon%` - See note below
- Current Temperature `%temp%`
- Feels Like `%feels%`
- Temperature Min `%tempmin%`
- Temperature Max `%tempmax%`
- Air Pressure `%pressure%`
- Humidity `%humidity%`
- Pressure at Sea Level `%pressure-sl%`
- Pressure at Ground Level `%pressure-gl%`
- Visibility `%visibility%`
- Wind Speed `%wind-speed%` - Km/h for Metric, Mp/h for Imperial
- Wind Direction `%wind-dir%` - Eg. Northwest
- Wind Gust `%wind-gust%` - See note below
- Sunrise `%sunrise%` - 08:30:30 (24 hour format)
- Sunset `%sunset%` - 19:30:30 (24 hour format)
- City Name `%name%` - Eg. Edmonton
- (Date & Time) - The date & time of the most recent data information that OpenWeather API has available
  - year1 `%dateYear1%` - 2022
  - year2 `%dateYear2%` - 22
  - month1 `%dateMonth1%` - 1
  - month2 `%dateMonth2%` - 01
  - month3 `%dateMonth3%` - Jan
  - month4 `%dateMonth4%` - January
  - date1 `%dateDay1%` - 02
  - date2 `%dateDay2%` - 2
  - ampm1 `%ampm1%` = "AM"
  - ampm2 `%ampm2%` = "am"
  - hour1 `%timeH1%` - 23 (24 hour)
  - hour2 `%timeH2%` - 1 (12 hour)
  - min `%timeM%` - 05
  - sec `%timeS%` - 05

- ### Weather Placeholder notes
  - `%Icon%` - This is replaced with the image tag `<img src={Icon Url} />` This is more useful if it is embedded inside a [div](#div-support) code block.

  - `%wind-gust%` This data is only returned by the API if the condition exists. To make this data optional within your string you can surround it with the caret symbols.

  - For example: `Winds %wind-speed% Km/h^ with gusts up to %wind-gust% Km/h^`
  - With wind gust data this will convert to: `Winds 10 Km/h with gusts up to 20 Km/h`
  - Without wind gust data this will convert to: `Winds 10 Km/h` (The gusts text surrounded by carets will be removed)

## OpenWeather Plugin Commands

#### All these commands are available from the command palette and the ribbon icon

- `Insert weather format one` - Inserts Weather Format String One into the current document.
- `Insert weather format two` - Inserts Weather Format String Two into the current document.
- `Insert weather format three` - Inserts Weather Format String Three into the current document.
- `Insert weather format four` - Inserts Weather Format String Four into the current document.
  - Note: If text is selected in the current document when these commands are run, it will be replaced by the inserted weather string.
- `Replace template string` - This will replace all occurences of the strings, `%weather1%`, `%weather2%`, `%weather3%` and `%weather4%` with the corresponding defined weather strings. See also [Template support](#template-support)

## Template support
You can place the following strings in your templates and when creating a new document using the template, they will automatically be replaced with the corresponding weather strings.

- `%weather1%` - Inserts weather string format One
- `%weather2%` - Inserts weather string format Two
- `%weather3%` - Inserts weather string format Three
- `%weather4%` - Inserts weather string format Four

## DIV support
You can insert the following DIV inside your documents to provide dynamic weather which is updated at the frequency set in the [settings _Update Frequency_](#update-frequency) setting. See [EXAMPLE.md](EXAMPLE.md) for a demonstration of how I use these in my Daily Template.


```html
<div class="weather_current_1"></div>
```

You can use the following class's to insert the corresponding weather string formats

- "weather_current_1" Inserts weather string format One
- "weather_current_2" Inserts weather string format Two
- "weather_current_3" Inserts weather string format Three
- "weather_current_4" Inserts weather string format Four

Note: This also allows you to style the output using CSS, see [EXAMPLE.md](EXAMPLE.md) for details.
