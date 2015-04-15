// ==================
// Meetups Collection
// ==================

this.meetups = new Mongo.Collection( 'meetups' );

Schema.meetups = new SimpleSchema( {
  dateCreated : {
    type : String,
    autoValue : function () {
      if ( this.isInsert ) {
        return Date.now() + '';
      } else if ( this.isUpsert ) {
        return { $setOnInsert: ( Date.now() + '' ) }
      } else {
        this.unset();
      }
    }
  },
  dateUpdated : {
    type : String,
    autoValue : function () {
      return Date.now() + '';
    }
  },
  shortcode : {
    type : String
  },
  placeTypeSlug : {
    type : String
  },
  dateToMeet : {
    type : String
  },
  timeToMeet : {
    type : String
  },
  location : {
    type : Object
  },
  'location.latitude' : {
    type : String
  },
  'location.longitude' : {
    type : String
  },
  'location.radius' : {
    type : Number
  },
  'invitees.$.email' : {
    type : String
  },
  'invitees.$.shortcode' : {
    type : String
  },
  'invitees.$.owner' : {
    type : Boolean,
    optional : true
  },
  'invitees.$.vote' : {
    type : Object,
    optional : true
  },
  'invitees.$.vote.latitude' : {
    type : Number
  },
  'invitees.$.vote.longitude' : {
    type : Number
  },
  'invitees.$.vote.placeData' : {
    type : Object,
    optional : true
  }
} );

this.meetups.attachSchema( Schema.meetups );

this.meetups.allow( {
  // TODO
} );

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'meetups', function ( shortcode ) {
    check( shortcode, String );
    // TODO do not return other email shortcodes!

    return meetups.find( {
      shortcode : shortcode
    } );
  } );
}