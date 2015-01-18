// ===================================
// hold-to-delete.jquery.js
// ===================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===================================
// Add Hold to Delete functionality
// TODO handle touches
// TODO make a seperate repo!

/*
 * Example
 * ```html
 * <button data-bind="#data-progress" class="button hold-to-delete">Hold me!
 * </button>
 * <div id="data-progress"></div>
 * ```
 *
 * ```js
 * $('.hold-to-delete').holdToDelete({
 *   cleanup : function (options) {
 *     $($(this).attr('data-bind')).width(0)
 *   },
 *   increment : function (count) {
 *     $($(this).attr('data-bind')).width(count+'%')
 *   }
 * }).on('htd.success', function () { console.log('wow') })
 * ```
 *
 * ```css
 * #data-progress {
 *   background-color: red;
 *   height: 5px;
 *   width: 0;
 * }
 * ```
 */

+function ($) {
  'use strict';

  // HOLD TO DELETE PUBLIC CLASS DEFINITION
  // ======================================

  var HoldToDelete = function (element, options) {
    options = $.extend({}, HoldToDelete.DEFAULTS, options)

    var $this = $(element)

    var triggerLeave = function (success) {
      clearInterval( $this.data('htd.interval'))
      options.cleanup.call($this)

      if (success !== true) {
        options.cancel.call($this)
      }
    }

    var triggerSuccess = function () {
      $this.trigger('htdsuccess')
      options.success.call($this)
    }

    var attach = function () {
      var count = 0

      $this.data('htd.interval', setInterval(function () {
        count++
        options.increment.call($this, count)

        if (count > 100) {
          count = 0
          triggerLeave()
          triggerSuccess(true)
        }

      }, options.speed))
    }

    $this.mousedown(function(e) {
      e.preventDefault()
      if (e.which != 1) {
        // not a left click
        return
      }
      attach()
    })
    $this.focusout( triggerLeave )
         .mouseleave( triggerLeave )
         .mouseout( triggerLeave )
         .mouseup( triggerLeave )
    // accessibility fallback
    $this.keydown(function(e) {
      if (e.keyCode == 13) {
        // enter key
        if (options.accessibilityConfirm.call($this)) {
          triggerSuccess()
        } else {
          triggerLeave()
        }
      }
    })
  }

  HoldToDelete.VERSION = '0.0.1'

  HoldToDelete.DEFAULTS = {
    success: function () { $.noop() },
    cancel : function () { $.noop() },
    cleanup : function () { $.noop() },
    increment : function (count) { $.noop(count) },
    accessibilityConfirm : function() {
      if (confirm('Are you sure?')) {
        return true
      }
      return false
    },
    // TODO "slow", "fast"
    speed : 7
  }

  // NOTE: HOLD TO DELTE DOES NOT EXTEND
  // ===================================

  HoldToDelete.prototype = {}

  HoldToDelete.prototype.constructor = HoldToDelete

  HoldToDelete.prototype.getDefaults = function () {
    return HoldToDelete.DEFAULTS
  }

  // HOLD TO DELETE PLUGIN DEFINITION
  // ================================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('htd.holdToDelete')
      var options = typeof option ==  'object' && option

      if (!data && option == 'destroy') {
        return
      } else {
        if (!option) {
          option = HoldToDelete.prototype.getDefaults()
        }

        if (!data) {
          $this.data('htd.holdToDelete', (data = new HoldToDelete(this, options)))
        }
      }

      if (typeof option == 'string') {
        data[option]()
      }
    })
  }

  var old = $.fn.holdToDelete

  $.fn.holdToDelete             = Plugin
  $.fn.holdToDelete.Constructor = HoldToDelete

  // HOLD TO DELETE NO CONFLICT
  // ==========================

  $.fn.holdToDelete.noConflict = function () {
    $.fn.holdToDelete = old
    return this
  }

}(jQuery);