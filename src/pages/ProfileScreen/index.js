import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, Spinner } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import styles from '../../resources/styles'

class ProfileScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            userData: null,
            userPhoto: null,
            userID: null
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
                    userData: responseJson,
                    userID: userid
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

    BackIcon = (props) => (<Icon {...props} name='arrow-back' />)

    navigateBack = () => { this.props.navigation.goBack() }

    BackAction = () => (<TopNavigationAction icon={this.BackIcon} onPress={this.navigateBack} />)

    render () {
        if (this.state.isLoading) {
            return (
                <SafeAreaView style={styles.safeAreaView}>
                    <Layout style={styles.layout}>
                        <Spinner/>
                    </Layout>
                </SafeAreaView>
            )
        } else {
            console.log(this.state.userData)
            return (
                <SafeAreaView style={styles.safeAreaView}>
                    <TopNavigation title='Profile' alignment='center' accessoryLeft={this.BackAction} />
                    <Layout style={styles.container}>
                        <Avatar shape='round' style={{ width: 100, height: 100 }} source={{ uri: this.state.userPhoto }}/>
                        <Text>Name: {this.state.userData.first_name} {this.state.userData.last_name}</Text>
                        <Text>Email: {this.state.userData.email}</Text>
                        <Text>Friend Count: {this.state.userData.friend_count}</Text>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('Post', { userID: this.state.userID })}>My Posts</Button>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('EditProfile')}>Edit Profile</Button>
                    </Layout>
                </SafeAreaView>
            )
        }
    }
}

ProfileScreen.propTypes = { navigation: PropTypes.object.isRequired }

export { ProfileScreen }
