Meetups = new Mongo.Collection( 'meetups' );

Schema.meetups = new SimpleSchema( {
  date_created: {
    type : String,
    autoValue: function () {
      return Date.now() + '';
    }
  },
  slug: {
    type: String,
    autoValue: function () {
      var to_slugify = this.field('name').value;

      // user id + name + now + rand
      to_slugify  = to_slugify + '-';
      to_slugify += this.userId + Date.now();
      to_slugify += parseInt( Math.random() * 10 );

      return slugify( to_slugify );
    }
  },
  owner_id : {
    type: String,
    autoValue: function () {
      return this.userId;
    }
  },
  date_to_meet : {
    type: String,
    label: "Date To Meet",
    max: 200
  },
  map_center : {
    type: Object,
    label : "Map Center Point"
  },
  'map_center.latitude' : {
    type: String,
    label : 'Latitude'
  },
  'map_center.longitude' : {
    type: String,
    label: 'Longitude'
  },
  votes : {
    type: Array,
    label: 'Friend Votes',
    optional: true
  },
  'votes.$' : {
    type: Object,
    label : 'Friend Vote'
  },
  'votes.$.latitude' : {
    type: String,
    label: 'Latitude'
  },
  'votes.$.longitude' : {
    type: String,
    label: 'Longitude'
  },
  'votes.$.user_id' : {
    type: String,
    label : 'User Id'
  },
  // TODO not sure what this will look like yet
  'votes.$.place_details' : {
    type: Object,
    label : 'Place Details'
  }
} );

Meetups.attachSchema( Schema.meetups );

Meetups.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  }
});

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'meetups', function () {
    'use strict';
    // TODO pull meetups that belong to 
    // circles that have users that belong to them
    return Meetups.find( {
      owner_id: this.userId
    }, {
      $sort : {
        date_created : -1
      }
    } );
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'meetups' );
}