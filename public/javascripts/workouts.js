jQuery(document).ready(function() {

	$('#show-workouts').click(function() {
		$('#route_actions a.selected').removeClass('selected');
		$('#show-workouts').addClass('selected');
		$('#comments-container').hide();
		$('#climbs-container').hide();

		if($('#workouts-container').is(":visible")) {
			$('#workouts-container').slideUp("slow");
			$('#route_actions a.selected').removeClass('selected');
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

	// sprawdzanie poprawności czasu 
	$('#workout_time_string').focus(function(){
		$('#workout_time_string').keyup(function(){
			var time_string = $('#workout_time_string').val();
			var timeRegex = /\d{1,3}\D\d{1,2}\D?\d{0,2}/;
			var timeRegexOk = time_string.match(timeRegex)
			if (timeRegexOk == time_string) {
				var time_s = "";
				var time_a = [];
				for(var i = 0; i < time_string.length; i++) {
					var c = time_string.charAt(i);
					if(c.match(/\d/)) {
						time_s += c;
					} else {
						time_s += ":"
					}
				}
				time_a = time_s.split(":");
				total_time_sec = 0;
				if(time_a[2] != "" && time_a[2] != null) {
					total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60 + parseFloat(time_a[2]);
				} else {
					total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60;
					time_a[2] = "0";
				}
				if(total_time_sec > 0) {
					distance = $('#route_distance').val();
					avg_speed = Math.round(distance * 3600 / total_time_sec * 100) / 100;
					$("#avg_speed_val").html(avg_speed);
					$("#total-time-show-h").html(time_a[0]);
					$("#total-time-show-m").html(time_a[1]);
					$("#total-time-show-s").html(time_a[2]);
				}
				$('#error-explanation-time').hide();
				$('#workout_time_string').css("border-color", "#D5D8D9");
			} else {
				$('#error-explanation-time').show();
				$('#workout_time_string').css("border-color", "#C84446");
			}
		});
	});
	//ukrywanie podpowiedzi gdy pole zostaje wyczyszczone
	$('#workout_time_string').blur(function(){
		if($('#workout_time_string').val() == "") {
			$('#error-explanation-time').hide();
			$('#workout_time_string').css("border-color", "#D5D8D9");
		}
	});

	//Poprawność tętna
	$('#workout_pulse').blur(function() {
		var pulse = $('#workout_pulse').val();
		var pulseRegex = /\d{2,3}\/\d{2,3}/;
		var pulseRegexOk = pulse.match(pulseRegex);
		if(pulse == pulseRegexOk || $('#workout_pulse').val() == "") {
			$("#error-explanation-pulse").hide();
			$('#workout_pulse').css("border-color", "#D5D8D9");
		} else {
			$("#error-explanation-pulse").show();
			$('#workout_pulse').css("border-color", "#C84446");
		}
	});

	//Poprawność prędkość maksymalna
	$('#workout_max_speed').blur(function() {
		var max_speed = $('#workout_max_speed').val();
		var max_speedRegex = /\d{1,3}.?\d{0,4}/;
		var max_speedRegexOk = max_speed.match(max_speedRegex);
		if((max_speed == max_speedRegexOk || $('#workout_max_speed').val() == "") && max_speed < 200) {
			$("#error-explanation-max-speed").hide();
			$('#workout_max_speed').css("border-color", "#D5D8D9");
		} else {
			$("#error-explanation-max-speed").show();
			$('#workout_max_speed').css("border-color", "#C84446");
		}
	});

	//Poprawność temperatury
	$('#workout_temperature').blur(function() {
		var temperature = $('#workout_temperature').val();
		var temperatureRegex = /\d{1,2}.?\d{0,1}/;
		var temperatureRegexOk = temperature.match(temperatureRegex);
		if(temperature == temperatureRegexOk || $('#workout_temperature').val() == "") {
			$("#error-explanation-temperature").hide();
			$('#workout_temperature').css("border-color", "#D5D8D9");
		} else {
			$("#error-explanation-temperature").show();
			$('#workout_temperature').css("border-color", "#C84446");
		}
	});

	// dodawanie przejazdu
	var route_id = $('#route_id').val();
	$('#workout_submit').click(function() {
		var time_string = $("#workout_time_string").val();
		var max_speed = $("#workout_max_speed").val();
		var pulse = $("#workout_pulse").val();
		var temperature = $("#workout_temperature").val();
		var description = $("#workout_description").val();
		$.post(
			'/create_workout', {
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
				updateWorkoutsNum(1);
			}
		);
		$("#workout_time_string").val("");
		$("#workout_max_speed").val("");
		$("#workout_pulse").val("");
		$("#workout_temperature").val("");
		$("#workout_description").val("");


		$('#add-workout').hide();
		$('#add_workout_btn').show();
		return false;
	});

	//edit
	$('p.workout-meta .edit_workout').live('click', function(){
		alert("test ok");
		var id_a = $(this).attr("id").split('_');
		var id = id_a[2];
		console.log(id);
		var test = "32 (32)".split("(")[1].replace(")", "");
		
		return false;
	});
});

function updateWorkoutsNum(value) {
	var workoutsNum = parseFloat($('#workouts-container h3').html().split("(")[1].replace(")", ""));
	console.log(workoutsNum);
	$('#workouts-container h3').html("Przejazdy (" + (value + workoutsNum) + ")");
	$('#show-workouts').html("Przejazdy (" + (value + workoutsNum) + ")");
};

