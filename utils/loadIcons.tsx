import React from "react";


type IconTypes = "AntDesign" | "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "FontAwesome5" | "Fontisto" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "Zocial";

interface IIconProps {
    name: string;
    IconType: IconTypes;
    size?: number;
    color?: string;
}

export const LoadIcon = (props: IIconProps) => {
    const { name, IconType, size, color } = props;
    const IconComponent = require(`@expo/vector-icons`)?.[IconType];
    return <IconComponent name={name} size={size} color={color} />;
};

export const loadIcons = (icons: IIconProps[]) => {
    icons.forEach((icon) => {
        const { name,IconType } = icon;
        LoadIcon({ name, IconType});
    });
}
