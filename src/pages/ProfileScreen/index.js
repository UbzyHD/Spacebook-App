import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

class ProfileScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            userData: null,
            userPhoto: null
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })

        this.getData()
        this.getPhoto()
    }

    componentWillUnmount () {
        this.unsubscribe()
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
                    userData: responseJson
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getPhoto = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        const userid = await AsyncStorage.getItem('@user_id')

        fetch(baseURL + 'user/' + userid + '/photo', {
            method: 'GET',
            headers: {
                'X-Authorization': value
            }
        })
            .then((res) => {
                return res.blob()
            })
            .then((resBlob) => {
                const data = URL.createObjectURL(resBlob)
                this.setState({
                    userPhoto: data
                })
            })
            .catch((err) => {
                console.log('error', err)
            })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
    }

    BackIcon = (props) => (
        <Icon {...props} name='arrow-back' />
    )

    navigateBack = () => {
        this.props.navigation.goBack()
    }

    BackAction = () => (<TopNavigationAction icon={this.BackIcon} onPress={this.navigateBack} />)

    render () {
        if (this.state.isLoading) {
            return (

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text>Loading..</Text>
                </View>
            )
        } else {
            console.log(this.state.userData)
            return (
                <SafeAreaView style={styles.safeAreaView}>
                    <TopNavigation title='Profile' alignment='center' accessoryLeft={this.BackAction} />
                    <Layout style={styles.layout}>
                        <Avatar shape='round' style={{ width: 100, height: 100 }} source={{ uri: this.state.userPhoto }}/>
                        <Text>Name: {this.state.userData.first_name} {this.state.userData.last_name}</Text>
                        <Text>Email: {this.state.userData.email}</Text>
                        <Text>Friend Count: {this.state.userData.friend_count}</Text>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('EditProfile')}>Edit Profile</Button>
                    </Layout>
                </SafeAreaView>
            )
        }
    }
}
ProfileScreen.propTypes = { navigation: PropTypes.object.isRequired }

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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

export { ProfileScreen }
