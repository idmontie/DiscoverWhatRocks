// ======================================
// Meetups Collection
//
// Mongo Collection and Schema definition
// ======================================

// ============
// Lint Globals
// ============
/* global SimpleSchema */
/* global slugify */
/* global Schema */

// =====================
// Collection Definition
// =====================
this.Meetups = new Mongo.Collection( 'meetups' );

// =================
// Schema Definition
// =================
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
  pinged : {
    type : Boolean,
    optional : true
  },
  deleted : {
    type : Boolean,
    optional : true
  },
  slug : {
    type : String,
    autoValue : function () {
      var toSlugify = this.field( 'name' ).value;
      var user = Meteor.users.findOne( Meteor.userId() );

      toSlugify += '-' + user.profile.name;
      toSlugify += '-' + this.dayToMeet;
      toSlugify += '-' + parseInt( Math.random() * 10, 10 );

      if ( this.isInsert ) {
        return slugify( toSlugify );
      } else if ( this.isUpsert ) {
        return { $setOnInsert: slugify( toSlugify ) };
      } else {
        this.unset();
      }
    }
  },
  ownerId : {
    type : String,
    autoValue : function () {
      if ( this.isInsert ) {
        return Meteor.userId();
      } else if ( this.isUpsert ) {
        return { $setOnInsert: Meteor.userId() };
      } else {
        this.unset();
      }
    }
  },
  name : {
    type: String
  },
  placeTypeSlug : {
    type : String
  },
  dayToMeet : {
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
    type: Number
  },
  'votes' : {
    type : Array,
    optional : true
  },
  'votes.$' : {
    type : Object,
    optional : true
  },
  'votes.$.latitude' : {
    type : String
  },
  'votes.$.longitude' : {
    type : String
  },
  'votes.$.userId' : {
    type : String
  },
  'votes.$.placeDetails' : {
    type : Object
  },
  'votes.$.placeDetails.name' : {
    type : String
  },
  'votes.$.placeDetails.place_id' : {
    type : String
  },
  'votes.$.placeDetails.vicinity' : {
    type : String
  },
  'twitterInvites' : {
    type : Array,
    optional : true
  },
  'twitterInvites.$' : {
    type : Object,
    optional : true
  },
  'twitterInvites.$.id' : {
    type : Number
  },
  'twitterInvites.$.profile_background_color' : {
    type : String
  },
  'twitterInvites.$.profile_background_image_url' : {
    type : String
  },
  'twitterInvites.$.profile_background_image_url_https' : {
    type : String
  },
  'twitterInvites.$.profile_background_tile' : {
    type : String
  },
  'twitterInvites.$.profile_image_url' : {
    type : String
  },
  'twitterInvites.$.profile_image_url_https' : {
    type : String
  },
  'twitterInvites.$.profile_link_color' : {
    type : String
  },
  'twitterInvites.$.profile_sidebar_border_color' : {
    type : String
  },
  'twitterInvites.$.profile_sidebar_fill_color' : {
    type : String
  },
  'twitterInvites.$.profile_text_color' : {
    type : String
  },
  'twitterInvites.$.screen_name' : {
    type : String
  },
  'twitterInvites.$.name' : {
    type : String
  }
} );

this.Meetups.attachSchema( Schema.meetups );

this.Meetups.allow( {
  // TODO
} )

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'meetups', function ( slug ) {
    var search = {
      // TODO or is invited meetup
      ownerId : this.userId
    };

    if ( slug ) {
      search.slug = slug
    }

    return Meetups.find( search )
  } )
}

