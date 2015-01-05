// ==========================
// Router.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains routes for Iron Router configuration.

// ============
// Lint Globals
// ============
/* global Circles */
/* global Meetups */
/* global Router */
/* global Session */

// ====================
// Global Configuration
// ====================

/**
 * Set a base layout template.
 */
Router.configure( {
  layoutTemplate: 'applicationLayout'
} );

/**
 * If the user is not logged in, show the log in page
 */
Router.onBeforeAction( function () {
  'use strict';

  if ( ! Meteor.userId() ) {
    this.render( 'home' )
  } else {
    this.next()
  }
}, {
  except: ['home', 'about']
} );

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

Router.route( '/circles/meetups/add/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } )

  this.render( 'meetupsAddForm', {
    data : circle
  } )
}, {
  name : 'meetupsAddForm'
} );

Router.route( '/circles/meetups/update/:slug', function () {
  'use strict';
  this.render( 'meetups-update-form' );
}, {
  name : 'meetupsUpdateForm'
} );

Router.route( '/circles/meetups/:slug', function () {
  'use strict';

  this.render( 'meetup', {
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
} );

// =======
// Circles
// =======

Router.route( '/circles/add', function () {
  'use strict';

  this.render( 'circlesAddForm' );
}, {
  name : 'circlesAddForm'
} );

Router.route( '/circles/update/:slug', function () {
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
  name : 'circlesUpdateForm'
} );

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

Router.route( '/circles/friends/add/:slug', function () {
  'use strict';

  var circle = Circles.findOne( {
    slug : this.params.slug
  } )

  this.render( 'friendsForm', {
    data : circle
  } );
}, {
  name : 'friendsForm'
} );
