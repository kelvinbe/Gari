import { Text, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { Icon, Image } from '@rneui/base'
import ChevronRight from "../../../../assets/icons/chevron-right.svg"
import ChevronDown from "../../../../assets/icons/chevron-down.svg"

interface IProps {
    image?: ReactNode;
    title?: string;
    onPress?: (id?: string | number) => void;
    customStyle?: StyleProp<ViewStyle>,
    raised?: boolean,
    id?: string | number,
    data?:{question_id: number, question: string, answer: string}[]
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props)=>({
    buttonContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: theme.colors.stroke,
        padding: 10,
        borderRadius: 10
    },
    questionContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 40
    },
    actionImage: {
        width: 40,
        height: 40,
    },
    actionTextStyle: {
        width:'85%',
        fontSize: 15,
        color: theme.colors.black,
        fontWeight: "600", fontFamily: "Lato_400Regular",
        marginLeft: 10
    },
    buttonIcon: {
        width: 10,
        height: 10,
    }
}))

const ActionButton = (props: Props) => {
    /**
     * @todo: this component needs to be overwritten to sufficiently handle the different payment methods
     */
    const { image, title, onPress, id, data } = props;
    const styles = useStyles(props)
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
    const [viewAnswer, setViewAnswer] = useState<boolean>(false)

    const _onPress = () =>{
        data && setSelectedAnswer(data?.filter((question:{question_id:number}) => id === question.question_id))
        setViewAnswer(!viewAnswer)
        id && onPress && onPress(id)
        onPress && onPress()
    }
  return (
    <ThemeConsumer>
        {({theme})=>(
            <TouchableOpacity onPress={_onPress} style={[styles.buttonContainer,props.customStyle]}> 
                <View style={[styles.questionContainer,props.customStyle]}>
                    <View style={styles.leftSection} >
                        {/* 
                            @todo: add functionality to switch between images
                        */}
                        {image ? image :<Image 
                            source={require("../../../../assets/images/mpesa.png")}
                            style={styles.actionImage}
                        />}
                        <Text style={styles.actionTextStyle} >
                            { title }
                        </Text>
                    </View>
                    {
                        viewAnswer ? <ChevronDown
                        stroke={theme.colors.stroke}
                        fill={theme.colors.stroke}
                    /> : <ChevronRight
                    stroke={theme.colors.stroke}
                    fill={theme.colors.stroke}
                />
                    }
                    
                </View>
                {viewAnswer && selectedAnswer !== null && <Text>{selectedAnswer[0].answer}</Text> }
            </TouchableOpacity>
        )}
    </ThemeConsumer>
    
)
}

export default ActionButton
