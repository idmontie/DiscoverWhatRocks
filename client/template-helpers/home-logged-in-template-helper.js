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
    'use strict';

    if ( Meteor.user() ) {
      return Circles.find( {
        users : {
          $elemMatch : {
            email : Meteor.user().emails[0].address
          }
        }
      } ).fetch().length === 0
    }

    return true;
  }
});
