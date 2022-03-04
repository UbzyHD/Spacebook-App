import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '../../resources/baseURL'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Input, TopNavigation, TopNavigationAction, Icon, Button, Text } from '@ui-kitten/components'
import PropTypes from 'prop-types'

class EditProfileScreen extends Component {
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
                    orig_email: responseJson.email
                })
                console.log(responseJson.email)
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

        console.log(authToken)

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

    BackIcon = (props) => (<Icon {...props} name='arrow-back' />)
    navigateBack = () => { this.props.navigation.navigate('Home') }
    BackAction = () => (<TopNavigationAction icon={this.BackIcon} onPress={this.navigateBack} />)

    render () {
        console.log(this.state.userData)
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Edit Profile' alignment='center' accessoryLeft={this.BackAction} />
                <Layout style={styles.layout}>
                    <Text style={styles.text} category="h1">Edit Profile</Text>
                    <Input style={styles.input}
                        placeholder={this.state.orig_first_name}
                        onChangeText={(firstName) => this.setState({ firstName })}
                        value={this.state.first_name}
                    />
                    <Input style={styles.input}
                        placeholder={this.state.orig_last_name}
                        onChangeText={(lastName) => this.setState({ lastName })}
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
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    layout: {
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center'
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        justifyContent: 'flex-start'
    },
    header: {
        textAlign: 'center',
        margin: 10
    },
    input: {
        margin: 2,
        padding: 5
    },
    button: {
        display: 'flex',
        margin: 5,
        minHeight: 30,
        flexDirection: 'row'
    }
})

EditProfileScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { EditProfileScreen }
