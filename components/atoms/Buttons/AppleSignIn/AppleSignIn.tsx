import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as AppleAuthentication from 'expo-apple-authentication';

const AppleSignIn = () => {
  return (
    <View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 44 }}
        onPress={async () => {
        }}
        />
    </View>
  )
}

export default AppleSignIn

const styles = StyleSheet.create({})