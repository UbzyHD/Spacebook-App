import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Layout, Text, TopNavigation, TopNavigationAction, Input, Button } from '@ui-kitten/components'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

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
        return fetch(baseURL + 'user', {
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

    BackIcon = (props) => (
        <Icon {...props} name='arrow-back' />
    )

    navigateBack = () => {
        this.props.navigation.goBack()
    }

    BackAction = () => (
        <TopNavigationAction icon={this.BackIcon} onPress={this.navigateBack} />
    )

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Signup' alignment='center' accessoryLeft={this.BackAction} />
                <Layout style={styles.layout}>
                    <Text style={styles.header} category="h1"> Signup </Text>

                    <Text style={styles.label} >   First Name </Text>
                    <Input style={styles.input} placeholder="Enter your first name..."
                        onChangeText={(firstName) => this.setState({ firstName })} value={this.state.firstName} />

                    <Text style={styles.label} >   Last Name </Text>
                    <Input style={styles.input} placeholder="Enter your last name..."
                        onChangeText={(lastName) => this.setState({ lastName })} value={this.state.lastName} />

                    <Text style={styles.label} >   Email </Text>
                    <Input style={styles.input} placeholder="Enter your email..."
                        onChangeText={(email) => this.setState({ email })} value={this.state.email} />

                    <Text style={styles.label} >   Password </Text>
                    <Input style={styles.input} placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry />

                    <View style={styles.view}>
                        <View>
                            <Button style={styles.button} onPress={() => this.signup()}>Finish Signup</Button>
                        </View>
                    </View>
                </Layout>
            </SafeAreaView>
        )
    }
}
SignupScreen.propTypes = { navigation: PropTypes.object.isRequired }

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    layout: {
        flex: 1,
        justifyContent: 'center'
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

export { SignupScreen }
