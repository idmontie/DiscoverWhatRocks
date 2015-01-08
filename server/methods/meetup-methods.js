
/* global check */
/* global Circles */
/* global Email */
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

    check( id, String )

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
  },
  meetupInvitees : function ( meetupId ) {
    'use strict';

    check( meetupId, String )

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to invite users.' )
    }

    var meetup = Meetups.findOne( {
      _id : meetupId
    } )

    var circle = Circles.findOne( {
      _id : meetup.circleId
    } )

    // Invitees structure:
    // - email
    // - hasVoted
    var invitees = [];

    var hasVoted = function ( userId ) {
      for ( var i = 0; i < meetup.votes.length; i++ ) {
        if ( meetup.votes[i].userId === userId ) {
          return true
        }
      }

      return false
    }

    // dont forget yourself!
    invitees.push( {
      email : Meteor.user().emails[0].address,
      hasVoted : hasVoted( Meteor.userId() )
    } )

    for ( var i = 0; i < circle.users.length; i++ ) {
      var user = Meteor.users.findOne( {
        emails : {
          $elemMatch : {
            address : circle.users[i].email
          }
        }
      } )

      if ( user === null ||
           typeof user === 'undefined' ) {
        invitees.push( {
          email : circle.users[i].email,
          hasVoted : false
        } )
      } else {
        if ( user.emails && user.emails[0] ) {
          invitees.push( {
            email : user.emails[0].address,
            hasVoted : hasVoted( user._id )
          } )
        }
      }
    }

    return invitees
  },
  inviteToMeetup : function ( meetupId ) {
    'use strict';

    check( meetupId, String )

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to invite users.' )
    }

    var meetup = Meetups.findOne( {
      _id : meetupId
    } )

    // TODO check that the user is the owner

    if ( meetup.pinged === true ) {
      throw new Meteor.Error( 'already-pinged', 'You have already pinged!' )
    } else {
      meetup.pinged = true

      Meetups.update( meetup._id, {
        $set : {
          pinged : true
        }
      }, {
        validate: false,
        getAutoValues: false
      } )
    }

    var circle = Circles.findOne( {
      _id : meetup.circleId
    } )

    var url = Meteor.absoluteUrl( 'circles/meetups/' + meetup.slug )

    for ( var i = 0; i < circle.users.length; i++ ) {
      // TODO only send emails to users with accounts

      // send email
      var email = circle.users[i].email

      Email.send( {
        from : Meetups.emailTemplate.from,
        to : email,
        subject : Meetups.emailTemplate.inviteEmail.subject( email ),
        text : Meetups.emailTemplate.inviteEmail.text( email, url )
      } )
    }
  }
} );
