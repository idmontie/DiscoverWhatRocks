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