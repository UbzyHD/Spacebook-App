import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { LoginScreen } from '../pages/LoginScreen'
import { SignupScreen } from '../pages/SignupScreen'
import { HomeScreen } from '../pages/HomeScreen'
import { ProfileScreen } from '../pages/ProfileScreen'
import { EditProfileScreen } from '../pages/EditProfileScreen'
import { FriendScreen } from '../pages/FriendScreen'
import { ConfigScreen } from '../pages/ConfigScreen'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const Stack = createStackNavigator()

const MainNavigation = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen}/>
        <Stack.Screen name='EditProfile' component={EditProfileScreen}/>
        <Stack.Screen name='Friends' component={FriendScreen}/>
        <Stack.Screen name='Configuration' component={ConfigScreen}/>
    </Stack.Navigator>
)

const Routes = () => (
    <SafeAreaProvider>
        <NavigationContainer>
            <MainNavigation />
        </NavigationContainer>
    </SafeAreaProvider>
)

export default Routes
