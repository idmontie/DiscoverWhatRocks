
/* global Meetups */

Meteor.methods( {
  getRealMeetupSlug : function ( id ) {
    'use strict';

    var newMeetup = Meetups.findOne( {
      _id : id
    } )

    return newMeetup.slug
  }
} );
