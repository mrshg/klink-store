
// =============================================================================
// Blur background image
// =============================================================================

$(document).ready(function () {

if ($('.collections-hero').length) {
	var bgImageCollections = $('.collections-hero').find('img').first().attr('src');
	$('#bg').backgroundBlur({
	    imageURL : bgImageCollections,
	    blurAmount : 10
	  });
}
if($('.pack-hero').length){
	var bgImagePack = $('.pack-hero').find('.bg-image').first().attr('src');
		$('#bg').backgroundBlur({
	    imageURL : bgImagePack,
	    blurAmount : 20
	  });
}
if($('.account-hero').length){
	var bgImageAccount = $('.account-hero').find('.bg-image').first().attr('src');
		$('#bg').backgroundBlur({
	    imageURL : bgImageAccount,
	    blurAmount : 40
	  });
}
if ($('.billboard-hero').length){
		var bgImageBillboard = $('.billboard-hero').find('img').first().attr('src');
		$('#bg').backgroundBlur({
	    imageURL : bgImageBillboard,
	    blurAmount : 50
	  });
}


});
