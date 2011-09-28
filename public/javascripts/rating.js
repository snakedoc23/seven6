jQuery(document).ready(function() {

	// ustalanie ikonek dla wartosci z bazy
	var value = $('#route_rating_value').val();	//obecna ocena
	console.log(value);
	if(value > 4.75) {
		$('#rating li a:lt(5)').addClass('full-fill');
	} else if(value > 4.25) {
		$('#rating li a:lt(4)').addClass('full-fill');
		$('#rating li a.5').addClass('half-fill');
	} else if(value > 3.75) {
		$('#rating li a:lt(4)').addClass('full-fill');
	} else if(value > 3.25) {
		$('#rating li a:lt(3)').addClass('full-fill');
		$('#rating li a.4').addClass('half-fill');
	} else if(value > 2.75) {
		$('#rating li a:lt(3)').addClass('full-fill');
	} else if(value > 2.25) {
		$('#rating li a:lt(2)').addClass('full-fill');
		$('#rating li a.3').addClass('half-fill');
	} else if(value > 1.75) {
		$('#rating li a:lt(2)').addClass('full-fill');
	} else if(value > 1.25) {
		$('#rating li a:lt(1)').addClass('full-fill');
		$('#rating li a.2').addClass('half-fill');
	} else if(value > 0.75) {
		console.log('fdsf');
		$('#rating li a.1').addClass('full-fill');
	}
	////////////////////////////////////////////////


	$('#rating li a').mouseover(function() {
		var hoverVal = $(this).html();
		$('#rating li a:lt(' + hoverVal + ')').addClass('select');
	});
	$('#rating li a').mouseout(function() {
		var hoverVal = $(this).html();
		$('#rating li a:lt(' + hoverVal + ')').removeClass('select');
	});
		
	
	$('#rating li a').click(function() {
		var selectVal = $(this).html();
		$('#rating li a:lt(' + selectVal + ')').addClass('select');
		$('#rating_value').val(selectVal);

		// $.post('/load_coordinates', {id : selectVal}, function(coordinates) {
			
		// });


		$('form.edit_rating').submit();
		$('form.new_rating').submit();
		return false;
		//wywolac licznie avg
	});

	if($('#rating_value')) {
		var selectVal = $('#rating_value').val();
		$('#rating li a:lt(' + selectVal + ')').addClass('select');
	}




});
