Meteor.methods( {
  'resendVerificationEmail' : function () {
    Accounts.sendVerificationEmail( this.userId )
  }
} )