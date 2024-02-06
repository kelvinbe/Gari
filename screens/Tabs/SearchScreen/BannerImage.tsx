import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { ImageBackground } from 'react-native'
import { Image, makeStyles } from '@rneui/themed'
import { useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'


const BannerImage = () => {
    const maxWidth = Dimensions.get('window').width
  return (
    <ImageBackground
      source={require('../../../assets/images/background-home.png')}
      style={[{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 30,
        overflow: 'hidden',
      }, { width: maxWidth, height: 356 }]}
      resizeMode="cover">
      <LinearGradient
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          },
          {
            width: maxWidth,
            height: 356,
          },
        ]}
        start={{
          x: 0.5,
          y: 0,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)']}
        locations={[0, 0.6927, 1]}
      />
      <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} />
      <Text style={styles.heading}>Airbnb Host Car Sharing</Text>
      <Text style={styles.subHeading}>Rent a car hourly with fuel included</Text>
    </ImageBackground>
  )
}

export default React.memo(BannerImage)

const styles = StyleSheet.create({
    topContentContainerStyle: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingVertical: 30,
      paddingHorizontal: 40,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      marginBottom: 30,
      overflow: 'hidden',
    },
    logoImage: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      marginBottom: 20,
    },
    heading: {
      color: 'white', // hardcoded color
      fontSize: 24,
      lineHeight: 24,
      textAlign: 'center',
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
      width: '100%',
      marginBottom: 10,
    },
    subHeading: {
      color: 'white', // hardcoded color
      fontSize: 20,
      lineHeight: 20,
      textAlign: 'center',
      fontWeight: '500',
      fontFamily: 'Lato_400Regular',
      width: '100%',
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
  })