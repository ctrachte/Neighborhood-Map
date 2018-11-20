import React, {Component} from 'react';
import Menu from './Menu';
import * as dataHelper from '../utils/dataHelper';

const fourSquareClientId = "&client_id=2WN2LW0H3PTZ5ANP5B2P1ZPF0JIDBWZNPHXPBDZIRPJVGPJQ";
const fourSquareClientSecret = "&client_secret=TQNTS32NRFWBI4WLBB5CMZX4C2VOVX4PNN3BYC3ZSKS2LVAA";
const fourSquareVersion = "&v=20181115";
const limit = "&limit=1";

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      'cabotPlaces':[],
      'map': '',
      'currentMarker': '',
      'previousMarker': ''
    };

    // keep context when invoking functions
    this.initMap = this.initMap.bind(this);
    this.openmarker = this.openmarker.bind(this);
    this.minimizeMarker = this.minimizeMarker.bind(this);
  }
  componentWillMount() {
    // get places from data API before component mounts
    this.setState({
      'cabotPlaces': dataHelper.getPlaces()
    });
  }
  componentDidMount() {
    window.initMap = this.initMap;
  }
  initMap() {
    let self = this;
    let view = document.getElementById('map');
    view.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(view, {
      zoom: 13,
      mapTypeControl: false,
      fullscreenControl: false,
      center: {lat: 34.963541, lng: -92.022440} // the center of Cabot, Ar
    });
    // make the map responsive if screen size changes
    window.google.maps.event.addDomListener(window, "resize", () => {
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(map.getCenter());
    });
    // if the user clicks somewhere on the map, close the info marker
    window.google.maps.event.addListener(map, 'click', () => {
      self.minimizeMarker();
    });
    let markerWindow = new window.google.maps.InfoWindow({});
    //if the user clicks the "x" on the marker:
    window.google.maps.event.addListener(markerWindow, 'closeclick', () => {
      self.minimizeMarker();
    });
    this.setState({
      'map': map,
      'currentMarker': markerWindow
    });
    this.getAllLocationsInfo();
  }
  // get additional info for each location based on API information
  getAllLocationsInfo () {
    let self = this;
    let newLocationsInfo = [];
    this.state.cabotPlaces.forEach((place) => {
      //concat name and desc to be more searchable
      let fullName = place.name + ' - ' + place.description;
      place.fullName = fullName;
      place.display = true;
      let lat = place.latitude;
      let long = place.longitude;
      let url = "https://api.foursquare.com/v2/venues/search?" + fourSquareClientId + fourSquareClientSecret + fourSquareVersion + "&ll=" + lat + "," + long + limit;
      // This fetch call is primarily to get the unique ids for each venue
      fetch(url).then((res) => {
        if (res.status !== 200) {
          place.getDetailsError = res;
          newLocationsInfo.push(place);
        } else {
          res.json().then((data) => {
            //Set the place Ids
            place.id = data.response.venues[0].id;
            // add a marker with a unique Id to the location
            let marker = new window.google.maps.Marker({
              animation: window.google.maps.Animation.DROP,
              position: new window.google.maps.LatLng(place.latitude, place.longitude),
              map: this.state.map,
              id:data.response.venues[0].id
            });
            marker.addListener('click', function () {
              self.openmarker(marker);
            });
            place.marker = marker;
            // now that we have the unique id, get detailed info about this location
            this.getVenueDetails(place, newLocationsInfo);
          })
        }
      })
      .catch((err) => {
        console.log(err);
        place.getDetailsError = err;
        newLocationsInfo.push(place);
      });
    });
    this.setState({
      cabotPlaces: newLocationsInfo
    });
    // console.log(this.state.cabotPlaces);
  }

  getVenueDetails (place, newLocationsInfo) {
    let url = 'https://api.foursquare.com/v2/venues/' + place.id + '?' + fourSquareClientId + fourSquareClientSecret + fourSquareVersion;
      fetch(url).then((res) => {
        if (res.status !== 200) {
          place.getDetailsError = res;
          newLocationsInfo.push(place);
        } else {
          res.json().then((data) => {
            // console.log(place.name, data);
            data = data.response.venue;
            if (data.bestPhoto) {
              place.img = data.bestPhoto.prefix + "100x100" + data.bestPhoto.suffix;
            }
            place.hereNow = data.hereNow.summary;
            place.rating = (data.likes.summary ? data.likes.summary  + ", " : "No likes, ") + (data.rating ? data.rating + "/10 stars." : "No stars.") ;
            place.url = data.shortUrl;
            newLocationsInfo.push(place);
          })
        }
      })
      .catch((err) => {
        console.log(err);
        place.getDetailsError = err;
        newLocationsInfo.push(place);
      });
  }
  openmarker(marker) {
    //close any existing markers
    this.minimizeMarker();
    //animate the icon of the marker
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
        'previousMarker': marker
    });
    //while waiting for response from displayMarker:
    this.state.currentMarker.setContent('Loading SquareSpace Data...');
    //center the map over the selected icon
    this.state.map.setCenter(marker.getPosition());
    //offset the screen so the menu doesnt hide the marker
    this.state.map.panBy(0, -230);
    // now show the marker info
    this.displayMarker(marker);
    //open the marker window on the map
    this.state.currentMarker.open(this.state.map, marker);
  }
  displayMarker(marker) {
    let self = this;
    let locationInfo = [];
    this.state.cabotPlaces.forEach((place) => {
      if (place.id === marker.id) {
        locationInfo.push(place);
        // console.log(locationInfo);
      }
    });
    locationInfo = locationInfo[0];
    if (!locationInfo.getDetailsError){
      let heading = '<h2 class="location-text">' + locationInfo.name + '</h2>';
      let rating = '<span class="location-text">' + locationInfo.rating + '</span><hr/>';
      let img = locationInfo.img ? '<img src="' + locationInfo.img + '"alt="' + locationInfo.name + '\'s most popular photo" /><br>' : '<span> No Image for this Venue </span><br>';
      let hereNow = '<b>Current Visitors: </b>' + locationInfo.hereNow + '<hr/>';
      let fourSquareLink = '<a href="' + locationInfo.url + '" target="_blank">Check it out on FourSquare!</a> ';
      self.state.currentMarker.setContent(heading + img + rating + hereNow + fourSquareLink);
    } else {
      self.state.currentMarker.setContent("We were unable to retrieve details of this location.");
    }
  }

  minimizeMarker() {
    //stop animations on the previous marker
    if (this.state.previousMarker) {
        this.state.previousMarker.setAnimation(null);
    }
    //close the current currentMarker
    if (this.state.currentMarker) {
      this.state.currentMarker.close();
    }
    // remove the previous marker from the state
    this.setState({
      'previousMarker': ''
    });
  }

  render() {
    return (
      <div>
        <Menu
          key="100"
          cabotPlaces={this.state.cabotPlaces}
          openmarker={this.openmarker}
          minimizeMarker={this.minimizeMarker}
        />
        <div id="map" aria-labelledby="Map"></div>
      </div>
    );
  }
}

export default App;
