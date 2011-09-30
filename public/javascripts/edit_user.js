jQuery(document).ready(function() {
	$('#avatar_actions_update').bind('click', function() {
		if($('#avatar_form').is(':visible')) {
			$('#avatar_form').slideUp("slow");
		} else {
			$('#avatar_form').slideDown('slow');
		}
		return false;
	});
});
