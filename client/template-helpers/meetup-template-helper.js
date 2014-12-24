/**
 * Meetup Template Helper
 */

/* global _$ */
/* global google */
/* global RichMarker */
/* global Meetups */
/* global PlaceTypes */
/* global Schema */
/* global ReactivityHelper */
/* global Gravatar */


// ================
// Session Defaults
// ================
Session.setDefault( 'voteLat', null )
Session.setDefault( 'voteLong', null )
Session.setDefault( 'voteData', null )

Template.meetup.helpers( {
  placeType : function () {
    'use strict';

    if ( this.meetup !== null &&
         typeof this.meetup !== 'undefined' ) {
      return PlaceTypes.findOne( {
        slug : this.meetup.placeTypeSlug
      } )
    } else {
      return ''
    }
  },
  voteNotCast : function () {
    'use strict';

    return Session.get( 'voteLat' ) === null &&
      Session.get( 'voteLong' ) === null
  },
  voteAlreadyCast : function () {
    'use strict';
    var isSet = ReactivityHelper.reliesOn( this.meetup )

    if ( isSet ) {
      var index = _$.getPreviouslyCastVote( this.meetup, Meteor.userId() )
      return index !== -1
    } else {
      return false
    }
  }
} )

Template.meetup.events( {
  'click #vote:not(.disabled)' : function ( e ) {
    'use strict';

    e.preventDefault()
    e.stopPropagation()

    // Add or Update vote in the meetup
    var newMeetup = $.extend( {}, this.meetup )
    var userId = Meteor.userId()
    var vote = _$.createVote( userId )

    // First vote needs to create votes array
    if ( newMeetup.votes == null ) {
      newMeetup.votes = []
    }

    // Check array for pre-existing vote
    var index = _$.getPreviouslyCastVote( newMeetup, userId )

    // Pre-existing votes should be updated, not deleted
    if ( index !== -1 ) {
      newMeetup.votes[index] = vote
    } else {
      newMeetup.votes.push( vote )
    }

    // Update meetup
    newMeetup = Schema.meetups.clean( newMeetup )
    Meetups.update( this.meetup._id, {
      $set : {
        votes : newMeetup.votes
      }
    } )

    // redirect to the meetup view
    Router.go ( 'meetup', {
      slug : this.meetup.slug
    } )
  }
} )

// ============
// Vote Helpers
// ============

this.getPreviouslyCastVote = function ( meetup, userId ) {
  'use strict';
  var index = -1
  for ( var i = 0; i < meetup.votes.length; i++ ) {
    if ( meetup.votes[i].userId == userId ) {
      index = i
      break
    }
  }

  return index
}

this.createVote = function ( userId ) {
  'use strict';

  var lat          = Session.get( 'voteLat' )
  var lng          = Session.get( 'voteLong' )
  var placeDetails = Session.get( 'voteData' )

  // Make sure placeDetails is an object
  if ( placeDetails == null ) {
    placeDetails = {}
  }

  return {
    latitude : lat,
    longitude : lng,
    userId : userId,
    placeDetails : placeDetails
  }
}

// ===========
// Map Helpers
// ===========

/**
 * Run after data is set
 */
this.run = function () {
  'use strict';

  var Coords = {
    latitude: _$.data.meetup.mapCenter.latitude,
    longitude: _$.data.meetup.mapCenter.longitude
  }

  _$.map = new google.maps.Map( document.getElementById( 'map-canvas' ), {
    center: new google.maps.LatLng( Coords.latitude, Coords.longitude ),
    zoom: 13
  } );
  _$.scale = parseFloat( _$.data.meetup.mapCenter.radius );

  var meetupLocation = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: _$.map,
    center: new google.maps.LatLng( Coords.latitude, Coords.longitude ),
    radius: _$.scale
  };

  _$.meetupCircle = new google.maps.Circle( meetupLocation );

  _$.setPlaceMarkers( _$.data.meetup.placeTypeSlug )

  // TODO mark votes
  // TODO set vote marker if user has already voted


  // Add click listener
  google.maps.event.addListener( _$.map, 'click', function ( np ) {
    _$.setVoteMarker( np.latLng.lat(), np.latLng.lng() );
  } )

  google.maps.event.addListener( _$.meetupCircle, 'click', function ( np ) {
    _$.setVoteMarker( np.latLng.lat(), np.latLng.lng() );
  } )

}

this.setVoteMarker = function ( lat, lon, placeData ) {
  'use strict';
  var location = lat + ', ' + lon
  var latLng = new google.maps.LatLng( lat, lon )

  $( '#vote_location' ).val( location )

  var content = '<div class="pin"><img src="' + Gravatar.imageUrlFromEmail( Meteor.user().emails[0].address, {
    size : 32,
    secure : true
  } ) + '" /></div>';

  var voteLocation = {
    position: latLng,
    map: _$.map,
    flat: true,
    title: 'Vote',
    content: content
  }

  if ( _$.voteMarker ) {
    _$.voteMarker.setMap( null )
  }

  _$.voteMarker = new RichMarker( voteLocation )

  Session.set( 'voteLat', lat )
  Session.set( 'voteLong', lon )
  Session.set( 'voteData', placeData )
}

this.setPlaceMarkers = function ( placeType ) {
  'use strict';

  // set markers
  var service   = new google.maps.places.PlacesService( _$.map )
  var placeRequest = {
    location : _$.meetupCircle.getCenter(),
    radius : _$.scale,
    types  : [placeType]
  }
  service.radarSearch( placeRequest, _$.nearbyCallback )
}

this.nearbyCallback = function  ( results, status ) {
  'use strict';

  var i = 0;

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

this.createMarker = function ( place ) {
  'use strict';

  var marker = new google.maps.Marker( {
    map: _$.map,
    position: place.geometry.location
  } )

  _$.previewMarkers.push( marker )

  /*jshint camelcase: false */
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  _$.updateMarker( marker, place.place_id )
  /*jshint camelcase: true */
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
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

        // this marks the marker
        _$.setVoteMarker(
            markerReference.getPosition().lat(),
            markerReference.getPosition().lng(),
            place
        )
      }
    } )
  } )
}
