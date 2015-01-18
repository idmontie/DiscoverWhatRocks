// ==================================
// circle-methods.js
// ==================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==================================
// Contains server-side methods for dealing with circle requests
//
// TODO handle throttling

// ============
// Lint Globals
// ============
/* global Circles */
/* global Schema */

+function () {
  'use strict';

  // =======
  // Methods
  // =======
  Meteor.methods( {
    circlesAdd : function ( name ) {
      check( name, String )

      // TODO validation!
      var circle = Schema.circles.clean( {
        name : name
      } )

      var id = Circles.insert( circle )

      var realCircle = Circles.findOne( {
        _id : id
      } )

      return realCircle.slug
    },
    circlesDelete : function ( circleId ) {
      check( circleId, String )

      if ( ! this.userId ) {
        throw new Meteor.Error( 'not-logged-in', 'You must be logged in to delete circles.' )
      }

      var circle = Circles.findOne( {
        _id : circleId
      } )

      if ( this.userId !== circle.ownerId ) {
        throw new Meteor.Error( 'not-owner', 'You must be the owner of this circle to delete it.' )
      }

      Circles.remove( {
        _id : circleId
      } )

      return 'Circle ' + circle.name + ' deleted!'
    }
  } )
}();
