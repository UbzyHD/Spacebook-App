import React from 'react'
import { Button, Card, Layout, Modal, Text, Icon, Input } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '../../../resources/baseURL'

export const NewPost = () => {
    const [visible, setVisible] = React.useState(false)
    const [postText, setpostText] = React.useState()

    const SubmitPost = async (userID, text) => {
        const authToken = AsyncStorage.getItem('@session_token')
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

    return (
        <Layout level='1'>

            <Button onPress={() => setVisible(true)}>New Post</Button>

            <Modal visible={visible}>
                <Card disabled={true}>
                    <Text>New Post</Text>
                    <Input placeholder='Enter new post text' multiline={true} onChange={e => setpostText(e.target.value)} accessoryLeft={(props) => (<Icon {...props} name='edit'/>)}/>
                    <Button onPress={() => SubmitPost(8, { text: postText }, setVisible(false))}>Submit Post</Button>
                    <Button onPress={() => setVisible(false)}>Cancel New Post</Button>
                </Card>
            </Modal>

        </Layout>
    )
}
