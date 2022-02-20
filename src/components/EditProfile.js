import React, { Component } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { baseUrl } from '../../App'

class EditProfile extends Component {
    constructor (props) {
        super(props)

        this.state = {
            orig_first_name: '',
            orig_last_name: '',
            orig_email: '',
            orig_password: '',
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    }

    updateItem = async () => {
        const authToken = await AsyncStorage.getItem('@session_token')
        const userID = await AsyncStorage.getItem('@user_id')

        const toSend = {}

        if (this.state.first_name !== this.state.orig_first_name) {
            toSend.first_name = this.state.first_name
        }

        if (this.state.last_name !== this.state.orig_last_name) {
            toSend.last_name = this.state.last_name
        }

        if (this.state.email !== this.state.orig_email) {
            toSend.email = (this.state.email)
        }

        if (this.state.password !== this.state.orig_password) {
            toSend.password = (this.state.password)
        }

        console.log(JSON.stringify(toSend))

        console.log(authToken)

        return fetch(baseUrl + 'user/' + userID, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'x-authorization': authToken
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                if (response.status === 200) { console.log('Item updated') } else if (response.status === 400) { console.log('Bad request') } else if (response.status === 401) { console.log('Unauthorized') } else if (response.status === 403) { console.log('Forbidden') } else if (response.status === 404) { console.log('Not Found') } else if (response.status === 500) { console.log('Server Error') }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        return (
            <View>
                <Text>Update an Item</Text>

                <TextInput
                    placeholder="Enter first name..."
                    onChangeText={(firstName) => this.setState({ firstName })}
                    value={this.state.firstName}
                />
                <TextInput
                    placeholder="Enter last name..."
                    onChangeText={(lastName) => this.setState({ lastName })}
                    value={this.state.lastName}
                />
                <TextInput
                    placeholder="Enter email..."
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter password..."
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                />
                <Button
                    title="Update"
                    onPress={() => this.updateItem()}
                />
            </View>
        )
    }
}

export default EditProfile
