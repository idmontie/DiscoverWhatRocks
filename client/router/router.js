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