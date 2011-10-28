
var directionsDisplay;
var directionsService;
var elevator;
var geocoder;
var snap;
var path = new Array();
var markers = [];

//zmienna okresla czy rysowac wykres tak by nie byl generowany gdy go nie widac
var drawChart = 0;

//zmienna okresla czy wysylac form po tworzeniu elevation
var newRoute = 0;

var startMarkerImage;
var finishMarkerImage;
var pointMarkerImage;
var infoBox;



var shadow;

var calculatedMarkers;

var chartMarker;
var polyline
var map;
var route;



var distance = 0;
var max_altitude = 0;
var min_altitude = 0;
var total_climb_up = 0;
var total_climb_down = 0;
var avg_speed = null;


var total_time_sec = 0;

var colors = ["#283A43", "#c84446", "#CACED0"];


var homeMarkers = [];
var homeInfoBoxes =[];


var sMarkerImageHover;
var sMarkerImage;


google.load("visualization", "1", {packages: ["corechart"]});

var mapWidth;

$(document).ready(function(){


	// TODO --> inne okienka dla roznych ajaxow
	$('body').ajaxStart(function () {
        $('#ajax-status').show().text("Ładowanie...");
      });
      $('body').ajaxStop(function () {
        $('#ajax-status').fadeOut();
    });


	mapWidth = $(document).width() - $('#aside').outerWidth();
	$('#map').width($(document).width() - $('#aside').outerWidth());
	// $('#map').height($('#aside').height());
	// $(window).resize(function() {
	// 	$('#map').height($(window).height());
	// });
	$(window).resize(function() {
		$('#map').width($(window).width() - $('#aside').outerWidth());
	});


	$(".flash").click(function(){$(".flash").slideUp('slow')});
	$(".flash").delay(3000).slideUp('slow');


	//pagination -- wyznaczenie szerokosci by wysrodkowac na stronie
	if($('.pagination').length) {
		$('.pagination').width(75+75+(29*($('.pagination').children().length - 2)));
	}


	//ROUTES#NEW


/////////////////////////////////////////////////////////////////////////////////////////
	//Walidacja formularza

	// sprawdzanie poprawności czasu 
	$('#route_time_string').focus(function(){
		$('#route_time_string').keyup(function(){
			var time_string = $('#route_time_string').val();
			var timeRegex = /\d{1,3}\D\d{1,2}\D?\d{0,2}/;
			var timeRegexOk = time_string.match(timeRegex)
			// console.log(timeRegexOk);
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
					// console.log("Trzy");
				} else {
					total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60;
					// console.log("Dwie");
					time_a[2] = "0";
				}
				if(total_time_sec > 0) {
					avg_speed = Math.round(distance * 3600 / total_time_sec * 100) / 100;
					$("p.avg_speed .value").html(avg_speed);
					$("#total-time-show-h").html(time_a[0]);
					$("#total-time-show-m").html(time_a[1]);
					$("#total-time-show-s").html(time_a[2]);
				}


				$('#error-explanation-time').hide();
				$('#route_time_string').css("border-color", "#D5D8D9");
			} else {
				$('#error-explanation-time').show();
				$('#route_time_string').css("border-color", "#C84446");
			}
		});
	});
	//ukrywanie podpowiedzi gdy pole zostaje wyczyszczone
	$('#route_time_string').blur(function(){
		if($('#route_time_string').val() == "") {
			$('#error-explanation-time').hide();
			$('#route_time_string').css("border-color", "#D5D8D9");
		}
	});


	//Poprawność tętna
	$('#route_pulse').blur(function() {
		var pulse = $('#route_pulse').val();
		var pulseRegex = /\d{2,3}\/\d{2,3}/;
		var pulseRegexOk = pulse.match(pulseRegex);
		if(pulse == pulseRegexOk || $('#route_pulse').val() == "") {
			$("#error-explanation-pulse").hide();
			$('#route_pulse').css("border-color", "#D5D8D9");
		} else {
			$("#error-explanation-pulse").show();
			$('#route_pulse').css("border-color", "#C84446");
		}
	});

	//Poprawność prędkość maksymalna
	$('#route_max_speed').blur(function() {
		var max_speed = $('#route_max_speed').val();
		var max_speedRegex = /\d{1,3}.?\d{0,4}/;
		var max_speedRegexOk = max_speed.match(max_speedRegex);
		if((max_speed == max_speedRegexOk || $('#route_max_speed').val() == "") && max_speed < 200) {
			$("#error-explanation-max-speed").hide();
			$('#route_max_speed').css("border-color", "#D5D8D9");
		} else {
			$("#error-explanation-max-speed").show();
			$('#route_max_speed').css("border-color", "#C84446");
		}
	});

///////////////////////////////////////////////////////////////////////


	if($("#map").length) {
		map = initializeMap();
		polyline = new google.maps.Polyline({
			strokeColor: '#c84446',
			strokeOpacity: .8,
			strokeWeight: 5,
			map: map
		});

		snap = 0;
		directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();
		elevator = new google.maps.ElevationService();
		geocoder = new google.maps.Geocoder();


	}
	//geocoding
	$('#search-place').submit(function() {
		var val = $('#search-place-text').val();
		centerMap(val);
		$('#search-place-text').val("");
		return false;
	});


	//pages/home --> zawiera listę ostatnich tras
	if($('#last-routes').length) {
		loadStartMarkers(0, 'added');
	}
	// user_show_page
	if($('#user-last-routes').length) {
		var user_id = $('#user_id').val();
		loadStartMarkers(user_id, 'added');
	}


	//users_page
	$('#last_routes_added_btn').bind('click', function() {
		var user_id = $('#user_id').val();
		loadStartMarkers(user_id, 'added');
		loadLastRoutes("added", user_id);
		$('#last_routes_tabs li a.selected').removeClass('selected');
		$('#last_routes_added_btn').addClass('selected');
		return false;
	});
	$('#last_routes_favorite_btn').bind('click', function() {
		loadStartMarkers(user_id, 'favorite');
		loadLastRoutes("favorite", user_id);
		$('#last_routes_tabs li a.selected').removeClass('selected');
		$('#last_routes_favorite_btn').addClass('selected');
		return false;
	});
	$('#last_routes_following_btn').bind('click', function() {
		loadStartMarkers(user_id, 'following');
		loadLastRoutes("following", user_id);
		$('#last_routes_tabs li a.selected').removeClass('selected');
		$('#last_routes_following_btn').addClass('selected');
		return false;
	});

	
	




	//pages/home i users_page
	if($('.routes-list').length) {

		$('.route-img').live('click', function(){
			// console.log($(this).css("border"));
			if($('.route-img').hasClass("selected")) {
				$('.route-img').removeClass("selected");
			}
			$(this).addClass("selected");

			var id = $(this).parent().attr("id").split("-")[2];
			console.log(id);

			// ładuje trase na mapie i zmienia marker nizej 
			loadRouteToHome(id);


			for(var i = 0; i < homeMarkers.length; i++) {
				homeMarkers[i].setIcon(sMarkerImage);
				if(homeMarkers[i].getTitle() == id) {
					homeMarkers[i].setIcon(sMarkerImageHover);
					homeInfoBoxes[i].open(map, homeMarkers[i]);
				}
			}
		});
		$('.route-img').live('mouseover', function(){
			var id = $(this).parent().attr("id").split("-")[2];
			for(var i = 0; i < homeMarkers.length; i++) {
				homeMarkers[i].setIcon(sMarkerImage);
				if(homeMarkers[i].getTitle() == id) {
					homeMarkers[i].setIcon(sMarkerImageHover);
					homeInfoBoxes[i].open(map, homeMarkers[i]);
				}
			}
		});
		$('.route-img').live('mouseout', function(){
			var id = $(this).parent().attr("id").split("-")[2];
			for(var i = 0; i < homeMarkers.length; i++) {
				homeMarkers[i].setIcon(sMarkerImage);
				if(homeMarkers[i].getTitle() == id) {
					homeMarkers[i].setIcon(sMarkerImage);
					homeInfoBoxes[i].close();
				}
			}
		});
	}

	
	// routes/new -> dodatkowe opcje 
	$('#route-new-extra').hide();
	$('#show-extra').click(function() {
		$('#route-new-extra').slideToggle('slow', function() {
			if($('#show-extra').html() == "Pokaż dodatkowe opcje") {
				$('#show-extra').html("Ukryj dodatkowe opcje");
			} else {
				$('#show-extra').html("Pokaż dodatkowe opcje");
			}
		});
		return false;
		
	});


// SHOW ROUTE

	$('#altitude').click(function(){
		if($('.altitude-extra').is(":visible")) {
			$('.altitude-extra').hide();
			$('#altitude .small-arrow').css("backgroundPosition", "0");
			$('#altitude').css("border-top", "1px solid " + colors[2]);
		} else {
			$('.altitude-extra').show();
			$('#altitude .small-arrow').css("backgroundPosition", "-13px");
			$('#altitude').css("border-top", "1px solid " + colors[0]);
		}

	});



	if($('#load_coordinates').length) {
		drawChart = 1;
		var id = $('#load_coordinates').val();
		// console.log(id)
		$.post('/load_coordinates', {id : id}, function(coordinates) {
			// console.log(coordinates);
			var bounds = pathFromString(coordinates, path);
			map.fitBounds(bounds);
			polyline.setPath(path);


			var startMarkerPos = path[0];
			var finishMarkerPos = path[path.length - 1]
			startMarkerImage = new google.maps.MarkerImage(
				'../images/markers.png',
				new google.maps.Size(15, 27),
				new google.maps.Point(0, 0),
				new google.maps.Point(7.5, 26)
			);
			finishMarkerImage = new google.maps.MarkerImage(
				'../images/markers.png',
				new google.maps.Size(15, 27),
				new google.maps.Point(15, 0),
				new google.maps.Point(7.5, 26)
			);
			var startMarker = new google.maps.Marker({
				position: startMarkerPos,
				map: map,
				title: "Początek trasy",
				icon: startMarkerImage
			});
			var finishMarker = new google.maps.Marker({
				position: finishMarkerPos,
				map: map,
				title: "Koniec trasy",
				icon: finishMarkerImage
			});
			
			console.log(finishMarkerPos);
			//poberz ostati i pierwszy punkt i postaw tam markery do rysowania


			// pokaz wykres
			$("#show-elevation").click(function(){
				if($("#elevation-chart").is(':visible')) {
					$("#elevation-chart").hide();
				} else {
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
				return false;
				// createElevation(path);
				// $("#elevation-chart").css("opacity", ".7");
				// $("#elevation-chart").show(2000, function(){
					
				// });
			});

		});
		
	}
	//KML upload
	$('#upload-file-btn').bind('click', function(){
		if($('#draw-controls').is(':visible')) {
			$('#draw-controls').slideUp('slow');
		}
		if($('#upload-form').is(':visible')) {
			$('#upload-form').slideUp('slow');
		} else {
			$('#upload-form').slideDown('slow');
			//upload tutaj
		}
		return false;
	});


	//load_route_from_$("#route_coordinates_string")
	if($("#route_coordinates_string").val()) {
		var bounds = pathFromString($("#route_coordinates_string").val(), path);
		map.fitBounds(bounds);
		polyline.setPath(path);
		addDistanceToPage(polyline);


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
	
	
	

	//przyciski do rysowania
	$('#draw-controls').hide();
	$('#draw-route-btn').bind('click', function(){
		if($('#upload-form').is(':visible')) {
			$('#upload-form').slideUp('slow');
		}
		if($('#draw-controls').is(':visible')) {
			$('#draw-controls').slideUp('slow');
		} else {
			$('#draw-controls').slideDown('slow');
			if(route == null)
			route = drawRoute(map, polyline);
		}
		
    	return false;
  	});

  	$('#delete-path').bind('click', function(){
		deletePath(path);
		return false;
	});


	$("#snap").click(function(event){
		event.preventDefault();

		if(snap === 0) {
			snap = 1;
			$("#snap").css("color", "#283A43");
			$("#snap").text("Wyłącz przyciąganie");
		} else {
			snap = 0;
			$("#snap").css("color", "#C84446");
			$("#snap").text("Przyciągaj do dróg");
		}
	});



	//wysyłanie nowej trasy
	$("#route_submit").click(function() {

		newRoute = 1;

		if(path.length > 1) {
			// redukcja tablicy do 190 elementow 
			if (path.length > 190) {
				var reucedPath = new google.maps.MVCArray();
				reucedPath = path;
				var ca = 0;
				while (reucedPath.length > 190) {
					 reucedPath = reductionPath(reucedPath);
				}
				// console.log("Do wywalenia: "+  (path.length - 190));
				// console.log(reucedPath.length);
			}

			// wywolanie funkcji do stworzenia profilu wysokosciowego
			if(reucedPath) {
				createElevation(reucedPath);
				// console.log("reduced");
			} else {
				createElevation(path);
			}
		}

		// console.log(stringPath);
		// console.log($("#route_coordinates_string").val());
		return false;
	});
	


	//EDIT ROUTE
		//> walidacje zrobic i automatycznie uzupełniać avg jak w new

	$("#edit-route").click(function() {
		var time_string_edit = $("#route_time_string_edit").val();
			console.log(time_string_edit);
			var time_s = "";
			var time_a = [];
			for(var i = 0; i < time_string_edit.length; i++) {
				var c = time_string_edit.charAt(i);
				if(c.match(/\d/)) {
					time_s += c;
				} else if(c.match(/\s/)) {
					
				} else {
					time_s += ":";
				}
			}
			console.log(time_s);
			time_a = time_s.split(":");
			total_time_sec = 0;
			if(time_a[2] != "" && time_a[2] != null) {
				total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60 + parseFloat(time_a[2]);
			} else {
				total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60;
				time_a[2] = "0";
			}
			
				distance = $("#route_distance").val();
				avg_speed = Math.round(distance * 3600 / total_time_sec * 100) / 100;

		var pulse_edit = $("#route_pulse_edit").val();
		if(pulse_edit == "0/0") {
			pulse_edit = null;
		}
		$("#route_total_time").val(total_time_sec);
		$("#route_pulse").val(pulse_edit);
		$("#route_avg_speed").val(avg_speed);
	});


});

// ładowanie wszystkich tras na mapę
function loadStartMarkers(user_id, route_type) {

	for(var i = 0; i < homeMarkers.length; i++) {
		homeMarkers[i].setMap(null);
	}

	homeInfoBoxes = [];
	homeMarkers = [];
	// zwraca tablice z tablicami dla kazdej trasy [id, start_lat_lng]
	$.ajax({
		type: "POST",
		url: "/start_markers",
		data: {user_id : user_id, route_type: route_type},
		dataType: "json",
		success: function(markers) {
			for(var i = 0; i < markers.length; i++) {
				var title_id = markers[i][0].toString();
				var title_route = markers[i][2].toString();
				var route_distance = markers[i][3].toString();
				var user_name = markers[i][4].toString();
				// console.log(title_id);
				var position = markers[i][1].split(",");
				var lat = parseFloat(position[0]);
				var lng = parseFloat(position[1]);
				var point = new google.maps.LatLng(lat, lng);
				createStartMarker(point, title_id, title_route, route_distance, user_name);

			}
		}
	});
};

function loadLastRoutes(last_route_type, user_id) {
	$.post(
		'/user_last_routes',
		{last_route_type : last_route_type, user_id : user_id},
		function(data) {
			console.log(data);
			$('#last_route_container').html(data);
		}
	);
};

function createStartMarker(pos, title, title_route, route_distance, user_name) {
	sMarkerImage = new google.maps.MarkerImage(
		'../images/markers-home.png',
		new google.maps.Size(32, 47),
		new google.maps.Point(0, 0)
	);
	sMarkerImageHover = new google.maps.MarkerImage(
		'../images/markers-home.png',
		new google.maps.Size(32, 47),
		new google.maps.Point(32, 0)
	);
	var sMarker = new google.maps.Marker({
		position: pos,
		map: map,
		icon: sMarkerImage,
		title: title
	});
	var sMarkerTitle = sMarker.getTitle();



	// INFOBOX
	// http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/examples.html

	var boxContent = document.createElement("div");
	boxContent.id = 'infobox';

	var html = "<h3>"+title_route+"</h3><p>Dystans: <span>"+route_distance+"km</span> Dodał: <span>"+user_name+"</span></p>";
	boxContent.innerHTML = html;
	
	var myOptions = {
		content: boxContent
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
			// background: "url('../images/info_box_close.png') no-repeat"
			opacity: 0.9,
			width: "280px"
		}
		,closeBoxMargin: "10px 2px 2px 2px"
		// ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};

	infoBox = new InfoBox(myOptions);



	homeInfoBoxes.push(infoBox);
	homeMarkers.push(sMarker);

	addListenersToMarker(sMarker, infoBox, sMarkerTitle);

};
function addListenersToMarker(sMarker, infoBox, sMarkerTitle) {
	google.maps.event.addListener(sMarker, "mouseover", function() {
		// sMarker.setIcon(sMarkerImageHover);
		infoBox.open(map, sMarker);
	

	});
	google.maps.event.addListener(sMarker, "mouseout", function() {
		// sMarker.setIcon(sMarkerImage);
		infoBox.close();
	});

	google.maps.event.addListener(sMarker, "click", function() {
		// zmiana ikonek na domyślne
		for(var i = 0; i < homeMarkers.length; i++) {
			homeMarkers[i].setIcon(sMarkerImage);
		}
		sMarker.setIcon(sMarkerImageHover);
		loadRouteToHome(sMarkerTitle);

		// zaznaczenie wybranej trasy na liscie jesli tam jest 
		$('.route-img').removeClass("selected");
		var elements = $('.route-img');
		for(var i = 0; i < elements.length; i++) {
			var el = elements[i];
			var id = $(el).parent().attr("id").split("-")[2];
			if(id == sMarkerTitle) {
				$('#route-home-'+ id +' > .route-img').addClass("selected");
			}
		}
		infoBox.open(map, sMarker);
		google.maps.event.addListener(this, "click", function() {
			var tTitle = sMarker.getTitle();
			window.location = '/routes/'+tTitle;
		});
	});


};


function loadRouteToHome(id) {
	var id_r = parseFloat(id);
	path = [];
	polyline.setPath(path);
	$.post('/load_coordinates', {id : id_r}, function(coordinates) {
		var bounds = pathFromString(coordinates, path);
		map.fitBounds(bounds);
		polyline.setPath(path);
	});
	google.maps.event.addListener(map, "click", function() {
		path = [];
		polyline.setPath(path);
	});

};


// przerabia path (polyline.getPath()) na string (do bazy)
function pathToString(pathToS) {
	pathToS = route.getPath();
	var pathString = "";
	for(var i = 0; i < pathToS.b.length; i++){
		// var lat = pathToS.getAt(i).lat();
		// var lng = pathToS.getAt(i).lng();
		
		var tmpString = pathToS.getAt(i).toUrlValue()

		// pathToS.b[i]["Ma"];
		// pathToS.b[i]["Na"];
		// var tmpString = lat + "x" + lng;
		if(i < pathToS.b.length -1) {
			tmpString += "|"
		}
		pathString += tmpString;
	}
	return pathString;
}

// przerabia stringa z bazy na path dla google maps API 
function pathFromString(string, pathT) {
	var bounds = new google.maps.LatLngBounds();
	var p = string.split("|");
		for(var i = 0; i < p.length; i++) {
			var pointS = p[i].split(",");
			var lat = parseFloat(pointS[0]);
			var lng = parseFloat(pointS[1]);
			var point = new google.maps.LatLng(lat, lng);
			pathT.push(point);
			bounds.extend(point);
		}
	return bounds;
};


function initializeMap(){
	var map = new google.maps.Map(document.getElementById("map"), {
	   	zoom: 13,
	    center: new google.maps.LatLng(50.263888, 19.029007),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	return map;
}

function drawRoute(map, polyline){
	shadow = new google.maps.MarkerImage(
		'../images/shadow.png',
		null,
		null,
		new google.maps.Point(8, 2)
	);
	startMarkerImage = new google.maps.MarkerImage(
		'../images/markers.png',
		new google.maps.Size(15, 27),
		new google.maps.Point(0, 0),
		new google.maps.Point(7.5, 26)
	);
	pointMarkerImage = new google.maps.MarkerImage(
		'../images/markers.png',
		new google.maps.Size(13, 13),
		new google.maps.Point(30, 0),
		new google.maps.Point(6.5, 6.5)
	);
	finishMarkerImage = new google.maps.MarkerImage(
		'../images/markers.png',
		new google.maps.Size(15, 27),
		new google.maps.Point(15, 0),
		new google.maps.Point(7.5, 26)
	);

	// path = polyline.getPath(); nie chodzi elevationService, zamiast tego polyline.setPath(path);

	google.maps.event.addListener(map, 'click', function(event){
		var pos = event.latLng;
		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			draggable: true,
			icon: pointMarkerImage,
			title: 'Kliknij by usunąć lub przesuń'
		});
		if(snap === 1 ) {
			if(markers.length < 1){
				setFirstMarker(marker);
				markers.push(marker);
				path.push(marker.getPosition());
				editMarkerC(marker, polyline);
			} else {
				var start = markers[markers.length - 1].getPosition();
				var end = pos;
				calcRoute(start, end, marker);
				//usuwam ostatni marker
				marker.setMap(null);
				markers.pop;
			}
		} else {
			if(markers.length < 1){
				setFirstMarker(marker);
			}
			markers.push(marker);
			path.push(marker.getPosition());
			editMarker(marker, polyline);
		}
		console.log(polyline.getPath().getLength());
		
		polyline.setPath(path);
		addDistanceToPage(polyline);
		


  });
  	console.log(polyline);
	return polyline;
}


function calcRoute(start, end, marker) {
	var lastPoint;
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
    		//cała magia to linijka nizej
			directionsDisplay.setDirections(result);
      		//directionsDisplay.directions.routes[0] - tablica z punktami do trasy
			// console.log(directionsDisplay.directions.routes[0].overview_path.length);
			//dodaje do sciezki wszystki bez punkty - bez pierwszego
			for(var i = 1; i < directionsDisplay.directions.routes[0].overview_path.length; i++){
				var point = directionsDisplay.directions.routes[0].overview_path[i];
				// markers.push(marker);
	    		path.push(point);
				// markery do tablicy 
	    		var markerR = new google.maps.Marker({
					position: point
			      	// map: map,
			    	// draggable: true
			    });
			    markers.push(markerR);
	    		//liczba dodanych markerów
	    		calculatedMarkers = i;
	    		editMarkerC(markerR, polyline, calculatedMarkers);
	    		// console.log(calculatedMarkers);
			}
			lastPoint = directionsDisplay.directions.routes[0].overview_path[directionsDisplay.directions.routes[0].overview_path.length -1];
			markers[markers.length -1].setMap(map);
			polyline.setPath(path);
			addDistanceToPage(polyline);
			// console.log(lastPoint);
			// marker.setPosition(lastPoint);
			// editMarker(marker, polyline);
      		// console.log(directionsDisplay.directions.routes[0].overview_path[0]);
     		// console.log(path);
      		// console.log(markers.length);
		}
	});
}

function editMarker(marker, polyline) {
	//przesuwanie
	google.maps.event.addListener(marker, 'drag', function(){
		for (var i = 0; i < markers.length; i++) {
			if (markers[i] == marker) {
				polyline.getPath().setAt(i, marker.getPosition());
				break;
			}
		}
		addDistanceToPage(polyline);
	});
	//usuwanie markerów
	google.maps.event.addListener(marker, 'click', function(){
		for (var i = 0; i < markers.length; i++) {
			if (markers[i] == marker) {
				//pierwszy marker
				if(i == 0){
					setFirstMarker(markers[1]);
				}
				marker.setMap(null);
				markers.splice(i, 1);
				polyline.getPath().removeAt(i);
				break;
			}
		}
		addDistanceToPage(polyline);
	});
	setLastMarker();
}


function deletePath() {
	//wczytaj ostatni marker 
	// usun go z tablicy i z mapy
	// usun ostatni punkt ze sciezki
	var num = 0;
	for (var i = 0; i < markers.length; i++) {
		polyline.getPath().pop();
		markers[i].setMap(null);
		console.log("Usuwam: " + i);
		num++;
	};
	markers = [];

	console.log("Usun sciezke z: " + num);
	console.log(markers);
	console.log(polyline.getPath().length);
};



function setFirstMarker(marker) {
	marker.setIcon(startMarkerImage);
	marker.setTitle('Początek trasy');
}

function setLastMarker() {
	//ostatni marker - ikonka
	if(markers.length > 1) {
		if (markers[markers.length - 2].getIcon() == finishMarkerImage) {
		  markers[markers.length - 2].setIcon(pointMarkerImage);
		}
		var lastMarker = markers[markers.length - 1];
		lastMarker.setIcon(finishMarkerImage);
		lastMarker.setTitle('Koniec trasy');
	}
};


function editMarkerC(marker, polyline, num) {
	google.maps.event.addListener(marker, 'click', function(){
		console.log("c");
		console.log(num);
		for (var i = 0; i < markers.length; i++) {
			if (markers[i] == marker) {
				//pierwszy marker
				if(i == 0){
					setFirstMarker(markers[1]);
					console.log("First");
				}
				console.log("usuwanie");
				//marker - klikniety
				// usuwam wszystki od kliknietego do num
				// i - pozycja w markers
				var last = i - num;
				for(var n = i; n > last; n--) {
					markers[n].setMap(null);
					markers.splice(n, 1);
					polyline.getPath().removeAt(n);
				}
			}
		}
		addDistanceToPage(polyline);
	});
	setLastMarker();
};

function calculateDistance(polyline) {
	var polylineLength = polyline.getPath().getLength();
	var polylineDistance = 0;
	for (var i = 0; i < polylineLength - 1; i++) {
		polylineDistance += google.maps.geometry.spherical.computeDistanceBetween(polyline.getPath().getAt(i), polyline.getPath().getAt(i+1));
	};
	return polylineDistance;
}

function addDistanceToPage(polyline) {
	distance = Math.round((calculateDistance(polyline)/1000)*100)/100;
	$('.distance .value').html(distance);

	if(total_time_sec > 1) {
		avg_speed = Math.round(distance * 3600 / total_time_sec * 100) / 100;
		$("p.avg_speed .value").html(avg_speed);
	}
	
}


function reductionPath(originalPath) {
	var pathLength = originalPath.length;
	console.log("Dlugosc tab: "+ pathLength);
	var x = Math.ceil(pathLength / (pathLength - 190)); // wspolczynnik wywalania
	console.log(x);
	reucedPath = [];
	for(var i = 0; i < pathLength ; i++) {
		if((i + 1) % x != 0) { // +1 by zachowac pierwszy element
			reucedPath.push(originalPath[i]);
		}
	}
	return reucedPath;
}


// obliczanie elevations  -- max path: 193 elementy
function createElevation(pathE) {
	var pathRequest = {
		'path': pathE,
		'samples': 512
	}
	// console.log(pathRequest);
  elevator.getElevationAlongPath(pathRequest, plotElevation);

}

// rysowanie profilu wysokosciowego
function plotElevation(results, status) {
	if (status == google.maps.ElevationStatus.OK) {

		var distance = Math.round((calculateDistance(polyline)/1000)*100)/100;
		// console.log(distance);
		// console.log(results.length);

		// wspolczynnik by na vAxis byly kilometry
		var x = distance * 1000 / results.length;

		//nowa trasa --> wysylaie formularza po storzenniu profilu wys. 
		if(newRoute) {
			
			// min i max wysokość
			var min = results[0].elevation;
			var max = results[0].elevation;
			// suma zjazdów i podjazdów
			var sumUp = 0;
			var sumDown = 0;

			var climbUpTable = [];
			for(var i = 0; i < results.length; i++) {
				if( i > 0 ) {
					var current = results[i].elevation - results[i - 1].elevation;
					if( i > 1 ) {
						var previous = results[i - 1].elevation - results[i - 2].elevation;
					}
					if( i < results.length - 1) {
						var next = results[i + 1].elevation - results[i].elevation;
					}
					if( current > 0 ) {
						// podjazd
						if( i == 1 ) {
							climbUpFirst = { "F" : {position : (Math.round(i * x)), elevation : results[i].elevation} };
							climbUpTable.push(climbUpFirst);
						} else if( previous < 0 ) {
							climbUpFirst = { "F" : {position : (Math.round(i * x)), elevation : results[i].elevation} };
							climbUpTable.push(climbUpFirst);
						}
						if( next < 0 || i == results.length - 1) {
							climbUpLast = {position : (Math.round(i * x)), elevation : results[i].elevation };
							climbUpTable[climbUpTable.length - 1]["L"] = climbUpLast;
							console.log(climbUpLast);
						}
					}

				}




				var	el = results[i].elevation;
				if(el < min) {
					min = el;
				} else if(el > max) {
					max = el;
				}
				if(i > 0) {
					var difference = results[i].elevation - results[i - 1].elevation
					// console.log(difference);
					if(difference < 0) {
						sumDown += (difference * -1);
					} else {
						sumUp += difference;
					}
				}
			}
			max_altitude = max;
			min_altitude = min;
			total_climb_up = sumUp;
			total_climb_down = sumDown;

			var climbs_string = "";

			// console.log(climbUpTable);
			for(var i = 0; i < climbUpTable.length; i++) {
				var cu = climbUpTable[i]["L"].elevation - climbUpTable[i]["F"].elevation;
				var dis = climbUpTable[i]["L"].position - climbUpTable[i]["F"].position;
				var grade = cu * 100 / dis;
				if(cu > 30 && dis > 500 && grade > 1) {
					// console.log("Miejsce: " + climbUpTable[i]["F"].position);
					
					console.log("Start: " + climbUpTable[i]["F"].position / 1000 + "; Dystans: " + dis / 1000 + "; Min: " + Math.round(climbUpTable[i]["F"].elevation) + "; Max: " + Math.round(climbUpTable[i]["L"].elevation) + "; Śred: " + Math.round(cu *100 / dis * 10) /10);
					// console.log(cu *100 / dis);
					// console.log(climbUpTable[i]);
					if(climbs_string != "") {
						climbs_string += "|";
					}
					climbs_string += climbUpTable[i]["F"].position + "," + climbUpTable[i]["F"].elevation + "," + climbUpTable[i]["L"].position + "," + climbUpTable[i]["L"].elevation;
				}
			}
			console.log(climbs_string);


			$("#route_climbs_string").val(climbs_string);
			$("#route_distance").val(distance);
			$("#route_max_altitude").val(max_altitude);
			$("#route_min_altitude").val(min_altitude);
			$("#route_total_climb_up").val(total_climb_up);
			$("#route_total_climb_down").val(total_climb_down);
			$("#route_total_time").val(total_time_sec);
			$("#route_avg_speed").val(avg_speed);
			if(!$("#route_coordinates_string").val()) {
				var stringPath = pathToString(path);
				$("#route_coordinates_string").val(stringPath);
			}
			// console.log($("#route_coordinates_string").val());
			//wysylam form

			$('#new_route').submit();
		}

		if(drawChart) {
			

			var data = new google.visualization.DataTable();
			data.addColumn('string', 'D');
			data.addColumn('number', 'Wysokość');
			for(var i = 0; i < results.length; i++) {
				// if(i % 5 == 0) {
					// data.addRow([ (i).toString(), results[i].elevation]);
					data.addRow([ (Math.round(i * x) / 1000).toString() + ' km', Math.round(results[i].elevation * 100)/100]);
				// }
				// data.addRow([ (Math.round(i * x)).toString(), results[i].elevation]);
				
				// else {
				// 	data.addRow([ '', results[i].elevation]);
				// }
			}
			var chart = new google.visualization.AreaChart(document.getElementById('elevation-chart'));
			chart.draw(data, {
				width: mapWidth,
				height: 200,
				legend: 'none',
				colors: ['#283A43'],
				backgroundColor : '#f1f1f1',
				titleY: 'Wysokość (m)',
				titleX: 'Dystans (km)',
				chartArea:{left:50,top:23,width:mapWidth,height:"157"},
				// vAxis: {baselineColor: '#283A43'}
				vAxis: {baselineColor: '#283a43' },
				fontSize: 13,
				fontName: "Helvetica Neue"

			});
			sMarkerImage = new google.maps.MarkerImage(
				'../images/markers-home.png',
				new google.maps.Size(32, 47),
				new google.maps.Point(0, 0)
			);

			// pokazywanie na mapie miejsca z wykresu
			google.visualization.events.addListener(chart, 'onmouseover', function(event) {
				if (chartMarker == null) {
					
					chartMarker = new google.maps.Marker({
						position: results[event.row].location,
						map: map,
						icon: sMarkerImage
					});
				} else {
					chartMarker.setPosition(results[event.row].location);
					// console.log(event.row);
				}
			});
		}
	}
}
//centrowanie mapy przez google maps geocoding service
function centerMap(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			console.log("Geocoding status:" + status);
		} else {
			console.log("Geocoding status:" + status);
		}
	});
}