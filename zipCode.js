const ZIPPO_URL = 'http://www.zippopotam.us';
const GOOGLE_API = 'AIzaSyAVJzkDy2OXeAlbGIslD6SOxqvY8pGUtpU';
let DATA_STORAGE=[];
ShowHistory();
function searchData(event){
	const myForm = document.forms[0]
	const country = myForm.elements[0].value.toLowerCase();
	const zipCode = myForm.elements[1].value;
	document.getElementById('error').innerHTML = '';

	
	let countryCode = ''
	if (country === 'germany')
		countryCode = 'DE'
	else if(country === 'finland')
		countryCode = 'FI'
	else if(country === 'france')
		countryCode = 'FR'
	else if (country === 'sweden')
		countryCode = 'SE'
	let url = `${ZIPPO_URL}/${countryCode}/${zipCode}`;

	let place, longitude, latitude;
	

	//now get data from Zippo API
	fetch(url)
		.then(req => req.json())
		.then(data => {
			if(data["places"]){
				const {"place name":place, longitude, latitude} = data["places"][0];
				document.getElementById('country').innerHTML =place;
				document.getElementById('latitude').innerHTML =latitude;
				document.getElementById('longitude').innerHTML =longitude;

				myMap = () =>{
					let mapCanvas = document.getElementById('googleMap');
					let myCenter = new google.maps.LatLng(latitude, longitude);
					let mapOptions = {center: myCenter, zoom: 5};
					let map = new google.maps.Map(mapCanvas, mapOptions);
					let marker = new google.maps.Marker({position: myCenter, animation: google.maps.Animation.BOUNCE});
					marker.setMap(map);
				}
				myMap();

				//now set the local storage
				if(typeof(Storage) !== 'undefined'){
					//remove the search if is more than 10
					if (localStorage.savedLocation){
						let savedLocation = JSON.parse(localStorage.savedLocation)
						if (savedLocation.length > 9){
							savedLocation.splice(0,1)
						}
						savedLocation.push({[country]:zipCode})
						localStorage.savedLocation = JSON.stringify(savedLocation);

					}else{
						let savedLocation = [{[country]:zipCode}]
						localStorage.setItem('savedLocation', JSON.stringify(savedLocation))
						
					}
		
				}
				else{
					alert('Your browser doesn\'t support webstorage ')
				}
				//update the history
				ShowHistory(update=true)
			}
			else{
				document.getElementById('error').innerHTML = '404 Not Found; Make sure counry and code is correct';
			}
		});
	
	event.preventDefault();
	
}


//Display the history 
function ShowHistory(update=false){
	if (localStorage.savedLocation){
		let savedLocation = JSON.parse(localStorage.savedLocation);
		let history = document.querySelector('.historyList');
		if (update === true){
			history.innerHTML =''
		}
		
		savedLocation.reverse().map(eachCountry => {
			Object.entries(eachCountry).map(([key,value]) => {
				let [historylist, countrySpan, zipCodeSpan] = [document.createElement('li'), document.createElement('span'), document.createElement('span')];
				countrySpan.innerHTML = key;
				zipCodeSpan.innerHTML = value;
				historylist.appendChild(countrySpan);
				historylist.appendChild(zipCodeSpan);
				history.appendChild(historylist);
			})
		})
		
	}
}