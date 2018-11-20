import React, {Component} from 'react';

class Menu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        'cabotPlaces': '',
        'query': '',
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
      const {value} = event.target;
      let cabotPlaces = [];
        // loop through elements and set visibility if they match the query
        this.props.cabotPlaces.forEach((location) => {
            if (location.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                cabotPlaces.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
          'cabotPlaces': cabotPlaces,
          'query': value
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
            <div className="search">
              <div className="button" onClick={this.toggleSuggestions}>
                <h1 className='app-title'> Visit Cabot! </h1>
                <small>Click to {!this.state.showMenu ? 'see' : 'hide' } Suggestions!</small>
                <hr />
              </div>
                <input
                  role="search"
                  aria-labelledby="filter"
                  id="search-input"
                  type="text"
                  placeholder="Search Suggestions"
                  value={this.state.query}
                  onChange={this.filterLocations}
                />
                <ul>
                    {this.state.showMenu && locationlist}
                </ul>
            </div>
        );
    }
}

export default Menu;
