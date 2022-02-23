import React, { Component } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import { baseUrl } from '../../App'

class Friends extends Component {
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
        return fetch(baseUrl + 'user/' + userID + '/friends', {
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
        return fetch(baseUrl + 'friendrequests/', {
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

        return fetch(baseUrl + 'friendrequests/' + userID, {
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
    };

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
            return (
                <View>
                    <Text>Friends:</Text>
                    <FlatList
                        data={this.state.listFriends}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.user_givenname} {item.user_familyname}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => item.user_id.toString()}
                    />
                    <Text>{'\nFriend Requests:'}</Text>

                    <FlatList
                        data={this.state.listFriendRequests}
                        renderItem={({ item }) => (
                            <View>
                                <Text>
                                    {item.first_name} {item.last_name}
                                    <Button
                                        title="Accept?"
                                        color="green"
                                        onPress={() => this.friendRequestResponse('POST', item.user_id)}
                                    />
                                    <Button
                                        title="Decline?"
                                        color="red"
                                        onPress={() => this.friendRequestResponse('DELETE', item.user_id)}
                                    />
                                </Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => item.user_id.toString()}
                    />
                    <Text></Text>
                    <Button
                        title="Profile"
                        color="green"
                        onPress={() => this.props.navigation.navigate('Profile')}
                    />
                    <Button
                        title="Logout"
                        color="darkblue"
                        onPress={() => this.props.navigation.navigate('Logout')}
                    />
                </View>
            )
        }
    }
}

Friends.propTypes = { navigation: PropTypes.object.isRequired }

export default Friends
