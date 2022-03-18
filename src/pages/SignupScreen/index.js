import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon, Layout, Text, TopNavigation, TopNavigationAction, Input, Button, Tooltip } from '@ui-kitten/components'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import styles from '../../resources/styles'

class SignupScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            errorMessage: '',
            visible: false
        }
    }

    signup = (params) => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

        if (!this.state.first_name) {
            this.setState({
                errorMessage: 'Empty first name. Cannot signup',
                visible: true
            })
        } else if (!this.state.last_name) {
            this.setState({
                errorMessage: 'Empty lasty name. Cannot signup',
                visible: true
            })
        } else if (!this.state.email) {
            this.setState({
                errorMessage: 'Empty email. Cannot signup',
                visible: true
            })
        } else if (regex.test(this.state.email) === false) {
            this.setState({
                errorMessage: 'Invalid email. Example: example@user.com\nCannot signup',
                visible: true
            })
        } else if (!this.state.password) {
            this.setState({
                errorMessage: 'Empty password. Cannot signup',
                visible: true
            })
        } else if (this.state.password.length < 6) {
            this.setState({
                errorMessage: 'Password cannot be less than 5 characters. Cannot signup',
                visible: true
            })
        } else {
            return fetch(baseURL + 'user', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
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
                    this.props.navigation.navigate('Login', { email: this.state.email, password: this.state.password })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    renderSignupButton = () => (
        <Button onPress={() => this.signup({ first_name: this.state.first_name, last_name: this.state.last_name, email: this.state.email, password: this.state.password })}>Finish Signup</Button>
    );

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Signup' alignment='center' accessoryLeft={<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />} />
                <Layout style={styles.layout}>
                    <Layout style={styles.layout}>
                        <Text style={styles.header} category="h1">Signup</Text>

                        <Text style={styles.label} >First Name</Text>
                        <Input style={styles.input} placeholder="Enter your first name..." onChangeText={(first_name) => this.setState({ first_name })} value={this.state.first_name} />

                        <Text style={styles.label} >Last Name</Text>
                        <Input style={styles.input} placeholder="Enter your last name..." onChangeText={(last_name) => this.setState({ last_name })} value={this.state.last_name} />

                        <Text style={styles.label} >Email</Text>
                        <Input style={styles.input} placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} />

                        <Text style={styles.label} >Password</Text>
                        <Input style={styles.input} placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry />

                        <Layout style={styles.layout_button}>
                            <Tooltip
                                anchor={this.renderSignupButton}
                                visible={this.state.visible}
                                onBackdropPress={() => this.setState(({ visible }) => ({ visible: !visible }))}>
                                {this.state.errorMessage}
                            </Tooltip>
                        </Layout>
                    </Layout>
                </Layout>
            </SafeAreaView>
        )
    }
}
SignupScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { SignupScreen }
