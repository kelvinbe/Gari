import { View, Text, Image } from 'react-native'
import React from 'react'
import { makeStyles, useTheme } from '@rneui/themed'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { ImageBackground } from 'react-native'
import { StyleProp } from 'react-native'
import { ViewStyle } from 'react-native'

interface Props {
    image?: string,
    deleteImage: (image: string) => void,
    containerStyle?: StyleProp<ViewStyle>
}

const useStyles = makeStyles((theme) => {
    return {
        container: {
            width: 100,
            height: 100,
            position: 'relative',
            backgroundColor: theme.colors.grey0,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        deleteButton: {
            width: 30,
            height: 30,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            marginTop: 10
        }
    }
})

const UploadedImage = (props: Props) => {
  const { image, deleteImage, containerStyle } = props
  const styles = useStyles()
  const { theme } = useTheme()
  return (
      <View style={[styles.container, containerStyle]} >
        <ImageBackground
            source={{ uri: image }}
            style={styles.image}
        >
            <TouchableOpacity onPress={()=>{
                deleteImage(image ?? "")
            }} style={styles.deleteButton} >
                <Ionicons name="md-trash-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
        </ImageBackground>
          
          {/* <Image source={{ uri: image, width: 100, height: 100 }} style={styles.image} /> */}
          
      </View>
  )
}

export default UploadedImage