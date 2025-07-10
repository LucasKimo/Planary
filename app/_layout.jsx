import { Stack } from 'expo-router'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from "../constants/Colors"
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContext'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light  

  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <StatusBar value="auto" />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
        }}>
          <Stack.Screen name='(auth)' options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name='(dashboard)' options={{ headerShown: false }}></Stack.Screen>
          
          <Stack.Screen name="index" options={{ title: 'Home' }} /> 
        </Stack>

        <Text style={{ fontSize: 11, textAlign: 'center' }}>© 2025 Planary. All rights reserved. | Developed by Eunsu Kim</Text>
      </View>
    </UserProvider>
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