/**
 * Friends Form Template Helper
 */

Template.friendsForm.helpers( {
  users : function () {
    'use strict';
    var self = this

    return _.map( this.users, function ( user ) {
      return _.extend( user, {
        circleId : self._id
      })
    })
  }
} );

Template.friendsForm.events( {
  'submit #friendsAddForm' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    // TODO validate

    var email = $( '#friendsAddForm' ).find( '[name=email]' ).val()

    Meteor.call( 'invite', email, this._id, function ( error, result ) {
      // TODO Tell the user whether they were successful or not
    } )

    // Reset form
    $( '#friendsAddForm' )[0].reset()
  },
  'click .resendInvitation' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    Meteor.call( 'invite', this.email, this.circleId, function ( error, result ) {
      // TODO Tell the user whether they were successful or not
    } )
  },
  'click .deleteEmail' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    Meteor.call( 'uninvite', this.email, this.circleId, function () {
      // TODO Tell the user whether they were successful or not
    } )
  }
} );