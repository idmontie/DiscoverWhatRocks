Circles = new Mongo.Collection( 'circles' );

Circles.attachSchema( new SimpleSchema( {
  slug: {
    type: String,
    autoValue: function () {
      // TODO
      return  '';
    }
  },
  owner_id : {
    type: String,
    autoValue: function () {
      return this.userId;
    }
  },
  name: {
    type: String,
    label: "Name",
    max: 200
  },
  users: {
    type: Array,
    label: 'User Emails',
    optional: true
  },
  'users.$': {
    type: Object,
    label: 'User Email'
  },
  'users.$.email': {
    type: String
  },
} ) );

Circles.allow({
  insert: function () {
    return true;
  }
})


// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'circles', function () {
    'use strict';
    return Circles.find( {
      owner_id: this.userId
    } )
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'circles' );
}