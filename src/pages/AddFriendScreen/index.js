import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Input, Icon, TopNavigation, TopNavigationAction, Divider, List, ListItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

class AddFriendScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            listData: [],
            listAvailableUsers: [],
            listFriendRequests: []
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })
        this.getPeople()
    }

    componentWillUnmount () {
        this.unsubscribe()
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        if (value == null) {
            this.props.navigation.navigate('Login')
        }
    }

    getPeople = async () => {
        const value = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'search', {
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
                    listData: responseJson
                })
                // console.log(userID)
                // // console.log(this.state.listData)
                // let i
                // let loopData = ''
                // for (i = 0; i < this.state.listData.length; i++) {
                //     if (this.state.listData[i].user_id.toString() === userID) {
                //         (console.log(this.state.listData[i]))
                //     } else {
                //         loopData += this.state.listData[i]
                //     }
                // }
                // this.setState({
                //     listAvailableUsers: loopData
                // })
                // console.log(this.state.listData)
                // console.log(this.state.listAvailableUsers)
                // // this.state.listData.splice(this.state.listData.user_id.indexOf(userID), 1)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    sendFriendRequest = async (userID) => {
        const value = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'user/' + userID + '/friends', {
            method: 'POST',
            headers: {
                'x-authorization': value
            }
        })
            .then((response) => {
                console.log(response.status)
                console.log(response)
                if (response.status === 201) {
                    console.log('Friend Request Sent')
                } else if (response.status === 401) {
                    this.props.navigation.navigate('Login')
                } else if (response.status === 403) {
                    console.log(response)
                } else {
                    throw Error('Something went wrong')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    SearchIcon = (props) => (<Icon {...props} name='search'/>)

      SearchBar = () => (
          <Input placeholder='Search' accessoryLeft={(props) => (<Icon {...props} name='search'/>)} />
      );

    BackAction = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />)

    render () {
        const userID = AsyncStorage.getItem('@user_id')
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Add Friends' alignment='center' accessoryLeft={this.BackAction} />
                <Divider />
                <Layout style={styles.container}>
                    <this.SearchBar/>
                    <List data={this.state.listData} renderItem={({ item }) => (
                        <ListItem
                            title={`${item.user_givenname} ${item.user_familyname}`}
                            accessoryRight={<><Button size='small' accessoryLeft={(props) => (<Icon {...props} name='person-add'/>)} onPress={() => this.sendFriendRequest(item.user_id)}>Add Friend</Button></>}>
                        </ListItem>
                    )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                    />
                </Layout>

            </SafeAreaView>
        )
    }
}

AddFriendScreen.propTypes = { navigation: PropTypes.object.isRequired }

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
        justifyContent: 'flex-start',
        padding: 5
    },
    button: {
        display: 'flex',
        margin: 5,
        minHeight: 30,
        flexDirection: 'row'
    }
})

export { AddFriendScreen }
