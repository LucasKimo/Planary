import { Stack } from 'expo-router'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from "../constants/Colors"
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light  

  return (
    
    <View style={{ flex: 1 }}>
      <StatusBar value="auto" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} /> // , headerShown: false
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="contact" options={{ title: 'Contact' }} />
      </Stack>

      <Text style={{ fontSize: 11, textAlign: 'center' }}>© 2025 Way Maker. All rights reserved. | Developed by Eunsu Kim</Text>
    </View>
  )
}

export default RootLayout

const styles = StyleSheet.create({})



/*
Stack:

  |
  |
  |about
  |index
------

*/