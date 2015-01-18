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

      if ( this.isInsert ) {
        return Date.now() + ''
      } else if (this.isUpsert) {
        return { $setOnInsert: Date.now() + '' };
      } else {
        this.unset();
      }
    }
  },
  slug: {
    type: String,
    autoValue: function () {
      'use strict';
      var toSlugify = this.field('name').value;

      // user id + name + now + rand
      toSlugify  = toSlugify
      toSlugify += '-' + Meteor.user().emails[0].address
      toSlugify += '-' + (new Date()).dateFormat('Y/m/d h:i a')
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
  ownerId : {
    type: String,
    autoValue: function () {
      'use strict';

      if ( this.isInsert ) {
        return Meteor.userId()
      } else if (this.isUpsert) {
        return { $setOnInsert: Meteor.userId() };
      } else {
        this.unset();
      }
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
  Circles.getUserCircles = function ( userId, email ) {
    'use strict';

    // TODO this same logic is in the Meetups code as well
    return Circles.find( {
      $or : [
        {
          ownerId : userId
        },
        {
          users : {
            $elemMatch : {
              email : email
            }
          }
        }
      ]
    } )
  }

  Meteor.publish( 'circles', function () {
    'use strict';

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    if ( user == null ) {
      return null
    }

    return Circles.getUserCircles( this.userId, user.emails[0].address )
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'circles' );
}
