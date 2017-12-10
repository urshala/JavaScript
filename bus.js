let map, position, bus_number, marker, locations, destinations, markers=[];
function displayMap(){
					let mapOptions = {
				        mapTypeId: 'roadmap'
				    };
				    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    				map.setTilt(45);
					
}

function updateMarkers(foundBus, update=false){
	locations = [];
	setMapOnAll = (map) =>{
		for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
	}

	if (marker){
		setMapOnAll(null);
		markers = [];
	}
	let bounds = new google.maps.LatLngBounds();
	Object.entries(foundBus).forEach(([key, val]) => {
						for (let eachVal of val){
							if (eachVal.latitude && eachVal.longitude)
								locations.push([eachVal.latitude, eachVal.longitude])
							
						}
							
					})
					
	for (let i = 0; i < locations.length; i++){
		position = new google.maps.LatLng(locations[i][0], locations[i][1]);
		bounds.extend(position);
		marker = new google.maps.Marker({
			position: position,
			animation: google.maps.Animation.BOUNCE,
			map:map
		})
		markers.push(marker);
	}
	
	//set markers
	setMapOnAll(map);
	map.fitBounds(bounds);	
}

function showRoute(e){
	bus_number = document.querySelector('#busNumber').value;
	fetch('http://data.foli.fi/siri/vm')
		.then(res => res.json())
		.then(data => {
			//work on the received data
			const vehicles = data.result.vehicles;
			const foundBus = Object.entries(vehicles).filter(([key,val]) => val.lineref == bus_number);
			//errors message if error
			if (foundBus.length == 0) document.querySelector("#googleMap").innerHTML = 'Sorry no routes availabe for bus ' + bus_number + ' at the moment';
			else{

				if (e.target.innerHTML == 'Refresh'){
					updateMarkers(foundBus);
				}
				else{
					displayMap();
					updateMarkers(foundBus);
				}
				
			}

		})
	
	
	e.preventDefault();
}


function showR(event){
	//get route_id
	
	let route_id,waypoints=[];
	bus_number = document.querySelector('#busNumber').value;
	fetch('http://data.foli.fi/gtfs/v0/20171130-162538/routes')
		.then(res => res.json())
		.then(dt => {
			dt.forEach(val => {
					if (val.route_short_name == bus_number){
						route_id = val.route_id;
					}
				})
				return fetch('http://data.foli.fi/gtfs/v0/20171130-162538/trips/route/'+ route_id);
			})
		.then(res => res.json())
		.then(dt => {
			let shape_id = dt[0]["shape_id"]
			return fetch('http://data.foli.fi/gtfs/v0/20171130-162538/shapes/'+ shape_id)
			})
		.then(dt => dt.json())
		.then(res => {
				res.forEach(item => waypoints.push({location: `${item.lat}, ${item.lon}`}))
				let mapOptions = {
				    mapTypeId: 'roadmap'
				    };
	let map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
	let origin = waypoints[0].location;
	
	let destination = waypoints.slice(-1)[0].location;
	console.log(destination)
    map.setTilt(45);
	let dirService = new google.maps.DirectionsService();
	let dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers:true});
	dirRenderer.setMap(map);
	let request = {
		origin,
		destination,
		waypoints: waypoints.slice(0,23),
		travelMode: google.maps.TravelMode.DRIVING
	}

	dirService.route(request, function(result, status){
		if (status == google.maps.DirectionsStatus.OK)
			dirRenderer.setDirections(result);
	})


				return
			})
		.catch(err => console.log(err))
	
	
	event.preventDefault();
	
}


