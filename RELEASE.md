# Release Notes
<!--
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Updated
-->

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->
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

For a full list of changes, please see the projects [Changelog](CHANGELOG.md) file.

I hope you enjoy using the Plugin, and if you find any bugs, or would like to see a certain feature added, please feel free to contact me.

Enjoy! William
