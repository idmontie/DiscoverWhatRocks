/**
 * Auto Run Template Helper
 *
 * Template Helpers that are always added
 */

Meteor.autorun( function () {
  'use strict';

  Session.set( 'meteorLoggedIn', ! ! Meteor.user() );
} );
