import React, {Component} from 'react';

class Menu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        'cabotPlaces': [],
        'inputVal': '',
        'showMenu': false,
      };
      // so we dont lose context
      this.filterLocations = this.filterLocations.bind(this);
      this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }
    componentWillMount() {
      this.setState({
        'cabotPlaces': this.props.cabotPlaces
      });
    }
    toggleSuggestions() {
      this.setState({
        'showMenu': !this.state.showMenu
      });
    }
    // filters the list of suggestions
    filterLocations(event) {
      this.props.minimizeMarker();
      let input = document.getElementById('search-input');
      let inputVal = input.value;
      let inputString = inputVal.toUpperCase();
      let filteredPlaces = [];
      // loop through elements and set visibility if they match the input
      // inspired by w3c https://www.w3schools.com/howto/howto_js_filter_lists.asp
      this.props.cabotPlaces.forEach((location) => {
        if (location.fullName.toUpperCase().indexOf(inputString) > -1) {
          location.marker.setVisible(true);
          filteredPlaces.push(location);
        } else {
          location.marker.setVisible(false);
        }
      });
      this.setState({
        'cabotPlaces': filteredPlaces,
        'inputVal': inputVal
      });
    }
    render() {
        let locationlist = this.state.cabotPlaces.map((listItem, index) => {
            return (
                <li
                  openMarker={this.props.openMarker.bind(this)}
                  key={index}
                  role="button"
                  className="box"
                  tabIndex="0"
                  onKeyPress={this.props.openMarker.bind(this, listItem.marker)}
                  onClick={this.props.openMarker.bind(this, listItem.marker)}
                >{listItem.fullName}</li>
            );
        }, this);

        return (
            <div className="search-menu">
              <div className="button" onClick={this.toggleSuggestions}>
                <h1 className='app-title'> Visit Cabot! </h1>
                <small>Click to {!this.state.showMenu ? 'see' : 'hide' } Suggestions!</small>
                <hr />
              </div>
                <input
                  role="search"
                  aria-labelledby="Search"
                  id="search-input"
                  type="text"
                  placeholder="Search Suggestions"
                  value={this.state.inputVal}
                  onChange={this.filterLocations}
                />
                <ul className="locations-list">
                    {this.state.showMenu && locationlist}
                </ul>
            </div>
        );
    }
}

export default Menu;
