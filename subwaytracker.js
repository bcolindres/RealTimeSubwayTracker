var map;
var markers = [];

// load map
function init(){
	var myOptions = {
		zoom      : 14,
		center    : { lat:42.353350,lng:-71.091525},
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}

// Add subway markers to map
async function addMarkers(){
	// get subway data
	var locations = await getSubwayLocations();

	// loop through data, add subway markers
	locations.forEach(function(subway){
		var marker = getMarker(subway.id);		
		if (marker){
			moveMarker(marker,subway);
		}
		else{
			addMarker(subway);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,2000);
}

// Request subway data from MBTA
async function getSubwayLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter/routes?filter[type]=0,1';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(subway){
	var icon = getIcon(subway);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: subway.attributes.latitude, 
	    	lng: subway.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: subway.id
	});
	markers.push(marker);
}

function getIcon(subway){
	// select icon based on subway direction
	if (subway.attributes.direction_id === 0) {
		return 'green.png';
	}
	return 'purple.png';	
}

function moveMarker(marker,subway) {
	// change icon if subway has changed direction
	var icon = getIcon(subway);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: subway.attributes.latitude, 
    	lng: subway.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

window.onload = init;