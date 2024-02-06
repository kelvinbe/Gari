import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { Entypo } from '@expo/vector-icons'
import { isUndefined } from 'lodash'

interface Props {
    onPress: () => void,
    title: string,
    icon: ReactNode,
    /**
     * @todo add expandable functionality
     */
    expandable?: boolean,
    customStyles?: StyleProp<ViewStyle>,
    customAccordionIcon?: ReactNode,
}

type IProps = Props

const useStyles = makeStyles((theme, props: IProps)=> {
    return {
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 25,
        },
        title: {
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "Lato_400Regular",
            color: theme.colors.title,
            textAlign: "left"
        },
        iconContainer: {
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },
        leftContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        rightContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        },
    }
})

const AccordionButton = (props: IProps) => {

    const styles = useStyles(props)
    const { icon, onPress, title, expandable, customAccordionIcon  } = props;
  return (
    <ThemeConsumer>
        {({theme})=>(
            <TouchableOpacity
                style={[styles.container, props.customStyles]}
                onPress={onPress}
            >
                <View 
                    style={styles.leftContainer}
                >
                    {
                        icon  ? <View style={styles.iconContainer} >
                            {
                                icon
                            }
                        </View> : null
                    }
                    <Text style={styles.title} >
                        {title} 
                    </Text>
                </View>
                <View style={styles.leftContainer} >
                    {
                        isUndefined(customAccordionIcon) ?
                        <Entypo name="chevron-small-right" size={28} color={theme.colors.iconPrimary} /> :
                        customAccordionIcon
                    }
                </View>

            </TouchableOpacity>
        )}
    </ThemeConsumer>
    
  )
}

export default AccordionButton
