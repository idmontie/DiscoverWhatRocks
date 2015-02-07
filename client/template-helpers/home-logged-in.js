Template.homeLoggedIn.helpers( {
  meetups : function () {
    return Meetups.find();
  }
} );