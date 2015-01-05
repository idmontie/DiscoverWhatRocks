/**
 * Users
 *
 * Mongo Collection and Schema
 */

Meteor.users.deny( {
  update: function () {
    'use strict';

    return true
  }
} )