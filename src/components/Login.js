import React, { Component } from 'react'
import { Button, Text } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import { baseUrl } from '../../App'

class Login extends Component {
    constructor (props) {
        super(props)

        this.state = {
            email: '',
            password: ''
        }
    }

    login = async () => {
        return fetch(baseUrl + 'login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 400) {
                    throw Error('Invalid email or password')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then(async (responseJson) => {
                console.log(responseJson)
                await AsyncStorage.setItem('@session_token', responseJson.token)
                await AsyncStorage.setItem('@user_id', responseJson.id)
                this.props.navigation.navigate('Home')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        return (

            <ScrollView>
                <Text style={{ textAlignVertical: 'center', textAlign: 'center' }}>Welcome to Spacebook!</Text>
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    secureTextEntry
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <Button
                    title="Login"
                    onPress={() => this.login()}
                />
                <Button
                    title="Don't have an account?"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate('Signup')}
                />
            </ScrollView>
        )
    }
}
Login.propTypes = { navigation: PropTypes.object.isRequired }

export default Login
