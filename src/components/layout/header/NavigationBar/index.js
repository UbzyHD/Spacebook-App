import React from 'react'
import {
    Icon,
    Layout,
    MenuItem,
    OverflowMenu,
    TopNavigation,
    TopNavigationAction,
    Divider
} from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
// import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '../../../../resources/baseURL'

// const BackIcon = (props) => (
//     <Icon {...props} name='arrow-back'/>
// )

const ProfileIcon = (props) => (
    <Icon {...props} name='person'/>
)

const MenuIcon = (props) => (
    <Icon {...props} name='more-vertical'/>
)

const LogoutIcon = (props) => (
    <Icon {...props} name='log-out'/>
)

const SettingsIcon = (props) => (
    <Icon {...props} name='settings' />
)

const NavigationBar = (props) => {
    const [menuVisible, setMenuVisible] = React.useState(false)

    const logout = async () => {
        const token = await AsyncStorage.getItem('@session_token')
        await AsyncStorage.removeItem('@session_token')
        return fetch(baseURL + 'logout', {
            method: 'post',
            headers: {
                'X-Authorization': token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    props.navigation.navigate('Login')
                } else if (response.status === 401) {
                    props.navigation.navigate('Login')
                } else {
                    throw Error('Something went wrong')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const toggleMenu = () => {
        setMenuVisible(!menuVisible)
    }

    // const route = useRoute();
    // const title = route.name;

    const navigateToConfig = () => {
        props.navigation.navigate('Configuration')
    }

    const navigateToProfile = () => {
        props.navigation.navigate('Profile')
    }

    // const navigateBack = () => {
    //     props.navigation.goBack()
    // }

    const renderMenuAction = () => (
        <TopNavigationAction icon={MenuIcon} onPress={toggleMenu}/>
    )

    const renderRightActions = () => (
        <React.Fragment>
            <TopNavigationAction icon={ProfileIcon} onPress={navigateToProfile}/>
            <OverflowMenu
                anchor={renderMenuAction}
                visible={menuVisible}
                onBackdropPress={toggleMenu}>
                <MenuItem accessoryLeft={SettingsIcon} title='Configuration' onPress={navigateToConfig}/>
                <MenuItem accessoryLeft={LogoutIcon} title='Logout' onPress={logout}/>
            </OverflowMenu>
        </React.Fragment>
    )

    // const renderBackAction = () => (
    //   <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
    // );

    return (
        <Layout style={styles.container} level='1'>
            <TopNavigation
                alignment='center'
                title='Spacebook App'
                accessoryRight={renderRightActions}
            />
            <Divider/>
        </Layout>
    )

//   if (title === 'Home') {
//     return (
//     <Layout style={styles.container} level='1'>
//     <TopNavigation
//       alignment='center'
//       title={title}
//       accessoryRight={renderRightActions}
//     />
//     <Divider/>
//   </Layout>
//     )
// } else if (title === 'Login') {
//   return(
//     null
//   )
// } else {
//     return (
//       <Layout style={styles.container} level='1'>
//       <TopNavigation
//         alignment='center'
//         title={title}
//         accessoryLeft={renderBackAction}
//         accessoryRight={renderRightActions}
//       />
//       <Divider/>
//     </Layout>
//     )
// }
}

const styles = StyleSheet.create({
    container: {
    }
})

NavigationBar.propTypes = { navigation: PropTypes.object.isRequired }

export default NavigationBar
