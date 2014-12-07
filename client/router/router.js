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

Router.route('/circles/hangout/add', function () {
  'use strict';
  this.render('meetups-add-form');
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
  this.render('meetup');
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

  this.render('circle', {
    data : circle
  });
}, {
  name : 'circle'
});


