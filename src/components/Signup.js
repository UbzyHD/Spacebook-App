import React, { Component } from 'react'
import { Button, ScrollView, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import { baseUrl } from '../../App'

class SignupScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    }

    signup = () => {
        return fetch(baseUrl + 'user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else if (response.status === 400) {
                    throw Error('Failed validation')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('User created with ID: ', responseJson)
                this.props.navigation.navigate('Login')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(firstName) => this.setState({ firstName })}
                    value={this.state.first_name}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(lastName) => this.setState({ lastName })}
                    value={this.state.last_name}
                    style={{ padding: 5, borderWidth: 1, margin: 5 }}
                />
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
                    title="Create an account"
                    onPress={() => this.signup()}
                />
            </ScrollView>
        )
    }
}
SignupScreen.propTypes = { navigation: PropTypes.object.isRequired }

export default SignupScreen
