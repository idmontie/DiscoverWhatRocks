Meteor.methods( {
  'meetupInsert' : function ( meetup ) {
    // TODO validate

    // generate shortcodes
    meetup.shortcode = ShortId.generate();
    var userShortcode = '';

    for (var i = 0; i < meetup.invitees.length; i++) {
      meetup.invitees[i].shortcode = ShortId.generate();

      if (meetup.invitees[i].owner) {
        userShortcode = meetup.invitees[i].shortcode;
      }
    }

    console.log( meetup );

    meetups.insert( meetup );

    // TODO Send out emails
    for (var i = 0; i < meetup.invitees.length; i++) {
      PrettyEmail.send(
        'call-to-action',
        {
          to: 'myuser@myuser.com',
          subject: 'You got new message',
          heading: 'Your friend sent you a message',
          message: 'Click the button below to read the message',
          buttonText: 'Read message',
          buttonUrl: 'http://mycompany.com/messages/2314'
        }
      );
    }

    return {
      shortcode: meetup.shortcode,
      userShortcode : userShortcode
    };
  },
  'meetupVote': function ( shortcode, update ) {
    // TODO validate

    // check that the shortcode+email+userShortcode combination exists
    var meetup = meetups.findOne( { 
      shortcode : shortcode,
      invitees : { 
        $elemMatch : { 
          email : update.email, 
          shortcode : update.shortcode
        } 
      } 
    } );

    if ( meetup ) {
      // TODO if it does, add the vote data to the object in the database  
    }
  }
} )