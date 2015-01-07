
/* global slugify */

Template.gravatarBadge.helpers( {
  emailAsSlug : function () {
    'use strict';

    return slugify( this.email )
  }
} )
