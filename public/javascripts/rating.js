jQuery(document).ready(function() {

	// ustalanie ikonek dla wartosci z bazy
	var value = $('#route_rating_value').val();
	update_rating(value, '#rating li a');
	var route_id = $('#route_id').val();


	$('#rating li a').mouseover(function() {
		var hoverVal = $(this).html();
		$('#rating li a:lt(' + hoverVal + ')').addClass('select');
	});
	$('#rating li a').mouseout(function() {
		var hoverVal = $(this).html();
		$('#rating li a:lt(' + hoverVal + ')').removeClass('select');
	});
		
	$('#rating li a').click(function() {
		var selectVal = $('#user_rating_value').val();
		$('#rating li a:lt(' + selectVal + ')').addClass('select');
		
		var rating_value = parseFloat($(this).html());

		 $.post('/add_rating', {route_id : route_id, value : rating_value }, function(avg_rating) {
		 	update_rating(avg_rating, '#rating li a');
	
		 });
		return false;
	});

	// zaznaczenie gwiazdeg gdy user wczesniej glosowal
	if($('#user_rating_value')) {
		var selectVal = $('#user_rating_value').val();
		$('#rating li a:lt(' + selectVal + ')').addClass('select');
	}


	if($('#user_rating_like').val() == "true") {
		$('#add-favorite span').html("Usuń z ulubionych");
	}

	var like = $('#user_rating_like').val();
	$('#add-favorite a').click(function() {
		like = $('#user_rating_like').val();
		if(like) { // jesli jest true 
			like = null;
			$('#add-favorite span').html("Dodaj do ulubionych");
		} else {
			like = true;
			$('#add-favorite span').html("Usuń z ulubionych");
		}
		console.log(like);
		$('#user_rating_like').val(like);
		$.post('/add_like', {route_id : route_id, like : like }, function(data) {
		});
		return false;
	});


	//index oceny

	// for(var i = 0; i < $('td.rating').length; i++) {
	// 	value = 

	// 	update_rating(value, 'ul.rating li');
	// 	var z = $('ul.rating')[i];
	// 	console.log($(z).html());
	// }


	// var ul = $($('.rating').children());
	// value = ul.children().first().html();
	// update_rating(value, '.rating li');
	$('ul.rating').each(function(i) {
		z = $('ul.rating')[i];
		value = $(z).children().first().html();
		if(parseFloat(value) > 4.75) {
			$(z).children().each(function(index) {
				$(this).addClass('full-fill');
			});
		} else if(parseFloat(value) > 4.25) {
			$(z).children().each(function(index) {
				if(index < 5) {
					$(this).addClass('full-fill');
				} else if (index == 5) {
					$(this).addClass('half-fill');
				}
			});
		} else if(parseFloat(value) > 3.75) {
			$(z).children().each(function(index) {
				if(index < 5) {
					$(this).addClass('full-fill');
				}
			});
		} else if(parseFloat(value) > 3.25) {
			$(z).children().each(function(index) {
				if(index < 4) {
					$(this).addClass('full-fill');
				} else if (index == 4) {
					$(this).addClass('half-fill');
				}
			});
		} else if(parseFloat(value) > 2.75) {
			$(z).children().each(function(index) {
				if(index < 4) {
					$(this).addClass('full-fill');
				}
			});
		} else if(parseFloat(value) > 2.25) {
			$(z).children().each(function(index) {
				if(index < 3) {
					$(this).addClass('full-fill');
				} else if (index == 3) {
					$(this).addClass('half-fill');
				}
			});
		} else if(parseFloat(value) > 1.75) {
			$(z).children().each(function(index) {
				if(index < 3) {
					$(this).addClass('full-fill');
				}
			});
		} else if(parseFloat(value) > 1.25) {
			$(z).children().each(function(index) {
				if(index < 2) {
					$(this).addClass('full-fill');
				} else if (index == 2) {
					$(this).addClass('half-fill');
				}
			});
		} else if(parseFloat(value) > 0.75) {
			$(z).children().each(function(index) {
				if(index < 2) {
					$(this).addClass('full-fill');
				}
			});
		}


	});





});

// aktualizacja gwiazdek
function update_rating(value, target) {

	$(target).removeClass('full-fill');
	$(target).removeClass('half-fill');
	if(value > 4.75) {
		$(target +':lt(5)').addClass('full-fill');
	} else if(value > 4.25) {
		$(target + ':lt(4)').addClass('full-fill');
		$(target + '.5').addClass('half-fill');
	} else if(value > 3.75) {
		$(target + ':lt(4)').addClass('full-fill');
	} else if(value > 3.25) {
		$(target + ':lt(3)').addClass('full-fill');
		$(target + '.4').addClass('half-fill');
	} else if(value > 2.75) {
		$(target + ':lt(3)').addClass('full-fill');
	} else if(value > 2.25) {
		$(target + ':lt(2)').addClass('full-fill');
		$(target + '.3').addClass('half-fill');
	} else if(value > 1.75) {
		$(target + ':lt(2)').addClass('full-fill');
	} else if(value > 1.25) {
		$(target + ':lt(1)').addClass('full-fill');
		$(target + '.2').addClass('half-fill');
	} else if(value > 0.75) {
		$(target + '.1').addClass('full-fill');
	}
}
