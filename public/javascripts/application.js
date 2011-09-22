// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var directionsDisplay;
var directionsService;
var elevator;
var snap;
var path = new Array();
var markers = [];


var startMarkerImage;
var finishMarkerImage;
var pointMarkerImage;

var shadow;

var calculatedMarkers;

var chartMarker;
var polyline
var map;
var route;
google.load("visualization", "1", {packages: ["corechart"]});




$(document).ready(function(){
	$('#map').width($(document).width() - $('#aside').outerWidth());
	$(window).resize(function() {
		$('#map').width($(window).width() - $('#aside').outerWidth());
	});
	
	
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
			$("#snap").text("Wyłącz przyciąganie");
		} else {
			snap = 0;
			$("#snap").text("Przyciągaj do dróg");
		}
	});
	

});
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
		addDistanceToPage(polyline);
		polyline.setPath(path);
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
	$('.distance .value').html(Math.round((calculateDistance(polyline)/1000)*100)/100);
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
		console.log("Zjazdy: " + sumDown + " Podjazdy: " + sumUp);
		console.log("Min: " + min + " -- Max: " + max);

		var distance = Math.round((calculateDistance(polyline)/1000)*100)/100;
		// console.log(distance);
		// console.log(results.length);

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
			width: 1000,
			height: 300,
			legend: 'none',
			colors: ['#c84446'],
			titleY: 'Wysokość (m)',
			titleX: 'Dystans (km)',
			// vAxis: {baselineColor: '#283A43'}
			vAxis: {baselineColor: 'red' }


		});

		// pokazywanie na mapie miejsca z wyjresu
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