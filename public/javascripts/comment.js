jQuery(document).ready(function() {

	$('#show-comments').click(function() {
		$('#route_actions a.selected').removeClass('selected');
		$('#show-comments').addClass('selected');
		$('#climbs-container').slideUp();
		$('#workouts-container').slideUp();

		if($('#comments-container').is(":visible")) {
			$('#comments-container').slideUp("slow");
			$('#route_actions a.selected').removeClass('selected');
		} else {
			$('#comments-container').slideDown('slow');
			// $(this).css('background', '#caced0');
		}
		return false;
	});

	//edit
	$('p.comment-meta a.edit_comment').live('click', function() {
		// $(this).unbind('click');
		// console.log($(this).attr("id"));
		var id_a = $(this).attr("id").split('_');
		var id = id_a[1];
		console.log(id);
		$(this).css('display', 'none');

		var cBody = $(this).parent().parent().children()
		var oldContent = $(cBody[1]).html();
		console.log(oldContent);
		var editForm = "<a href='#' class='deleteCommentBtn'>Usuń komentarz</a><textarea id='newCommentContent'>"+ oldContent +"</textarea><a href='#' class='editCommentBtn'>Zapisz</a>"
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

		$('.deleteCommentBtn').live('click', function() {
			$('.editCommentBtn').die();
			var li = $(this).parent().parent().parent().remove();
			$.post(
				'/delete_comment',
				{comment_id : id },
				function(data) {
					console.log(data);
					updateCommentsNum(-1);
				}
			);
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
				$('#comments-list').append(data);
				updateCommentsNum(1);
			}
		);
		$('#comment_content').val("");
		return false;
	});
});

function updateCommentsNum(value) {
	var commentsNum = parseFloat($('#comments-container h3').html().split(" ")[0]);
	console.log(commentsNum);
	$('#comments-container h3').html(commentsNum + value +" "+$('#comments-container h3').html().split(" ")[1]);
	$('#show-comments').html("Komentarze (" + (commentsNum + value) + ")");
};
