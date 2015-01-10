// ==================================
// _gravatar-badge-template-helper.js
// ==================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==================================
// Contains Template Helpers and Events for the Gravatar badges

// ============
// Lint Globals
// ============
/* global slugify */

+function () {
  'use strict';
  
  Template.gravatarBadge.helpers( {
    emailAsSlug : function () {
      return slugify( this.email )
    }
  } )
}();
