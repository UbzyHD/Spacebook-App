import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Text, Input, Button } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import styles from '../../resources/styles'

class LoginScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            email: 'uabidul@mmu.ac.uk',
            password: 'uabidul'
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        if (value == null) {
            this.props.navigation.navigate('Login')
        } else {
            this.login()
        }
    }

    login = async () => {
        return fetch(baseURL + 'login', {
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
                await AsyncStorage.setItem('@session_token', responseJson.token.toString())
                await AsyncStorage.setItem('@user_id', responseJson.id.toString())
                this.props.navigation.replace('Home')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Layout style={styles.layout}>
                    <Text style={styles.header} category="h1" >Login</Text>
                    <Text style={styles.label} >Email</Text>
                    <Input style={styles.input} placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} />
                    <Text style={styles.label} >Password</Text>
                    <Input style={styles.input} placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry />
                    <Layout style={styles.layout_button}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('Signup')}>Signup</Button>
                        <Button style={styles.button} onPress={() => this.login()}>Login</Button>
                    </Layout>
                </Layout>
            </SafeAreaView>
        )
    }
}

LoginScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { LoginScreen }
