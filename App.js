import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const baseUrl = 'http://localhost:3333/api/1.0.0/';

import Login from "./src/components/Login.js";
import Signup from "./src/components/Signup.js";
import Home from "./src/components/Home.js"
import Profile from "./src/components/Profile.js"
import Logout from "./src/components/Logout.js"

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Logout" component={Logout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;