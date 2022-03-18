import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Icon, TopNavigation, TopNavigationAction, Divider, Button, Input } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import styles from '../../resources/styles'

class PostEditScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            listData: [],
            listAvailableUsers: [],
            listFriendRequests: [],
            newText: ''
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })
        this.getPost(this.props.route.params.userID, this.props.route.params.postID)
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

    getPost = async (userID, postID) => {
        const value = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'user/' + userID + '/post/' + postID, {
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

    updatePost = async (postID, text) => {
        const value = await AsyncStorage.getItem('@session_token')
        const userid = await AsyncStorage.getItem('@user_id')

        return fetch(baseURL + 'user/' + userid + '/post/' + postID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify(text)

        })
            .then((response) => {
                if (response.status === 200) {
                    this.props.navigation.navigate('Post', { userID: this.state.userID })
                } else if (response.status === 401) {
                    this.props.navigation.navigate('Login')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('Post updated with ID: ', responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render () {
        console.log(this.state.listData)
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Edit Post' alignment='center' accessoryLeft={<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />} />
                <Divider />
                <Layout style={styles.container}>
                    <Input multiline={true} placeholder='Enter updated text' onChangeText={(newText) => this.setState({ newText })} value={this.state.newText} accessoryLeft={(props) => (<Icon {...props} name='edit'/>)} accessoryRight={<><Button size='small' onPress={() => this.updatePost(this.state.listData.post_id, { text: this.state.newText })}>Submit</Button></>}/>
                </Layout>
            </SafeAreaView>
        )
    }
}

PostEditScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
}

export { PostEditScreen }
