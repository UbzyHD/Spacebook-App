import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Text } from '@ui-kitten/components'
import PropTypes from 'prop-types'

import NavigationBar from '../../components/layout/header/NavigationBar'

export const HomeScreen = (props) => {
    return (
        <>
            <SafeAreaView style={styles.safeAreaView}>
                <NavigationBar {...props}/>
                <Layout style={styles.container}>
                    <Text style={styles.text} category="h1">Welcome to the Spacebook App!</Text>
                    <Layout style={styles.layout}>
                        <Button style={styles.button} onPress={() => props.navigation.navigate('Profile')}>Profile</Button>
                        <Button style={styles.button} onPress={() => props.navigation.navigate('Friends')}>Friends</Button>
                    </Layout>
                </Layout>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    safeAreaView: {
        flex: 1
    },
    layout: {
        flexDirection: 'row'
    },
    text: {
        textAlign: 'center'
    },
    link: {
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    button: {
        margin: 10
    }
})

HomeScreen.propTypes = { navigation: PropTypes.object.isRequired }
