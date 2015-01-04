/**
 * Router File
 * Contains routes for Iron Router configuration
 */

// Code coverage complains about Router not being defined
/* global Router */

/* global Circles */
/* global Meetups */

// ====================
// Global Configuration
// ====================

Router.configure({
  layoutTemplate: 'application-layout'
});

Router.onBeforeAction( function () {
  'use strict';
  if ( ! Meteor.userId() ) {
    this.render( 'home' )
    // TODO when the user logs in, it need to go to the original url
  } else {
    this.next()
  }
}, {
  except: ['home']
} )

// ====
// Home
// ====

Router.route('/', function () {
  'use strict';
  this.render('home');
}, {
  name : 'home'
});

Router.route('/about', function () {
  'use strict';
  this.render('about');
}, {
  name : 'about'
});

// =======
// Meetups
// =======

Router.route('/circles/meetups/add/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } );

  this.render('meetups-add-form', {
    data : circle
  });
}, {
  name : 'meetups-add-form'
});

Router.route('/circles/meetups/update/:slug', function () {
  'use strict';
  this.render('meetups-update-form');
}, {
  name : 'meetups-update-form'
});

Router.route('/circles/meetups/:slug', function () {
  'use strict';

  this.render('meetup', {
    data : function () {
      var circle = null

      var meetup = Meetups.findOne( {
        slug : this.params.slug
      } )

      if ( meetup ) {
        circle = Circles.findOne( {
          _id : meetup.circleId
        } )
      }

      return {
        meetup : meetup,
        circle : circle
      }
    }
  } );
}, {
  name : 'meetup',
  action : function () {
    'use strict';

    if ( this.ready() ) {
      this.render()
    }
  }
});


// =======
// Circles
// =======

Router.route('/circles/add', function () {
  'use strict';

  // Reset the session
  Session.set( 'invited-friends', [] );

  this.render( 'circles-add-form' );
}, {
  name : 'circles-add-form'
});

Router.route('/circles/update/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } );

  // Reset the session
  Session.set( 'invited-friends', [] );

  this.render( 'circles-update-form', {
    data : circle
  } );
}, {
  name : 'circles-update-form'
});


Router.route('/circles/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } );

  var meetups = Meetups.find( {
    circleId : circle._id
  } );

  this.render('circle', {
    data : {
      circle: circle,
      meetups : meetups
    }
  });
}, {
  name : 'circle'
});


// =======
// Friends
// =======
Router.route('/circles/friends/add/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } )

  this.render('friendsForm', {
    data : circle
  } );
}, {
  name : 'friends-form'
} );
