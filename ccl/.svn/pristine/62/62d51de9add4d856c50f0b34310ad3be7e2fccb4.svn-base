(function( $ ){
  $.fn.waterMark = function( options ) {  
	
	var $input = this;

	$input.val($input.waterMarkText = options.waterMarkText);
	$input.addClass($input.waterMarkClass = options.waterMarkClass);
		
	$input.bind("focus", function () {
		if( $input.hasClass( $input.waterMarkClass ) ){
			$input.val("").removeClass( $input.waterMarkClass );
		}
	}).bind("blur", function () {
		if( $.trim($input.val()) == ""){
			$input.val( $input.waterMarkText ).addClass( $input.waterMarkClass );
		}
	});
  };
})( jQuery );


/*
// HOW TO USE
$(function(){
	var options = {"waterMarkClass": "hint",
				   "waterMarkText" : "type some text"};
	$('#input-id').waterMark( options );
});
*/