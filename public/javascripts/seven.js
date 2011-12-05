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

var newPhotoMarker;
var newPhotoInfoBox;
var photoMarker;
var photoMarkerImage;
var photoMarkerImageBlue;
var photoMarkers = [];
var photoInfoBoxes = [];

var allPolylines = [];

var mc;

google.load("visualization", "1", {packages: ["corechart"]});

var mapWidth;

$(document).ready(function(){


  $('#show-workouts').click(function() {
    $('#route_actions a.selected').removeClass('selected');
    $('#show-workouts').addClass('selected');
    $('#comments-container').hide();
    $('#climbs-container').hide();

    if($('#workouts-container').is(":visible")) {
      $('#workouts-container').slideUp("slow");
      $('#route_actions a.selected').removeClass('selected');
    } else {
      $('#workouts-container').slideDown('slow');
    }
    return false;
  });

  $('#add_workout_btn').click(function(){
    $('#add_workout_btn').hide();
    $('#add-workout').slideDown('slow');
    return false;
  });

  // sprawdzanie poprawności czasu 
  $('#workout_time_string').focus(function(){
    $('#workout_time_string').keyup(function(){
      var time_string = $('#workout_time_string').val();
      var timeRegex = /\d{1,3}\D\d{1,2}\D?\d{0,2}/;
      var timeRegexOk = time_string.match(timeRegex)
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
        } else {
          total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60;
          time_a[2] = "0";
        }
        if(total_time_sec > 0) {
          distance = $('#route_distance').val();
          avg_speed = Math.round(distance * 3600 / total_time_sec * 100) / 100;
          $("#avg_speed_val").html(avg_speed);
          $("#total-time-show-h").html(time_a[0]);
          $("#total-time-show-m").html(time_a[1]);
          $("#total-time-show-s").html(time_a[2]);
        }
        $('#error-explanation-time').hide();
        $('#workout_time_string').css("border-color", "#D5D8D9");
      } else {
        $('#error-explanation-time').show();
        $('#workout_time_string').css("border-color", "#C84446");
      }
    });
  });
  //ukrywanie podpowiedzi gdy pole zostaje wyczyszczone
  $('#workout_time_string').blur(function(){
    if($('#workout_time_string').val() == "") {
      $('#error-explanation-time').hide();
      $('#workout_time_string').css("border-color", "#D5D8D9");
    }
  });

  //Poprawność tętna
  $('#workout_pulse').blur(function() {
    var pulse = $('#workout_pulse').val();
    var pulseRegex = /\d{2,3}\/\d{2,3}/;
    var pulseRegexOk = pulse.match(pulseRegex);
    if(pulse == pulseRegexOk || $('#workout_pulse').val() == "") {
      $("#error-explanation-pulse").hide();
      $('#workout_pulse').css("border-color", "#D5D8D9");
    } else {
      $("#error-explanation-pulse").show();
      $('#workout_pulse').css("border-color", "#C84446");
    }
  });

  //Poprawność prędkość maksymalna
  $('#workout_max_speed').blur(function() {
    var max_speed = $('#workout_max_speed').val();
    var max_speedRegex = /\d{1,3}.?\d{0,4}/;
    var max_speedRegexOk = max_speed.match(max_speedRegex);
    if((max_speed == max_speedRegexOk || $('#workout_max_speed').val() == "") && max_speed < 200) {
      $("#error-explanation-max-speed").hide();
      $('#workout_max_speed').css("border-color", "#D5D8D9");
    } else {
      $("#error-explanation-max-speed").show();
      $('#workout_max_speed').css("border-color", "#C84446");
    }
  });

  //Poprawność temperatury
  $('#workout_temperature').blur(function() {
    var temperature = $('#workout_temperature').val();
    var temperatureRegex = /\d{1,2}.?\d{0,1}/;
    var temperatureRegexOk = temperature.match(temperatureRegex);
    if(temperature == temperatureRegexOk || $('#workout_temperature').val() == "") {
      $("#error-explanation-temperature").hide();
      $('#workout_temperature').css("border-color", "#D5D8D9");
    } else {
      $("#error-explanation-temperature").show();
      $('#workout_temperature').css("border-color", "#C84446");
    }
  });

  // dodawanie przejazdu
  var route_id = $('#route_id').val();
  $('#workout_submit').click(function() {
    var time_string = $("#workout_time_string").val();
    var max_speed = $("#workout_max_speed").val();
    var pulse = $("#workout_pulse").val();
    var temperature = $("#workout_temperature").val();
    var description = $("#workout_description").val();
    $.post(
      '/create_workout', {
        route_id : route_id,
        time_string : time_string,
        max_speed : max_speed,
        pulse : pulse,
        temperature : temperature,
        description : description
      },
      function(data) {
        console.log(data);
        $('#workouts-list').append(data);
        updateWorkoutsNum(1);
      }
    );
    $("#workout_time_string").val("");
    $("#workout_max_speed").val("");
    $("#workout_pulse").val("");
    $("#workout_temperature").val("");
    $("#workout_description").val("");

    $('#add-workout').hide();
    $('#add_workout_btn').show();
    return false;
  });

  //edit
  $('p.workout-meta .edit_workout').live('click', function(){
    // $('p.workout-meta .edit_workout').die();
    // alert("test ok");
    var id_a = $(this).attr("id").split('_');
    var id = id_a[2];
    var workout_body = $(this).parent().parent().children('ul');
    var edit_workout_btn = $(this);
    console.log(id);
    $.post(
      '/edit_workout',
      { workout_id : id },
      function(data) {
        workout_body.html(data);
        edit_workout_btn.hide();
        workout_body.parent().children('.workout-description').remove();
        $('#workout_submit').click(function(){
          var time_string = $('#workout_time_string_edit').val();
          var max_speed = $('#workout_max_speed').val();
          var pulse = $('#workout_pulse_edit').val();
          var temperature = $('#workout_temperature').val();
          var description = $('#workout_description').val();
          $.post(
            '/update_workout',
            {
              workout_id : id,
              time_string : time_string,
              max_speed : max_speed,
              pulse : pulse,
              temperature : temperature,
              description : description
            },
            function(data) {
              workout_body.parent().parent().html(data);
            }
          );
          return false;
        });
        $('.deleteWorkoutBtn').live('click', function() {
          $('.edit_workout').die();
          $(this).parent().parent().parent().parent().remove();
            $.post(
            '/delete_workout',
            { workout_id : id },
            function(data) {
              console.log(data);
              updateWorkoutsNum(-1);
            }
          );
          return false;
        });
      }
    );

    // element do zamiany
    // console.log($(this).parent().parent().children('ul'));
    var test = "32 (32)".split("(")[1].replace(")", "");
    return false;
  });

  var offset = 0;
  var period = "";

  // TODO
  // id offset 0 to wylacz previous button

  $('#stats_next_btn').click(function() {
    offset += 1;
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset },
      function(data) {
        $('#script_chart').html(data);
      }
    );
    return false;
  });
  $('#stats_previous_btn').click(function() {
    offset -= 1;
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset },
      function(data) {
        $('#script_chart').html(data);
      }
    );
    return false;
  });
  var user_id = $('#user_id').val();
  if($('#charts_container').length) {
    $('#stats_day_btn').addClass('selected');
    period = "day";
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset},
      function(data) {
        $('#script_chart').html(data);
      }
    );
  }
  $('#stats_day_btn').click(function() {
    $('#stats_actions a.selected').removeClass('selected');
    $('#stats_day_btn').addClass('selected');
    offset = 0;
    period = "day";
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset},
      function(data) {
        $('#script_chart').html(data);
      }
    );
    return false;
  });
  $('#stats_month_btn').click(function() {
    $('#stats_actions a.selected').removeClass('selected');
    $('#stats_month_btn').addClass('selected');
    offset = 0;
    period = "month";
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset},
      function(data) {
        $('#script_chart').html(data);
      }
    );
    return false;
  });
  $('#stats_week_btn').click(function() {
    $('#stats_actions a.selected').removeClass('selected');
    $('#stats_week_btn').addClass('selected');
    offset = 0;
    period = "week";
    $.post(
      '/show_stats',
      {user_id : user_id, period : period, offset : offset},
      function(data) {
        $('#script_chart').html(data);
      }
    );
    return false;
  });
    $('#distance_slider').slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100],
      slide: function(event, slider) {
        if(slider.values[1] == 100) {
          $('#distance_range').text(slider.values[0] + ' km - ' + slider.values[1] + '+ km');
        } else {
          $('#distance_range').text(slider.values[0] + ' km - ' + slider.values[1] + ' km');
        }
      }
    });
    if($('#distance_min').val()) {
      $('#distance_slider').slider( "option", "values", [$('#distance_min').val(),$('#distance_max').val()] );
    }
    if($('#distance_slider').slider("values", 1) == '100') {
      $('#distance_range').text($('#distance_slider').slider("values", 0) + ' km - ' + $('#distance_slider').slider("values", 1) + '+ km');
    } else {
      $('#distance_range').text($('#distance_slider').slider("values", 0) + ' km - ' + $('#distance_slider').slider("values", 1) + ' km');
    }

    //altitude
    $('#altitude_slider').slider({
      range: true,
      min: 0,
      max: 400,
      values: [0, 400],
      slide: function(event, slider) {
        if(slider.values[1] == 400) {
          $('#altitude_range').text(slider.values[0] + ' m - ' + slider.values[1] + '+ m');
        } else {
          $('#altitude_range').text(slider.values[0] + ' m - ' + slider.values[1] + ' m');
        }
      }
    });
    if($('#altitude_min').val()) {
      $('#altitude_slider').slider( "option", "values", [$('#altitude_min').val(),$('#altitude_max').val()] );
    }
    if($('#altitude_slider').slider("values", 1) == '400') {
      $('#altitude_range').text($('#altitude_slider').slider("values", 0) + ' m - ' + $('#altitude_slider').slider("values", 1) + '+ m');
    } else {
      $('#altitude_range').text($('#altitude_slider').slider("values", 0) + ' m - ' + $('#altitude_slider').slider("values", 1) + ' m');
    }

    $('#routes_filter_reset').click(function() {
      $('#altitude_slider').slider( "option", "values", [0,400] );
      $('#distance_slider').slider( "option", "values", [0,100] );
      $('#route_road').attr('checked', false);
      return false;
    });

    if($('#road').val() == 1) {
      $('#route_road').attr('checked', true);
    }

    $('#routes_filter_btn').click(function() {
      var href = $(this).attr("href");
      var paramsArray = href.split("?")[1].split("&");
      var newHref = href.split("?")[0] + "?"
      for(var i in paramsArray) {
        if (paramsArray[i].indexOf('distance_max') != -1) {
          newHref += 'distance_max=' + $('#distance_slider').slider("values", 1) + '&';
        } else if(paramsArray[i].indexOf('distance_min') != -1) {
          newHref += 'distance_min=' + $('#distance_slider').slider("values", 0) + '&';
        } else if(paramsArray[i].indexOf('altitude_max') != -1) {
          newHref += 'altitude_max=' + $('#altitude_slider').slider("values", 1) + '&';
        } else if(paramsArray[i].indexOf('altitude_min') != -1) {
          newHref += 'altitude_min=' + $('#altitude_slider').slider("values", 0) + '&';
        } else {
          newHref += paramsArray[i] + '&';
        }
      }
      if($('#route_road').attr('checked')) {
        newHref += 'road=1';
      } else {
        newHref += 'road=0';
      }
      console.log(newHref);
      
      $(this).attr("href", newHref);
    });

  // ustalanie ikonek dla wartosci z bazy
  var value = $('#route_rating_value').val();
  update_rating(value, '#rating li a');
  var route_id = $('#route_id').val();

  $('#rating li a').mouseover(function() {
    var hoverVal = $(this).html();
    $('#rating li a:lt(' + hoverVal + ')').addClass('select');
  });
  $('#rating li a').mouseout(function() {
    var hoverVal = $(this).html();
    $('#rating li a:lt(' + hoverVal + ')').removeClass('select');
  });
  $('#rating li a').click(function() {
    var selectVal = $('#user_rating_value').val();
    $('#rating li a:lt(' + selectVal + ')').addClass('select');
    var rating_value = parseFloat($(this).html());
    $.post('/add_rating', {route_id : route_id, value : rating_value }, function(avg_rating) {
      update_rating(avg_rating, '#rating li a');
    });
    return false;
  });
  // zaznaczenie gwiazdeg gdy user wczesniej glosowal
  if($('#user_rating_value')) {
    var selectVal = $('#user_rating_value').val();
    $('#rating li a:lt(' + selectVal + ')').addClass('select');
  }
  if($('#user_rating_like').val() == "true") {
    $('#add-favorite span').html("Usuń z ulubionych");
    $('#add-favorite a').addClass("liked");
  }
  var like = $('#user_rating_like').val();
  $('#add-favorite a').click(function() {
    like = $('#user_rating_like').val();
    if(like) { // jesli jest true 
      like = null;
      $('#add-favorite span').html("Dodaj do ulubionych");
      $('#add-favorite a').removeClass("liked");
    } else {
      like = true;
      $('#add-favorite span').html("Usuń z ulubionych");
      $('#add-favorite a').addClass("liked");
    }
    // console.log(like);
    $('#user_rating_like').val(like);
    $.post('/add_like', {route_id : route_id, like : like }, function(data) {
    });
    return false;
  });
  //index oceny
  update_index_rating();

  $('#avatar_actions_update').bind('click', function() {
    if($('#avatar_form').is(':visible')) {
      $('#avatar_form').slideUp("slow");
    } else {
      $('#avatar_form').slideDown('slow');
    }
    return false;
  });

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



  // pokaz zdjecie
  if($('#route_photos').length) {
    var route_id = $('#route_id').val();
    $.ajax({
      type: "POST",
      url: "/photo_markers",
      data: {route_id : route_id},
      dataType: "json",
      success: function(markers) {
        console.log(markers);
        for(var i = 0; i < markers.length; i++) {
          var photo_id = markers[i][0].toString();
          var position = markers[i][1].split(",");
          var lat = parseFloat(position[0]);
          var lng = parseFloat(position[1]);
          var point = new google.maps.LatLng(lat, lng);
          createPhotoMarker(point, photo_id);
        }
      }
    });
  }
  // // edit photo
  // $('#edit_photo_btn').live('click', function() {
  //  var photo_id = $('#photo_id').val();
  //  $.post('/edit_photo', {id : photo_id}, function(data) {
  //  });
  // });

  // dodaj zdjecie
  $('#add-photo').click(function(){
    //TODO podpowiedz 'kilknij na mapie w miejsce gdzie chcesz dodac zdjecie'
    photoMarkerImageBlue = new google.maps.MarkerImage(
      '../images/markers_p_b.png',
      new google.maps.Size(34, 49),
      new google.maps.Point(0, 0)
    );
    
    for(var i = 0; i < photoInfoBoxes.length; i++) {
      photoInfoBoxes[i].close();
    }
    for(var i = 0; i < photoMarkers.length; i++) {
      photoMarkers[i].setIcon(photoMarkerImage);
    }
    
    google.maps.event.addListenerOnce(map, 'click', function(event){
      var pos = event.latLng;
      newPhotoMarker = new google.maps.Marker({
        position: pos,
        icon: photoMarkerImageBlue,
        map: map,
        draggable: true,
        title: 'Dodaj zdjęcie'
      });
      $.post(
        '/new_photo',
        {},
        function(data) {
          var newPhotoContent = document.createElement("div");
          newPhotoContent.id = 'infobox_add_photo';
          newPhotoContent.innerHTML = data;
          var newPhotoInfoBoxMyOptions = {
            content: newPhotoContent
            ,disableAutoPan: false
            ,maxWidth: 0
            ,pixelOffset: new google.maps.Size(-141, 5)
            ,zIndex: null
            ,boxStyle: { 
              width: "260px"
            }
            ,closeBoxMargin: "5px"
            ,closeBoxURL: "../images/close.png"
            ,infoBoxClearance: new google.maps.Size(1, 1)
            ,isHidden: false
            ,pane: "floatPane"
            ,enableEventPropagation: false
          };
          newPhotoInfoBox = new InfoBox(newPhotoInfoBoxMyOptions);
          newPhotoInfoBox.open(map, newPhotoMarker);
          google.maps.event.addListener(newPhotoInfoBox, 'closeclick', function() {
            newPhotoMarker.setMap(null);
          });

          $('#new_photo').live('submit', function() {
            console.log('working');
            $('#photo_lat_lng').val(pos.toUrlValue());
            $('#photo_route_id').val($('#route_id').val());
          });
        }
      );
    });
    return false;
  });

  // pokaz wszystkie trasy usera na mapie
  $('#show_all_routes_btn').click(function(){
    if($('#show_all_routes_btn').text() == "Ukryj wszystkie trasy") {
      clearAllUserRoutes();
    } else {
      var userId = $('#user_id').val();
      $.post('/show_all_routes', {user_id : userId}, function(coordinates_array) {
        var newBounds = new google.maps.LatLngBounds();
        for (var i = 0; i < coordinates_array.length; i++) {
          var poly = new google.maps.Polyline({
            strokeColor: '#283A43',
            strokeOpacity: .6,
            strokeWeight: 5,
            map: map
          });
          var path1 = new Array();
          var bounds = pathFromString(coordinates_array[i], path1);
          poly.setPath(path1);
          allPolylines.push(poly);

          //funkcja dodaje click event do kazdej trasy by pokazac co to za trasa
          addListenerToAllPolylines(poly);
          newBounds.extend(bounds.getNorthEast());
          newBounds.extend(bounds.getSouthWest());
        };
        map.fitBounds(newBounds);
      });
      $('#show_all_routes_btn').text("Ukryj wszystkie trasy");
    }
    return false;
  });

  // pokaz okienko gdy podczas ajaxow
  // TODO --> inne okienka dla roznych ajaxow
  $('body').ajaxStart(function () {
    $('#ajax-status').show().text("Ładowanie...");
  });
  $('body').ajaxStop(function () {
    $('#ajax-status').fadeOut();
  });

  // dostosowanie rozmiaru mapy
  mapWidth = $(document).width() - $('#aside').outerWidth();
  $('#map').width(mapWidth);
  $('#map').height($(window).height() - 63);
  $('#aside').css('min-height', ($(window).height() - 63));
  if($('#map').height() < $('#aside').height()) {
    $('#map').height($('#aside').height());
  }
  $('#aside').resize(function() {
    if($('#map').height() < $('#aside').height()) {
      $('#map').height($('#aside').height());
    }
  });

  $(window).resize(function() {
    $('#map').width($(window).width() - $('#aside').outerWidth());
    $('#map').height($(window).height() - 63);
    $('#aside').css('min-height', ($(window).height() - 63));
    if($('#map').height() < $('#aside').height()) {
      $('#map').height($('#aside').height());
    }
  });

  // pokaz okienko z informacjami o bledach i ukryj po 5 sekundach
  $(".flash").click(function(){$(".flash").slideUp('slow')});
  $("#error_explanation_route").click(function(){$("#error_explanation_route").slideUp('slow')});
  $(".flash").delay(5000).slideUp('slow');

  //pagination -- wyznaczenie szerokosci by wysrodkowac na stronie
  if($('.pagination').length) {
    $('.pagination').width(75+75+(29*($('.pagination').children().length - 2)));
  }



  // gdy jest widoczna mapa
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

  // geocoding
  $('#search-place').submit(function() {
    var val = $('#search-place-text').val();
    centerMap(val);
    $('#search-place-text').val("");
    return false;
  });

  // pages/home --> zawiera listę ostatnich tras
  if($('#last-routes').length) {
    loadStartMarkers(0, 'added');
  }
  // user_show_page
  if($('#user-last-routes').length) {
    var user_id = $('#user_id').val();
    loadStartMarkers(user_id, 'added');
  }
  // users_page
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

  // pages/home i users_page
  if($('.routes-list').length) {
    $('.route-img').live('click', function(){
      if($('.route-img').hasClass("selected")) {
        $('.route-img').removeClass("selected");
      }
      $(this).addClass("selected");
      var id = $(this).parent().attr("id").split("-")[2];
      clearAllUserRoutes();
      // ładuje trase na mapie i zmienia marker 
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

  // POKAZ TRASE
  
  // pokaz / ukryj informacje o podjazdach 
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

  // pokaz trase 
  if($('#load_coordinates').length) {
    drawChart = 1;
    var id = $('#load_coordinates').val();
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
            // console.log("Do wywalenia: "+  (path.length - 190));
            // console.log("Nowa: " + reucedPath);
            // console.log("Stara: " + path);
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
        return false;
        // createElevation(path);
        // $("#elevation-chart").css("opacity", ".7");
        // $("#elevation-chart").show(2000, function(){
        // });
      });
    });
  }


  // DODAWANIE TRASY

  // walidacja czasu 
  $('#route_time_string').focus(function(){
    $('#route_time_string').keyup(function(){
      var time_string = $('#route_time_string').val();
      var timeRegex = /\d{1,3}\D\d{1,2}\D?\d{0,2}/;
      var timeRegexOk = time_string.match(timeRegex)
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
        } else {
          total_time_sec = parseFloat(time_a[0]) * 3600 +  parseFloat(time_a[1]) * 60;
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
  // ukrywanie podpowiedzi gdy pole zostaje wyczyszczone
  $('#route_time_string').blur(function(){
    if($('#route_time_string').val() == "") {
      $('#error-explanation-time').hide();
      $('#route_time_string').css("border-color", "#D5D8D9");
    }
  });

  // waidacja tetna
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

  // walidacja predkosci max
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

  // pokaz formularz do dodawania pliku
  $('#upload-file-btn').bind('click', function(){
    if($('#draw-controls').is(':visible')) {
      $('#draw-controls').slideUp('slow');
    }
    if($('#upload-form').is(':visible')) {
      $('#upload-form').slideUp('slow');
    } else {
      $('#upload-form').slideDown('slow');
    }
    return false;
  });

  // stworz trase po uploadzie z pliku
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
    }
    // wywolanie funkcji do stworzenia profilu wysokosciowego
    if(reucedPath) {
      createElevation(reucedPath);
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


  // przycisk przyciafaj do drog
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
    // console.log(time_string_edit);
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
    // console.log(time_s);
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
}); // koniec glownej funkcji programu

function createPhotoMarker(pos, title) {
  photoMarkerImage = new google.maps.MarkerImage(
    '../images/markers_p.png',
    new google.maps.Size(34, 49),
    new google.maps.Point(0, 0)
  );
  photoMarkerImageBlue = new google.maps.MarkerImage(
    '../images/markers_p_b.png',
    new google.maps.Size(34, 49),
    new google.maps.Point(0, 0)
  );
  photoMarker = new google.maps.Marker({
    position: pos,
    icon: photoMarkerImage,
    map: map,
    title: title
  });
  photoMarkers.push(photoMarker);
  addListenersToPhotoMarker(photoMarker, title);
};

function addListenersToPhotoMarker(photoMarker, title) {
  google.maps.event.addListener(photoMarker, "click", function() {
    for(var i = 0; i < photoMarkers.length; i++) {
      photoMarkers[i].setIcon(photoMarkerImage);
    }
    for(var i = 0; i < photoInfoBoxes.length; i++) {
      photoInfoBoxes[i].close();
    }
    photoMarker.setIcon(photoMarkerImageBlue);
    showPhoto(photoMarker, title);
  });
}

function showPhoto(photoMarker, title) {
  var photo_id = title;
  $.post(
    '/show_photo',
    {
      id : photo_id
    },
    function(data) {
      var showPhotoContent = document.createElement("div");
      showPhotoContent.id = 'infobox_show_photo';
      showPhotoContent.innerHTML = data;
      var showPhotoInfoBoxMyOptions = {
        content: showPhotoContent
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-333, 5)
        ,zIndex: null
        ,boxStyle: { 
          width: "666px"
        }
        ,closeBoxMargin: "5px"
        ,closeBoxURL: "../images/close.png"
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: true
      };
      var showPhotoInfoBox = new InfoBox(showPhotoInfoBoxMyOptions);
      photoInfoBoxes.push(showPhotoInfoBox);
      showPhotoInfoBox.open(map, photoMarker);

      // console.log(data);
      $('.fancybox').fancybox({'type' : 'image', 'padding' : '5'});
      
      // hack wywolanie slidera po najechaniu na infoboxa
      $("#infobox_show_photo").live('mouseover',function(){
        $("#infobox_show_photo").die();
        $("#photo_img").slides();
      });

      google.maps.event.addListener(showPhotoInfoBox, 'closeclick', function() {
        photoMarker.setIcon(photoMarkerImage);
      });
      if(newPhotoInfoBox) {
        newPhotoInfoBox.close();
        newPhotoMarker.setMap(null);
      }
    }
  );
}

function addListenerToAllPolylines(poly) {
  google.maps.event.addListener(poly, "click", function() {
    for(var i = 0; i < allPolylines.length; i++) {
      homeInfoBoxes[i].close();
      if (allPolylines[i] == poly) {
        homeInfoBoxes[i].open(map, homeMarkers[i]);
      }
    }
  });
}

function clearAllUserRoutes() {
  for(var i = 0; i < allPolylines.length; i++) {
    if(homeInfoBoxes[i]) {
      homeInfoBoxes[i].close();
    }
    allPolylines[i].setMap(null);
  }
  allPolylines = [];
  $('#show_all_routes_btn').text("Wszystkie trasy");
}


// ładowanie wszystkich tras na mapę
function loadStartMarkers(user_id, route_type) {
  for(var i = 0; i < homeMarkers.length; i++) {
    homeMarkers[i].setMap(null);
  }
  homeInfoBoxes = [];
  homeMarkers = [];
  if (mc) {
    mc.clearMarkers();
  }
  
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
      var mcOptions = {
        gridSize: 50,
        maxZoom: 14,
        styles: [{
          url: "../images/cluster_1n.png",
          height: 35,
          width: 35,
          textColor: "white"
        }, {
          url: "../images/cluster_2n.png",
          height: 48,
          width: 48,
          textColor: "white",
          textSize: 13
        }, {
          url: "../images/cluster_3n.png",
          height: 56,
          width: 56,
          textColor: "white",
          textSize: 13
        }]
      };
      mc = new MarkerClusterer(map, homeMarkers, mcOptions);
    }
  });
}

function loadLastRoutes(last_route_type, user_id) {
  $.post(
    '/user_last_routes',
    {last_route_type : last_route_type, user_id : user_id},
    function(data) {
      // console.log(data);
      $('#last_route_container').html(data);
    }
  );
}

function createStartMarker(pos, title, title_route, route_distance, user_name) {
  sMarkerImage = new google.maps.MarkerImage(
    '../images/markers_h.png',
    new google.maps.Size(34, 49),
    new google.maps.Point(0, 0)
  );
  sMarkerImageHover = new google.maps.MarkerImage(
    '../images/markers_h.png',
    new google.maps.Size(34, 49),
    new google.maps.Point(34, 0)
  );
  var sMarker = new google.maps.Marker({
    position: pos,
    // map: map,
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
}

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
    clearAllUserRoutes();
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
}

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
}

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
}

function initializeMap(){
  var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
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
    // console.log(polyline.getPath().getLength());
    polyline.setPath(path);
    addDistanceToPage(polyline);
  });
    // console.log(polyline);
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
      // cała magia to linijka nizej
      directionsDisplay.setDirections(result);
      //dodaje do sciezki wszystki bez punkty - bez pierwszego
      for(var i = 1; i < directionsDisplay.directions.routes[0].overview_path.length; i++){
        var point = directionsDisplay.directions.routes[0].overview_path[i];
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
  // console.log("Usun sciezke z: " + num);
  // console.log(markers);
  // console.log(polyline.getPath().length);
}

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
}

function editMarkerC(marker, polyline, num) {
  google.maps.event.addListener(marker, 'click', function(){
    // console.log("c");
    // console.log(num);
    for (var i = 0; i < markers.length; i++) {
      if (markers[i] == marker) {
        //pierwszy marker
        if(i == 0){
          setFirstMarker(markers[1]);
          // console.log("First");
        }
        // console.log("usuwanie");
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
}

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
  // console.log("Dlugosc tab: "+ pathLength);
  var x = Math.ceil(pathLength / (pathLength - 190)); // wspolczynnik wywalania
  // console.log(x);
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
              var climbUpFirst = { "F" : {position : (Math.round(i * x)), elevation : results[i].elevation} };
              climbUpTable.push(climbUpFirst);
            } else if( previous < 0 ) {
              var climbUpFirst = { "F" : {position : (Math.round(i * x)), elevation : results[i].elevation} };
              climbUpTable.push(climbUpFirst);
            }
            if( next <= 0 || i == results.length - 1) {
              // console.log(results[i]);
              // console.log(i * x);
              var climbUpLast = {position : (Math.round(i * x)), elevation : results[i].elevation };
              climbUpTable[climbUpTable.length - 1]["L"] = climbUpLast;
              // console.log(climbUpLast);
            }
          }
        }
        var el = results[i].elevation;
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
        // if(!climbUpTable[i]["L"]) {
        //  climbUpTable[i]["L"] = climbUpTable[i]["F"];
        //  console.log(climbUpTable[i]["L"]);
        // }
        // console.log(climbUpTable);
        var cu = climbUpTable[i]["L"].elevation - climbUpTable[i]["F"].elevation;
        var dis = climbUpTable[i]["L"].position - climbUpTable[i]["F"].position;
        var grade = cu * 100 / dis;
        if(cu > 30 && dis > 500 && grade > 1) {
          // console.log("Miejsce: " + climbUpTable[i]["F"].position);
          // console.log("Start: " + climbUpTable[i]["F"].position / 1000 + "; Dystans: " + dis / 1000 + "; Min: " + Math.round(climbUpTable[i]["F"].elevation) + "; Max: " + Math.round(climbUpTable[i]["L"].elevation) + "; Śred: " + Math.round(cu *100 / dis * 10) /10);
          // console.log(cu *100 / dis);
          // console.log(climbUpTable[i]);
          if(climbs_string != "") {
            climbs_string += "|";
          }
          climbs_string += climbUpTable[i]["F"].position + "," + climbUpTable[i]["F"].elevation + "," + climbUpTable[i]["L"].position + "," + climbUpTable[i]["L"].elevation;
        }
      }
      // console.log(climbs_string);
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
        //  data.addRow([ '', results[i].elevation]);
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
        '../images/markers_e.png',
        new google.maps.Size(34, 49),
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
      // console.log("Geocoding status:" + status);
    } else {
      // console.log("Geocoding status:" + status);
    }
  });
}

function updateCommentsNum(value) {
  var commentsNum = parseFloat($('#comments-container h3').html().split(" ")[0]);
  console.log(commentsNum);
  $('#comments-container h3').html(commentsNum + value +" "+$('#comments-container h3').html().split(" ")[1]);
  $('#show-comments').html("Komentarze (" + (commentsNum + value) + ")");
}

function updateWorkoutsNum(value) {
  var workoutsNum = parseFloat($('#workouts-container h3').html().split("(")[1].replace(")", ""));
  // console.log(workoutsNum);
  $('#workouts-container h3').html("Przejazdy (" + (value + workoutsNum) + ")");
  $('#show-workouts').html("Przejazdy (" + (value + workoutsNum) + ")");
};

// aktualizacja gwiazdek
function update_rating(value, target) {
  $(target).removeClass('full-fill');
  $(target).removeClass('half-fill');
  if(value > 4.75) {
    $(target +':lt(5)').addClass('full-fill');
  } else if(value > 4.25) {
    $(target + ':lt(4)').addClass('full-fill');
    $(target + '.5').addClass('half-fill');
  } else if(value > 3.75) {
    $(target + ':lt(4)').addClass('full-fill');
  } else if(value > 3.25) {
    $(target + ':lt(3)').addClass('full-fill');
    $(target + '.4').addClass('half-fill');
  } else if(value > 2.75) {
    $(target + ':lt(3)').addClass('full-fill');
  } else if(value > 2.25) {
    $(target + ':lt(2)').addClass('full-fill');
    $(target + '.3').addClass('half-fill');
  } else if(value > 1.75) {
    $(target + ':lt(2)').addClass('full-fill');
  } else if(value > 1.25) {
    $(target + ':lt(1)').addClass('full-fill');
    $(target + '.2').addClass('half-fill');
  } else if(value > 0.75) {
    $(target + '.1').addClass('full-fill');
  }
}

function update_index_rating() {
  $('ul.rating').each(function(i) {
    z = $('ul.rating')[i];
    value = $(z).children().first().html();
    if(parseFloat(value) > 4.75) {
      $(z).children().each(function(index) {
        $(this).addClass('full-fill');
      });
    } else if(parseFloat(value) > 4.25) {
      $(z).children().each(function(index) {
        if(index < 5) {
          $(this).addClass('full-fill');
        } else if (index == 5) {
          $(this).addClass('half-fill');
        }
      });
    } else if(parseFloat(value) > 3.75) {
      $(z).children().each(function(index) {
        if(index < 5) {
          $(this).addClass('full-fill');
        }
      });
    } else if(parseFloat(value) > 3.25) {
      $(z).children().each(function(index) {
        if(index < 4) {
          $(this).addClass('full-fill');
        } else if (index == 4) {
          $(this).addClass('half-fill');
        }
      });
    } else if(parseFloat(value) > 2.75) {
      $(z).children().each(function(index) {
        if(index < 4) {
          $(this).addClass('full-fill');
        }
      });
    } else if(parseFloat(value) > 2.25) {
      $(z).children().each(function(index) {
        if(index < 3) {
          $(this).addClass('full-fill');
        } else if (index == 3) {
          $(this).addClass('half-fill');
        }
      });
    } else if(parseFloat(value) > 1.75) {
      $(z).children().each(function(index) {
        if(index < 3) {
          $(this).addClass('full-fill');
        }
      });
    } else if(parseFloat(value) > 1.25) {
      $(z).children().each(function(index) {
        if(index < 2) {
          $(this).addClass('full-fill');
        } else if (index == 2) {
          $(this).addClass('half-fill');
        }
      });
    } else if(parseFloat(value) > 0.75) {
      $(z).children().each(function(index) {
        if(index < 2) {
          $(this).addClass('full-fill');
        }
      });
    }
  });
}

