# angular-teleperiod
period picker on a time line with working hours embeded in an angular directive


Attributes
----------

`workingtimes`:
A scope function used to create the working times periods, the function will be called while browsing the calendar view with an interval object as parameter

`loadEvents`:
A scope function used to create additional events on the calendar view, the function will be called while browsing the calendar view with an interval object as parameter

`dtstart`:
A scope property to update with the start date of the selection

`dtend`:
A scope property to update with the end date of the selection
