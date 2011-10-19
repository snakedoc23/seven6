jQuery(document).ready(function() {

	var offset = 0;
	var period = "";

	// TODO
	// id offset 0 to wylacz previous button

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
		$('#stats_day_btn').addClass('selected');
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
		$('#stats_actions a.selected').removeClass('selected');
		$('#stats_day_btn').addClass('selected');
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
		$('#stats_actions a.selected').removeClass('selected');
		$('#stats_month_btn').addClass('selected');
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
		$('#stats_actions a.selected').removeClass('selected');
		$('#stats_week_btn').addClass('selected');
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
