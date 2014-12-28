/**
 * Friends Form Template Helper
 */

Template.friendsForm.helpers( {
  
} );

Template.friendsForm.events( {
  'submit #friendsAddForm' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    // TODO validate

    var email = $( '#friendsAddForm' ).find( '[name=email]' ).val()

    Meteor.call( 'invite', email, this._id, function () {
      // TODO Tell the user whether they were successful or not
    } )

    // Reset form
    $( '#friendsAddForm' )[0].reset()
  }
} );