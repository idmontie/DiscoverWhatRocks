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

    meetups.insert( meetup );

    return {
      shortcode: meetup.shortcode,
      userShortcode : userShortcode
    };
  }
} )