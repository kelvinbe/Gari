import { View, ActivityIndicator, Text} from 'react-native'
import React, { useEffect } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'

interface IProps {
    size?: number | "small" | "large" | undefined,
    fontLoaded?: boolean,
    promise?: Promise<any>,
    onResolve?: () => void,
    onReject?: () => void
}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props)=>{
    return {
        container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.white
        },
        loadingText: {
            color: theme.colors.black,
            fontSize: 14,
            fontWeight: "700", 
            ...((props.fontLoaded === false && typeof props.fontLoaded !== "undefined") ? null : {fontFamily: "Lato_700Bold"}),
            marginTop: 10
        }
    }
})

const Loading = (props: Props) => {
    const styles = useStyles(props)

    useEffect(()=>{
        props.promise && props.promise.then(props.onResolve).catch(props.onReject)
    }, [props.promise])
  return (
    <ThemeConsumer>
        {({theme})=>(
            <View style={styles.container} >
                <ActivityIndicator
                    color={theme.colors.primary}
                    size={props.size || "large"}
                    animating
                />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )}
    </ThemeConsumer>
    
  )
}

export default Loading
