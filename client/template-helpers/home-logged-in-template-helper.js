/**
 * Home Logged In Template Helper
 *
 * Template helper for the home logged in template
 */

/* global Circles */

Template.homeLoggedIn.helpers({
  circles : function () {
    'use strict';

    return Circles.find( {
      ownerId : Meteor.userId()
    }, {
      sort: {
        dateCreated: -1
      }
    } )
  },
  noCircles : function () {
    'use strict';

    return Circles.find( {
      ownerId : Meteor.userId()
    } ).fetch().length === 0
  },
  friendsCircles : function () {
    'use strict';

    return Circles.find( {
      'users.$.userId' : Meteor.userId()
    }, {
      sort: {
        dateCreated: -1
      }
    } )
  },
  noFriendsCircles : function () {
    'use strict';

    return Circles.find( {
      'users.$.userId' : Meteor.userId()
    } ).fetch().length === 0
  }
});
