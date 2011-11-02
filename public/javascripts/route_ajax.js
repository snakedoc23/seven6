jQuery(document).ready(function() {
	// $('#routes_filter_btn, .routes-index-table th.ajax a, .routes-index-table .pagination a').live('click', function() {
	// 	$.getScript(this.href);
	// 	return false;
	// });
	// $('#search-route').submit(function() {
	// 	$.get(this.action, $(this).serialize(), null, "script");
	// 	return false;
	// });

	// wersja z keyup
	// $('#search-route input').keyup(function() {
	// 	$.get($('#search-route').attr("action"), $('#search-route').serialize(), null, "script");
	// 	return false;
	// });

	//filters sliders
		//distance
		$('#distance_slider').slider({
			range: true,
			min: 0,
			max: 100,
			values: [0, 100],
			slide: function(event, slider) {
				if(slider.values[1] == 100) {
					$('#distance_range').text(slider.values[0] + ' km - ' + slider.values[1] + '+ km');
				} else {
					$('#distance_range').text(slider.values[0] + ' km - ' + slider.values[1] + ' km');
				}
			}
		});
		if($('#distance_min').val()) {
			$('#distance_slider').slider( "option", "values", [$('#distance_min').val(),$('#distance_max').val()] );
		}
		if($('#distance_slider').slider("values", 1) == '100') {
			$('#distance_range').text($('#distance_slider').slider("values", 0) + ' km - ' + $('#distance_slider').slider("values", 1) + '+ km');
		} else {
			$('#distance_range').text($('#distance_slider').slider("values", 0) + ' km - ' + $('#distance_slider').slider("values", 1) + ' km');
		}

		//altitude
		$('#altitude_slider').slider({
			range: true,
			min: 0,
			max: 400,
			values: [0, 400],
			slide: function(event, slider) {
				if(slider.values[1] == 400) {
					$('#altitude_range').text(slider.values[0] + ' m - ' + slider.values[1] + '+ m');
				} else {
					$('#altitude_range').text(slider.values[0] + ' m - ' + slider.values[1] + ' m');
				}
			}
		});
		if($('#altitude_min').val()) {
			$('#altitude_slider').slider( "option", "values", [$('#altitude_min').val(),$('#altitude_max').val()] );
		}
		if($('#altitude_slider').slider("values", 1) == '400') {
			$('#altitude_range').text($('#altitude_slider').slider("values", 0) + ' m - ' + $('#altitude_slider').slider("values", 1) + '+ m');
		} else {
			$('#altitude_range').text($('#altitude_slider').slider("values", 0) + ' m - ' + $('#altitude_slider').slider("values", 1) + ' m');
		}

		$('#routes_filter_reset').click(function() {
			$('#altitude_slider').slider( "option", "values", [0,400] );
			$('#distance_slider').slider( "option", "values", [0,100] );
			$('#route_road').attr('checked', false);
			return false;
		});

		if($('#road').val() == 1) {
			$('#route_road').attr('checked', true);
		}

		$('#routes_filter_btn').click(function() {
			var href = $(this).attr("href");
			var paramsArray = href.split("?")[1].split("&");
			var newHref = href.split("?")[0] + "?"
			for(var i in paramsArray) {
				if (paramsArray[i].indexOf('distance_max') != -1) {
					newHref += 'distance_max=' + $('#distance_slider').slider("values", 1) + '&';
				} else if(paramsArray[i].indexOf('distance_min') != -1) {
					newHref += 'distance_min=' + $('#distance_slider').slider("values", 0) + '&';
				} else if(paramsArray[i].indexOf('altitude_max') != -1) {
					newHref += 'altitude_max=' + $('#altitude_slider').slider("values", 1) + '&';
				} else if(paramsArray[i].indexOf('altitude_min') != -1) {
					newHref += 'altitude_min=' + $('#altitude_slider').slider("values", 0) + '&';
				} else {
					newHref += paramsArray[i] + '&';
				}
			}
			if($('#route_road').attr('checked')) {
				newHref += 'road=1';
			} else {
				newHref += 'road=0';
			}
			console.log(newHref);
			
			$(this).attr("href", newHref);
		});


});
