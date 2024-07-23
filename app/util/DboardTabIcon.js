'use strict';

import React from 'react';
// import PropTypes from 'prop-types';
import {Image} from 'react-native';

// const propTypes = {
//   focused: PropTypes.bool, // is tab selected
//   image: PropTypes.number, // tab image name
//   activeImage: PropTypes.number,
// };

const defaultProps = {
  focused: false,
};

const DboardTabIcon = props => (
  <Image
    style={{width: 35, height: 35, top: 2}}
    source={props.focused ? props.activeImage : props.image}
    resizeMode={'contain'}
  />
);

// DboardTabIcon.propTypes = propTypes;
DboardTabIcon.defaultProps = defaultProps;

export default DboardTabIcon;
