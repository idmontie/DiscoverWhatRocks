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

      // TODO this will always change when updated
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
    type: [Object],
    label: 'Add Friends to Your Circle',
    optional: true
  },
  'users.$.email': {
    regEx: SimpleSchema.RegEx.Email,
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

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    return Circles.find( {
      $or : [
        {
          ownerId : this.userId
        },
        {
          'users.$.email' : user.emails[0].address
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
