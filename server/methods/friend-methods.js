
/* global check */
/* global Circles */
/* global Email */

Meteor.methods( {
  /**
   * Validate email and circleId.  Send an email invite.
   *
   * TODO rate limiting
   *
   * @param String email
   * @param String circleId
   */
  invite : function ( email, circleId ) {
    'use strict';

    check( email, String )
    check( circleId, String )

    email = email.toLowerCase()

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to invite users.' )
    }

    var circle = Circles.findOne( {
      _id : circleId
    } )

    Circles.update( circleId, {
      $addToSet : {
        users : {
          email : email
        }
      }
    }, {
      validate: false,
      getAutoValues: false
    } )

    var url = Meteor.absoluteUrl( 'circles/' + circle.slug )

    // send email
    Email.send( {
      from : Circles.emailTemplate.from,
      to : email,
      subject : Circles.emailTemplate.inviteEmail.subject( email ),
      text : Circles.emailTemplate.inviteEmail.text( email, url )
    } )

    return true
  },
  uninvite : function ( email, circleId ) {
    'use strict';

    check( email, String )
    check( circleId, String )

    email = email.toLowerCase()

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to invite users.' )
    }

    var circle = Circles.findOne( {
      _id : circleId
    } )

    if ( circle.ownerId !== this.userId ) {
      throw new Meteor.Error( 'not-your-circle', 'You cannot uninvite users from circles you don\'t own.' )
    }

    Circles.update( circleId, {
      $pull : {
        users : {
          email : email
        }
      }
    }, {
      validate: false,
      getAutoValues: false
    })

    return true
  }
})
