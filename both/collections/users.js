// ======================================
// User Collection
//
// Mongo Collection and Schema definition
// ======================================

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'twitterUserData', function () {
    return Meteor.users.find( {
      _id : this.userId
    }, {
      fields : {
        'services.twitter.profile_image_url_https' : 1
      }
    } );
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'twitterUserData' );
}