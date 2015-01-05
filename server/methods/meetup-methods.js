
/* global Meetups */
/* global Gravatar */

Meteor.methods( {
  getRealMeetupSlug : function ( id ) {
    'use strict';

    var newMeetup = Meetups.findOne( {
      _id : id
    } )

    return newMeetup.slug
  },
  meetupStructuredVotes : function ( id ) {
    'use strict';

    // TODO check id is string
    // TODO check user can access meetup

    // TODO this takes a lot of computation power
    // make it only semi reactive
    var meetup = Meetups.findOne( {
      _id : id
    } )
    var placeName = null

    var structuredVotesObject = {}
    var places = {}

    for ( var i = 0; i < meetup.votes.length; i++ ) {
      var vote = meetup.votes[i]
      placeName = ( vote.placeDetails ? vote.placeDetails.name : vote.latitude + ', ' + vote.longitude )

      // TODO users is probably not accessible by clients
      var user = Meteor.users.findOne( {
        _id : vote.userId
      } )

      var email = user.emails[0].address

      var gravatar = Gravatar.imageUrlFromEmail( email )

      if ( structuredVotesObject[placeName]  == null ) {
        // Add it
        structuredVotesObject[placeName] = []
      }

      structuredVotesObject[placeName].push( {
        email : email,
        gravatar : gravatar
      } )

      places[placeName]           = vote.placeDetails
      places[placeName].latitude  = vote.latitude
      places[placeName].longitude = vote.longitude
    }

    // Transform the votes object into an array with vote counters
    var structuredVotes = []

    for ( placeName in structuredVotesObject ) {
      if ( structuredVotesObject.hasOwnProperty( placeName ) ) {
        var numberOfVotes = structuredVotesObject[placeName].length
        var voters        = []
        var place         = places[placeName]
        var latitude      = places[placeName].latitude
        var longitude     = places[placeName].longitude

        for ( var j = 0; j < numberOfVotes; j++ ) {
          voters.push( structuredVotesObject[placeName][j] )
        }

        structuredVotes.push( {
          placeDetails : place,
          latitude : latitude,
          longitude : longitude,
          placeName : placeName,
          numberOfVotes : numberOfVotes,
          voters : voters
        } )
      }
    }

    // TODO sort the array by number of votes

    return structuredVotes
  }
} );
