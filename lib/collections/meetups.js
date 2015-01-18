/**
 * Meetups
 *
 * Mongo Collection and Schema
 */

// Metoer package Simple Schema
/* global SimpleSchema */

/* global slugify */
/* global Meetups */
/* global Schema */
/* global Circles */

this.Meetups = new Mongo.Collection( 'meetups' );

Schema.meetups = new SimpleSchema( {
  dateCreated: {
    type : String,
    autoValue: function () {
      'use strict';

      return Date.now() + '';
    }
  },
  slug: {
    type: String,
    autoValue: function () {
      'use strict';

      var toSlugify = this.field( 'name' ).value;

      // user id + name + now + rand
      toSlugify  = toSlugify
      toSlugify += '-' + Meteor.user().emails[0].address
      toSlugify += '-' + this.dateToMeet
      toSlugify += '-' + parseInt( Math.random() * 10, 10 )

      if ( this.isInsert ) {
        return slugify( toSlugify );
      } else if (this.isUpsert) {
        return { $setOnInsert: toSlugify };
      } else {
        this.unset();
      }
    }
  },
  circleId : {
    type: String
  },
  ownerId : {
    type: String,
    autoValue: function () {
      'use strict';

      return this.userId;
    }
  },
  name : {
    type: String,
    label: 'Name Your Meetup'
  },
  placeTypeSlug : {
    type: String,
    label: 'Type of Meetup'
  },
  dateToMeet : {
    type: String,
    label: 'Date To Meet',
    max: 200
  },
  pinged : {
    type: Boolean,
    label: 'Have Pinged',
    optional: true
  },
  mapCenter : {
    type: Object,
    label : 'Map Center Point'
  },
  'mapCenter.latitude' : {
    type: String,
    label : 'Latitude'
  },
  'mapCenter.longitude' : {
    type: String,
    label: 'Longitude'
  },
  'mapCenter.radius' : {
    type: String,
    label: 'Radius'
  },
  votes : {
    type: Array,
    label: 'Friend Votes'
  },
  'votes.$' : {
    type: Object,
    label : 'Friend Vote',
    optional: true
  },
  'votes.$.latitude' : {
    type: String,
    label: 'Latitude'
  },
  'votes.$.longitude' : {
    type: String,
    label: 'Longitude'
  },
  'votes.$.userId' : {
    type: String,
    label : 'User Id'
  },
  // =============
  // Place Details
  // =============
  'votes.$.placeDetails' : {
    type: Object,
    label: 'Place Details'
  },
  'votes.$.placeDetails.name' : {
    type: String,
    label: 'Name'
  },
  'votes.$.placeDetails.place_id' : {
    type: String,
    label: 'Place Id'
  },
  'votes.$.placeDetails.vicinity' : {
    type: String,
    label: 'Address'
  }
} );

Meetups.attachSchema( Schema.meetups );

Meetups.allow({
  insert: function () {
    'use strict';

    return true
  },
  update: function () {
    'use strict';

    return true
  }
});

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'meetups', function () {
    'use strict';

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    if ( user == null ) {
      return null
    }

    var circles = Circles.getUserCircles( this.userId, user.emails[0].address ).fetch()

    var circleIds = _.map( circles, function ( c ) {
      return c._id
    } )

    return Meetups.find( {
      $or : [{
        circleId : {
          $in : circleIds
        }
      }, {
        ownerId: this.userId
      }]
    }, {
      $sort : {
        dateCreated : -1
      }
    } )
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'meetups' );
}
