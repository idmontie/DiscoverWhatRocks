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

    return this.meetups.fetch().length === 0
  },
  noFriends : function () {
    'use strict';

    if ( this.circle.users !== null &&
         this.circle.users.length > 0 ) {
      return false
    } else {
      return true
    }
  }
})
