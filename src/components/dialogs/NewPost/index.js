import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Card, Layout, Modal, Text, Icon, Input, TopNavigationAction } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '../../../resources/baseURL'

export const NewPost = () => {
    const [visible, setVisible] = React.useState(false)
    const [postText, setpostText] = React.useState()

    const SubmitPost = async (userID, text) => {
        const authToken = await AsyncStorage.getItem('@session_token')
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
                    return response.json()
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

    const style = StyleSheet.create({
        container: {
            flex: 1
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        layout_button: {
            flex: 1,
            display: 'flex-end',
            justifyContent: 'center'
        }
    })

    return (
        <Layout level='1'>

            <TopNavigationAction icon={(props) => (<Icon {...props} name='edit' />)} onPress={() => setVisible(true)} />

            <Modal visible={visible} backdropStyle={style.backdrop}>
                <Card disabled={true}>
                    <Layout style={style.container}>
                        <Text>New Post</Text>
                        <Input placeholder='Enter new post text' multiline={true} onChange={e => setpostText(e.target.value)} accessoryLeft={(props) => (<Icon {...props} name='edit'/>)}/>
                        <Layout style={style.layout_button}>
                            <Button onPress={() => setVisible(false)}>Cancel New Post</Button>
                            <Button onPress={() => SubmitPost(8, { text: postText }, setVisible(false))}>Submit Post</Button>
                        </Layout>
                    </Layout>
                </Card>
            </Modal>
        </Layout>
    )
}
