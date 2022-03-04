import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Text, Icon, TopNavigation, TopNavigationAction, Divider, List, ListItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

class FriendScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            listFriends: [],
            listFriendRequests: []
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })

        this.getFriends()
        this.getFriendRequests()
    }

    componentWillUnmount () {
        this.unsubscribe()
    }

    getFriends = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        const userID = await AsyncStorage.getItem('@user_id')
        return fetch(baseURL + 'user/' + userID + '/friends', {
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
                    listFriends: responseJson
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getFriendRequests = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'friendrequests/', {
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
                    listFriendRequests: responseJson
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    friendRequestResponse = async (request, userID) => {
        const authToken = await AsyncStorage.getItem('@session_token')

        return fetch(baseURL + 'friendrequests/' + userID, {
            method: request,
            headers: {
                'x-authorization': authToken
            }
        })
            .then((response) => {
                if (response.status === 200) { console.log('Item updated') } else if (response.status === 400) { console.log('Bad request') } else if (response.status === 401) { console.log('Unauthorized') } else if (response.status === 403) { console.log('Forbidden') } else if (response.status === 404) { console.log('Not Found') } else if (response.status === 500) { console.log('Server Error') }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
    }

    BackIcon = (props) => (<Icon {...props} name='arrow-back' />)
    CheckIcon = (props) => (<Icon {...props} name='checkmark'/>)
    CrossIcon = (props) => (<Icon {...props} name='close'/>)

    BackAction = () => (<TopNavigationAction icon={this.BackIcon} onPress={() => { this.props.navigation.goBack() }} />)
    FriendRequestButtons = (userID) => (<>
        <Button size='small' status='success' style={styles.button} onPress={() => this.friendRequestResponse('POST', userID)}>Accept?</Button>
        <Button size='small' status='danger' style={styles.button} onPress={() => this.friendRequestResponse('DELETE', userID)}>Deny?</Button></>)

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Friends' alignment='center' accessoryLeft={this.BackAction} />
                <Divider />
                <Layout style={styles.container}>

                    <Layout style={styles.container}>
                        <Text style={styles.label}>Friends:</Text>
                        <List data={this.state.listFriends} renderItem={({ item }) => (
                            <ListItem title={`${item.user_givenname} ${item.user_familyname}`}></ListItem>
                        )}
                        keyExtractor={(item, index) => item.user_id.toString()}/>
                    </Layout>

                    <Layout style={styles.container}>
                        <Text style={styles.label}>Friend Requests:</Text>
                        <List data={this.state.listFriendRequests} renderItem={({ item }) => (
                            <ListItem title={`${item.first_name} ${item.last_name}`} accessoryRight={this.FriendRequestButtons(item.user_id)}></ListItem>
                        )}
                        keyExtractor={(item, index) => item.user_id.toString()}/>
                    </Layout>
                </Layout>
            </SafeAreaView>
        )
    }
}

FriendScreen.propTypes = { navigation: PropTypes.object.isRequired }

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        padding: 5
    },
    label: {
        justifyContent: 'flex-start'
    },
    button: {
        display: 'flex',
        margin: 5,
        minHeight: 30,
        flexDirection: 'row'
    }
})

export { FriendScreen }
