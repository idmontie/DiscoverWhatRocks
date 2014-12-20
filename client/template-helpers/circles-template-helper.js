/**
 * Circles Template Helper
 *
 * Template Helper for the circles view.
 */


// ============
// Circles View
// ============

Template.circle.helpers({
  numberOfFriends : function () {
    'use strict';
    // TODO return number of friends
    return 0
  },
  noMeetups : function () {
    'use strict';

    return this.meetups.fetch().length === 0
  },
  noFriends : function () {
    'use strict';
    // TODO return if friendless
    return true
  }
})
