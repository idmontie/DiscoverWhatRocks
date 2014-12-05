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


Router.route('/circles/add', function () {
  'use strict';
  this.render('circles-form');
}, {
  name : 'circles-form'
});

Router.route('/circles/:slug', function () {
  'use strict';
  this.render('circle');
}, {
  name : 'circle'
});

Router.route('/circles/hangout/add', function () {
  'use strict';
  this.render('meetups-form');
}, {
  name : 'meetups-form'
});

Router.route('/circles/hangout/:slug', function () {
  'use strict';
  this.render('meetup');
}, {
  name : 'meetup'
});