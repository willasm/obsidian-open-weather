# My Daily Note Example

## Demonstration Information

This is an example of how I add the weather information into my Daily Notes. The recorded temperature is the permanently recorded temperature available at the time of my Daily Notes creation. When I hover over that it shows me the current temperature information. This is achieved through the use of CSS. All the code involved is also listed in this document and copies have been added to the repository.

Please note the web site `https://api.quotable.io/` which is used by the Templater plugin was down at the time I made the example gif so please just ignore the error message. Also the lines for the calendar are very long and may not be displayed properly in your markdown viewer or on Github.

It makes use of the following plugins, [banners](https://github.com/noatpad/obsidian-banners), [templater](https://github.com/SilentVoid13/Templater), [Buttons](https://github.com/shabegom/buttons) and of course this plugin [OpenWeather](https://github.com/willasm/obsidian-open-weather).

### Screenshot

![Demonstration](images/Demo.gif)

## [My Daily Note Template](Daily%20Note.md)

```markdown
---
cssclasses: daily, calendar
banner: "![[daily-note-banner.jpg]]"
banner_x: 0.5
banner_y: 0.3
obsidianUIMode: preview
title: <%tp.file.title%>
created: <%tp.date.now()%>
modified: <%tp.date.now()%>
last_reviewed: <%tp.date.now()%>
author: "William McKeever"
source:
status: 
webclip: false
tags: [daily_note]
aliases: []
description: "Daily Note"
---
<div class="weather_historical_3">%weather3%</div>
<div class="weather_current_4"></div>

| <%moment(tp.file.title, 'YYYY-MM-DD').subtract(3, 'd').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').subtract(2, 'd').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').subtract(1, 'd').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').add(1, 'd').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').add(2, 'd').format('ddd')%> | <%moment(tp.file.title, 'YYYY-MM-DD').add(3, 'd').format('ddd')%> |
|:------:|:------:|:------:|:------:|:------:|:------:|:----------:|
|   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(17, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(17, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(16, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(16, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(15, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(15, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(14, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(14, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(13, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(13, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(12, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(12, 'd').format('DD')%>]]   |     [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(11, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(11, 'd').format('DD')%>]]     |
|   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(10, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(10, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(9, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(9, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(8, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(8, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(7, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(7, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(6, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(6, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(5, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(5, 'd').format('DD')%>]]   |     [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(4, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(4, 'd').format('DD')%>]]     |
|   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(3, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(3, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(2, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(2, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').subtract(1, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').subtract(1, 'd').format('DD')%>]]   |   ==**[[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').format('DD')%>]]**==   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(1, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(2, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(2, 'd').format('DD')%>]]   |     [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(3, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(3, 'd').format('DD')%>]]     |
|   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(4, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(4, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(5, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(5, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(6, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(6, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(7, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(7, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(8, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(8, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(9, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(9, 'd').format('DD')%>]]   |     [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(10, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(10, 'd').format('DD')%>]]     |
|   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(11, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(11, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(12, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(12, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(13, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(13, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(14, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(14, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(15, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(15, 'd').format('DD')%>]]   |   [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(16, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(16, 'd').format('DD')%>]]   |     [[Daily/<%moment(tp.file.title, 'YYYY-MM-DD').add(17, 'd').format('YYYY-MM-DD')%>\|<%moment(tp.file.title, 'YYYY-MM-DD').add(17, 'd').format('DD')%>]]     |

> ###### [[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>|⬅]] <% tp.file.title %> [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>|➡]]
> ##### 🔹 <% tp.date.now("dddd 🔹 MMMM Do 🔹 YYYY", 0, tp.file.title, "YYYY-MM-DD") %> 🔹

<%tp.web.daily_quote()%>

---

## Todo Today
- [ ] `button-review` Review recent notes.

## Achievments for Today

## Research

## Ideas

## Quick notes

```

## [My Daily Notes CSS (dailyNote.css)](dailyNote.css)

```css
/*====================*/
/* Daily Note Styling */
/*====================*/
.daily {
    padding-left: 25px !important;
    padding-right: 25px !important;
    padding-top: 20px !important;
}

/* Transition Effect Weather One */
.weather_current_1,
.weather_historical_1 {
  transition: 0.3s;
}

/* Transition Effect Weather Two */
.weather_current_2,
.weather_historical_2 {
  transition: 0.3s;
}

/* Transition Effect Weather Three */
.weather_current_3,
.weather_historical_3 {
  transition: 0.3s;
}

/* Transition Effect Weather Four */
.weather_current_4,
.weather_historical_4 {
  transition: 0.3s;
}

/* Historical & Current weather One, Two, Three and Four common settings */
.weather_historical_1, .weather_current_1, .weather_historical_2, .weather_current_2, .weather_historical_3, .weather_current_3, .weather_historical_4, .weather_current_4 {
    display: flex;
    float: left;
    clear: left;
    align-items: center;
    top: 45px;
    left: 55px;
    white-space: pre;
    position: absolute;
    font-family: monospace;
    font-size: 14pt !important;
    margin: 10px 5px;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 3px 3px 2px #414654;
    cursor: pointer;
}

/* Historical weather at top of the document over banner */
.weather_historical_1, .weather_historical_2, .weather_historical_3, .weather_historical_4 {
    color: #d0dce9;
    background-color: #0d3d56;
}

/* Current weather at top of the document over banner */
.weather_current_1, .weather_current_2, .weather_current_3, .weather_current_4 {
    color: #c4caa5;
    background-color: #133e2c;
    opacity: 0;
}

/* Show Current weather One on hover */
.weather_current_1:hover {
    opacity: 1;
}

/* Show Current weather Two on hover */
.weather_current_2:hover {
    opacity: 1;
}

/* Show Current weather Three on hover */
.weather_current_3:hover {
    opacity: 1;
}

/* Show Current weather Four on hover */
.weather_current_4:hover {
    opacity: 1;
}

/* Daily Note Name H6 Styling (YYYY-MM-DD) */
.daily h6 {
    font-size: 1.75em;
    color: #4cbf90;
    border-width: 1px;
    padding-bottom: 3px;
    text-align: center;
}

/* Daily Note Date H5 Styling (🔹 Thursday 🔹 10th November 🔹 2022 🔹) */
.daily h5 {
    font-size: 1.25em;
    color: #23a49d;
    border-width: 1px;
    padding-bottom: 3px;
    text-align: center;
}

/* Hide the frontmatter for Daily Notes
.daily .frontmatter-container {
    display: none;
}
 */

/*==============================*/
/* Display Daily Notes Calendar */
/*==============================*/
.calendar table {
    top: 30px;
    right: 30px;
    position: absolute;
    background-color: #0d3d56;
    border-radius: 10px;
}

.calendar thead {
	background-color: #147980;
}

.calendar th {
    color: goldenrod !important;
}

.calendar table th:first-of-type {
    border-top-left-radius: 6px;
}
.calendar table th:last-of-type {
    border-top-right-radius: 6px;
}

.calendar .internal-link {
	color: rgb(215, 146, 27);
}

.calendar .internal-link.is-unresolved {
	color: silver;
}

.calendar td strong {
    border-radius: 50%;
    padding: 3px;
    border: 2px solid #229ecf;
	color: black !important;
}

.calendar mark {
    /* color: #fd0707 !important; */
    background: #0d3d56;
}

.calendar strong .internal-link{
    color: #23bca5 !important;
    /* background: #0d3d56; */
}

```
