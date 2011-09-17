// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$(document).ready(function(){
	$('#map').width($(document).width() - $('#aside').outerWidth());
	$(window).resize(function() {
		$('#map').width($(window).width() - $('#aside').outerWidth());
	});
	// initializeMap();
});

function initializeMap() {
  var myOptions = {
    zoom: 11,
    center: new google.maps.LatLng(50.183054 ,19.035873),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map'),
      myOptions);
  

  // rysowanie po kliknieciu w link
  $('#draw-route-btn').bind('click', function(){
    drawRoute(map);
    alert("tetst");
    return false;
  });

  
}