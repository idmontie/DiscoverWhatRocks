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
    // TODO
  }
} );
