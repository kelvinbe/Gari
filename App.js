import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "@rneui/themed";
import Navigation from './navigation';
import ToastContainer from './components/organisms/Feedback/ToastContainer/ToastContainer';
import ErrorBoundary from './components/ErrorHandler/ErrorBoundary';
import store, { useAppDispatch, useAppSelector } from './store/store';
import { theme } from './utils/theme';
import {
  useFonts,
  Lato_300Light,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,

} from '@expo-google-fonts/lato';
import { isLoading } from 'expo-font';
import Loading from './components/molecules/Feedback/Loading/Loading';
import useCachedResources from './hooks/useCachedResources';
import { useEffect } from 'react';
import LoginScreen from './screens/Stacks/LoginScreen';


const StatefullApp = () => {
  useEffect(() => {

  }, [])

  return <Navigation colorScheme='light' />
}

export default function App() {

  const isLoadingComplete = useCachedResources();

  console.log('isLoadingComplete', isLoadingComplete)

  let [fontsLoaded] = useFonts({
    Lato_300Light,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    Lato_900Black_Italic
  });


  if(!isLoadingComplete) {
    console.log('we are in not Complete')
    return (
      <ThemeProvider theme={theme} >
        <Loading fontLoaded={false} />
      </ThemeProvider>
    )
  }else if(!fontsLoaded){
   return (<ThemeProvider theme={theme} >
      <Loading fontLoaded={false} />
    </ThemeProvider>)
  }
  
  else{
    console.log('we got here')
    return (
      <View style={styles.container}>
        <LoginScreen />
      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
