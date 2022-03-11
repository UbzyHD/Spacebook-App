import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Input, Icon, TopNavigation, TopNavigationAction, Divider, List, ListItem, Card, Text } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'

class PostScreen extends Component {
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
        this.getListofPosts(9)
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

    getListofPosts = async (userID) => {
        const value = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'user/' + userID + '/post', {
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
            })
            .catch((error) => {
                console.log(error)
            })
    }

    BackAction = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />)

    render () {
        const userID = AsyncStorage.getItem('@user_id')
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Posts' alignment='center' accessoryLeft={this.BackAction} />
                <Divider />
                <Layout style={styles.container}>
                    <List data={this.state.listData} renderItem={({ item }) => (
                        <>
                        <Card
                        header={<Text>{`${item.author.first_name} ${item.author.last_name}`}</Text>}
                        footer={<><Text>Likes: {item.numLikes}</Text><Text>Time Posted: {item.timestamp}</Text></>}>
                        <Text>
                        {item.text}
                        </Text>
                      </Card>
                      <Divider></Divider>
                      </>
                    )}
                    keyExtractor={(item, index) => item.post_id.toString()}
                    />
                </Layout>
            </SafeAreaView>
        )
    }
}

PostScreen.propTypes = { navigation: PropTypes.object.isRequired }

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

export { PostScreen }
