/**
 * Circles
 *
 * Mongo Collection and Schema
 */

// Metoer package Simple Schema
/* global SimpleSchema */

/* global slugify */
/* global Circles */
/* global Schema */

this.Circles = new Mongo.Collection( 'circles' );

Schema.circles = new SimpleSchema( {
  date_created: {
    type: String,
    autoValue: function () {
      'use strict';

      return Date.now() + ''
    }
  },
  slug: {
    type: String,
    autoValue: function () {
      'use strict';

      var to_slugify = this.field('name').value;

      // user id + name + now + rand
      to_slugify  = to_slugify + '-';
      to_slugify += this.userId;
      to_slugify += Date.now();
      to_slugify += parseInt( Math.random() * 10, 10 );

      return slugify( to_slugify );
    }
  },
  owner_id : {
    type: String,
    autoValue: function () {
      'use strict';

      return this.userId
    }
  },
  name: {
    type: String,
    label: "Name Your Circle",
    max: 200
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
  }
} ) 

Circles.attachSchema( Schema.circles );

Circles.allow({
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
  Meteor.publish( 'circles', function () {
    'use strict';

    return Circles.find( {
      $or : [
        {
          owner_id : this.userId
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