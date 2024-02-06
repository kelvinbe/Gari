import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { makeStyles, ThemeConsumer } from '@rneui/themed'
import { Divider, Icon } from '@rneui/base';
import ChevronDown from "../../../assets/icons/chevron-down.svg"
import { ScrollView } from 'react-native-gesture-handler';
import { isString } from 'lodash';

interface IProps {
    onChange?: (value:  (string|number)[] | string | number) => void,
    items?: {
        label: string,
        value: string | number
    }[],
    placeholder?: string,
    additionalFilter?: string[],
    dropdownOpen?: (v: boolean) => void,
    defaultValue?: string,
    defaultAdditionalFilter?: string,
    filter?: (chosenFilter: string, item: Partial<{
        label: string;
        value: string | number;
    }>)=> boolean
}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props) =>{
    return ({  
        container: {
            width: "100%",
            backgroundColor: "transparent"
        },
        dropdownInputContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.colors.white,
            // paddingHorizontal: 20,
            // paddingVertical: 15,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: theme.colors.stroke,
            overflow: "hidden"
        },
        selectedContainer: {
            width: props?.additionalFilter ? "50%" : "80%",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: 20,
            paddingVertical: 15
        },
        selectedText: {
            fontWeight: "600", fontFamily: "Lato_400Regular",
            fontSize: 16,
            textAlign: "left",
            width: "100%"
        },
        iconStyle: {
            width: 12,
            height: 10,
        },
        divider: {
            backgroundColor: theme.colors.stroke,
        },
        additionalText: {
            fontWeight: "600", fontFamily: "Lato_400Regular",
            fontSize: 12,
            paddingHorizontal: 10
        },
        dropdownValuesContainer: {
            width: "100%",
            backgroundColor: "white",
            elevation: 5,
            borderRadius: 4,
            marginTop: 10,
            height: props?.items ? props?.items?.length > 5 ? 140 : props?.items?.length * 40 : "auto",
        },
        dropdownValue: {
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        dropdownValueText: {
            fontWeight: "600", fontFamily: "Lato_400Regular",
            fontSize: 16,
            textAlign: "left"
        },
        iconContainer: {
            // width: "20%",
            height: 20,
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 20
        },
        additionalFilterContainer: {
            // width: "20%",
            height: 20,
            alignItems: "center",
            justifyContent: "center"

        }
    })
})

const Dropdown = (props: Props) => {

    const {items, onChange, placeholder, additionalFilter, dropdownOpen, defaultAdditionalFilter, defaultValue, filter} = props
    const [open, setOpen] = useState<boolean>(false)
    const [currentValue, setCurrentValue] = useState<string>( defaultValue || placeholder || "Select " )
    const [chosenFilter, setChosenFilter] = useState<string>( defaultAdditionalFilter || additionalFilter?.[0] || "")
    const styles = useStyles(props)

    const toggleDropdown = () => {
        setOpen(!open)
        dropdownOpen && dropdownOpen(!open)
    }

    const toggleFilter = () =>{
        const filter = chosenFilter;
        setChosenFilter(additionalFilter?.filter((f)=> f !== filter)[0] || "")
        // onChange && onChange([currentValue, additionalFilter?.filter((f)=> f !== filter)[0] || ""])
    }

    const handleSelect = (index: number) =>{
        toggleDropdown()
        setCurrentValue(
            items?.
            filter((item)=>filter ? filter?.(chosenFilter, item) : true)?.
            find((_, i)=> i== index)?.label || ""
        )
        if(additionalFilter){
            onChange && onChange(
                [
                    items?.
                    filter((item)=>filter ? filter?.(chosenFilter, item) : true)?.
                    find((_, i)=> i== index)?.value || "", chosenFilter
                ])
        }else{
            onChange && onChange(
                items?.find((_, i)=> i== index)?.value || ""
                )
        }
    }
  return (
    <ThemeConsumer>
        {({theme})=>(
            <View style={styles.container} >
                <View  style={styles.dropdownInputContainer} >
                    <TouchableOpacity onPress={toggleDropdown} style={[styles.selectedContainer, additionalFilter ? {
                        borderRightWidth: 1,
                        borderRightColor: theme.colors.stroke
                    } : null]} >
                        <Text style={styles.selectedText} >{currentValue}</Text>
                    </TouchableOpacity>
                    
                    
                    { additionalFilter &&
                        <TouchableOpacity onPress={toggleFilter} style={styles.additionalFilterContainer} >
                            <Text onPress={toggleFilter} style={styles.additionalText} >
                                {
                                    chosenFilter
                                }
                            </Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={toggleDropdown} style={styles.iconContainer} >
                        <ChevronDown   style={styles.iconStyle} stroke={theme.colors.black} />
                    </TouchableOpacity>
                    
                </View>
                { open && <ScrollView style={styles.dropdownValuesContainer} >
                    {
                        items?.
                        filter((item)=>filter ? filter?.(chosenFilter, item) : true)
                        .map((item, i)=>(
                            <TouchableOpacity key={i} onPress={()=>{
                                handleSelect(i)
                                }}  style={styles.dropdownValue} >
                                <Text style={styles.dropdownValueText} >
                                    {
                                        item.label
                                    }
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                    
                </ScrollView>}
            </View>
        )}
    </ThemeConsumer>
    
  )
}

export default Dropdown

const styles = StyleSheet.create({})