jQuery(document).ready(function() {
	$('.routes-index-table th.ajax a, .routes-index-table .pagination a').live('click', function() {

		$.getScript(this.href);
		return false;
	});
	$('#search-route').submit(function() {
		$.get(this.action, $(this).serialize(), null, "script");
		return false;
	});

	// wersja z keyup
	// $('#search-route input').keyup(function() {
	// 	$.get($('#search-route').attr("action"), $('#search-route').serialize(), null, "script");
	// 	return false;
	// });
});
