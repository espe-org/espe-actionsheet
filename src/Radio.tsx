import React from 'react'
import { Image, View } from 'react-native'

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
      <Image
        source={require('./check.png')}
        style={{ width: this.props.size, height: this.props.size, tintColor: this.props.mainColor }}
      />
    ) : null

    return (
      <View style={{ width: 36, alignItems: 'center', backgroundColor: 'transparent' }}>
        {icon}
      </View>
    )
  }
}
