// =================================
// home-logged-in-template-helper.js
// =================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// =================================
// Contains Template Helper and Evens for the Home Logged
// In view

// ============
// Lint Globals
// ============
/* global Circles */

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.homeLoggedIn.helpers( {
    circles : function () {
      return Circles.find( {
        ownerId : Meteor.userId()
      }, {
        sort: {
          dateCreated: -1
        }
      } )
    },
    noCircles : function () {
      return Circles.find( {
        ownerId : Meteor.userId()
      } ).fetch().length === 0
    },
    friendsCircles : function () {
      return Circles.find( {
        users : {
          $elemMatch : {
            email : Meteor.user().emails[0].address
          }
        }
      }, {
        sort: {
          dateCreated: -1
        }
      } )
    },
    noFriendsCircles : function () {
      if ( Meteor.user() ) {
        return Circles.find( {
          users : {
            $elemMatch : {
              email : Meteor.user().emails[0].address
            }
          }
        } ).fetch().length === 0
      }

      return true
    }
  } )
}();

