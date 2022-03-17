import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Button, Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'

import ToggleThemeButton from '../../components/buttons/ToggleThemeButton'
import baseURL from '../../resources/baseURL'

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
)

export const ConfigScreen = ({ navigation }) => {
    const navigateBack = () => {
        navigation.goBack()
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    )

    const serverManagement = async (type) => {
        return fetch(baseURL + type, {
            method: 'POST'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 400) {
                    throw Error('Failed validation')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .then((responseJson) => {
                console.log('Server: ', responseJson)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <SafeAreaView style={styles.safeAreaView}>
                <TopNavigation title='Configuration' alignment='center' accessoryLeft={BackAction()} />
                <Divider />
                <Layout style={styles.layout}>
                    <Avatar style={styles.avatar} size='large' source={require('../../../assets/icon.png')} />
                    <Text>Click the button to change theme</Text>
                    <ToggleThemeButton />
                    <Button onPress={() => serverManagement('reset')}>Reset Server</Button>
                    <Button onPress={() => serverManagement('resample')}>Resample</Button>

                </Layout>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
