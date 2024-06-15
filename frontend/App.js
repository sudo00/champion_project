import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImageGeneratorScreen from './screens/image_gen/ImageGeneratorScreen'
import { Avatar, AvatarFallbackText, Box, Button, ButtonGroup, ButtonText, GluestackUIProvider, HStack, Heading, Image } from '@gluestack-ui/themed';
import { config } from "@gluestack-ui/config"
import { APP_HEADER_HEIGHT } from './screens/ScreenConst';
import AuthScreen from './screens/AuthScreen';
import RegistrationScreen from './screens/RegistrationScreen';


// TODO
// Карусель изображений в истории (когда было сгенерировано несколько изображений)
// Загрузка изображений и данных о них
const SERVICE_NAME = `Сервис генерации \n маркетинговых изображений`
const headerStyle = {
  height: APP_HEADER_HEIGHT,
  backgroundColor: "#F4F6FA"
}
const headerLeft = () => (
  <Image ml='$5' style={styles.headerLogoImage} source={require("./assets/bank_logo.png")} />
)

const headerRight = () => {
  const navigation = useNavigation()
  const onExit = () => { navigation.replace("Auth") }
  return (
    <HStack space='xs'>
      <Avatar>
        <AvatarFallbackText>Denis S</AvatarFallbackText>
      </Avatar>
      <Heading mr='$5'>Denis S</Heading>
      <Button mr='$5' variant="outline" onPress={onExit}>
        <ButtonText>Выйти</ButtonText>
      </Button>
    </HStack>
  )
}


const Stack = createNativeStackNavigator()
export default function App() {
  var os = require("os")
  var end = JSON.stringify(os.EOL)
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="ImageGenerator"
            component={ImageGeneratorScreen}
            options={{
              title: SERVICE_NAME,
              headerStyle: headerStyle,
              headerLeft: headerLeft,
              headerRight: headerRight,
            }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              title: SERVICE_NAME,
              headerStyle: headerStyle,
              headerLeft: headerLeft,
            }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{
              title: SERVICE_NAME,
              headerStyle: headerStyle,
              headerLeft: headerLeft,
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoImage: {
    width: 100,
    height: APP_HEADER_HEIGHT,
  }
});
