Circles = new Mongo.Collection( 'circles' );

Circles.attachSchema( new SimpleSchema( {
  date_created: {
    type: String,
    autoValue: function () {
      return Date.now()
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
  name: {
    type: String,
    label: "Name Your Circle",
    max: 200,
    //placeholder: "Give your group of friends a name! (Ex: Work Pals)"
  },
  users: {
    type: Array,
    label: 'Add Friends to Your Circle',
    optional: true
  },
  'users.$': {
    type: Object,
    label: 'User Ids'
  },
  'users.$.user_id': {
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
      $or : [
        {
          owner_id: this.userId
        },
        {
          'users.$.user_id' : this.userId
        }
      ]
    } )
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'circles' );
}