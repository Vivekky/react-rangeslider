import React, { PropTypes, Component, findDOMNode } from 'react';
import joinClasses from 'react/lib/joinClasses';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
    if (pos < min) { return min; }
    if (pos > max) { return max; }
    return pos;
}

const constants = {
    orientation: {
        horizontal: {
            dimension: 'width',
            direction: 'left',
            coordinate: 'x'
        }, vertical: {
            dimension: 'height',
            direction: 'top',
            coordinate: 'y' }
    }
};

class Slider extends Component {
    static propTypes = {
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      value: PropTypes.number,
      orientation: PropTypes.string,
      onChange: PropTypes.func,
      className: PropTypes.string }

  static defaultProps = {
      min: 0,
      max: 100,
      step: 1,
      value: 0,
      orientation: 'horizontal'
  }

  state = {
      limit: 0,
      grab: 0
  }

  // Add window resize event listener here
  componentDidMount() {
      const { orientation } = this.props;
      const dimension = capitalize(constants.orientation[orientation].dimension);
      const sliderPos = findDOMNode(this.refs.slider)['offset' + dimension];
      const handlePos = findDOMNode(this.refs.handle)['offset' + dimension];
      this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2
      });
  }

  render() {
    let dimension;
    let direction;
    let position;
    let coords;
    let fillStyle;
    let handleStyle;
    let minMarkerStyle;
    let maxMarkerStyle;
    let minMarkerLabelStyle;
    let maxMarkerLabelStyle;
    const { value, orientation, className, minMarker, maxMarker} = this.props;

    dimension = constants.orientation[orientation].dimension;
    direction = constants.orientation[orientation].direction;

    position = this.getPositionFromValue(value);
    coords = this.coordinates(position);

    const positionMinMarker = this.getPositionFromValue(minMarker);
    const positionMaxMarker = this.getPositionFromValue(maxMarker);
    const positionMinMarkerLabel = positionMinMarker - 10;
    const positionMaxMarkerLabel = positionMaxMarker - 10;

    fillStyle = {[dimension]: `${coords.fill}px`};
    handleStyle = {[direction]: `${coords.handle}px`};
    minMarkerStyle = {['marginLeft']: `${positionMinMarker}px`};
    maxMarkerStyle = {['marginLeft']: `${positionMaxMarker}px`};
    minMarkerLabelStyle = {['marginLeft']: `${positionMinMarkerLabel}px`};
    maxMarkerLabelStyle = {['marginLeft']: `${positionMaxMarkerLabel}px`};

    return (
      <div
        ref="slider"
        className={joinClasses('rangeslider ', 'rangeslider-' + orientation, className)}
        onMouseDown={this.handleSliderMouseDown}
        onClick={this.handleNoop}>
        <div
          ref="fill"
          className="rangeslider__fill"
          style={fillStyle} />
        <div
          ref="handle"
          className="rangeslider__handle"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={handleStyle} />
        <div
          ref="slider"
          className="rangeslider__minMarker"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={minMarkerStyle} />
        <div
          ref="slider"
          className="rangeslider__maxMarker"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={maxMarkerStyle} />
        <div
          ref="slider"
          className="rangeslider__minMarkerLabel"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={minMarkerLabelStyle} >
          {minMarker === 10.00 ? minMarker.toFixed(1) : minMarker.toFixed(2)}
          </div>
        <div
          ref="slider"
          className="rangeslider__maxMarkerLabel"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={maxMarkerLabelStyle} >
          {maxMarker === 10.00 ? maxMarker.toFixed(1) : maxMarker.toFixed(2)}
          </div>
      </div>
    );
  }

  handleSliderMouseDown = (e) => {
      let value = this.props;
    const { onChange } = this.props;
      if (!onChange) return;

      value = this.position(e);
      onChange && onChange(value);
  }

  handleKnobMouseDown = () => {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleDragEnd);
  }

  handleDrag = (e) => {
      let value = this.props;
    const { onChange } = this.props;
      if (!onChange) return;

      value = this.position(e);
      onChange && onChange(value);
  }

  handleDragEnd = () => {
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.handleDragEnd);
  }

  handleNoop = (e) => {
      e.stopPropagation();
      e.preventDefault();
  }

  getPositionFromValue = (value) => {
      let percentage;
    let pos;
      const { limit } = this.state;
      const { min, max } = this.props;
      percentage = (value - min) / (max - min);
      pos = Math.round(percentage * limit);

      return pos;
  }

  getValueFromPosition = (pos) => {
    let percentage;
    let value;
    const { limit } = this.state;
      const { orientation, min, max, step } = this.props;
      percentage = (maxmin(pos, 0, limit) / (limit || 1));

      if (orientation === 'horizontal') {
      value = step * Math.round(percentage * (max - min) / step) + min;
      } else {
      value = max - (step * Math.round(percentage * (max - min) / step) + min);
      }

      return value;
  }

  position = (e) => {
    let pos = this.state;
    let value = this.state;
    const { grab } = this.state;
    const { orientation } = this.props;
    const node = findDOMNode(this.refs.slider);
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = constants.orientation[orientation].direction;
    const coordinate = e['client' + capitalize(coordinateStyle)];
    const direction = node.getBoundingClientRect()[directionStyle];

      pos = coordinate - direction - grab;
      value = this.getValueFromPosition(pos);

      return value;
  }

  coordinates = (pos) => {
    let value;
    let fillPos;
    let handlePos;
    const { limit, grab } = this.state;
    const { orientation } = this.props;

      value = this.getValueFromPosition(pos);
      handlePos = this.getPositionFromValue(value);

      if (orientation === 'horizontal') {
      fillPos = handlePos + grab;
      } else {
      fillPos = limit - handlePos + grab;
      }

      return {
      fill: fillPos,
      handle: handlePos
      };
  }
}

export default Slider;
