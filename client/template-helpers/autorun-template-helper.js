/**
 * Auto Run Template Helper
 * 
 * Template Helpers that are always added
 */

Meteor.autorun( function () {
  'use strict';
  Session.set( 'meteor_loggedin', ! ! Meteor.user() );
} );