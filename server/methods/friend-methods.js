
Meteor.methods( {
  invite : function ( email, circleId ) {
    'use strict';

    check( email, String )
    check ( circleId, String )

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged_in', 'You must be logged in to invite users.' )
    }

    var circle = Circles.find( {
      _id : circleId
    } )

    console.log( circleId, email )

    Circles.update( circleId, {
      $addToSet : {
        users : {
          email : email
        }
      }
    }, {
      validate: false,
      getAutoValues : false
    } )

    var url = Meteor.absoluteUrl( 'circles/' + circle.slug )

    // send email
    Email.send( {
      from : Circles.emailTemplate.from,
      to : email,
      subject : Circles.emailTemplate.inviteEmail.subject( email ),
      text : Circles.emailTemplate.inviteEmail.text( email, url )
    } )

  }
})
