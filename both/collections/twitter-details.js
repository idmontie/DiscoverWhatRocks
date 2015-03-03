// ====================================== 
// Twitter Details Collection
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
this.TwitterDetails = new Mongo.Collection( 'twitter_details' );

// =================
// Schema Definition
// =================
Schema.twitterDetails = new SimpleSchema( {
  dateCreated : {
    type : Number,
    autoValue : function () {
      if ( this.isInsert ) {
        return Date.now();
      } else if ( this.isUpsert ) {
        return { $setOnInsert: ( Date.now() ) }
      } else {
        this.unset();
      }
    }
  },
  dateUpdated : {
    type : Number,
    autoValue : function () {
      return Date.now();
    }
  },
  twitterId : {
    type : String
  },
  friend : {
    type : Object
  },
  'friend.id' : {
    type : Number
  },
  'friend.profile_background_color' : {
    type : String
  },
  'friend.profile_background_image_url' : {
    type : String
  },
  'friend.profile_background_image_url_https' : {
    type : String
  },
  'friend.profile_background_tile' : {
    type : String
  },
  'friend.profile_banner_url' : {
    type : String
  },
  'friend.profile_image_url' : {
    type : String
  },
  'friend.profile_image_url_https' : {
    type : String
  },
  'friend.profile_link_color' : {
    type : String
  },
  'friend.profile_sidebar_border_color' : {
    type : String
  },
  'friend.profile_sidebar_fill_color' : {
    type : String
  },
  'friend.profile_text_color' : {
    type : String
  },
  'friend.name' : {
    type : String
  },
  'friend.screen_name' : {
    type : String
  },
  'friend.time_zone' : {
    type : String
  },
  'friend.url' : {
    type : String
  }
} );

this.TwitterDetails.attachSchema( Schema.twitterDetails );

this.TwitterDetails.allow( {} );