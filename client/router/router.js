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