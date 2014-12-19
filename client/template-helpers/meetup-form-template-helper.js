/**
 * Meetup Form Template Helper
 *
 * Template Helpers for the meetup forms, including the meetups-add-form
 * and the meetups-update-form
 */

/* global Meetups */
/* global Schema */

// The `currentPositionCallback` is defined in the template file
/* global currentPositionCallback */

Template['meetups-add-form'].helpers( {
  geolocationEnabled : function () {
    'use strict';

    if ( navigator.geolocation ) {
      return '';
    } else {
      return 'disabled="disabled"';
    }
  }
} );

Template['meetups-add-form'].events( {
  'click #use_current_location:not("[disabled]")' : function ( e ) {
    'use strict';
    e.preventDefault();

    navigator.geolocation.getCurrentPosition( currentPositionCallback );
  },
  'submit form' : function ( e ) {
    'use strict';
    e.preventDefault();

    // TODO validation

    var meetupDate        = $( 'input[name="date_to_meet"]' ).val()
    var tempLocationParts = $( '#map_center' ).val().split( ',' )
    var meetupLatitude    = tempLocationParts[0].trim()
    var meetupLongitude   = tempLocationParts[1].trim()
    var meetupRadius      = window.scale

    var meetup = Schema.meetups.clean( {
      dateToMeet: meetupDate,
      mapCenter : {
        latitude : meetupLatitude,
        longitude : meetupLongitude,
        radius : meetupRadius
      },
      circleId: this._id
    } )

    Meetups.insert( meetup )

    // redirect to the meetup view
    Router.go( 'meetup', {
      slug : meetup.slug
    })
  }
} );
