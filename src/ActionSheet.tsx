import ActionSheetOverlayModal from './ActionSheetOverlayModal'
import { MenuView } from '@react-native-menu/menu'
import { Platform, TouchableOpacity, View } from 'react-native'
import React, { type ReactNode } from 'react'

interface IActionSheetProps {
  actions: any[];
  touchable?: boolean;
  key?: number | string;
  style?: Record<string, any>;
  forced?: boolean;
  message?: string | { header: string; text: string; };
  testID?: string;
  forceModal?: boolean;
  selected?: number;
  onLongPress?: () => void;
  throttled?: boolean;
  children?: ReactNode | ReactNode[];
  classicMode?: boolean;
  menuMode?: boolean;
  scrollToIndex?: number;
  isDarkMode?: boolean;
  mainColor?: string;
}

class ActionSheet extends React.Component<IActionSheetProps> {
  AppConfig = {
    iOS: Platform.OS === 'ios',
    android: Platform.OS === 'android',
    // @ts-ignore
    mac: Platform.isMacCatalyst,
    get isPad() {
      return this.windowWidth > 767 || this.mac
    },
    dark: this.props.isDarkMode,
  }

  static defaultProps = {
    touchable: true,
    forced: false,
    style: {}
  }

  state = {
    visible: false,
  }

  showActionSheet = () => {
    this.setState({ visible: true })
  }

  hideActionSheet = () => {
    this.setState({ visible: false })
  }

  componentDidUpdate(prevProps: Readonly<IActionSheetProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.isDarkMode !== this.props.isDarkMode) {
      this.AppConfig.dark = this.props.isDarkMode
    }
  }

  render() {
    const actions = this.props.actions.filter(r => r)

    if (!this.props.touchable || !actions.filter(r => r).length) {
      return (
        <View style={this.props.style} testID={this.props.testID}>
          {this.props.children}
        </View>
      )
    }

    if (actions.length === 1 && !this.props.forced) {
      return (
        <TouchableOpacity
          style={this.props.style}
          onPress={actions[0].onPress}
          onLongPress={this.props.onLongPress}
          testID={this.props.testID}
        >
          {this.props.children}
        </TouchableOpacity>
      )
    }

    if ((this.AppConfig.android || this.props.classicMode) && !this.props.menuMode) {
      return (
        <TouchableOpacity
          style={this.props.style}
          onPress={this.showActionSheet}
          onLongPress={this.props.onLongPress}
          testID={this.props.testID}
        >
          {this.props.children}
          <ActionSheetOverlayModal
            buttons={this.props.actions.filter(r => r)}
            title={this.props.message}
            visible={this.state.visible}
            hide={this.hideActionSheet}
            selected={this.props.selected}
            forceModal={this.props.forceModal || this.AppConfig.mac}
            scrollToIndex={this.props.scrollToIndex}
            throttled={this.props.throttled}
            mainColor={this.props.mainColor}
            isDarkMode={this.props.isDarkMode}
          />
        </TouchableOpacity>
      )
    }

    const menuActions = actions.map((a, index) => {
      const action = {
        id: index.toString(),
        title: a.text,
        subtitle: a.description,
      }

      // if (this.props.selected) {
      //   return { ...action, state: this.props.selected === index ? 'on' as const : 'off' as const }
      // }

      return { ...action, state: this.props.selected === index ? 'on' as const : 'off' as const }
    })

    const menuTitle = typeof (this.props.message) === 'object' ? this.AppConfig.android ? this.props.message.header : this.props.message.header + ' ' + this.props.message.text : this.props.message

    const onPressAction = e => {
      const { event } = e.nativeEvent

      if (this.props.throttled) {
        setTimeout(() => actions[Number(event)].onPress(), 100)
      } else {
        actions[Number(event)].onPress()
      }
    }

    return (
      // @ts-ignore
      <MenuView
        themeVariant={this.AppConfig.dark ? 'dark' : 'light'}
        title={menuTitle}
        style={this.props.style}
        onPressAction={onPressAction}
        actions={menuActions}
      >
        {this.props.children}
      </MenuView>
    )
  }
}

export default ActionSheet
