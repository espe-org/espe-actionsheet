import Icon from 'react-native-vector-icons/Feather'
import React from 'react'
import { View } from 'react-native'

interface IRadioProps {
  checked: boolean;
  mainColor: string;
  size?: number;
  style?: Record<string, any>;
}

export default class Radio extends React.Component<IRadioProps> {
  static defaultProps = {
    size: 23
  };

  render() {
    const icon = this.props.checked ? (
      <Icon
        name='check'
        size={this.props.size}
        color={this.props.mainColor}
      />
    ) : null

    return (
      <View style={{ width: 36, alignItems: 'center', backgroundColor: 'transparent' }}>
        {icon}
      </View>
    )
  }
}
