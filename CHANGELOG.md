# Change Log

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->
## [1.7.1] 2024-02-24
### Fixed
- String settings names were named incorrectly (This effectively reset your defined strings to defaults)
  - The original edited strings are still in the data file, this fix just points back to them
  - This only affects anyone who had changed the default strings

## [1.7.0] 2024-02-18
### Added
- Settings for Latitude and Longitude
  - Please note that API requests by city name have been deprecated although they are still available for use
  - Note that setting these will override the location setting
  - Use these if you are having issues with getting data returned for the wrong city
  - Leave them blank to use the location setting (Not recommended)
- `Geocoding API` - This provides you with the requested cities name, state, country, latitude and longitude
- Settings button for using the `Geocoding API` to retrieve cities name, state, country, latitude and longitude
  - This will prompt you with a list of up to 5 locations based on your city name search query
  - The settings for location name, latitude and longitude will automatically be updated to the data from your selection
  - This should solve any issues with receiving data for the wrong city
- The weather string placeholders `%latitude%` and `%longitude%`
  - These values are returned from the API call and are not from the new settings for Latitude and Longitude
- `Air Pollution API` - This provides you with the current Air Quality Index with the corresponding placeholders
  - `%aqinumber%` - Numbers 1 to 5 which match with the strings below
  - `%aqistring%` - The strings that match the numbers 1 to 5 - 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'
- Github repository links in the settings UI
### Changed
- Wind speed in meters/second now rounded to nearest whole number
### Fixed
- Now returns an error message on API error Eg. `Error Code 404: city not found` will be displayed as the weather string
### Updated
- Settings UI improved the layout and descriptions

## [1.6.1] 2024-01-13
### Added
- The files `Daily Note.md` and `dailyNote.css` used in `EXAMPLE.md` file
### Updated
- The documentation in the `EXAMPLE.md` document has been updated

## [1.6.0] 2023-11-07
### Added
- New macro for wind speed in meters per second %wind-speed-ms%
### Fixed
- "Failed to fetch weather data TypeError: Cannot read properties of undefined (reading '0')" while entering location in settings 

## [1.5.1] 2023-04-11
### Fixed
- Selected exclude folder now excludes files in subfolders as well
- Corrected some typos

## [1.5.0] 2023-03-18
### Added
- Weather Description Emojis
  - Macro `%desc-em%` will be replaced with an emoji of the current weather description

## [1.4.0] 2023-03-18
### Added
- Language support for the following languages
  - af - Afrikaans
  - al - Albanian
  - ar - Arabic
  - az - Azerbaijani
  - bg - Bulgarian
  - ca - Catalan
  - cz - Czech
  - da - Danish
  - de - German
  - el - Greek
  - en - English
  - eu - Basque
  - fa - Persian (Farsi)
  - fi - Finnish
  - fr - French
  - gl - Galician
  - he - Hebrew
  - hi - Hindi
  - hr - Croatian
  - hu - Hungarian
  - id - Indonesian
  - it - Italian
  - ja - Japanese
  - kr - Korean
  - la - Latvian
  - lt - Lithuanian
  - mk - Macedonian
  - no - Norwegian
  - nl - Dutch
  - pl - Polish
  - pt - Portuguese
  - pt_br - Português Brasil
  - ro - Romanian
  - ru - Russian
  - sv - Swedish
  - sk - Slovak
  - sl - Slovenian
  - sp - Spanish
  - sr - Serbian
  - th - Thai
  - tr - Turkish
  - ua - uk Ukrainian
  - vi - Vietnamese
  - zh_cn - Chinese Simplified
  - zh_tw - Chinese Traditional
  - zu - Zulu

## [1.3.0] 2023-03-10
### Fixed
- removed obsidian from ID

## [1.2.0] 2023-03-02
### Added
- Cloud coverage %clouds% (Percentage)
- Rain past 1 hour %rain1h% (in millimeters)
- Rain past 3 hours %rain3h% (in millimeters)
- Snow past 1 hour %snow1h% (in millimeters)
- Snow past 3 hours %snow3h% (in millimeters)
- Precipitation past 1 hour %precipitation1h% (in millimeters - Rain or Snow)
- Precipitation past 3 hours %precipitation3h% (in millimeters - Rain or Snow)

## [1.1.0] 2023-02-07
### Added
- Now runs on mobile (Display weather in statusbar is disabled)
- New setting `Exclude Folder` which will exclude a folder from automatic template strings replacement (set this to your templates folder so it does not replace the strings in your template)

### Fixed
- Dynamic weather in DIV's should be shown more reliably

## [1.0.0] 2022-12-22
- Initial release
