import React, {Component} from 'react';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'showMenu': false,
        };
        // so we dont lose context
        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }
    componentWillMount() {
      this.setState({
        'locations': this.props.cabotPlaces
      });
    }
    // filters the list of suggestions
    filterLocations(event) {
        this.props.minimizeMarker();
        const {value} = event.target;
        let locations = [];
        // loop through elements and set visibility if they match the query
        this.props.cabotPlaces.forEach(function (location) {
            if (location.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }



    toggleSuggestions() {
        this.setState({
            'showMenu': !this.state.showMenu
        });
    }

    render() {
        let locationlist = this.state.locations.map((listItem, index) => {
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
                  id="search-field"
                  className="search-field"
                  type="text"
                  placeholder="Filter Suggestions"
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
