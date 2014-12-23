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

    var name              = $( 'input[name="name"]' ).val()
    var meetupDate        = $( 'input[name="dateToMeet"]' ).val()
    var meetupType        = $( 'select[name="meetupType"]' ).find(":selected").val()
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

    meetup = Meetups.findOne( {
      _id : newId
    } )

    // redirect to the meetup view
    // TODO this redirects to the wrong slug
    Router.go( 'meetup', {
      slug : meetup.slug
    })
  }
} );

// ===========
// Map Helpers
// ===========
this.setScale = function ( scale ) {
  _$.scale = scale * scaleFactor;

  if ( _$.meetupCircle ) {
    _$.meetupCircle.setRadius( _$.scale );
    // defined in meetup-template-helper.js
    setPlaceMarkers(  $( 'select[name="meetupType"]' ).find(":selected").val() )
  }
}

this.setCenter = function ( lat, lon ) {
  'use strict';

  var location = lat + ', ' + lon
  var center   = new google.maps.LatLng( lat, lon )
  $( '#map_center' ).val( location )

  var meetup_location = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: _$.map,
    center: center,
    // TODO
    radius: _$.scale
  }

  if ( _$.meetupCircle ) {
    _$.meetupCircle.setMap( null )
  }

  _$.meetupCircle = new google.maps.Circle( meetup_location )
  _$.map.panTo( _$.meetupCircle.getCenter() )
  // TODO rezoom the map according to the radius

  // defined in meetup-template-helper.js
  setPlaceMarkers(  $( 'select[name="meetupType"]' ).find(":selected").val() )
}

this.nearbyCallback = function  ( results, status ) {
  'use strict';

  // Place the markers on the map
  if ( status == google.maps.places.PlacesServiceStatus.OK ) {
    // Destroy old markers
    if ( _$.previewMarkers ) {
      for ( var i = 0; i < _$.previewMarkers.length; i++ ) {
        _$.previewMarkers[i].setMap( null )
      }
      _$.previewMarkers = []
    }

    for ( var i = 0; i < results.length; i++ ) {
      var place = results[i];
      if ( results[i] !== null &&
          typeof results[i] !== 'undefined' )
        createMarker( results[i] )
    }
  }
}

this.currentPositionCallback = function ( position ) {
  'use strict';

  setCenter( position.coords.latitude,  position.coords.longitude );
}

this.createMarker = function ( place ) {
  'use strict';

  var placeLoc = place.geometry.location
  var marker = new google.maps.Marker( {
    map: _$.map,
    position: place.geometry.location
  } )

  _$.previewMarkers.push( marker )

  updateMarker( marker, place.place_id )
}

this.updateMarker = function ( markerReference, placeId ) {
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
