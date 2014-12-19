/**
 * Global Template Helpers
 *
 * Template helpers that are present globally.  Similar to autorun
 * template helpers, but are normally reactive.
 */

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

  // TODO trick to shut grunt up
  circle = circle
  return 0;
} );

Handlebars.registerHelper('key_value', function(context) {
  'use strict';

  var result = [];
  _.each(context, function(value, key){
    result.push({key:key, value:value})
  })

  return result
});