// ==========================
// global-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Template Helpers that get registered
// globally.

// ============
// Lint Globals
// ============
/* global Meetups */
/* global slugify */

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.registerHelper( 'currentRouteName', function () {
    if ( Router.current() &&
         Router.current().route.getName() ) {
      return slugify( Router.current().route.getName() )
    }

    return 'na'
  } )

  Template.registerHelper( 'session', function ( input ) {
    return Session.get( input )
  } )

  Template.registerHelper( 'numberOfUpcomingMeetupsForCircle', function ( circle ) {
    return Meetups.find( {
      circleId : circle._id
    } ).count()
  } )

  Template.registerHelper( 'numberOfFriendsForCircle', function ( circle ) {
    if ( circle && circle.users ) {
      return circle.users.length
    }

    return 0
  } )

  Template.registerHelper( 'generateCalendarIcon', function ( dateTime ) {
    var date       = new Date( dateTime )
    var dayNames   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday']
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']

    var monthName = monthNames[date.getMonth()]
    var dayName   = dayNames[date.getDay()]

    var calendar = ''
    calendar += '<time datetime="' + date + '" class="icon">'
    calendar += '<em>' + dayName + '</em>'
    calendar += '<strong>' + monthName + '</strong>'
    calendar += '<span>' + date.getDate() + '</span>'
    calendar += '<span class="time">' + date.toLocaleTimeString() + '</span>'
    calendar += '</time>'

    return calendar
  } )

}();
