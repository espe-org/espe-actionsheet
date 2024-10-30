import DeviceInfo from 'react-native-device-info'
import Modal from 'react-native-modal'
import Radio from './Radio'
import React, { useEffect, useRef } from 'react'
import { Appearance, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface IActionSheetOverlayModalProps {
  title: string | { header: string; text: string; };
  buttons: { text: string; description?: string; onPress: () => void }[];
  visible: boolean;
  hide: () => void;
  selected?: number;
  forceModal?: boolean;
  scrollToIndex?: number;
  throttled?: boolean;
  isDarkMode?: boolean;
  mainColor?: string;
}

const ActionSheetOverlayModal: React.FunctionComponent<IActionSheetOverlayModalProps> = ({ buttons, title, visible, hide, selected, forceModal, scrollToIndex, throttled, isDarkMode, mainColor }) => {
  const AppConfig = {
    iOS: Platform.OS === 'ios',
    android: Platform.OS === 'android',
    // @ts-ignore
    mac: Platform.isMacCatalyst,
    hasNotch: DeviceInfo.hasNotch(),
    dark: isDarkMode ?? Appearance.getColorScheme() === 'dark',
    scale: 1,
    getDeviceId: DeviceInfo.getDeviceId(),
    get isFaceIDPad() {
      if (this.getDeviceId.substring(0, 4) === 'iPad') {
        if (Number(this.getDeviceId.substring(4, 5)) > 7 || Number(this.getDeviceId.substring(4, 6)) > 12) {
          return true
        }
        return false
      }
      return false
    },
    get mainColor() {
      return mainColor || (this.dark ? '#87DC84' : '#049A00');
    },
    get plainColor() {
      return this.dark ? 'white' : 'black';
    },
    get secondaryColor() {
      return this.dark ? '#888888' : '#777777'
    },
    get grayColor() {
      return this.dark ? '#BABABA' : '#999999';
    },
    get borderColor() {
      return this.dark ? '#313131' : '#DDDDDD';
    },
  };

  const filteredButtons = buttons.filter(item => item)

  const scrollRef = useRef<ScrollView>(null)

  const itemHeight = 44

  useEffect(() => {
    if (visible && !!scrollToIndex && !!scrollRef?.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ y: scrollToIndex * itemHeight + 1, animated: false })
      }, 50)
    }
  }, [visible])

  const mappedButtons = filteredButtons.map((button, index) => (
    <TouchableOpacity
      key={button.text}
      onPress={() => {
        if (forceModal) {
          hide()
          button.onPress()
        } else if (throttled) {
          hide()
          setTimeout(() => button.onPress(), 100)
        } else {
          hide()
          button.onPress()
        }
      }}
      style={[
        {
          height: itemHeight,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: selected !== undefined && selected !== null ? 'space-between' : 'center'
        },
        index && {
          borderTopWidth: 1,
          borderTopColor: AppConfig.borderColor,
        }
      ]}
      testID={button.text}
    >
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <Text
          style={{
            fontSize: 15 * AppConfig.scale,
            fontFamily: 'TTNorms-Medium',
            color: AppConfig.plainColor,
            textAlign: selected !== undefined && selected !== null ? 'left' : 'center'
          }}
        >
          {button.text}
        </Text>
        {button.description ? (
          <Text
            style={{
              fontSize: 11 * AppConfig.scale,
              fontFamily: 'TTNorms-Regular',
              color: AppConfig.grayColor,
              textAlign: selected !== undefined && selected !== null ? 'left' : 'center'
            }}
          >
            {button.description}
          </Text>
        ) : null}
      </View>
      {selected !== undefined && selected !== null ? <Radio mainColor={AppConfig.mainColor} size={18} checked={selected === index} /> : null}
    </TouchableOpacity>
  ))

  const content = (
    <>
      <View
        style={[
          {
            paddingVertical: 1,
            borderRadius: AppConfig.android ? 8 : 12,
            backgroundColor: AppConfig.dark ? '#242424' : 'white',
            elevation: 32,
            alignSelf: 'center',
            width: 280
          },
          AppConfig.mac ? { maxHeight: 400 } : {}
        ]}
      >
        {title ? (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: AppConfig.borderColor,
            }}
          >
            {typeof title === 'object' ? (
              <>
                <Text
                  style={{
                    fontSize: 12 * AppConfig.scale,
                    fontFamily: 'TTNorms-Medium',
                    color: AppConfig.plainColor,
                    textAlign: 'center'
                  }}
                >
                  {title.header}
                </Text>
                <Text
                  style={{
                    fontSize: 10 * AppConfig.scale,
                    fontFamily: 'TTNorms-Medium',
                    color: AppConfig.secondaryColor,
                    textAlign: 'center'
                  }}
                >
                  {title.text}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  fontSize: 12 * AppConfig.scale,
                  fontFamily: 'TTNorms-Medium',
                  color: AppConfig.grayColor,
                  textAlign: 'center'
                }}
              >
                {title}
              </Text>
            )}
          </View>
        ) : null}

        {AppConfig.mac && filteredButtons.length < 8 ? (
          <View>
            {mappedButtons}
          </View>
        ) : (
          <ScrollView ref={scrollRef}>
            {mappedButtons}
          </ScrollView>
        )}
      </View>
    </>
  )

  return (
    <Modal
      animationIn='zoomIn'
      animationOut='zoomOut'
      isVisible={visible}
      useNativeDriver={false}
      backdropOpacity={0}
      style={{
        margin: 28,
        elevation: 2,
        marginBottom: (AppConfig.hasNotch || AppConfig.isFaceIDPad || AppConfig.android) ? 20 : 0,
        width: 200,
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: '#111111',
        shadowOpacity: 0.1,
        shadowRadius: 40,
        shadowOffset: { width: 0, height: 0 },
      }}
      onBackButtonPress={hide}
      onBackdropPress={hide}
    >
      {content}
    </Modal>
  )
}

export default ActionSheetOverlayModal
