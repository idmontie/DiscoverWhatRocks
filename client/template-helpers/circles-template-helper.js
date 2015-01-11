// ==========================
// circles-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Template Helper and Events for the Circle View

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.circle.helpers( {
    noMeetups : function () {
      if ( this.meetups ) {
        return this.meetups.fetch().length === 0
      } else {
        return true
      }
    },
    noFriends : function () {
      if ( this.circle &&
           this.circle.users &&
           this.circle.users.length > 0 ) {
        return false
      } else {
        return true
      }
    }
  } )
}();
