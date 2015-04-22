Template.gravatarBadge.helpers( {
  gravatar : function () {
    // `this` comes in as a String Object,
    // not a primitive string
    return Gravatar.imageUrlFromEmail(
      this.toString(),
      {
        secure : true
      }
    );
  }
} )