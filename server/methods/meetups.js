Meteor.methods( {
  'meetupInsert' : function ( meetup ) {
    // TODO validate
    console.log( meetup );
    var id = Meetups.insert( meetup );

    var inserted = Meetups.findOne( id );

    return inserted.slug;
  }
} )