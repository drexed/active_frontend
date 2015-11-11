$(function() {

  $("input[type=file].file-input").each(function(i,el){
    if (typeof $(this).attr("data-vendor-style") != 'undefined') {
      return;
    };

    var buttonWord = "Browse";
    if (typeof $(this).attr("title") != "undefined") {
      buttonWord = $(this).attr("title");
    };

    var input = $("<div>").append( $(el).eq(0).clone() ).html();

    var view = "btn";
    if (typeof $(this).attr("data-view") != "undefined") {
      view = $(this).attr("data-view");
    };

    var id = 'file-input-' + i
    $(el).replaceWith("<a class='"+view+" file-input' id='"+id+"'>"+buttonWord+input+"</a>");

    var viewChanged = null;
    if (typeof $(this).attr("data-view-changed") != "undefined") {
      viewChanged = $(this).attr("data-view-changed");
    };

    var hash_id = '#' + id
    $(hash_id).change(function(){
      $(hash_id).addClass(viewChanged);
    });

    var cssHtml = "<style>"+
    ".file-input { overflow: hidden; position: relative; cursor: pointer; z-index: 1; }"+
    ".file-input input[type=file], .btn-file input[type=file]:focus, .btn-file input[type=file]:hover { position: absolute; top: 0; left: 0; cursor: pointer; opacity: 0; z-index: 99; outline: 0; }"+
    "</style>";

    $("link[rel=stylesheet]").eq(0).before(cssHtml);

  }).promise().done( function(){

    $(".file-input").mousemove(function(cursor) {
      var input, wrapper, wrapperX, wrapperY, inputWidth, inputHeight, cursorX, cursorY;

      wrapper     = $(this);
      input       = wrapper.find("input");
      wrapperX    = wrapper.offset().left;
      wrapperY    = wrapper.offset().top;
      inputWidth  = input.width();
      inputHeight = input.height();
      cursorX     = cursor.pageX;
      cursorY     = cursor.pageY;
      moveInputX  = cursorX - wrapperX - inputWidth + 20;
      moveInputY  = cursorY- wrapperY - (inputHeight/2);

      input.css({
        left:moveInputX,
        top:moveInputY
      });
    });
  });

});

function formFileGroup() { "use strict";
  $('.form-file-group-input').click();

  $('.form-file-group-input').change(function(){
    $('.form-file-group-text').val($('.form-file-group-input').val());
  });
};