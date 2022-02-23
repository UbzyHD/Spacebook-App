import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './src/components/Login.js'
import Signup from './src/components/Signup.js'
import Home from './src/components/Home.js'
import Profile from './src/components/Profile.js'
import EditProfile from './src/components/EditProfile.js'
import Friends from './src/components/Friends.js'
import Logout from './src/components/Logout.js'

export const baseUrl = 'http://localhost:3333/api/1.0.0/'

const Stack = createNativeStackNavigator()

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Friends" component={Friends} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Logout" component={Logout} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
