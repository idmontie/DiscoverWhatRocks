
Meteor.methods( {
  getRealMeetupSlug : function ( id ) {
    var newMeetup = Meetups.findOne( {
      _id : id
    } )

    return newMeetup.slug
  }
} )