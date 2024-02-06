import { View, Text, Touchable, FlatList, Image, ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CheckBox, makeStyles, useTheme } from '@rneui/themed'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseInput from '../../../atoms/Input/BaseInput/BaseInput'
import UploadedImage from '../../../atoms/Images/UploadedImage/UploadedImage'
import { isEmpty, last } from 'lodash'
import { MediaTypeOptions, launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker'
import useToast from '../../../../hooks/useToast'
import { uploadToFirebase } from '../../../../utils/utils'

interface State {
  description: string | null,
  option: 'yes' | 'no' | null,
  images: string[] | null,
  takenPictureUploading: boolean
  chosenPictureUploading: boolean
}

interface IProps {
  question: string,
  onChanges: (value: State & {index: number}) => void,
  index: number,
  initData: State | null,
  containerStyle?: StyleProp<ViewStyle>
}

const useStyles = makeStyles((theme)=>{
  return {
    container: {
      width: "100%",
    },
    queryText: {
      fontSize: 16,
      fontWeight: "600",
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 5
    },
    queryInputContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15
    },
    queryInputLeftContainer: {
      width: "50%",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    queryInputRightContainer: {
      width: "20%",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row"
    },
    radioOptionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start"
    },
    radioOptionText: {
      fontSize: 16,
      fontWeight: "500",
    },
    descriptionContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    checkboxStyle: {
      backgroundColor: "transparent",
      padding: 0,
      margin: 0
    },
    imagesContainer: {
      padding: 5,
      marginRight: 100
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      backgroundColor: theme.colors.stroke,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 5,
    }
  }
})

const VehicleInspectionQuery = (props: IProps) => {
  const { onChanges, question, index, initData, containerStyle } = props
  const image_list_ref = useRef<FlatList>(null)
  const [inputState, setInputState] = useState<State>({
    description: null,
    option: null,
    images: null,
    takenPictureUploading: false,
    chosenPictureUploading: false
  })


  const toast = useToast()

  const yes = () => {
    setInputState((prev)=>({
      ...prev,
      option: 'yes'
    }))
  }

  const no = () => {
    setInputState((prev)=>({
      ...prev,
      option: 'no'
    }))
  }

  const chooseImage = () => {
    launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((result)=>{
      if(!result.canceled){
        if(result.canceled) return toast({
          message: "Image upload cancelled",
          type: "error"
      })
      if(!isEmpty(result?.assets)){
          setInputState((prev)=>({
              ...prev,
              chosenPictureUploading: true
          }))
          Promise.all(result.assets.map((asset)=>{
              return uploadToFirebase(asset.uri, asset.fileName ?? Date.now().toString(), "image/jpeg").then((url)=>url).catch((e)=>{
                  /**
                   * @todo logrocket for upload error
                   */
                  toast({
                      message: "Image upload failed",
                      type: "error"
                  })
                  return null
              })
          })).then((urls)=>{
              const filteredUrls = urls.filter((url)=>!isEmpty(url)) as string[]
              setInputState((prev)=>({
                  ...prev,
                  images: [...(inputState.images ?? []), ...filteredUrls]
              }))
          }).catch((e)=>{
              // error toasts have already been displayed
              // add logrocket implementation
          }).finally(()=>{
              setInputState((prev)=>({
                  ...prev,
                  chosenPictureUploading: false
              }))
          })
        } 
      }
    }).catch((e)=> {
      toast({
        type: "error",
        message: "Error choosing picture",
        title: "Error"
      })
    })
  }

  const takePicture = () => {
    launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    }).then((result)=>{
      if(!result.canceled){
        if(result.canceled) return toast({
          message: "Image upload cancelled",
          type: "error"
      })
      if(!isEmpty(result?.assets)){
        setInputState((prev)=>({
            ...prev,
            takenPictureUploading: true
        }))
          Promise.all(result.assets.map((asset)=>{
              return uploadToFirebase(asset.uri, asset.fileName ?? Date.now().toString(), "image/jpeg").then((url)=>url).catch((e)=>{
                  /**
                   * @todo logrocket for upload error
                   */
                  toast({
                      message: "Image upload failed",
                      type: "error"
                  })
                  return null
              })
          })).then((urls)=>{
              const filteredUrls = urls.filter((url)=>!isEmpty(url)) as string[]
              setInputState((prev)=>({
                  ...prev,
                  images: [...(inputState.images ?? []), ...filteredUrls]
              }))
          }).catch((e)=>{
              // error toasts have already been displayed
              // add logrocket implementation
          }).finally(()=>{
              setInputState((prev)=>({
                  ...prev,
                  takenPictureUploading: false
              }))
          })
        } 
      }
    }).catch((e)=>{
      toast({
        type: "error",
        message: "Error taking picture",
        title: "Error"
      })
    })
  }

  const onDescriptionChange = (text: string) => {
    setInputState((prev)=>({
      ...prev,
      description: text
    }))
  }

  const deleteImage = (image: string) => {
    setInputState((prev)=>({
      ...prev,
      images: inputState.images?.filter((item)=>item !== image) ?? null
    }))
  }

  useEffect(()=>{
    if(!isEmpty(inputState.images)){
      image_list_ref.current?.scrollToEnd()
    }
  }, [inputState.images?.length])


  const styles = useStyles()
  const {theme} = useTheme()


  useEffect(()=>{
    onChanges({
      ...inputState,
      index
    })
  }, [
    inputState.description,
    inputState.option,
    inputState.images?.length,
  ])

  useEffect(()=>{
    initData && setInputState((prev)=>({
      ...prev,
      ...initData
    }))
  },[JSON.stringify(initData)])

  return (
    <View style={[styles.container, containerStyle]} >
      <Text style={styles.queryText} >{question}</Text>
      <View style={styles.queryInputContainer} >
        <View style={styles.queryInputLeftContainer} >
          <View style={styles.radioOptionContainer} >
            <CheckBox  containerStyle={styles.checkboxStyle} checkedColor={theme.colors.primary} checkedIcon={"dot-circle-o"} uncheckedIcon={"circle-o"} checked={inputState.option === 'no'} onPress={no} />
            <Text style={styles.radioOptionText} >No</Text>
          </View>
          <View style={styles.radioOptionContainer} >
            <CheckBox containerStyle={styles.checkboxStyle} checkedColor={theme.colors.primary}  checkedIcon={"dot-circle-o"} uncheckedIcon={"circle-o"} checked={inputState.option === 'yes'} onPress={yes} />
            <Text style={styles.radioOptionText} >Yes</Text>
          </View>
        </View>
        <View style={styles.queryInputRightContainer} >
          <TouchableOpacity
            onPress={chooseImage}
          >
            {inputState.chosenPictureUploading ? <ActivityIndicator color={theme.colors.primary} /> :<MaterialCommunityIcons name="image-plus" size={26} color={theme.colors.grey0} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePicture}
          >
            {inputState.takenPictureUploading ? <ActivityIndicator color={theme.colors.primary} /> :<MaterialCommunityIcons name="camera" size={26} color={theme.colors.grey0} />}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.descriptionContainer} >
        <BaseInput
          placeholder="Detail (optional)"
          value={inputState.description ?? ""}
          onChangeText={onDescriptionChange}
        />
      </View>
      {!isEmpty(inputState.images) && <View>
        <FlatList
          ref={image_list_ref}
          snapToOffsets={
            inputState.images?.map((item, index)=>index * (100 - 40))
          }
          data={inputState.images}
          style={styles.imagesContainer}
          renderItem={({item}) => {
          return (
            <UploadedImage
              image={item}
              deleteImage={deleteImage}
              containerStyle={styles.imageContainer}
            />
          )}}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>}
    </View>
  )
}

export default VehicleInspectionQuery