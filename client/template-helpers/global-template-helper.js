/**
 * Global Template Helpers
 */
// Configure UI helper
Template.registerHelper( 'current_route_name', function () {
  if ( Router.current() &&
       Router.current().route.getName() ) {
    return slugify( Router.current().route.getName() );
  }

  return 'NA';
} );

Template.registerHelper( 'session', function ( input ) {
  return Session.get( input );
});

Template.registerHelper( 'number_of_upcoming_meetups_for_circle', function ( circle ) {
  // TODO
  return 0;
} );