import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '../../resources/baseURL'
import { SafeAreaView } from 'react-native-safe-area-context'
import PropTypes from 'prop-types'
import { Layout, Input, TopNavigation, TopNavigationAction, Icon, Button, Text } from '@ui-kitten/components'
import styles from '../../resources/styles'
import { ImageUpload } from '../../components/dialogs/ImageUpload'

class EditProfileScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            orig_first_name: '',
            orig_last_name: '',
            orig_email: '',
            orig_password: '',
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        }
    }

    componentDidMount () {
        this.getData()
    }

    getData = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        const userid = await AsyncStorage.getItem('@user_id')

        return fetch(baseURL + 'user/' + userid, {
            headers: {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    this.props.navigation.navigate('Login')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    orig_first_name: responseJson.first_name,
                    orig_last_name: responseJson.last_name,
                    orig_email: responseJson.email,
                    first_name: responseJson.first_name,
                    last_name: responseJson.last_name,
                    email: responseJson.email
                })
            })
            .catch((error) => {
                console.log(error)
            })
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

        return fetch(baseURL + 'user/' + userID, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'x-authorization': authToken
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                if (response.status === 200) { this.props.navigation.navigate('Home') } else if (response.status === 400) { console.log('Bad request') } else if (response.status === 401) { console.log('Unauthorized') } else if (response.status === 403) { console.log('Forbidden') } else if (response.status === 404) { console.log('Not Found') } else if (response.status === 500) { console.log('Server Error') }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Edit Profile' alignment='center' accessoryLeft={<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.navigate('Profile') }} />} />
                <Layout style={styles.layout}>
                    <Text style={styles.text} category="h1">Edit Profile Info</Text>
                    <Input style={styles.input}
                        placeholder={this.state.orig_first_name}
                        onChangeText={(first_name) => this.setState({ first_name })}
                        value={this.state.first_name}
                    />
                    <Input style={styles.input}
                        placeholder={this.state.orig_last_name}
                        onChangeText={(last_name) => this.setState({ last_name })}
                        value={this.state.last_name}
                    />
                    <Input style={styles.input}
                        placeholder={this.state.orig_email}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                    />
                    <Input style={styles.input}
                        placeholder="Enter new password/leave blank to keep current..."
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />
                    <Button style={styles.button} onPress={() => this.updateItem()}>Update Info</Button>
                </Layout>
                <Layout style={styles.container}>
                    <ImageUpload/>
                </Layout>
            </SafeAreaView>
        )
    }
}

EditProfileScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { EditProfileScreen }
