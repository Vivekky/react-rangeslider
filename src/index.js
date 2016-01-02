'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLibJoinClasses = require('react/lib/joinClasses');

var _reactLibJoinClasses2 = _interopRequireDefault(_reactLibJoinClasses);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
  if (pos < min) {
    return min;
  }
  if (pos > max) {
    return max;
  }
  return pos;
}

var constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x'
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y'
    }
  }
};

var Slider = (function (_Component) {
  _inherits(Slider, _Component);

  function Slider() {
    var _this = this;

    _classCallCheck(this, Slider);

    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      limit: 0,
      grab: 0
    };

    this.handleSliderMouseDown = function (e) {
      var value = undefined;var onChange = _this.props.onChange;

      if (!onChange) return;

      value = _this.position(e);
      onChange && onChange(value);
    };

    this.handleKnobMouseDown = function () {
      document.addEventListener('mousemove', _this.handleDrag);
      document.addEventListener('mouseup', _this.handleDragEnd);
    };

    this.handleDrag = function (e) {
      var value = undefined;var onChange = _this.props.onChange;

      if (!onChange) return;

      value = _this.position(e);
      onChange && onChange(value);
    };

    this.handleDragEnd = function () {
      document.removeEventListener('mousemove', _this.handleDrag);
      document.removeEventListener('mouseup', _this.handleDragEnd);
    };

    this.handleNoop = function (e) {
      e.stopPropagation();
      e.preventDefault();
    };

    this.getPositionFromValue = function (value) {
      var percentage = undefined,
          pos = undefined;
      var limit = _this.state.limit;
      var _props = _this.props;
      var min = _props.min;
      var max = _props.max;
      percentage = (value - min) / (max - min);
      pos = Math.round(percentage * limit);

      return pos;
    };

    this.getValueFromPosition = function (pos) {
      var percentage = undefined,
          value = undefined;
      var limit = _this.state.limit;
      var _props2 = _this.props;
      var orientation = _props2.orientation;
      var min = _props2.min;
      var max = _props2.max;
      var step = _props2.step;

      percentage = maxmin(pos, 0, limit) / (limit || 1);

      if (orientation === 'horizontal') {
        value = step * Math.round(percentage * (max - min) / step) + min;
      } else {
        value = max - (step * Math.round(percentage * (max - min) / step) + min);
      }

      return value;
    };

    this.position = function (e) {
      var pos = undefined;var value = undefined;var grab = _this.state.grab;
      var orientation = _this.props.orientation;

      var node = (0, _react.findDOMNode)(_this.refs.slider);
      var coordinateStyle = constants.orientation[orientation].coordinate;
      var directionStyle = constants.orientation[orientation].direction;
      var coordinate = e['client' + capitalize(coordinateStyle)];
      var direction = node.getBoundingClientRect()[directionStyle];

      pos = coordinate - direction - grab;
      value = _this.getValueFromPosition(pos);

      return value;
    };

    this.coordinates = function (pos) {
      var value = undefined,
          fillPos = undefined,
          handlePos = undefined;
      var _state = _this.state;
      var limit = _state.limit;
      var grab = _state.grab;
      var orientation = _this.props.orientation;

      value = _this.getValueFromPosition(pos);
      handlePos = _this.getPositionFromValue(value);

      if (orientation === 'horizontal') {
        fillPos = handlePos + grab;
      } else {
        fillPos = limit - handlePos + grab;
      }

      return {
        fill: fillPos,
        handle: handlePos
      };
    };

  }

  _createClass(Slider, [{
    key: 'componentDidMount',

    // Add window resize event listener here
    value: function componentDidMount() {
      var orientation = this.props.orientation;

      var dimension = capitalize(constants.orientation[orientation].dimension);
      var sliderPos = (0, _react.findDOMNode)(this.refs.slider)['offset' + dimension];
      var handlePos = (0, _react.findDOMNode)(this.refs.handle)['offset' + dimension];
      this.setState({
        limit: sliderPos - handlePos,
        grab: handlePos / 2
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var dimension = undefined,
          direction = undefined,
          position = undefined,
          coordinate = undefined,
          coords = undefined,
          fillStyle = undefined,
          handleStyle = undefined,
          minMarkerStyle = undefined,
          maxMarkerStyle = undefined,
          minMarkerLabelStyle = undefined,
          maxMarkerLabelStyle = undefined;
      var _props3 = this.props;
      var value = _props3.value;
      var orientation = _props3.orientation;
      var className = _props3.className;
      var minMarker = _props3.minMarker;
      var maxMarker = _props3.maxMarker;
      dimension = constants.orientation[orientation].dimension;
      direction = constants.orientation[orientation].direction;
      coordinate = constants.orientation[orientation].coordinate;
      position = this.getPositionFromValue(value);
      coords = this.coordinates(position);


      var positionMinMarker = this.getPositionFromValue(minMarker);
      var positionMaxMarker = this.getPositionFromValue(maxMarker);
      var positionMinMarkerLabel = positionMinMarker - 12;
      var positionMaxMarkerLabel = positionMaxMarker - 12;

      
      fillStyle = _defineProperty({}, dimension, coords.fill + 'px');
      handleStyle = _defineProperty({}, direction, coords.handle + 'px');
      minMarkerStyle = _defineProperty({}, 'marginLeft', positionMinMarker + 'px');
      maxMarkerStyle = _defineProperty({}, 'marginLeft', positionMaxMarker + 'px');
      minMarkerLabelStyle = _defineProperty({}, 'marginLeft', positionMinMarkerLabel + 'px');
      maxMarkerLabelStyle = _defineProperty({}, 'marginLeft', positionMaxMarkerLabel + 'px');

      return _react2['default'].createElement(
        'div',
        {
          ref: 'slider',
          className: (0, _reactLibJoinClasses2['default'])('rangeslider ', 'rangeslider-' + orientation, className),
          onMouseDown: this.handleSliderMouseDown,
          onClick: this.handleNoop },
        _react2['default'].createElement('div', {
          ref: 'fill',
          className: 'rangeslider__fill',
          style: fillStyle }),
        _react2['default'].createElement('div', {
          ref: 'handle',
          className: 'rangeslider__handle',
          onMouseDown: this.handleKnobMouseDown,
          onClick: this.handleNoop,
          style: handleStyle }),
        _react2['default'].createElement('div', {
          ref: 'slider',
          className: 'rangeslider__minMarker',
          style: minMarkerStyle }),
        _react2['default'].createElement('div', {
          ref: 'slider',
          className: 'rangeslider__maxMarker',
          style: maxMarkerStyle }),
        _react2['default'].createElement('div', {
          ref: 'slider',
          className: 'rangeslider__minMarkerLabel',
          style: minMarkerLabelStyle }, _props3.minMarker === 10.00? _props3.minMarker.toFixed(1): _props3.minMarker.toFixed(2)),
        _react2['default'].createElement('div', {
          ref: 'slider',
          className: 'rangeslider__maxMarkerLabel',
          style: maxMarkerLabelStyle }, _props3.maxMarker === 10.00? _props3.maxMarker.toFixed(1): _props3.maxMarker.toFixed(2))
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      min: _react.PropTypes.number,
      max: _react.PropTypes.number,
      minMarker: _react.PropTypes.number,
      maxMarker: _react.PropTypes.number,
      step: _react.PropTypes.number,
      value: _react.PropTypes.number,
      orientation: _react.PropTypes.string,
      onChange: _react.PropTypes.func,
      className: _react.PropTypes.string
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      min: 0,
      max: 100,
      minMarker: 0,
      maxMarker: 10,
      step: 1,
      value: 0,
      orientation: 'horizontal'
    },
    enumerable: true
  }]);

  return Slider;
})(_react.Component);

exports['default'] = Slider;
module.exports = exports['default'];