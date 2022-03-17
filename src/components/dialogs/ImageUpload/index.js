import React from 'react'
import { useFilePicker } from 'use-file-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar, Button, Layout, Spinner, Text } from '@ui-kitten/components'
import baseURL from '../../../resources/baseURL'
import styles from '../../../resources/styles'
import { SafeAreaView } from 'react-native-safe-area-context'

export const ImageUpload = () => {
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        readAs: 'DataURL',
        accept: ['.jpeg', '.jpg', '.png'],
        multiple: false,
        limitFilesConfig: { max: 1 },
        maxFileSize: 50
    })

    const sendToServer = async (data) => {
        const authToken = await AsyncStorage.getItem('@session_token')
        const userID = await AsyncStorage.getItem('@user_id')

        return fetch(baseURL + 'user/' + userID + '/photo', {
            method: 'POST',
            headers: {
                'Content-Type': data.type,
                'X-Authorization': authToken
            },
            body: data
        })
            .then((response) => {
                console.log('Picture added', response)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Layout style={styles.layout}>
                    <Spinner/>
                </Layout>
            </SafeAreaView>
        )
    }

    return (
        <Layout style={styles.container}>
            <Text style={styles.text} category="h1">Edit Profile Picture</Text>

            {filesContent.map((file, index) => (
                <div key={index}>
                    <Avatar shape='round' style={{ width: 256, height: 256 }} source={{ uri: file.content }}/>
                </div>
            ))}
            <Button onPress={() => openFileSelector()}>Select new image</Button>
            <Button disabled={filesContent.length === 0} onPress={() => fetch(filesContent[0].content).then(res => res.blob()).then(blob => { sendToServer(blob) })}>Set as profile picture</Button>
        </Layout>
    )
}
