/**
 * Place Types
 *
 * Mongo Collection and Schema based on Google place types
 *
 * @see https://developers.google.com/places/documentation/supported_types
 */

 /* global Schema */
 /* global SimpleSchema */
 /* global PlaceTypes */

this.PlaceTypes = new Mongo.Collection( 'place_types' );

Schema.placeTypes = new SimpleSchema( {
  slug : {
    type: String
  },
  readibleName : {
    type: String
  }
} )

// ==================
// Publish Properties
// ==================
if ( Meteor.isServer ) {
  Meteor.publish( 'place_types', function () {
    'use strict';

    return PlaceTypes.find();
  } );
}

// =======================
// Subscribe to Properties
// =======================
if ( Meteor.isClient ) {
  Meteor.subscribe( 'place_types' );
}

