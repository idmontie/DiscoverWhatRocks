
this.ReactivityHelper = {
  reliesOn : function () {
    'use strict';

    var switcher = true
    for ( var i = 0; i < arguments.length; i++ ) {
      if ( arguments[i] === null ) {
        switcher == false
        break
      }
    }
    return switcher
  }
}