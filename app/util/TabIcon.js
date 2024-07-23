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

const TabIcon = props => (
  <Image
    style={{width: 25, height: 25, top: 2}}
    source={props.focused ? props.activeImage : props.image}
    resizeMode={'contain'}
  />
);

// TabIcon.propTypes = propTypes;
TabIcon.defaultProps = defaultProps;

export default TabIcon;
