import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Text, Input, Button } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

class LoginScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            email: 'uabidul@mmu.ac.uk',
            password: 'uabidul'
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
                    <Text style={styles.header} category="h1">Login</Text>

                    <Text style={styles.label} >   Email </Text>
                    <Input style={styles.input} placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} />

                    <Text style={styles.label} >   Password </Text>
                    <Input style={styles.input} placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry />
                    <View style={styles.view}>
                        <View>
                            <Button style={styles.button} onPress={() => this.props.navigation.navigate('Signup')}>Signup</Button>
                        </View>
                        <View>
                            <Button style={styles.button} onPress={() => this.login()}>Login</Button>
                        </View>
                    </View>
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

LoginScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { LoginScreen }
