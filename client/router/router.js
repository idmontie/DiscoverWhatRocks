/**
 * Router File
 * Contains routes
 */

Router.configure({
  layoutTemplate: 'application-layout'
});

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

Router.route('/circles/hangout/add/:slug', function () {
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

Router.route('/circles/hangout/update/:slug', function () {
  'use strict';
  this.render('meetups-update-form');
}, {
  name : 'meetups-update-form'
});

Router.route('/circles/hangout/:slug', function () {
  'use strict';

  var meetup = Meetups.findOne( {
    slug : this.params.slug
  } );

  this.render('meetup', {
    data : meetup
  } );
}, {
  name : 'meetup'
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
    circle_id : circle._id
  } );

  console.log( meetups );

  this.render('circle', {
    data : {
      circle: circle,
      meetups : meetups
    }
  });
}, {
  name : 'circle'
});


