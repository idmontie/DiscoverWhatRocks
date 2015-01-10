/**
 * Global Template Helpers
 *
 * Template helpers that are present globally.  Similar to autorun
 * template helpers, but are normally reactive.
 */

/* global Meetups */
/* global slugify */

// Configure UI helper
Template.registerHelper( 'current_route_name', function () {
  'use strict';

  if ( Router.current() &&
       Router.current().route.getName() ) {
    return slugify( Router.current().route.getName() )
  }

  return 'NA'
} );

Template.registerHelper( 'session', function ( input ) {
  'use strict';

  return Session.get( input )
});

Template.registerHelper( 'number_of_upcoming_meetups_for_circle', function ( circle ) {
  'use strict';

  return Meetups.find( {
    circleId : circle._id
  } ).count()
} );

Template.registerHelper( 'numberOfFriendsForCircle', function ( circle ) {
  'use strict';

  if ( circle && circle.users ) {
    return circle.users.length
  }

  return 0
} );

Handlebars.registerHelper('key_value', function ( context ) {
  'use strict';

  var result = [];
  _.each(context, function ( value, key ) {
    result.push({ key:key, value:value })
  })

  return result
});

Template.registerHelper( 'generateCalendarIcon', function ( dateTime ) {
  'use strict';

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
