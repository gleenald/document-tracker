//import react
import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Dimensions,
    ImageBackground,
    StatusBar,
    TextInput,
    ActivityIndicator
} from 'react-native';

//import react native elements
import {
    Card,
    Icon,
    Overlay,
    Button
} from 'react-native-elements';

//import color library
import { RGBACOLORS } from "./../../../utils/colors/color_library";

//import QR CODE
import QRCodeScanner from 'react-native-qrcode-scanner';

//import realm db
import Realm from "realm";

//import url from backend
import { baseURL } from "./../../../utils/config";

//import telegram logger
import { TelegramLogger } from 'node-telegram-log';

/**
* DEFINE SCREEN DIMENSIONS
*/
const { height, width } = Dimensions.get('window');

/**
* DEFINE LOGGER TELEGRAM
*/
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-653733508");


export default class C002 extends Component {
    constructor(props) {
        super(props);

        this.initDatabase()

        this.state = {
            isManualInput: false,

            isWaiting: false,

            isError: false,
            isServerSideError: false,
            isClientSideError: false,
            isQRnotValid: false
        }
    }
    /**
    * IF CAMERA READS BARCODE RUN THIS FUNCTION!
    */
    onRead = async (e) => {
        try {
            this.setState({ isWaiting: true })

            let result = e.data.split("/");

            if (result.length == 3) {

                //fetching process goes here!
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: "GET",
                    redirect: "follow",
                    headers: myHeaders,
                }

                const res = await fetch(`${baseURL}/delivery-customer/${result[1]}`, requestOptions);
                const stat = await res.status;
                const data = await res.json();

                if (stat >= 200 && stat <= 300) {
                    this.props.navigation.push("DocumentDetail-ScanOutPage", {
                        date: result[0],
                        document_no: result[1],
                        nama_customer: data.data.CustomerName
                    })
                    this.setState({ isWaiting: false })
                }
                if (stat >= 400 && stat <= 500) {
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: 400,{function: ScanQR(), page:C002}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                    this.setState({
                        isWaiting: false,
                        isClientSideError: true
                    })
                }
                if (stat >= 500 && stat <= 600) {
                    console.log(data.description);
                    logger.error(`@Gleenald HTTP Stat: 500,{function: scanQR(), page:C002}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                    this.setState({
                        isServerSideError: true,
                        isWaiting: false,
                    })
                }

            }
            if (result.length < 3) {
                this.setState({
                    isWaiting: false,
                    isQRnotValid: true
                })  
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: scanQR(), page: C002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({
                isWaiting: false,
                isError: true
            });
        }
    };

    submit = async () => {
        try {
            this.setState({
                isWaiting: true,
                isManualInput: false
            })

            //fetching process goes here!
            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

            let requestOptions = {
                method: "GET",
                redirect: "follow",
                headers: myHeaders,
            }

            const res = await fetch(`${baseURL}/delivery-customer/${this.state.DocNum}`, requestOptions)
            const stat = await res.status
            const data = await res.json()

            if (stat >= 200 && stat <= 300) {

                this.setState({
                    isWaiting: false,
                    isManualInput: false
                });

                this.props.navigation.push("DocumentDetail-ScanOutPage", {
                    date: new Date(),
                    document_no: this.state.DocNum,
                    nama_customer: data.data.CustomerName
                })
            }
            if (stat >= 400 && stat <= 500) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 400,{function: manualInput(), page:C002}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                this.setState({
                    isWaiting: false,
                    isManualInput: false,
                    isClientSideError: true
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: manualInput(), page:C002}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                this.setState({
                    isServerSideError: true,
                    isWaiting: false,
                    isManualInput: false
                })
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: manualInput(), page: C002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({ isWaiting: false });
            this.setState({ isError: true });
        }
    }

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
        console.log('database sudah jalan di C002!')
    }

    componentDidMount() {
        StatusBar.setHidden(true);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <QRCodeScanner
                    cameraType="back"
                    onRead={this.onRead}
                    showMarker={true}
                    cameraStyle={{
                        width: width,
                        height: height
                    }}
                    containerStyle={{
                        transform: [{ rotate: "0deg" }],

                    }}
                    reactivate={true}
                    reactivateTimeout={3000}
                />

                {/* Header Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.primaryBlue,
                        width: width,
                        height: height / 10,
                        position: "absolute",
                        top: 0,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}
                >

                    <Icon
                        name="chevron-left"
                        size={30}
                        color={RGBACOLORS.lightBlue}
                        containerStyle={{
                            marginRight: 20
                        }}
                        onPress={
                            () => {
                                try {
                                    this.props.navigation.navigate("HomePage")
                                }
                                catch (err) {
                                    ogger.error(`@Gleenald Application catch error, {function: getBack(), page:C02}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                                    console.log(err)
                                    this.setState({ isError: true })
                                }
                            }
                        }
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            fontFamily: "Open-Sans",
                            color: RGBACOLORS.lightBlue,
                        }}
                    >
                        Scan Out
                    </Text>

                    <Icon
                        name="keyboard-outline"
                        type="material-community"
                        size={25}
                        color={RGBACOLORS.white}
                        containerStyle={{
                            marginTop: 3,
                            marginLeft: width / 1.85

                        }}

                        onPress={
                            () => {
                                this.setState({ isManualInput: true })
                            }
                        }
                    />


                </View>

                {/* Bottom Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        position: "absolute",
                        bottom: 0,
                        width: width,
                        height: height / 14,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"

                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            fontFamily: "Open-Sans",
                            color: RGBACOLORS.primaryBlue,
                        }}
                    >
                        Scan Dokumen Dengan Barcode Scanner
                    </Text>
                </View>

                {/* Overlay Manual Input */}
                <View>
                    <Overlay
                        overlayStyle={{
                            width: 310,
                            height: 180,
                            borderRadius: 10,
                        }}
                        isVisible={this.state.isManualInput}
                        onBackdropPress={() => {
                            this.setState({ isManualInput: false })
                        }}
                    >
                        <View
                            style={{
                                marginTop: 20,
                                marginLeft: 5
                            }}
                        >
                            <View
                                style={{
                                    // marginTop: 20
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: '600'
                                    }}
                                >
                                    No. Dokumen
                                </Text>

                                <TextInput
                                    placeholder="masukkan No Dokumen disini .."
                                    placeholderTextColor={"rgba(112, 112, 112, 1)"}
                                    style={{
                                        backgroundColor: RGBACOLORS.lightGray,
                                        paddingLeft: 10,
                                        borderRadius: 10,
                                        width: 280,
                                        height: 40,
                                        marginTop: 7,
                                        color: RGBACOLORS.primaryBlue
                                    }}
                                    onChangeText={
                                        (y) => { this.setState({ DocNum: y }) }
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginRight: 12,
                                    marginTop: 15
                                }}
                            >
                                <Button
                                    title={"Submit"}
                                    buttonStyle={{
                                        width: 75,
                                        height: 37,
                                        marginTop: 15,
                                        backgroundColor: RGBACOLORS.primaryBlue,
                                        borderRadius: 5
                                    }}
                                    type={"solid"}
                                    onPress={this.submit}
                                />
                            </View>

                        </View>
                    </Overlay>
                </View>

                {/* Loading Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.isWaiting}
                        overlayStyle={{
                            width: 120,
                            height: 120,
                            borderRadius: 10,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{
                                marginBottom: 20
                            }}
                        >
                            <ActivityIndicator size="large" color={RGBACOLORS.primaryBlue} />
                        </View>

                        <Text>Loading</Text>

                    </Overlay>
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

                {/* error if get 500 */}
                <View>
                    <Overlay
                        isVisible={this.state.isServerSideError}
                        overlayStyle={{
                            width: 320,
                            height: 220,
                            borderRadius: 10
                        }}
                        onBackdropPress={
                            () => {
                                this.setState({ isServerSideError: false })
                            }
                        }
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
                                    onPress={
                                        () => {
                                            this.setState({ isServerSideError: false });
                                        }
                                    }
                                />
                            </View>
                        </View>
                    </Overlay>
                </View>

                {/* error if get 400 */}
                <View>
                    <Overlay
                        isVisible={this.state.isClientSideError}
                        onBackdropPress={() => {
                            this.setState({ isClientSideError: !this.state.isClientSideError })
                        }}
                        overlayStyle={{
                            width: 320,
                            height: 125,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{
                                marginLeft: 10,
                                marginTop: 10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "red"
                                }}
                            >
                                Maaf, Dokumen yang anda Scan tidak sesuai
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Button
                                    title={"Ok"}
                                    buttonStyle={{
                                        width: 100,
                                        height: 40,
                                        marginTop: 10,
                                        marginRight: 10
                                    }}
                                    type={'clear'}
                                    onPress={() => { this.setState({ isClientSideError: false }) }}
                                />
                            </View>
                        </View>
                    </Overlay>

                </View >

                {/* error qr not valid */}
                <View>
                    <Overlay
                        overlayStyle={{
                            width: 320,
                            height: 124,
                            borderRadius: 10,

                        }}
                        isVisible={this.state.isQRnotValid}
                        onBackdropPress={
                            () => { this.setState({ isQRnotValid: false }) }
                        }
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: RGBACOLORS.red,
                                marginLeft: 10,
                                marginTop: 10
                            }}
                        >
                            QR yang anda scan tidak valid.
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                // marginRight: 10,
                                marginTop: 10
                            }}
                        >
                            <Button
                                title="OK"
                                type='clear'
                                containerStyle={{
                                    height: 50,
                                    width: 50,
                                }}
                                onPress={
                                    () => {
                                        this.setState({ isQRnotValid: false })
                                    }
                                }
                            />
                        </View>
                    </Overlay>
                </View>

            </View>

        );
    }
}
