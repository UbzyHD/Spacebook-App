import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout, Button, Text, Icon } from '@ui-kitten/components'
import styles from '../../resources/styles'
import PropTypes from 'prop-types'

import NavigationBar from '../../components/layout/header/NavigationBar'

export const HomeScreen = (props) => {
    return (
        <>
            <SafeAreaView style={styles.safeAreaView}>
                <NavigationBar {...props}/>
                <Layout style={styles.layout}>
                    <Text style={styles.text} category="h1">Welcome to the Spacebook App!</Text>
                    <Layout style={styles.layout_button}>
                        <Button accessoryLeft={<Icon {...props} name='person' />} style={styles.button} onPress={() => props.navigation.navigate('Profile')}>Profile</Button>
                        <Button accessoryLeft={<Icon {...props} name='people' />} style={styles.button} onPress={() => props.navigation.navigate('Friends')}>Friends</Button>
                    </Layout>
                    <Layout style={styles.layout_button}>
                        <Button accessoryLeft={<Icon {...props} name='person-add' />} style={styles.button} onPress={() => props.navigation.navigate('AddFriends')}>Add Friends</Button>
                    </Layout>
                </Layout>
            </SafeAreaView>
        </>
    )
}

HomeScreen.propTypes = { navigation: PropTypes.object.isRequired }
