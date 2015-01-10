/**
 * Circles Template Helper
 *
 * Template Helper for the circles view.
 */


// ============
// Circles View
// ============

Template.circle.helpers({
  noMeetups : function () {
    'use strict';
    if ( this.meetups ) {
      return this.meetups.fetch().length === 0
    } else {
      return true
    }
  },
  noFriends : function () {
    'use strict';

    if ( this.circle &&
         this.circle.users &&
         this.circle.users.length > 0 ) {
      return false
    } else {
      return true
    }
  }
})
