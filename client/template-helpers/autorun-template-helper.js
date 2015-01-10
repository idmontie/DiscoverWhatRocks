// ==========================
// autorun-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Autorun Session helpers

+function () {
  'use strict';

  Meteor.autorun( function () {
    Session.set( 'meteorLoggedIn', ! ! Meteor.user() )
  } )
}();

