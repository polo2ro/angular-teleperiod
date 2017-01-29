# Angular-teleperiod
A period picker on a time line with working hours embeded in an Angular directive.
This project is an Angular wrapper for the main projet [teleperiod](https://github.com/polo2ro/teleperiod)

![Preview](/examples/screenshot.png?raw=true)

Demo
----

http://www.rosanbo.com/angular-teleperiod/examples/


Directives
----------

```html
<div tp-teleperiod>
    <tp-period-picker workingtimes="loadWorkingTimes" events="loadEvents" dtstart="selected.dtstart" dtend="selected.dtend"></tp-period-picker>
    <tp-timeline name="Scholar holidays" events="loadVacationsPreview"></tp-timeline>
</div>
```

the `tp-teleperiod` attribute will display a sliding calendar view with one period picker and optional timelines.


Attributes
----------

__On the tp-period-picker tag__

`workingtimes`:
A scope function used to create the working times periods, the function will be called while browsing the calendar view with an interval object as parameter

`loadEvents`:
A scope function used to create additional events on the calendar view, the function will be called while browsing the calendar view with an interval object as parameter

`dtstart`:
A scope property to update with the start date of the selection

`dtend`:
A scope property to update with the end date of the selection

`ready`:
If attribute is set, draw the period picker when ready=true

`periods`:
Optional property to update with the list of selected periods

`selectedevents`:
Optional list of events to replace with a selection

`refreshevents`:
Set this value to "true" to force a reload of all events

`dayFirstMinute`:
Set the first minute of the day, default is 7x60 and day start at 7:00am

`dayLastMinute`:
Set the last minute of the day, default is 20x60 and day end at 8:00pm


__On a tp-timeline tag__

`name`:
The name displayed on the timeline.

`events`:
A scope function used to create the events on the timeline


