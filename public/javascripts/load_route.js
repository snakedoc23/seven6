// funkcja wczytuje plik kml i przekazuje go funkcji kmlParse
function kmlToPolyline() {
  $.ajax({
    type: "GET",
    url: "01.kml",
    dataType: "xml",
    success: kmlParser
  });
}

// funkcja "wyciąga" z pliku wspolzedna i tworzy z nich polyline
function kmlParser(xml) {
  polyline = new google.maps.Polyline();  
  var z = $(xml).find('coordinates').text().split('\n');
  var route = new google.maps.MVCArray();
  $.each(z, function(index, value){
    var coo = value.split(',');
    var lng = coo[0];
    var lat = coo[1];
    if(lat != null){
      point = new google.maps.LatLng(lat, lng);
      route.push(point);
      // console.log(point);
      // console.log(lat +" -- "+ lng );
    }
  });
  polyline.setPath(route);
  polyline.setMap(map);


  // cała reszta tutaj --> jest dostępna trasa
}