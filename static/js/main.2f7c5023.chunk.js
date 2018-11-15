(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var o=n(0),i=n.n(o),a=n(8),s=n.n(a),r=(n(14),n(2)),c=n(3),l=n(6),u=n(4),d=n(5),h=n(1);var m=function(e){var t=e.data.marker;return i.a.createElement("li",{role:"button",className:"box",tabIndex:"0",onKeyPress:e.openInfoWindow.bind(this,t),onClick:e.openInfoWindow.bind(this,t),onMouseEnter:e.openInfoWindow.bind(this,t),onMouseLeave:e.minimizeMarker},e.data.fullName)},p=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={locations:"",query:"",showMenu:!1},n.filterLocations=n.filterLocations.bind(Object(h.a)(Object(h.a)(n))),n.toggleSuggestions=n.toggleSuggestions.bind(Object(h.a)(Object(h.a)(n))),n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"filterLocations",value:function(e){this.props.minimizeMarker();var t=e.target.value,n=[];this.props.cabotPlaces.forEach(function(e){e.fullName.toLowerCase().indexOf(t.toLowerCase())>=0?(e.marker.setVisible(!0),n.push(e)):e.marker.setVisible(!1)}),this.setState({locations:n,query:t})}},{key:"componentWillMount",value:function(){this.setState({locations:this.props.cabotPlaces})}},{key:"toggleSuggestions",value:function(){this.setState({showMenu:!this.state.showMenu})}},{key:"render",value:function(){var e=this,t=this.state.locations.map(function(t,n){return i.a.createElement(m,{key:n,openInfoWindow:e.props.openInfoWindow.bind(e),data:t})},this);return i.a.createElement("div",{className:"search"},i.a.createElement("div",{className:"button",onClick:this.toggleSuggestions},i.a.createElement("h1",{className:"app-title"}," Visit Cabot! "),i.a.createElement("small",null,"Click to ",this.state.showMenu?"hide":"see"," Suggestions!"),i.a.createElement("hr",null)),i.a.createElement("input",{role:"search","aria-labelledby":"filter",id:"search-field",className:"search-field",type:"text",placeholder:"Filter Suggestions",value:this.state.query,onChange:this.filterLocations}),i.a.createElement("ul",null,this.state.showMenu&&t))}}]),t}(o.Component);var f=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={cabotPlaces:[],map:"",infowindow:"",previousMarker:""},n.initMap=n.initMap.bind(Object(h.a)(Object(h.a)(n))),n.openInfoWindow=n.openInfoWindow.bind(Object(h.a)(Object(h.a)(n))),n.minimizeMarker=n.minimizeMarker.bind(Object(h.a)(Object(h.a)(n))),n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentWillMount",value:function(){this.setState({cabotPlaces:[{name:"The Purple Onion",description:"Restaurant",latitude:34.955031,longitude:-92.007987,streetAddress:"1101 S Pine St, Cabot, AR 72023"},{name:"Allfam Bowling & Entertainment Center",description:"Bowling",latitude:34.941082,longitude:-92.049554,streetAddress:"2350 Lakewood Dr, Cabot, AR 72023"},{name:"Silver Screen Cinema 8",description:"Movie Theater",latitude:34.97754,longitude:-92.024227,streetAddress:"100 Cinema Blvd, Cabot, AR 72023"},{name:"Grinds Coffee Co",description:"Coffee Shop",latitude:34.944463,longitude:-92.009152,streetAddress:"8177, 1904 S Pine St ste a, Cabot, AR 72023"},{name:"Walmart Neighborhood Market",description:"Grocery Store",latitude:34.953394,longitude:-92.00702,streetAddress:"1203 S Pine St, Cabot, AR 72023"}]})}},{key:"componentDidMount",value:function(){window.initMap=this.initMap;!function(e){var t=window.document.getElementsByTagName("script")[0],n=window.document.createElement("script");n.src=e,n.async=!0,n.onerror=function(){document.write("There was an error loading Google Maps!")},t.parentNode.insertBefore(n,t)}("https://maps.googleapis.com/maps/api/js?key=AIzaSyAePOTf0XVIBUytjxUa0Pg0QSU7Jp23LiI&callback=initMap")}},{key:"initMap",value:function(){var e=this,t=document.getElementById("map");t.style.height=window.innerHeight+"px";var n=new window.google.maps.Map(t,{center:{lat:34.963541,lng:-92.02244},zoom:13,mapTypeControl:!1,fullscreenControl:!1}),o=new window.google.maps.InfoWindow({});window.google.maps.event.addListener(o,"closeclick",function(){e.minimizeMarker()}),this.setState({map:n,infowindow:o}),window.google.maps.event.addDomListener(window,"resize",function(){var t=n.getCenter();window.google.maps.event.trigger(n,"resize"),e.state.map.setCenter(t)}),window.google.maps.event.addListener(n,"click",function(){e.minimizeMarker()});var i=[];this.state.cabotPlaces.forEach(function(t){var o=t.name+" - "+t.description,a=new window.google.maps.Marker({position:new window.google.maps.LatLng(t.latitude,t.longitude),animation:window.google.maps.Animation.DROP,map:n});a.addListener("click",function(){e.openInfoWindow(a)}),t.fullName=o,t.marker=a,t.display=!0,i.push(t)}),this.setState({cabotPlaces:i})}},{key:"openInfoWindow",value:function(e){this.minimizeMarker(),this.state.infowindow.open(this.state.map,e),e.setAnimation(window.google.maps.Animation.BOUNCE),this.setState({previousMarker:e}),this.state.infowindow.setContent("Loading SquareSpace Data..."),this.state.map.setCenter(e.getPosition()),this.state.map.panBy(0,-250),this.displayMarker(e)}},{key:"displayMarker",value:function(e){var t=this,n=e.getPosition().lat(),o=e.getPosition().lng();fetch("https://api.foursquare.com/v2/venues/search?client_id=2WN2LW0H3PTZ5ANP5B2P1ZPF0JIDBWZNPHXPBDZIRPJVGPJQ&client_secret=GZNVTNU3MJ0MTEXZD1G14QZA4R4IAB3FH5MLL21MLIBULV5J&v=20130815&ll="+n+","+o+"&limit=1").then(function(e){200===e.status?e.json().then(function(e){var n=e.response.venues[0],o='<h2 class="location-text">'+n.name+"</h2>",i='<span class="location-text">'+n.categories[0].name+"</span><hr/>",a="<b>Number of Check-Ins: </b>"+n.stats.checkinsCount+"<br>",s="<b>Total Visitors: </b>"+n.stats.usersCount+"<br>",r="<b>Current Visitors: </b>"+n.hereNow.summary+"<hr/>",c='<a href="https://foursquare.com/v/'+n.id+'" target="_blank">Check it out on FourSquare!</a> ';t.state.infowindow.setContent(o+i+a+s+r+c)}):t.state.infowindow.setContent("We were unable to retrieve this locations info!")}).catch(function(e){t.state.infowindow.setContent("We were unable to retrieve this locations info!")})}},{key:"minimizeMarker",value:function(){this.state.previousMarker&&this.state.previousMarker.setAnimation(null),this.setState({previousMarker:""}),this.state.infowindow.close()}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(p,{key:"100",cabotPlaces:this.state.cabotPlaces,openInfoWindow:this.openInfoWindow,minimizeMarker:this.minimizeMarker}),i.a.createElement("div",{id:"map"}))}}]),t}(o.Component),w=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function g(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}s.a.render(i.a.createElement(f,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/Neighborhood-Map",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/Neighborhood-Map","/service-worker.js");w?(function(e,t){fetch(e).then(function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):g(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):g(t,e)})}}()},9:function(e,t,n){e.exports=n(16)}},[[9,2,1]]]);
//# sourceMappingURL=main.2f7c5023.chunk.js.map