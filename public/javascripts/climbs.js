jQuery(document).ready(function() {

	$('#show-climbs').click(function() {
		$('#route_actions a.selected').removeClass('selected');
		$('#show-climbs').addClass('selected');
		$('#comments-container').hide();
		$('#workouts-container').hide();

		if($('#climbs-container').is(":visible")) {
			$('#climbs-container').slideUp("slow");
			$('#route_actions a.selected').removeClass('selected');
			$("#elevation-chart").slideUp();
		} else {
			$('#climbs-container').slideDown('slow');
		
			// pokaz wykres i obicz elevation 

			if(!$('#elevation-chart').is(":visible")) {
			

				$("#elevation-chart").slideDown();
				$("#elevation-chart").width(mapWidth - 1);

				// redukcja tablicy do 190 elementow 
				if (path.length > 190) {
					var reucedPath = new google.maps.MVCArray();
					reucedPath = path;
					var ca = 0;
					while (reucedPath.length > 190) {
						 reucedPath = reductionPath(reucedPath);
					}
					console.log("Do wywalenia: "+  (path.length - 190));
					// console.log("Nowa: " + reucedPath);
					// console.log("Stara: " + path);
					console.log(reucedPath.length);
				}

				// wywolanie funkcji do stworzenia profilu wysokosciowego
				if(reucedPath) {
					createElevation(reucedPath);
					console.log("reduced");
				} else {
					createElevation(path);
				}
			}
		}







		return false;

	});
});
