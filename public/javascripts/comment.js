jQuery(document).ready(function() {


	$('#show-comments').click(function() {

		if($('#comments-container').is(":visible")) {
			$('#comments-container').slideUp("slow");
		} else {
			$('#comments-container').slideDown('slow');
			// $(this).css('background', '#caced0');
		}
		
		return false;
	});



	//edit
	$('p.comment-meta a').live('click', function() {
		// $(this).unbind('click');
		// console.log($(this).attr("id"));
		var id_a = $(this).attr("id").split('_');
		var id = id_a[1];
		console.log(id);
		$(this).css('display', 'none');

		var cBody = $(this).parent().parent().children()
		var oldContent = $(cBody[1]).html();
		console.log(oldContent);
		var editForm = "<textarea id='newCommentContent'>"+ oldContent +"</textarea><a href='#' class='editCommentBtn'>Zapisz</a>"
		$(cBody[1]).html(editForm);
		$('.editCommentBtn').live('click', function() {
			$('.editCommentBtn').die();
			var newContent = $('#newCommentContent').val();

			$(cBody[1]).html(newContent);
			
			//postem na serwer newContent id
			$.post(
				'/edit_comment',
				{comment_id : id, content : newContent },
				function(data) {
					console.log(data);
				}
			);

			console.log("zmien id:" +id+" content:" + newContent);

			// przywraca przycisk edit

			$('#edit_'+id).css('display', 'inline');
			return false;
		});

		
		return false;
	});





	var route_id = $('#route_id').val();

	$('#add-comment-btn').click(function() {
		var content = $('#comment_content').val();
		$.post(
			'/create_comment',
			{route_id : route_id, content : content },
			function(data) {
				console.log(data);
				$('#comments-list').append(data);
			}
		);
		return false;
	});
});
