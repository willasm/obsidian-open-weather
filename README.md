# OpenWeather Plugin for Obsidian

## Features
- Display current weather in the statusbar
- Insert current weather into your documents
- Four customizable weather strings available
- Customizable statusbar weather string
- [Template support](#template-support) for automatic weather insertion into your new documents
- [DIV support](#div-support) for dynamic weather
- 5 Day forecast available

## Default Weather Strings with Example Screenshots

#### **Statusbar String**
`' | %desc% | Current Temp: %temp%°C | Feels Like: %feels%°C | '`

![Statusbar](/images/Statusbar-1.png)

#### **Weather String One**
`'%desc% • Current Temp: %temp%°C • Feels Like: %feels%°C\n'`

![Format One](/images/Format1-1.png)

#### **Weather String Two**
`'%name%: %dateMonth4% %dateDay2% - %timeH2%:%timeM% %ampm1%\nCurrent Temp: %temp%°C • Feels Like: %feels%°C\nWind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^\nSunrise: %sunrise% • Sunset: %sunset%\n'`

![Format Two](/images/Format2-1.png)

#### **Weather String Three**
`'%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Recorded Temp: %temp% • Felt like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%'`

![Format Three](/images/Format3-1.png)

#### **Weather String Four**
`'%icon%&nbsp;%dateMonth4% %dateDay2% %dateYear1% • %timeH2%:%timeM% %ampm1% • %desc%<br>&nbsp;Current Temp: %temp% • Feels like: %feels%<br>&nbsp;Wind: %wind-speed% km/h from the %wind-dir%^ with gusts up to %wind-gust% km/h^<br>&nbsp;Sunrise: %sunrise% • Sunset: %sunset%'`

![Format Four](/images/Format4-1.png)

#### **Format Strings Three & Four within DIV's and styled wih CSS**

Format String Three...

![Format Three](/images/Format3-2.png)

Format String Four...

![Format Four](/images/Format4-2.png)

Note: The `\n`'s are not required when editing these in the settings. Simply enter a `return` to add a new line and the `\n` will be added to the saved settings file. The `<br>`'s in string formats 3 & 4 are required for use in HTML.

See [EXAMPLE.md](EXAMPLE.md) for a demonstration of how I use this in my Daily Template.

## Settings

#### **OpenWeather API Key**
Enter your OpenWeather API Key here (Required)

A free OpenWeather API key is required for the plugin to work.
Go to https://openweathermap.org to register and get a key.
Direct link to signup page https://home.openweathermap.org/users/sign_up.

Note: You will need to verify your email address, then your API key will be emailed to you. The key itself may take a couple of hours before it is activated. All this information will be included in the email they send to you.

#### **Use Geocoding API to get location (recommended)**
This Geocoding API returns the requested locations name, state, country, latitude and longitude allowing you to choose the correct location. This is beneficial in cases where your city has a common name shared by other cities. To use this, enter your cities name in the text field and press the `Get location` button. You will be prompted with a list of up to 5 locations to choose from.

#### **Enter Location**
Note: It is recommended to use the new `Use Geocoding API to get location (recommended)` command to fill this in for you.

Enter your city's name (This setting is required unless latitude and longitude are defined)
Note: If you are getting the wrong data try including your state and country codes. They can be entered as {city name},{state code},{country code}. Eg. South Bend, WA, US (The commas are required). If you are still having issues getting the correct data, then use the Latitude and Longitude settings instead.

#### **Enter Latitude**
Note: It is recommended to use the new `Use Geocoding API to get location (recommended)` command to fill this in for you.

Enter your city's latitude (Setting Latitude and Longitude will override the Location setting)

Please note that API requests by city name have been deprecated although they are still available for use. The preferred method is to use latitude and longitude.

#### **Enter Longitude**
Note: It is recommended to use the new `Use Geocoding API to get location (recommended)` command to fill this in for you.

Enter your city's longitude (Setting Latitude and Longitude will override the Location setting)

Please note that API requests by city name have been deprecated although they are still available for use. The preferred method is to use latitude and longitude.

#### **Units of Measurement**
Metric, Imperial and Standard units can be selected here. (Note: Standard is in Kelvin, not really useful in most cases)

#### **Language**
Supported languages available (46 languages total)
Note: This only applies to text that is returned by the Open Weather API. This does not change the text in the defined weather strings. If you want the text in the default weather strings in another language you will need to edit them directly in the settings.

#### **Exclude Folder**
Folder to exclude from automatic [Template](#template-support) strings replacement. This should be set to your vaults template folder. The exclusion includes any subfolders within the selected folder.

#### **Weather Strings **
Define your weather strings here (4 strings are available + 1 for the statusbar)

_Tip: These strings can contain anything you want, not just weather information._

#### **Show Weather in Statusbar** Note: This will not be displayed on mobile app
Toggle display of the current weather in the statusbar on or off

#### **Weather String Format Statusbar** Note: This will not be displayed on mobile app
Define your statusbar weather string here

#### **Update Frequency**
Time interval to update the weather displayed in the statusbar and [DIV's](#div-support) (1, 5, 10, 15, 20, 30 or 60 minutes)

## Weather String Placeholders
These macros contained within the weather string will be replaced with the appropiate data.

### Current Weather Placeholders
- Weather Description Text `%desc%`
- Weather Description Emoji `%desc-em%`
- Weather Icon `%icon%` - See note below
- Weather Icon Double sized `%icon2x%` - See note below
- Current Temperature `%temp%`
- Feels Like `%feels%`
- Temperature Min `%tempmin%`
- Temperature Max `%tempmax%`
- Air Pressure `%pressure%`
- Humidity `%humidity%`
- Pressure at Sea Level `%pressure-sl%`
- Pressure at Ground Level `%pressure-gl%`
- Visibility `%visibility%`
- Wind Speed `%wind-speed%` - km/h for Metric, mph for Imperial
- Wind Speed `%wind-speed-ms%` - m/s (Meters per second)
- Wind Direction `%wind-dir%` - Eg. Northwest
- Wind Gust `%wind-gust%` - See note below
- Cloud coverage `%clouds%` (Percentage)
- Rain past 1 hour `%rain1h%` (in millimeters)
- Rain past 3 hours `%rain3h%` (in millimeters)
- Snow past 1 hour `%snow1h%` (in millimeters)
- Snow past 3 hours `%snow3h%` (in millimeters)
- Precipitation past 1 hour `%precipitation1h%` (in millimeters - Rain or Snow)
- Precipitation past 3 hours `%precipitation3h%` (in millimeters - Rain or Snow)
- Sunrise `%sunrise%` - 08:30:30 (24 hour format)
- Sunset `%sunset%` - 19:30:30 (24 hour format)
- City Name `%name%` - Eg. Edmonton
- Latitude `%latitude%` - Eg. 46.66
- Longitude `%longitude%` - Eg. -123.80
- Air Quality Index as number `%aqinumber%` - 1 to 5 (Order matches the strings list)
- Air Quality Index as string `%aqistring%` - 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor' (Order matches the numbers list)
- (Date & Time) - The date & time of the most recent data information that OpenWeather API has available
  - year1 `%dateYear1%` - 2022
  - year2 `%dateYear2%` - 22
  - month1 `%dateMonth1%` - 1
  - month2 `%dateMonth2%` - 01
  - month3 `%dateMonth3%` - Jan
  - month4 `%dateMonth4%` - January
  - date1 `%dateDay1%` - 02
  - date2 `%dateDay2%` - 2
  - ampm1 `%ampm1%` - "AM"
  - ampm2 `%ampm2%` - "am"
  - hour1 `%timeH1%` - 23 (24 hour)
  - hour2 `%timeH2%` - 1 (12 hour)
  - min `%timeM%` - 05
  - sec `%timeS%` - 05

### Forecast Weather Placeholders
Note: The 5 day forecast is returned in 3 hour increments (total of 40 data objects). This means that the data returned by the API does not start at 12:00 am tommorow, but for the next 3 hour slice of available data. This means that only once a day can you get the full forecast for 5 days (just before midnight). At all other times you will recieve partial data for today and partial data for the last day. You will need to account for this when defining your weather strings. To make it easier for you I have included the placeholders `%next12%`, `%next24%`, and `%next48%` (see placeholder example) and will add more in the future.

Note: The placeholders represent the 3 hour forecast objects and are numbered 00, 01, 02, ... 39 in the placeholders.

- `%fyear_00%` to `%fyear_39%` - Forecast Year Eg. 2024
- `%fmonth_00%` to `%fmonth_39%` - Forecast Month Eg. 05
- `%fdate_00%` to `%fdate_39%` - Forecast Date Eg. 26
- `%fhours_00%` to `%fhours_39%` - Forecast Hours Eg. 18
- `%fmins_00%` to `%fmins_39%` - Forecast Minutes Eg. 00 (will always be 00)
- `%fsecs_00%` to `%fsecs_39%` - Forecast Seconds Eg. 00 (will always be 00)
- `%dt_localtime_00%` to `%dt_localtime_39%` - Forecast local date and time string Eg. 2024-05-26 18:00:00
- `%d_localtime_00%` to `%d_localtime_39%` - Forecast local date string Eg. 2024-05-26
- `%ds_localtime_00%` to `%ds_localtime_39%` - Forecast local date short string Eg. 05-26
- `%t_localtime_00%` to `%t_localtime_39%` - Forecast local time string Eg. 18:00:00
- `%ts_localtime_00%` to `%ts_localtime_39%` - Forecast local time short string Eg. 18:00
- `%ftemp_00%` to `%ftemp_39%` - Forecast temperature Eg. 15
- `%ffeels_00%` to `%ffeels_39%` - Forecast feels like temperature Eg. 14
- `%fclouds_00%` to `%fclouds_39%` - Forecast cloud coverage Eg. 99
- `%fpop_00%` to `%fpop_39%` - Probability of precipitation Eg. 100
- `%fpod_00%` to `%fpod_39%` - Part of the day (n - night, d - day) Eg. d
- `%fvis_00%` to `%fvis_39%` - Visibility in feet Eg. 10000
- `%fhum_00%` to `%fhum_39%` - Humidity percentage Eg. 70
- `%ftempmax_00%` to `%ftempmax_39%` - Maximum temperature Eg. 16
- `%ftempmin_00%` to `%ftempmin_39%` - Minimum temperature Eg. 15
- `%fground_00%` to `%fground_39%` - Ground level pressure in millibarsEg. 928
- `%fsea_00%` to `%fsea_39%` - Sea level pressure in millibarsEg. 1007
- `%fdesc_00%` to `%fdesc_39%` - Weather description Eg. Light Rain
- `%fmaindesc_00%` to `%fmaindesc_39%` - Weather main description Eg. Rain
- `%fdescem_00%` to `%fdescem_39%` - Weather description emoji Eg. 🌧️
- `%ficonurl_00%` to `%ficonurl_39%` - Weather icon URL Eg. https://openweathermap.org/img/wn/10d.png
- `%ficonurl2x_00%` to `%ficonurl2x_39%` - Weather icon URL double size Eg. https://openweathermap.org/img/wn/10d@2x.png
- `%fwindspeed_00%` to `%fwindspeed_39%` - Wind speed in miles per hour Eg. 7
- `%fwindspeedms_00%` to `%fwindspeedms_39%` - Wind speed in meters per second Eg. 2
- `%fwinddeg_00%` to `%fwinddeg_39%` - Wind direction in degrees Eg. 198
- `%fwinddir_00%` to `%fwinddir_39%` - Wind direction Eg. South
- `%fwindgust_00%` to `%fwindgust_39%` - Wind gusts miles per hour Eg. 7
- `%fwindgustms_00%` to `%fwindgustms_39%` - Wind gusts meters per second Eg. 2
- `%next12%` - Forecast list for the next 12 hours Eg...
  - 05-26 - 18:00 🌧️ Light Rain Temp: 15 Feels Like: 14
  - 05-26 - 21:00 🌧️ Light Rain Temp: 14 Feels Like: 13
  - 05-27 - 00:00 ☁️ Overcast Clouds Temp: 12 Feels Like: 11
  - 05-27 - 03:00 🌧️ Light Rain Temp: 9 Feels Like: 8
- `%next24%` - Forecast list for the next 24 hours Eg...
  - 05-26 - 18:00 🌧️ Light Rain Temp: 15 Feels Like: 14
  - 05-26 - 21:00 🌧️ Light Rain Temp: 14 Feels Like: 13
  - 05-27 - 00:00 ☁️ Overcast Clouds Temp: 12 Feels Like: 11
  - 05-27 - 03:00 🌧️ Light Rain Temp: 9 Feels Like: 8
  - 05-27 - 06:00 🌧️ Scattered Clouds Temp: 8 Feels Like: 7
  - 05-27 - 09:00 🌥️ Scattered Clouds Temp: 13 Feels Like: 12
  - 05-27 - 12:00 🌥️ Broken Clouds Temp: 18 Feels Like: 17
  - 05-27 - 15:00 ☁️ Overcast Clouds Temp: 20 Feels Like: 17
- `%next48%` - Forecast list for the next 48 hours Eg...
  - 05-26 - 18:00 🌧️ Light Rain Temp: 15 Feels Like: 14
  - 05-26 - 21:00 🌧️ Light Rain Temp: 14 Feels Like: 13
  - 05-27 - 00:00 ☁️ Overcast Clouds Temp: 12 Feels Like: 11
  - 05-27 - 03:00 🌧️ Light Rain Temp: 9 Feels Like: 8
  - 05-27 - 06:00 🌧️ Scattered Clouds Temp: 8 Feels Like: 7
  - 05-27 - 09:00 🌥️ Scattered Clouds Temp: 13 Feels Like: 12
  - 05-27 - 12:00 🌥️ Broken Clouds Temp: 18 Feels Like: 17
  - 05-27 - 15:00 ☁️ Overcast Clouds Temp: 20 Feels Like: 17
  - 05-27 - 18:00 ☁️ Overcast Clouds Temp: 20 Feels Like: 20
  - 05-27 - 21:00 ☁️ Overcast Clouds Temp: 15 Feels Like: 15
  - 05-28 - 00:00 ☁️ Overcast Clouds Temp: 14 Feels Like: 13
  - 05-28 - 03:00 ☁️ Overcast Clouds Temp: 12 Feels Like: 11
  - 05-28 - 06:00 ☁️ Overcast Clouds Temp: 10 Feels Like: 9
  - 05-28 - 09:00 🌥️ Broken Clouds Temp: 14 Feels Like: 14
  - 05-28 - 12:00 🌥️ Broken Clouds Temp: 19 Feels Like: 18
  - 05-28 - 15:00 ☁️ Overcast Clouds Temp: 21 Feels Like: 20

- ### Weather Placeholder notes
  - `%icon%` and `%icon2x%` - This is replaced with the image tag `<img src={Icon Url} />` This is more useful if it is embedded inside a [div](#div-support) code block.

  - `%wind-gust%` This data is only returned by the API if the condition exists. To make this display the string data only when it exists you can surround it with the caret symbols.

  - For example: `Winds %wind-speed% km/h^ with gusts up to %wind-gust% km/h^`
  - With wind gust data this will convert to: `Winds 10 km/h with gusts up to 20 km/h`
  - Without wind gust data this will convert to: `Winds 10 km/h` (The text surrounded by carets will be removed)

## OpenWeather Plugin Commands

#### All these commands are available from the command palette and the ribbon icon

- `OpenWeather: Insert weather string one` - Inserts Weather String One into the current document.
- `OpenWeather: Insert weather string two` - Inserts Weather String Two into the current document.
- `OpenWeather: Insert weather string three` - Inserts Weather String Three into the current document.
- `OpenWeather: Insert weather string four` - Inserts Weather String Four into the current document.
  - Note: If text is selected in the current document when these commands are run, it will be replaced by the inserted weather string.
- `OpenWeather: Replace template string` - This will replace all occurences of the strings, `%weather1%`, `%weather2%`, `%weather3%` and `%weather4%` with the corresponding defined weather strings. See also [Template support](#template-support)

## Template support
You can place the following strings in your templates and when creating a new document using the template, they will automatically be replaced with the corresponding weather strings.

- `%weather1%` - Inserts weather string One
- `%weather2%` - Inserts weather string Two
- `%weather3%` - Inserts weather string Three
- `%weather4%` - Inserts weather string Four

## DIV support
You can insert the following DIV inside your documents to provide dynamic weather which is updated at the frequency set in the [settings _Update Frequency_](#update-frequency) setting. The `weather_historical_3` is the static temperature at the time the document is created and the `weather_current_1` is dynamic. See [EXAMPLE.md](EXAMPLE.md) for a demonstration of how I use these in my Daily Template.


```html
<div class="weather_historical_3">%weather3%</div>
<div class="weather_current_1"></div>
```

You can use the following class's to insert the corresponding weather strings

- "weather_current_1" Inserts dynamic weather string One
- "weather_current_2" Inserts dynamic weather string Two
- "weather_current_3" Inserts dynamic weather string Three
- "weather_current_4" Inserts dynamic weather string Four

and...

- "weather_historical_1" Inserts static weather string One
- "weather_historical_2" Inserts static weather string Two
- "weather_historical_3" Inserts static weather string Three
- "weather_historical_4" Inserts static weather string Four

