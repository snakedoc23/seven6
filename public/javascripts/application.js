// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var directionsDisplay;
var directionsService;
var elevator;
var snap;
var path = new Array();
var markers = [];

//zmienna okresla czy rysowac wykres tak by nie byl generowany gdy go nie widac
var drawChart = 0;

var startMarkerImage;
var finishMarkerImage;
var pointMarkerImage;

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

var total_time_sec = 0;

google.load("visualization", "1", {packages: ["corechart"]});

var mapWidth;

$(document).ready(function(){
	mapWidth = $(document).width() - $('#aside').outerWidth();
	$('#map').width($(document).width() - $('#aside').outerWidth());
	$(window).resize(function() {
		$('#map').width($(window).width() - $('#aside').outerWidth());
	});
	
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

	//ROUTES#NEW


	///////////////////////////////////////////////
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
					var avg = Math.round(distance * 3600 / total_time_sec * 100) / 100;
					$("p.avg_speed .value").html(avg);
					$("#total-time-show-h").html(time_a[0]);
					$("#total-time-show-m").html(time_a[1]);
					$("#total-time-show-s").html(time_a[2]);
				}


				$('#error-explanation-time').hide();
			} else {
				$('#error-explanation-time').show();
			}
		});
	});
	//ukrywanie podpowiedzi gdy pole zostaje wyczyszczone
	$('#route_time_string').blur(function(){
		if($('#route_time_string').val() == "") {
			$('#error-explanation-time').hide();
		}
	});


	//Poprawność tętna
	$('#route_pulse').blur(function() {
		var pulse = $('#route_pulse').val();
		var pulseRegex = /\d{2,3}\/\d{2,3}/;
		var pulseRegexOk = pulse.match(pulseRegex);
		if(pulse == pulseRegexOk || $('#route_pulse').val() == "") {
			console.log(pulseRegexOk);
			$("#error-explanation-pulse").hide();
		} else {
			$("#error-explanation-pulse").show();
		}
	});

	



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

	}




	if($('#load_coordinates').length) {
		drawChart = 1;
		console.log("test ok");
		var id = $('#load_coordinates').val();
		console.log(id)
		$.post('/load_coordinates', {id : id}, function(coordinates) {
			console.log(coordinates);
			var bounds = pathFromString(coordinates, path);
			map.fitBounds(bounds);
			polyline.setPath(path);


	$("#show-elevation").click(function(){
		console.log("esdadas");
		$("#elevation-chart").show();
		$("#elevation-chart").width(mapWidth);





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




		return false;
		// createElevation(path);
		// $("#elevation-chart").css("opacity", ".7");
		// $("#elevation-chart").show(2000, function(){
			
		// });
	});

		});
		
	}
	


	//przyciski do rysowania
	$('#draw-controls').hide();
	$('#draw-route-btn').bind('click', function(){
		$('#draw-controls').slideDown('slow');
		if(route == null)
		route = drawRoute(map, polyline);
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

		var stringPath = pathToString(path);
		// createElevation(path);
		//wypałniam ukryte pola dla formularza
		$("#route_coordinates_string").val(stringPath);
		$("#route_distance").val(distance);
		$("#route_max_altitude").val(max_altitude);
		$("#route_min_altitude").val(min_altitude);
		$("#route_total_climb_up").val(total_climb_up);
		$("#route_total_climb_down").val(total_climb_down);
		$("#route_total_time").val(total_time_sec);


				// <%= f.hidden_field :distance %>
				// <%= f.hidden_field :max_altitude %>
				// <%= f.hidden_field :min_altitude %>
				// <%= f.hidden_field :total_climb_up %>
				// <%= f.hidden_field :total_climb_down %>

		
		console.log(stringPath);
		console.log($("#route_coordinates_string").val());
		// return false;
	})
	

});
function loadRoute() {

	//ajaksowe zadanie po path, 
	
};


// przerabia path (polyline.getPath()) na string (do bazy)
function pathToString(pathToS) {
	pathToS = route.getPath();
	var pathString = "";
	for(var i = 0; i < pathToS.b.length; i++){
		var lat = pathToS.b[i]["Ja"];
		var lng = pathToS.b[i]["Ka"];
		var tmpString = lat + "x" + lng;
		if(i < pathToS.b.length -1) {
			tmpString += ","
		}
		pathString += tmpString;
	}
	return pathString;
}

// przerabia stringa z bazy na path dla google maps API 
function pathFromString(string, pathT) {
	var bounds = new google.maps.LatLngBounds();
	var p = string.split(",");
		for(var i = 0; i < p.length; i++) {
			var pointS = p[i].split("x");
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
	   	zoom: 15,
	    center: new google.maps.LatLng(40.77333,-73.9723),
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
		
		if(path.length > 1) {
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






  });
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
};

function addDistanceToPage(polyline) {
	distance = Math.round((calculateDistance(polyline)/1000)*100)/100;
	$('.distance .value').html(distance);
	
};




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
	console.log(pathRequest);
    elevator.getElevationAlongPath(pathRequest, plotElevation);

}

// rysowanie profilu wysokosciowego
function plotElevation(results, status) {
	if (status == google.maps.ElevationStatus.OK) {

		// min i max wysokość
		var min = results[0].elevation;
		var max = results[0].elevation;
		// suma zjazdów i podjazdów
		var sumUp = 0;
		var sumDown = 0;

		for(var i = 0; i < results.length; i++) {
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

		console.log("Zjazdy: " + sumDown + " Podjazdy: " + sumUp);
		console.log("Min: " + min + " -- Max: " + max);

		var distance = Math.round((calculateDistance(polyline)/1000)*100)/100;
		// console.log(distance);
		// console.log(results.length);

		if(drawChart) {
			// wspolczynnik by na vAxis byly kilometry
			var x = distance / results.length;

			var data = new google.visualization.DataTable();
			data.addColumn('string', 'D');
			data.addColumn('number', 'Wysokość');
			for(var i = 0; i < results.length; i++) {
				// if(i % 5 == 0) {
					// data.addRow([ (i).toString(), results[i].elevation]);
					data.addRow([ (Math.round(i * x)).toString() + ' km', results[i].elevation]);
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
				colors: ['#c84446'],
				backgroundColor : '#f1f1f1',
				titleY: 'Wysokość (m)',
				titleX: 'Dystans (km)',
				chartArea:{left:50,top:23,width:"735",height:"157"},
				// vAxis: {baselineColor: '#283A43'}
				vAxis: {baselineColor: '#283a43' },
				fontSize: 13,
				fontName: "Helvetica Neue"


			});

			// pokazywanie na mapie miejsca z wykresu
			google.visualization.events.addListener(chart, 'onmouseover', function(event) {
				if (chartMarker == null) {
					
					chartMarker = new google.maps.Marker({
						position: results[event.row].location,
						map: map,
						icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
					});
				} else {
					chartMarker.setPosition(results[event.row].location);
					// console.log(event.row);
				}
			});
		}
	}
}