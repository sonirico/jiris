(function ( $ ) {

  var has_max_length = false;

  $.fn.jiris = function (options) {

    var settings = $.extend({}, $.fn.jiris.defaults, options);        
    var that = initialize(this, settings);

    that.on('input', function (e) {
      var position = getCaretCharacterOffsetWithin(that.get(0));

      process(that, settings);

      setCaretPosition(that.get(0), position);
    });        

    return this;
  };

  function debug (obj) {
    if (window.console && window.console.log) {
      window.console.log(JSON.stringify(obj));
    }
  }

  function process (that, settings) {
    var text = that.text().replace(/^\s*/, '');
    var text_length = text.length;
    var sub_elements_arr = [];
    var index = 0;  

    for ( var i = 0, l = settings.segments.length; i < l && text_length > 0; i++ ) {
      var tag = settings.segments[i].tag;
      var className = settings.segments[i].className;
      var len = parseInt(settings.segments[i].len);

      sub_elements_arr.push(
        $('<' + tag + '>').addClass(className).text(text.substr(index, len))
      );

      if ($.fn.jiris.debugMode) {
        debug({
          'index': index,
          'len': len,
          'segment': '<' + text.substr(index, len) + '>'
        });
      } 

      index += len;
      text_length -= len;
    }

    if (text_length > 0) {
      sub_elements_arr.push(
        $('<' + settings.segments[0].tag + '>')
        .text(text.substr(index, text.length))
      )
    }

    that.html(sub_elements_arr);
  }

  // Totally stolen from http://stackoverflow.com/questions/26139475/restore-cursor-position-after-changing-contenteditable

  function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if ("undefined" !== typeof win.getSelection) {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && "Control" !== sel.type) {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  function setCaretPosition(element, offset) {
    var range = document.createRange();
    var sel = window.getSelection();

    //select appropriate node
    var currentNode = null;
    var previousNode = null;

    for (var i = 0; i < element.childNodes.length; i++) {
      //save previous node
      previousNode = currentNode;

      //get current node
      currentNode = element.childNodes[i];
      //if we get span or something else then we should get child node
      while(currentNode.childNodes.length > 0){
        currentNode = currentNode.childNodes[0];
      }

      //calc offset in current node
      if (null !== previousNode) {
        offset -= previousNode.length;
      }
      //check whether current node has enough length
      if (offset <= currentNode.length) {
        break;
      }
    }
    //move caret to specified offset
    if (null !== currentNode) {
      // If the offset were greater than the current node length, we set the offset to the maximum length.
      // This prevents the cursor to be moved to offset 0 if maxlength attribute were set.
      offset = offset <= currentNode.length ? offset : currentNode.length;

      range.setStart(currentNode, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }


  function initialize (that, settings) {
    that.attr('contenteditable', true);

    that.addClass($.fn.jiris.namespace).addClass($.fn.jiris.defaultEditableClass);

    if (parseInt(settings.maxlength) > 0) {
      that.attr('maxlength', parseInt(settings.maxlength));

      has_max_length = true;
    }

    // CSS properties
    that.css('min-width', settings['min-width']);
    that.css('min-height', settings['min-height']);
    that.css('height', settings.height);
    that.css('resize', settings.resize);

    // It may have preloaded content
    if (that.text().length > 0) {
      process(that, settings)
    }

    return that;
  }

  $.fn.jiris.onSegmentChanged = function () {},
  $.fn.jiris.debugMode = false;
  $.fn.jiris.defaultEditableClass = "editable-area";
  $.fn.jiris.namespace = "jiris";
  $.fn.jiris.defaults = {
    'maxlength': 0,
    'min-width': '100%',
    'min-height': "100px",
    'height': "auto",
    'resize': "both",
    'segments': [
      {'len': 11,  'className': $.fn.jiris.namespace + ' jiris-default-1', 'tag': 'span'},
      {'len': 13,  'className': $.fn.jiris.namespace + ' jiris-default-2', 'tag': 'span'},
      {'len': 17,  'className': $.fn.jiris.namespace + ' jiris-default-3', 'tag': 'span'}
    ]
  };

}(jQuery));
