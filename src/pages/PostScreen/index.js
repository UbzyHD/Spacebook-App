import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Icon, TopNavigation, TopNavigationAction, Divider, List, Card, Text } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import baseURL from '../../resources/baseURL'
import { NewPost } from '../../components/dialogs/NewPost'
import styles from '../../resources/styles'

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
        this.getListofPosts(this.props.route.params.userID)
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

    Header = (firstName, lastName, postID) => (
        <Layout>
            <Text category='h6'>{firstName}</Text><Text category='s1'>{lastName}</Text>
        </Layout>
    );

    Footer = (numberOfLikes, timestamp) => (
        <Layout style={styles.layout_button}>
            <Text>Number of Likes: {numberOfLikes}</Text>
            <Text>Date and Time Posted: {timestamp}</Text>
        </Layout>
    );

    BackAction = () => (<TopNavigationAction icon={(props) => (<Icon {...props} name='arrow-back' />)} onPress={() => { this.props.navigation.goBack() }} />)

    render () {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Posts' alignment='center' accessoryLeft={this.BackAction} />
                <Divider />
                <Layout style={styles.topContainer}>
                    <List data={this.state.listData} renderItem={({ item }) => (
                        <React.Fragment>
                            <Card style={styles.card}
                                header={this.Header(item.author.first_name, item.author.last_name, item.post_id)}
                                footer={this.Footer(item.numLikes, item.timestamp)}>
                                <Text>{item.text}</Text>
                            </Card>
                            <Divider/>
                        </React.Fragment>
                    )}
                    keyExtractor={(item, index) => item.post_id.toString()}
                    />
                </Layout>
                <NewPost/>
            </SafeAreaView>
        )
    }
}

PostScreen.propTypes = { navigation: PropTypes.object.isRequired }

const style = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    footerControl: {
        marginHorizontal: 2
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
