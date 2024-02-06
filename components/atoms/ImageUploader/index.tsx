import { Entypo, Feather } from '@expo/vector-icons'
import { Image, makeStyles, ThemeConsumer } from '@rneui/themed'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useDimensions from '../../../hooks/useDimensions'
import * as ImagePicker from 'expo-image-picker'
import useToast from '../../../hooks/useToast'
import { isEmpty, isNull, last } from 'lodash'
import { uploadToFirebase } from '../../../utils/utils'


interface Props {
    title?: string,
    multiple?: boolean,
    customIcon?: React.ReactNode,
    getImage?: (image: string) => void,
    getImages?: (images: string[]) => void,
    image?: string
    images?: string[]
}

type IProps = Props

const useStyles  = makeStyles((theme, props: IProps)=> {
    return {
        container: {
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start"
        },
        emptyImageContainer: {
            height: 200,
            backgroundColor: theme.colors.white,
            borderStyle: "dashed",
            borderColor: theme.colors.grey0,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2
        },
        imageContainer: {
            width: "100%",
            height: 200,
            overflow: "hidden",
        },
        image: {
            width: "100%",
            height: "100%",
            borderRadius: 20,
            resizeMode: "contain"
        },
        uploadButtonContainer: {
            width: "100%",
            alignItems: "center",
            marginTop: 20
        },
        uploadButtonText: {
            fontSize: 16,
            fontWeight: "400",
            fontFamily: "Lato_400Regular",
            color: theme.colors.title,
            textAlign: "center",
            marginTop: 10
        }
    }
})

const ImageUploader = (props: IProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { maxItemHeight, maxItemWidth } = useDimensions()
    const [image, setImage] = useState<string|null>(null)
    const [images, setImages] = useState<string[]>([])
    const styles = useStyles(props)
    const { title, multiple, customIcon, getImage, image: initial_image, images: initial_images, getImages } = props;

    const toast = useToast()

    useEffect(()=>{
        if(!isNull(image) && image !== initial_image){
            getImage && getImage(image)
        }
    },[image])

    useEffect(()=>{
           initial_image && setImage(initial_image)
    }, [,initial_image])

    useEffect(()=>{
        if(!isEmpty(images) && images !== initial_images){
            getImages && getImages(images)
        }
    },[images])

    useEffect(()=>{
        initial_images && setImages(initial_images)
    }, [,initial_images])

    useEffect(()=>{
        ImagePicker.requestMediaLibraryPermissionsAsync().then((result)=>{
            if(result.granted) return
            toast({
                message: "No Permission to access gallery",
                type: "error"
            })
        }).catch((e)=>{
            toast({
                message: "No Permission to access gallery",
                type: "error"
            })
        })
    }, [])

    const addImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: multiple
        }).then((result)=>{
            if(result.canceled) return toast({
                message: "Image upload cancelled",
                type: "error"
            })
            if(!isEmpty(result?.assets)){
                setLoading(true)
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
                    const last_url = last(filteredUrls) 
                    if(!multiple){
                        last_url && setImage(last_url)
                    }else{
                        setImages((prev)=>[...prev,...filteredUrls])
                    }
                }).catch((e)=>{
                    // error toasts have already been displayed
                    // add logrocket implementation
                }).finally(()=>{
                    setLoading(false)
                })
                
            }else{
                toast({
                    message: "Image upload failed",
                    type: "error"
                })
            }
        }).catch((e)=>{
            toast({
                message: "Image upload failed",
                type: "error"
            })
        })
    }

  return (
    <ThemeConsumer>
        {({theme})=>{
            return (
            <View style={styles.container} >
                {
                    (image) ? <View
                        style={styles.imageContainer}
                    >
                        <Image 
                            source={{uri: multiple ? last(images) : image}}
                            style={styles.image}
                        /> 
                    </View> :
                    <TouchableOpacity onPress={addImage} style={[styles.emptyImageContainer, {
                        width: maxItemWidth,
                    }]} >
                       { isEmpty(customIcon) ? <Entypo 
                            name={
                                multiple ? "images" : "image"
                            }
                            size={100}
                            color={theme.colors.grey0}
                       /> : customIcon}
                    </TouchableOpacity>
                }
                { loading ? <ActivityIndicator size={"large"} color={theme.colors.primary} /> : <TouchableOpacity
                    style={styles.uploadButtonContainer}
                    onPress={addImage}
                >
                    <Feather
                        name="upload"
                        size={24}
                        color={theme.colors.appBlue}
                    />
                    <Text style={styles.uploadButtonText} >
                        {
                            title || "Upload Image"
                        }
                    </Text>
                </TouchableOpacity>}
            </View>
            )
        }}
    </ThemeConsumer>
    
  )
}

export default ImageUploader