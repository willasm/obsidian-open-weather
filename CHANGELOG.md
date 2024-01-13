# Change Log
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
