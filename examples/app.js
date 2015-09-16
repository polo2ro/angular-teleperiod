var app = angular.module('teleperiodExample', ['mgcrea.ngStrap', 'tpTeleperiod']);


app.controller('MainCtrl', function($scope) {
    'use strict';


    $scope.loadWorkingTimes = function(interval) {

        var workingtimes = [];
        var loop = new Date(interval.from);
        while (loop.getTime() < interval.to.getTime()) {

            if (loop.getDay() !== 0 && loop.getDay() !== 6) {

                var am = {};
                var pm = {};

                am.summary = 'Morning work schedule';
                am.dtstart = new Date(loop);
                am.dtstart.setHours(9, 0, 0);

                am.dtend = new Date(loop);
                am.dtend.setHours(12, 0, 0);

                pm.summary = 'Afternoon work schedule';
                pm.dtstart = new Date(loop);
                pm.dtstart.setHours(13, 0, 0);

                pm.dtend = new Date(loop);
                pm.dtend.setHours(18, 0, 0);

                workingtimes.push(am);
                workingtimes.push(pm);
            }

            loop.setDate(loop.getDate() + 1);
        }

        return workingtimes;
    };


    function addEvent(interval, events, event)
    {
        if (interval.from < event.dtend && interval.to > event.dtstart) {
            events.push(event);
        }
    }

    $scope.events = [{
            uid: 'abc123456',
            summary: 'Special meeting',
            dtstart: new Date(2015, 8, 20, 8, 0, 0),
            dtend: new Date(2015, 8, 20, 18, 0, 0)
        },
        {
            uid: 'abc123457',
            summary: 'Sport',
            dtstart: new Date(2015, 8, 21, 8, 0, 0),
            dtend: new Date(2015, 8, 21, 12, 0, 0)
        },
        {
            uid: 'abc123455',
            summary: 'Social event',
            dtstart: new Date(2015, 8, 29, 8, 0, 0),
            dtend: new Date(2015, 8, 29, 18, 0, 0)
        }];


    $scope.editEvent = function(event) {
        $scope.event = event;
        //TODO focus date
        //TODO dynamic version for edit event
    };



    $scope.loadEvents = function(interval) {

        if (interval.to.getFullYear() < 2015 || interval.from.getFullYear() > 2015) {
            return [];
        }

        if (interval.to.getMonth() < 8 || interval.from.getMonth() > 8) {
            return [];
        }

        return $scope.events;
    };

    $scope.loadVacationsPreview = function(interval) {


        var events = [];
        var christmas = {
            summary: 'Christmas vacations',
            dtstart: new Date(2014, 11, 20, 8, 0, 0),
            dtend: new Date(2015, 0, 5, 19, 0, 0)
        };

        addEvent(interval, events, christmas);

        return events;
    };


    $scope.test = 'TEST';

    $scope.buzz = {
        dtstart:  new Date(2015, 4, 8, 8, 0, 0) ,
        dtend:  new Date(2015, 4, 9, 8, 0, 0)
    };
});


app.controller('SelectionCtrl', function($scope) {
    'use strict';
    $scope.time = new Date(1970, 0, 1, 10, 30);

});
