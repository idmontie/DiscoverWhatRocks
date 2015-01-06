/**
 * Meetup Form Template Helper
 *
 * Template Helpers for the meetup forms, including the meetups-add-form
 * and the meetupsAddForm
 */

/* global _$ */
/* global Meetups */
/* global Schema */
/* global PlaceTypes */
/* global google */

// The `currentPositionCallback` is defined in the template file
/* global currentPositionCallback */

Template.meetupsAddForm.created = function () {
  Session.set( 'meetupsAddFormErrors', {} )
}

Template.meetupsAddForm.schemaHelpers = {
  name : function () {
    'use strict';

    var name = $( 'input[name=name]' ).val()
    try {
      check( name, Schema.meetups._schema.name.type )
    } catch ( e ) {
      return {
        valid : false,
        message : 'Please enter a valid name'
      }  
    }

    if ( name.trim() == '' ) {
      return {
        valid : false,
        message : 'Please enter a name'
      }
    }
    
    return {
      valid : true
    }
  },
  date : function () {
    'use strict';

    var dateToMeet = $( 'input[name=dateToMeet]' ).val()
    
    if ( ( ! dateToMeet ) || dateToMeet.trim() === '' ||
         dateToMeet === '____/__/__ __:__ __') {
      return {
        valid : false,
        message : 'Please enter a date to meet'
      }
    }

    return {
      valid : true
    }
  },
  location : function () {
    'use strict';

    var tempLocationParts = $( '#map_center' ).val().split( ',' )

    if ( tempLocationParts.length <= 1 ) {
      return {
        valid : false,
        message : 'Please click on the map to select a location to meet'
      }
    }

    return {
      valid : true
    }
  }
}

Template.meetupsAddForm.helpers( {
  nameIsNotValid : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return  ( ! ! session.name ) && ! session.name.valid
  },
  nameErrorMessage : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return session.name.message
  },
  dateIsNotValid : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return ( ! ! session.date ) && ! session.date.valid
  },
  dateErrorMessage : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return session.date.message
  },
  locationIsNotValid : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return ( ! ! session.location ) && ! session.location.valid
  },
  locationErrorMessage : function () {
    'use strict';

    var session = Session.get( 'meetupsAddFormErrors' )
    return session.location.message
  },


  /**
   * Check for geolocation browser capability
   */
  geolocationEnabled : function () {
    'use strict';

    if ( navigator.geolocation ) {
      return ''
    } else {
      return 'disabled="disabled"'
    }
  },
  placeTypes : function () {
    'use strict';

    return PlaceTypes.find()
  }
} );

Template.meetupsAddForm.events( {
  // TODO this does not run on location pick
  'keyup input[name=name], change input[name=name]' : function ( e ) {
    var session = Session.get( 'meetupsAddFormErrors' )

    session.name = Template.meetupsAddForm.schemaHelpers.name()

    Session.set( 'meetupsAddFormErrors', session )
  },
  'keyup input[name=dateToMeet], blur input[name=dateToMeet]' : function ( e ) {
    var session = Session.get( 'meetupsAddFormErrors' )

    session.date = Template.meetupsAddForm.schemaHelpers.date()

    Session.set( 'meetupsAddFormErrors', session )
  },
  'click #use_current_location:not("[disabled]")' : function ( e ) {
    'use strict';
    e.preventDefault();

    // TODO precompute this on page load if we already have permission
    // to get it
    navigator.geolocation.getCurrentPosition( currentPositionCallback );
  },
  'submit form' : function ( e ) {
    'use strict';
    e.preventDefault();

    // validation
    var forceCheck = {
      name : Template.meetupsAddForm.schemaHelpers.name(),
      date : Template.meetupsAddForm.schemaHelpers.date(),
      location : Template.meetupsAddForm.schemaHelpers.location()
    }

    Session.set( 'meetupsAddFormErrors', forceCheck )

    var dirty = false
    for ( var check in forceCheck ) {
      if ( ! forceCheck[check].valid ) {
        dirty = true
        break;
      }
    }
    
    if ( dirty ) {
      return;
    }

    var name              = $( 'input[name="name"]' ).val()
    var meetupDate        = $( 'input[name="dateToMeet"]' ).val()
    var meetupType        = $( 'select[name="meetupType"]' ).find( ':selected' ).val()
    var tempLocationParts = $( '#map_center' ).val().split( ',' )
    var meetupLatitude    = tempLocationParts[0].trim()
    var meetupLongitude   = tempLocationParts[1].trim()
    var meetupRadius      = window.scale

    var meetup = Schema.meetups.clean( {
      circleId: this._id,
      dateToMeet : meetupDate,
      name : name,
      placeTypeSlug :  meetupType,
      mapCenter : {
        latitude : meetupLatitude,
        longitude : meetupLongitude,
        radius : meetupRadius
      },
      votes : []
    } )

    var newId = Meetups.insert( meetup )

    Meteor.call( 'getRealMeetupSlug', newId, function ( err, data ) {
      // redirect to the meetup view
      Router.go ( 'meetup', {
        slug : data
      } )
    } )
  }
} );

// ===========
// Map Helpers
// ===========
this.setScale = function ( scale ) {
  'use strict';

  _$.scale = scale * _$.scaleFactor;

  if ( _$.meetupCircle ) {
    _$.meetupCircle.setRadius( _$.scale );
    // defined in meetup-template-helper.js
    _$.setPlaceMarkers(  $( 'select[name="meetupType"]' ).find( ':selected' ).val() )
  }
}

this.setCenter = function ( lat, lon ) {
  'use strict';

  var location = lat + ', ' + lon
  var center   = new google.maps.LatLng( lat, lon )
  $( '#map_center' ).val( location )

  var meetupLocation = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: _$.map,
    center: center,
    radius: _$.scale
  }

  if ( _$.meetupCircle ) {
    _$.meetupCircle.setMap( null )
  }

  _$.meetupCircle = new google.maps.Circle( meetupLocation )
  _$.map.panTo( _$.meetupCircle.getCenter() )
  // TODO rezoom the map according to the radius

  // defined in meetup-template-helper.js
  _$.setPlaceMarkers( $( 'select[name="meetupType"]' ).find( ':selected' ).val() )
}

this.nearbyCallback = function  ( results, status ) {
  'use strict';

  var i = 0

  // Place the markers on the map
  if ( status == google.maps.places.PlacesServiceStatus.OK ) {
    // Destroy old markers
    if ( _$.previewMarkers ) {
      for ( i = 0; i < _$.previewMarkers.length; i++ ) {
        _$.previewMarkers[i].setMap( null )
      }
      _$.previewMarkers = []
    }

    for ( i = 0; i < results.length; i++ ) {
      if ( results[i] !== null &&
          typeof results[i] !== 'undefined' )
        _$.createMarker( results[i] )
    }
  }
}

this.currentPositionCallback = function ( position ) {
  'use strict';

  _$.setCenter( position.coords.latitude,  position.coords.longitude );
}

this.updateMarker = function ( markerReference, placeId ) {
  'use strict';

  var service = new google.maps.places.PlacesService( _$.map )

  var request = {
    placeId : placeId
  }

  google.maps.event.addListener( markerReference, 'click', function () {
    var self = this

    // anonymous because we need scoping
    service.getDetails( request, function ( place, status ) {

      if ( status == google.maps.places.PlacesServiceStatus.OK ) {
        _$.infowindow.setContent( place.name )
        _$.infowindow.open( _$.map, self )
      }
    } )
  } )
}
