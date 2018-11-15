import React, {Component} from 'react';
import Menu from './Menu';
import * as mapHelper from '../utils/mapHelper';
import * as dataHelper from '../utils/dataHelper';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'cabotPlaces':[],
            'map': '',
            'infowindow': '',
            'previousMarker': ''
        };

        // keep context when invoking functions
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
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
      // Asynchronously load Google Maps
      const mapsKey = 'AIzaSyAePOTf0XVIBUytjxUa0Pg0QSU7Jp23LiI';
      const mapsCallback = 'initMap';
      const mapsURL = 'https://maps.googleapis.com/maps/api/js?key=' + mapsKey + '&callback=' + mapsCallback;
      mapHelper.createMap(mapsURL);
    }
    // most of this init function is based on the Udacity google maps API course example
    initMap() {
        let self = this;

        let mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        let map = new window.google.maps.Map(mapview, {
            center: {lat: 34.963541, lng: -92.022440}, // the center of Cabot, Ar
            zoom: 13,
            mapTypeControl: false,
            fullscreenControl: false
        });

        let InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.minimizeMarker();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });
        // make the map responsive if screen size changes
        window.google.maps.event.addDomListener(window, "resize", function () {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });
        // if the user clicks somewhere on the map, close the info marker
        window.google.maps.event.addListener(map, 'click', function () {
            self.minimizeMarker();
        });
        // for each location in our cabotPlaces array, drop (animate) a pin
        let cabotPlaces = [];
        this.state.cabotPlaces.forEach(function (location) {
            let fullName = location.name + ' - ' + location.description;
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });
            // have the pin listen for clicks, and open the info marker window
            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });
            // add properties to our location object
            location.fullName = fullName;
            location.marker = marker;
            location.display = true;
            cabotPlaces.push(location);
        });
        this.setState({
            'cabotPlaces': cabotPlaces
        });
    }

    openInfoWindow(marker) {
        //close any existing markers
        this.minimizeMarker();
        //open the marker window on the map
        this.state.infowindow.open(this.state.map, marker);
        //animate the icon of the marker
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'previousMarker': marker
        });
        //while waiting for response from displayMarker:
        this.state.infowindow.setContent('Loading SquareSpace Data...');
        //center the map over the selected icon
        this.state.map.setCenter(marker.getPosition());
        //offset the screen so the menu doesnt hide the marker
        this.state.map.panBy(0, -250);
        // now show the marker info
        this.displayMarker(marker);
    }

    displayMarker(marker) {
      //set the marker, and url to request info
        let self = this;
        const clientId = "client_id=2WN2LW0H3PTZ5ANP5B2P1ZPF0JIDBWZNPHXPBDZIRPJVGPJQ";
        const clientSecret = "&client_secret=GZNVTNU3MJ0MTEXZD1G14QZA4R4IAB3FH5MLL21MLIBULV5J";
        const version = "&v=20130815";
        // we only want one result
        const limit = "&limit=1";

        let lat = marker.getPosition().lat();
        let long = marker.getPosition().lng();
        // get marker information from FourSqure API
        let url = "https://api.foursquare.com/v2/venues/search?" + clientId + clientSecret + version + "&ll=" + lat + "," + long + limit;
        // TODO: move this fetch call to component life cycle event, to avoid reloading information
        fetch(url)
            .then(
                function (res) {
                    if (res.status !== 200) {
                        self.state.infowindow.setContent("We were unable to retrieve this locations info!");
                        return;
                    }
                    res.json().then(function (data) {
                        let locationInfo = data.response.venues[0];
                        let heading = '<h2 class="location-text">' + locationInfo.name + '</h2>';
                        let category = '<span class="location-text">' + locationInfo.categories[0].name + '</span><hr/>';
                        let checkinsCount = '<b>Number of Check-Ins: </b>' + locationInfo.stats.checkinsCount + '<br>';
                        let usersCount = '<b>Total Visitors: </b>' + locationInfo.stats.usersCount + '<br>';
                        let hereNow = '<b>Current Visitors: </b>' + locationInfo.hereNow.summary + '<hr/>';
                        let fourSquareLink = '<a href="https://foursquare.com/v/'+ locationInfo.id +'" target="_blank">Check it out on FourSquare!</a> '
                        self.state.infowindow.setContent(heading + category + checkinsCount + usersCount + hereNow + fourSquareLink);
                    });
                }
            )
            .catch(function (err) {
              self.state.infowindow.setContent("We were unable to retrieve this locations info!");
            });
    }

    minimizeMarker() {
      //stop animations on the previous marker
        if (this.state.previousMarker) {
            this.state.previousMarker.setAnimation(null);
        }
        // remove the previous marker from the state
        this.setState({
            'previousMarker': ''
        });
        //close the current infowindow
        this.state.infowindow.close();
    }

  render() {
    return (
      <div>
        <Menu
          key="100"
          cabotPlaces={this.state.cabotPlaces}
          openInfoWindow={this.openInfoWindow}
          minimizeMarker={this.minimizeMarker}
        />
        <div id="map"></div>
      </div>
    );
  }
}

export default App;
