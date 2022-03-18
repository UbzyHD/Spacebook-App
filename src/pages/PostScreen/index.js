import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Icon, TopNavigation, TopNavigationAction, Divider, List, Card, Text, Button, Modal, Input } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import styles from '../../resources/styles'

class PostScreen extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            showNewPost: false,
            listData: [],
            listAvailableUsers: [],
            listFriendRequests: [],
            postText: '',
            userID: ''
        }
    }

    componentDidMount () {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn()
        })
        this.getListofPosts(this.props.route.params.userID)
    }

    componentWillUnmount () {
        this.unsubscribe()
    }

    // componentDidUpdate () {
    //     this.getListofPosts(this.props.route.params.userID)
    // }

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
                    listData: responseJson,
                    userID: userID
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    deletePost = async (userID, postID) => {
        const authToken = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'user/' + userID + '/post/' + postID, {
            method: 'DELETE',
            headers: {
                'X-Authorization': authToken
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    this.getListofPosts(userID)
                } else if (response.status === 400) {
                    throw Error('Failed validation')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('Post deleted with ID: ', responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    postInteract = async (interactType, userID, postID) => {
        const authToken = await AsyncStorage.getItem('@session_token')
        return fetch(baseURL + 'user/' + userID + '/post/' + postID + '/like/', {
            method: interactType,
            headers: {
                'X-Authorization': authToken
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    this.getListofPosts(userID)
                } else if (response.status === 400) {
                    throw Error('Failed validation')
                } else {
                    return response.json()
                    // throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('Post liked with ID: ', responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    SubmitPost = async (text) => {
        const authToken = await AsyncStorage.getItem('@session_token')
        const userID = await AsyncStorage.getItem('@user_id')
        return fetch(baseURL + 'user/' + userID + '/post/', {
            method: 'post',
            headers: {
                'X-Authorization': authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(text)
        })
            .then((response) => {
                if (response.status === 201) {
                    this.getListofPosts(this.props.route.params.userID)
                } else if (response.status === 400) {
                    throw Error('Failed validation')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('Post created with ID: ', responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleOnPress = () => this.setState({ showNewPost: true })

    Header = (firstName, lastName, postID) => (
        <Layout>
            <Text category='h6'>{firstName}</Text><Text category='s1'>{lastName}</Text>
        </Layout>
    );

    Footer = (numberOfLikes, timestamp, userID, postID) => (
        <Layout style={styles.layout_button}>
            <Text>Number of Likes: {numberOfLikes}</Text>
            <Text>Date and Time Posted: {timestamp}</Text>
            <Button onPress={() => this.deletePost(userID, postID)}>Delete Post</Button>
            <Button onPress={() => this.postInteract('POST', userID, postID)}>Like Post</Button>
            <Button onPress={() => this.postInteract('DELETE', userID, postID)}>Dislike Post</Button>
            <Button onPress={() => this.props.navigation.navigate('EditPost', { userID: userID, postID: postID })}>Edit Post</Button>
        </Layout>
    );

    BackAction = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />)
    NewPost1 = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='edit' />)} onPress={() => this.setState(({ showNewPost }) => ({ showNewPost: !showNewPost }))} />)
    refreshPosts = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='refresh' />)} onPress={() => this.setState(({ showNewPost }) => ({ showNewPost: !showNewPost }))} />)

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Posts' alignment='center' accessoryLeft={this.BackAction} accessoryRight={this.NewPost1} />
                <Divider />
                <Layout style={styles.topContainer}>
                    <Layout>
                        <Modal visible={this.state.showNewPost} backdropStyle={styles.backdrop}>
                            <Card disabled={true}>
                                <Layout>
                                    <Text>New Post</Text>
                                    <Input placeholder="Enter new post text" onChangeText={(postText) => this.setState({ postText })} value={this.state.postText} accessoryLeft={(props) => (<Icon {...props} name='edit'/>)}/>
                                    <Layout style={styles.layout_button}>
                                        <Button onPress={() => this.setState({ showNewPost: false })}>Cancel New Post</Button>
                                        <Button onPress={() => this.SubmitPost({ text: this.state.postText }, this.setState(({ showNewPost }) => ({ showNewPost: !showNewPost })), this.getListofPosts(this.state.userID))}>Submit Post</Button>
                                    </Layout>
                                </Layout>
                            </Card>
                        </Modal>
                    </Layout>
                    <List data={this.state.listData} renderItem={({ item }) => (
                        <React.Fragment>
                            <Card style={styles.card}
                                header={this.Header(item.author.first_name, item.author.last_name, item.post_id)}
                                footer={this.Footer(item.numLikes, item.timestamp, item.author.user_id, item.post_id)}>
                                <Text>{item.text}</Text>
                            </Card>
                            <Divider/>
                        </React.Fragment>
                    )}
                    keyExtractor={(item, index) => item.post_id.toString()}
                    />
                </Layout>
            </SafeAreaView>
        )
    }
}

PostScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
}

export { PostScreen }
