# OpenWeather Plugin fo Obsidian

## Features
- Display current weather in the statusbar
- Insert current weather into your documents
- Four customizable weather strings available
- Customizable statusbar weather string
- [Template support](#template-support) for automatic weather insertion into your new documents
- [DIV support](#div-support) for dynamic weather

## Settings

#### **Enter Location**
Enter your city's name (Required)

#### **OpenWeather API Key**
Enter your OpenWeather API Key here (Required)

_A free OpenWeather API key is required for the plugin to work.
Go to https://openweathermap.org to register and get a key._

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

  - `%wind-gust%` This data is only returned by the API if the condition exists. To make this data optional within your string you can surround it with underscores.

  - For example: `Winds %wind-speed% Km/h_ with gusts up to %wind-gust% Km/h_`
  - With wind gust data this will convert to: `Winds 10 Km/h with gusts up to 20 Km/h`
  - Without wind gust data this will convert to: `Winds 10 Km/h` (The gusts text surrounded by underscores will be removed)

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
You can insert the following DIV inside your documents to provide dynamic weather which is updated at the frequency set in the [settings _Update Frequency_](#update-frequency) setting

```html
<div class="weather_current_1"></div>
```

You can use the following class's to insert the corresponding weather string formats

- "weather_current_1" Inserts weather string format One
- "weather_current_2" Inserts weather string format Two
- "weather_current_3" Inserts weather string format Three
- "weather_current_4" Inserts weather string format Four