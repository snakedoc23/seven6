jQuery(document).ready(function() {

	$('#show-workouts').click(function() {
		$('#route_actions a.selected').removeClass('selected');
		$('#show-workouts').addClass('selected');
		$('#comments-container').hide();
		$('#climbs-container').hide();

		if($('#workouts-container').is(":visible")) {
			$('#workouts-container').slideUp("slow");
		} else {
			$('#workouts-container').slideDown('slow');
		}


		return false;

	});


	$('#add_workout_btn').click(function(){
		$('#add_workout_btn').hide();
		$('#add-workout').slideDown('slow');
		return false;
	});


	var route_id = $('#route_id').val();
	$('#workout_submit').click(function() {
		var time_string = $("#workout_time_string").val();
		var max_speed = $("#workout_max_speed").val();
		var pulse = $("#workout_pulse").val();
		var pulse = $("#workout_pulse").val();
		var temperature = $("#workout_temperature").val();
		var temperature = $("#workout_temperature").val();
		var description = $("#workout_description").val();
		$.post(
			'/create_workout',
			{
				route_id : route_id,
				time_string : time_string,
				max_speed : max_speed,
				pulse : pulse,
				temperature : temperature,
				description : description
			},
			function(data) {
				console.log(data);
				$('#workouts-list').append(data);
			}
		);
		//TODO
		//wyczysc pola formularza 


		$('#add-workout').hide();
		$('#add_workout_btn').show();
		return false;
	});
});

