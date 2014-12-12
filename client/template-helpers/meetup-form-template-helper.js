Template['meetups-add-form'].helpers( {
  geolocation_enabled : function () {
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
    e.preventDefault();

    navigator.geolocation.getCurrentPosition( current_position_callback );
  },
  'submit form' : function ( e ) {
    e.preventDefault();

    // TODO validation

    var meetup_date = $( 'input[name="date_to_meet"]' ).val();
    var temp_location_parts = $( '#map_center' ).val().split( ',' );
    var meetup_lat = temp_location_parts[0].trim();
    var meetup_long = temp_location_parts[1].trim();
    var meetup_radius = window.scale;

    var meetup = Schema.meetups.clean( {
      date_to_meet: meetup_date,
      map_center : {
        latitude : meetup_lat,
        longitude : meetup_long,
        radius : meetup_radius
      },
      circle_id: this._id
    } );

    Meetups.insert( meetup );

    // redirect to the meetup view
    Router.go( 'meetup', {
      slug : meetup.slug
    });
  }
} );
