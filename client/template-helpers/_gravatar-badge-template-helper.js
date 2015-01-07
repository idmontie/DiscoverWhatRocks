
Template.gravatarBadge.helpers( {
  emailAsSlug : function () {
    return slugify( this.email.toLowerCase() )
  }
} )