import React from 'react';

function MarkerWindow (props) {
  let marker = props.data.marker;
    return (
        <li
          role="button"
          className="box"
          tabIndex="0"
          onKeyPress={props.openInfoWindow.bind(this, marker)}
          onClick={props.openInfoWindow.bind(this, marker)}
          onMouseEnter={props.openInfoWindow.bind(this, marker)}
          onMouseLeave={props.minimizeMarker}
        >{props.data.fullName}</li>
    );
}

export default MarkerWindow;
