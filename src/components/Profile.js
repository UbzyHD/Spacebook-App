import React, { Component } from 'react';
import { View, Text, FlatList, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../App';


class ProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            userData: null,
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });

        this.getData();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const userid = await AsyncStorage.getItem('@userid')

        return fetch(baseUrl + "user/" + userid, {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    this.props.navigation.navigate("Login");
                } else {
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    userData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };

    render() {

        if (this.state.isLoading) {
            return (

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text>Loading..</Text>
                </View>
            );
        } else {
            console.log(this.state.userData)
            return (
                <View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text>My Profile</Text>
                        <br></br>
                        <Text>Name: {this.state.userData.first_name} {this.state.userData.last_name}</Text>
                        <Text>Email: {this.state.userData.email}</Text>
                        <Text>Friend Count: {this.state.userData.friend_count}</Text>
                        <Button
                            title="Home"
                            color="darkblue"
                            onPress={() => this.props.navigation.navigate("Home")}
                        />
                        <Button
                            title="Logout"
                            color="darkblue"
                            onPress={() => this.props.navigation.navigate("Logout")}
                        />
                    </View>
                </View>
            );
        }

    }
}



export default ProfileScreen;
