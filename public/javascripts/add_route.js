function drawRoute(map) {

  // rysowana trasa
  poly = new google.maps.Polyline({
    strokeColor: '#c84446',
    strokeOpacity: .8,
    strokeWeight: 5
  });
  poly.setMap(map);



  // polyline do pokazyanie kawałka trasy między ostatnim punktem a myszą
  tempPoly = new google.maps.Polyline({
   strokeColor: '#db5b5e',
    strokeOpacity: .3,
    strokeWeight: 2
  });
  tempPoly.setMap(map);


  // tablica na wszystki markery
  var markers = [];


  // ikonki markerów początkowego i końcowego
  var markerImageStart = new google.maps.MarkerImage("../images/markers/cycling.png");
  var markerImageFinish = new google.maps.MarkerImage("../images/markers//finish.png");
  var markerImageX = new google.maps.MarkerImage("../images/markers//ico.png", null, null, new google.maps.Point(6,6));




  //zdarzenie po kliknięciu na mapie
  google.maps.event.addListener(map, 'click', function(event){
    //pierwszy marker
    marker = addFirstMarker(map, event.latLng);
    

    //tworzenie 
    google.maps.event.addListener(map, 'mousemove', function(event){
      tempPoly.getPath().setAt(0, marker.getPosition());
      tempPoly.getPath().setAt(1, event.latLng);
    });

    // po kliknięcu w tempPoly czyli w mapę bo nie da się nie kliknąc w linie, ktora jest
    // pod kursorem usunięcie sledzenia myszy i funkcja do rysowania ktora dodaje te zdarzenie znow
    google.maps.event.addListener(tempPoly, 'click', function(event){
      google.maps.event.clearListeners(map, 'mousemove');
      drawPolyline(map, event.latLng);
    });
  });

	return poly;
	
  function addFirstMarker(map, pos) {

    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true
    });
    
    marker.setIcon(markerImageStart);
    markers.push(marker);
    poly.getPath().push(pos);

    google.maps.event.addListener(marker, 'drag', function(){
      poly.getPath().setAt(0, marker.getPosition());
    });
    return marker;
  }


  function drawPolyline(map, pos) {

    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true
    });

    markers.push(marker);

    google.maps.event.addListener(map, 'mousemove', function(event){
      tempPoly.getPath().setAt(0, poly.getPath().getAt(poly.getPath().getLength()-1));
      tempPoly.getPath().setAt(1, event.latLng);
    });

    var path = poly.getPath();

    // pozycja myszy jako kolejny 
    path.push(marker.getPosition());


    google.maps.event.addListener(marker, 'drag', function(){
      for (var i = 0; i < markers.length; i++) {
        if (markers[i] == marker) {
          poly.getPath().setAt(i, marker.getPosition());
          break;
        }
      }
    });

    //ostatni marker -- zakończenie rysowania trasy
    

    if(markers.length > 1) {
      
      if (markers[markers.length - 2].getIcon() == markerImageFinish) {
        markers[markers.length - 2].setIcon(markerImageX);
        google.maps.event.clearListeners(markers[markers.length - 2], 'rightclick');
      }
      var lastMarker = markers[markers.length - 1];
      lastMarker.setIcon(markerImageFinish);
      google.maps.event.addListener(lastMarker, 'rightclick', function(){
        // alert('rightclick');
        google.maps.event.clearInstanceListeners(map);
        lastMarker.setIcon(markerImageFinish);
        tempPoly.setMap(null);
        // zapisz trase
      });
    }
    
  }
}