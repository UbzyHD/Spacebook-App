import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    safeAreaView: {
        flex: 1,
        display: 'flex'
    },
    card: {
        flex: 1,
        margin: 2
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    layout: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center'
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    layout_button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        justifyContent: 'flex-start',
        padding: 5
    },
    header: {
        textAlign: 'center',
        margin: 10
    },
    input: {
        padding: 5
    },
    button: {
        margin: 5
        // flexDirection: 'row'
    }
})

export default styles
