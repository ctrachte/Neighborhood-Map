import React, {Component} from 'react';
import Menu from './Menu';
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
        self.getLocationInfo();
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
    // get additional info for each location based on API information
    getLocationInfo () {
      const clientId = "client_id=2WN2LW0H3PTZ5ANP5B2P1ZPF0JIDBWZNPHXPBDZIRPJVGPJQ";
      const clientSecret = "&client_secret=GZNVTNU3MJ0MTEXZD1G14QZA4R4IAB3FH5MLL21MLIBULV5J";
      const version = "&v=20181115";
      const limit = "&limit=1";
      let newLocationsInfo = [];
      this.state.cabotPlaces.forEach((place) => {
        let fullName = place.name + ' - ' + place.description;
        let marker = new window.google.maps.Marker({
          animation: window.google.maps.Animation.DROP,
          position: new window.google.maps.LatLng(place.latitude, place.longitude),
          map: this.state.map
        });
        marker.addListener('click', function () {
            this.openInfoWindow(marker);
        });
        place.fullName = fullName;
        place.marker = marker;
        place.display = true;
        let lat = place.latitude;
        let long = place.longitude;
        let url = "https://api.foursquare.com/v2/venues/search?" + clientId + clientSecret + version + "&ll=" + lat + "," + long + limit;
        fetch(url).then((res) => {
          if (res.status !== 200) {
            place.id = false;
            newLocationsInfo.push(place);
          } else {
            res.json().then((data) => {
              place.id = data.response.venues[0].id;
              newLocationsInfo.push(place);
            })
          }
        })
        .catch((err) => {
          console.log(err);
          place.id = false;
          newLocationsInfo.push(place);
        });
      });
      this.setState({
        cabotPlaces: newLocationsInfo
      });
    }


    displayMarker(marker) {
      //set the marker, and url to request info
        // let self = this;
        console.log('displaymarker called', marker)
        // const clientId = "client_id=2WN2LW0H3PTZ5ANP5B2P1ZPF0JIDBWZNPHXPBDZIRPJVGPJQ";
        // const clientSecret = "&client_secret=GZNVTNU3MJ0MTEXZD1G14QZA4R4IAB3FH5MLL21MLIBULV5J";
        // const version = "&v=20181115";
        // we only want one result
        // const limit = "&limit=1";
        //
        // let lat = marker.getPosition().lat();
        // let long = marker.getPosition().lng();
        // // get marker information from FourSqure API
        // let url = "https://api.foursquare.com/v2/venues/search?" + clientId + clientSecret + version + "&ll=" + lat + "," + long + limit;
        // fetch(url)
        //     .then(
        //         function (res) {
        //             if (res.status !== 200) {
        //                 self.state.infowindow.setContent("We were unable to retrieve this locations info!");
        //                 return;
        //             }
        //             res.json().then(function (data) {
        //               console.log(data)
        //                 let locationInfo = data.response.venues[0];
        //                 let heading = '<h2 class="location-text">' + locationInfo.name + '</h2>';
        //                 let category = '<span class="location-text">' + locationInfo.categories[0].name + '</span><hr/>';
        //                 let checkinsCount = '<b>Number of Check-Ins: </b>' + locationInfo.stats.checkinsCount + '<br>';
        //                 let usersCount = '<b>Total Visitors: </b>' + locationInfo.stats.usersCount + '<br>';
        //                 let hereNow = '<b>Current Visitors: </b>' + locationInfo.hereNow.summary + '<hr/>';
        //                 let fourSquareLink = '<a href="https://foursquare.com/v/'+ locationInfo.id +'" target="_blank">Check it out on FourSquare!</a> '
        //                 self.state.infowindow.setContent(heading + category + checkinsCount + usersCount + hereNow + fourSquareLink);
        //             });
        //         }
        //     )
        //     .catch(function (err) {
        //       self.state.infowindow.setContent("We were unable to retrieve this locations info!");
        //     });
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
