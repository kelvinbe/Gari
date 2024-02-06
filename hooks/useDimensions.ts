import { Dimensions } from "react-native"

const useDimensions = () => {
  return {
    screenWidth: Dimensions.get("screen").width,
    screenHeight: Dimensions.get("screen").height,
    screenScale: Dimensions.get("screen").scale,
    maxItemWidth: Dimensions.get("screen").width - 40,
    maxItemHeight: Dimensions.get("screen").height - 40,
    
  }
}

export default useDimensions
