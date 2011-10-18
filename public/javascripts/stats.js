jQuery(document).ready(function() {

	var offset = 0;
	var period = "";

	$('#stats_next_btn').click(function() {
		offset += 1;
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset },
			function(data) {
				$('#script_chart').html(data);
			}
		);
		return false;
	});
	$('#stats_previous_btn').click(function() {
		offset -= 1;
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset },
			function(data) {
				$('#script_chart').html(data);
			}
		);
		return false;
	});
	var user_id = $('#user_id').val();
	if($('#charts_container').length) {
		period = "day";
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset},
			function(data) {
				$('#script_chart').html(data);
			}
		);
	}
	$('#stats_day_btn').click(function() {
		offset = 0;
		period = "day";
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset},
			function(data) {
				$('#script_chart').html(data);
			}
		);
		return false;
	});
	$('#stats_month_btn').click(function() {
		offset = 0;
		period = "month";
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset},
			function(data) {
				$('#script_chart').html(data);
			}
		);
		return false;
	});
	$('#stats_week_btn').click(function() {
		offset = 0;
		period = "week";
		$.post(
			'/show_stats',
			{user_id : user_id, period : period, offset : offset},
			function(data) {
				$('#script_chart').html(data);
			}
		);
		return false;
	});
});
