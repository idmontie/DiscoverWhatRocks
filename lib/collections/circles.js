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
  dateCreated: {
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
      var toSlugify = this.field('name').value;

      // user id + name + now + rand
      toSlugify  = toSlugify + '-';
      toSlugify += this.userId;
      toSlugify += Date.now();
      toSlugify += parseInt( Math.random() * 10, 10 );

      if ( this.isInsert ) {
        return slugify( toSlugify );
      } else if (this.isUpsert) {
        return { $setOnInsert: toSlugify };
      } else {
        this.unset();
      }
    }
  },
  ownerId : {
    type: String,
    autoValue: function () {
      'use strict';

      return this.userId
    }
  },
  name: {
    type: String,
    label: 'Name Your Circle',
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
  'users.$.userId': {
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
          ownerId : this.userId
        },
        {
          'users.$.userId' : this.userId
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
