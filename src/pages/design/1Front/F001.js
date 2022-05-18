//import react
import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    ActivityIndicator
} from 'react-native';

//import react native elements
import { Button, Icon, Overlay } from 'react-native-elements';

//import component
import F001_Button from './../../../components/design/1Front/F001_Button';
import F001_alternateButton from "./../../../components/design/1Front/F001_alternateButton";

//import color library
import { RGBACOLORS } from "./../../../utils/colors/color_library";

//import url from backend
import { baseURL } from "./../../../utils/config";

//import realm db
import Realm from "realm";

//import image
import logoOnda from "./../../../utils/Logo/ONDA-LOGO2.png";
import logoBeOne from "./../../../utils/Logo/BEONE-LOGO2.png";

//import telegram logger
import { TelegramLogger } from "node-telegram-log";

/**
* DEFINE SCREEN DIMENSIONS
*/
const { height, width } = Dimensions.get('window');

const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-653733508")

export default class F001 extends Component {
    constructor(props) {
        super(props);

        /**
        * RUN LOCAL DATABASE (MONGO REALM)
        */
        this.initDatabase()

        this.state = {

            /**
             * CONTAINER FOR USERNAME AND PASSWORD
             */
            username: "",
            password: "",

            /**
             * PARAMS IF USER INPUT WRONG USERNAME AND PASSWORD
             */
            displayAlert: "",

            /**
             * CONTAINER FOR TOKEN FROM BACKEND
             */
            token: "",

            /**
             * STATEMENT FOR CONDITIONAL RENDERING IN LOGIN BUTTON
            */
            isWaiting: false,

            isLoading: false,

            isError: false,
            isServerSideError: false,

        }
    }

    /**
    * FUNCTION FOR OPEN LOCAL DATABASE (MONGO REALM)
    */
    login = {
        name: "Login",
        properties: {
            username: "string",
            password: "string",
            token: "string",
            divisi: "string"
        }
    }

    realmDb = null;

    initDatabase = () => {
        this.realmDb = new Realm({
            schema: [this.login],
            schemaVersion: 2
        });
        console.log('database sudah jalan di F001!')
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('beforeRemove', (e) => {
            // do something
            e.preventDefault()
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {

        /**
        * CONDITIONAL RENDERING IN LOGIN BUTTON SECTION
        */
        const loginButton =
            <F001_Button
                title={'Login'}
                backgroundColor={RGBACOLORS.primaryBlue}
                width={width / 1.35}
                height={42}
                borderRadius={10}
                disabled={(this.state.username === "" || this.state.password === "") ? true : false}
                type={"solid"}
                onPress={() => { this.submit() }}
            />


        const loginWait =

            <F001_alternateButton />


        let msg;

        if (this.state.isWaiting == false) {
            msg = loginButton
        }
        if (this.state.isWaiting == true) {
            msg = loginWait
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: RGBACOLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Logo Image Section */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <View
                        style={{
                            backgroundColor: RGBACOLORS.white,
                            height: height / 9,
                            width: width / 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 30,
                            marginTop: 7
                        }}
                    >
                        <Image source={logoOnda} style={{ height: "70%", width: "100%" }} />
                    </View>

                    <View
                        style={{
                            backgroundColor: RGBACOLORS.white,
                            height: height / 9,
                            width: width / 3,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image source={logoBeOne} style={{ height: "70%", width: "100%" }} />
                    </View>

                </View>

                {/* Username Form Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        width: width - 40,
                        marginTop: "5%",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Open-Sans",
                            fontWeight: "700",
                            fontSize: 16,
                            color: RGBACOLORS.gray2
                        }}
                    >
                        Username :
                    </Text>

                    <TextInput
                        placeholder="masukkan Username"
                        placeholderTextColor={"rgba(187, 187, 187, 1.0)"}
                        onChangeText={(text) => { this.setState({ username: text }) }}
                        value={this.state.username}

                        style={{
                            borderBottomColor: RGBACOLORS.lightGray,
                            borderBottomWidth: 2,
                            width: "95%",
                            color: RGBACOLORS.gray2
                        }}
                    />
                </View>

                {/* Password Form Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        width: width - 40,
                        marginTop: "10%",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Open-Sans",
                            fontWeight: "700",
                            fontSize: 16,
                            color: RGBACOLORS.gray2
                        }}
                    >
                        Password :
                    </Text>

                    <TextInput
                        placeholder="masukkan Password"
                        placeholderTextColor={"rgba(187, 187, 187, 1.0)"}
                        style={{
                            // backgroundColor:RGBACOLORS.white,
                            borderBottomColor: RGBACOLORS.lightGray,
                            borderBottomWidth: 2,
                            width: "95%",
                            color: RGBACOLORS.gray2
                        }}
                        secureTextEntry={true}
                        onChangeText={pass => { this.setState({ password: pass }) }}
                        value={this.state.password}
                    />
                </View>

                {/* alert if user input wrong username / pass */}
                <View
                    style={{
                        marginTop: 20
                    }}
                >
                    {this.displayAlert(this.state.displayAlert)}

                </View>

                {/* Login Button Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        width: width,
                        height: height / 8,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "10%",
                    }}
                >
                    {msg}
                </View>

                {/* Overlay Error */}
                <View>
                    <Overlay
                        isVisible={this.state.isError}
                        overlayStyle={{
                            width: 320,
                            height: 200,
                            borderRadius: 10
                        }}
                        onBackdropPress={() => { this.setState({ isError: false }) }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >

                            <Icon
                                name="alert-circle-outline"
                                type="material-community"
                                size={65}
                            />

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "red"
                                }}
                            >
                                Aplikasi Error
                            </Text>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: RGBACOLORS.black
                                }}
                            >
                                Anda harus restart aplikasi
                            </Text>

                            <View>
                                <Button
                                    title="Ok"
                                    containerStyle={{
                                        marginTop: 20,
                                        borderRadius: 10,
                                        width: 270,
                                    }}
                                    buttonStyle={{
                                        backgroundColor: RGBACOLORS.primaryBlue
                                    }}
                                    titleStyle={{
                                        fontSize: 18,
                                        fontFamily: "Open-Sans",
                                        fontWeight: "700",
                                        color: RGBACOLORS.white
                                    }}
                                    onPress={
                                        () => {
                                            let login1;

                                            this.realmDb.write(() => {

                                                login1 = this.realmDb.objects("Login")[0]
                                                login1.username = "",
                                                    login1.password = "",
                                                    login1.token = ""
                                            })

                                            this.props.navigation.push("FrontPage");
                                            this.setState({ isError: false })
                                        }
                                    }
                                />
                            </View>
                        </View>
                    </Overlay>
                </View>

                {/* Overlay Serverside Error */}
                <View>
                    <Overlay
                        isVisible={this.state.isServerSideError}
                        overlayStyle={{
                            width: 320,
                            height: 220,
                            borderRadius: 10
                        }}
                        onBackdropPress={() => { this.setState({ isServerSideError: false }) }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >

                            <Icon
                                name="alert-circle-outline"
                                type="material-community"
                                size={65}
                            />

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "red"
                                }}
                            >
                                Aplikasi Error
                            </Text>

                            <View
                                style={{
                                    width: width - 100,
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: RGBACOLORS.black,
                                    }}
                                >
                                    500! Internal Server Error.
                            </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: RGBACOLORS.black,
                                    }}
                                >
                                    Harap kontak tim Development Segera!
                                </Text>
                            </View>

                            <View>
                                <Button
                                    title="Ok"
                                    containerStyle={{
                                        marginTop: 20,
                                        borderRadius: 10,
                                        width: 270,
                                    }}
                                    buttonStyle={{
                                        backgroundColor: RGBACOLORS.primaryBlue
                                    }}
                                    titleStyle={{
                                        fontSize: 18,
                                        fontFamily: "Open-Sans",
                                        fontWeight: "700",
                                        color: RGBACOLORS.white
                                    }}
                                    onPress={() => { this.setState({ isServerSideError: false }) }}
                                />
                            </View>
                        </View>
                    </Overlay>
                </View>

            </View>
        )
    }

    /**
    * FUNCTION IF USER INPUT WRONG USERNAME AND PASSWORD
    */
    displayAlert(param) {
        return (

            <Text style={{ fontSize: 16, color: RGBACOLORS.red, fontWeight: "700" }}>{param}</Text>

        )

    }

    /**
    * FUNCTION TO SUBMIT USER INPUT TO LOGIN
    */
    submit = async () => {
        try {

            this.setState({ isWaiting: true });

            if (this.state.username == "d3l3t3" && this.state.password == "54321") {
                this.realmDb.write(() => {
                    this.realmDb.deleteAll()
                })
                this.props.navigation.push("FrontPage")
            }
            else {
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                let raw = JSON.stringify({
                    "username": this.state.username,
                    "password": this.state.password
                });

                let requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                }

                const res = await fetch(`${baseURL}/login`, requestOptions)
                const data = await res.json()
                const stat = await res.status

                console.log(data);
                console.log(stat);

                if (stat >= 200 && stat <= 300) {

                    this.setState({
                        token: data.token,
                        displayAlert: ""
                    });

                    let newData = {
                        username: this.state.username,
                        password: this.state.password,
                        token: this.state.token,
                        divisi: data.divisi
                    };

                    let login1;

                    this.realmDb.write(() => {
                        login1 = this.realmDb.create("Login", {
                            username: "",
                            password: "",
                            token: "",
                            divisi: ""
                        })

                        login1 = this.realmDb.objects("Login")[0];
                        login1.username = newData.username;
                        login1.password = newData.password;
                        login1.token = newData.token;
                        login1.divisi = newData.divisi;

                    })
                    this.setState({ displayAlert: "" })
                    this.setState({ username: "" })
                    this.setState({ password: "" })
                    this.setState({ isWaiting: false })

                    console.log(this.realmDb.objects("Login")[0])
                    console.log(`user login to Document Tracker, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                    logger.log(`user login to Document Tracker, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);

                    this.props.navigation.push("HomePage", {
                        name: this.realmDb.objects("Login")[0]["username"], divisi: this.realmDb.objects("Login")[0]["divisi"]
                    })

                }
                if (stat >= 400 && stat <= 500) {
                    console.log(data.description);
                    logger.error(`HTTP Stat: 400, ClientSideError, NodeMsg: ${data.description}`);
                    this.setState({ isWaiting: false, displayAlert: "username atau password yang diinput salah" })
                }
                if (stat >= 500 && stat <= 600) {
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: 500, ServerSideError, NodeMsg: ${data.description}`);
                    this.setState({ isWaiting: false, isServerSideError: true })
                }
            }
        }
        catch (err) {
            console.log(err);
            this.setState({ isError: true, isWaiting: false });
            logger.error(`@Gleenald Application catch error, logMsg: ${err}`);
        }
    }
}
