//import react
import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Dimensions,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

//import library react native elements
import {
    Icon,
    Overlay,
    Button
} from 'react-native-elements';

//import component
import D001_Card2 from './../../../components/design/4Scan-In/D001_Card2';
import D001_Card from './../../../components/design/4Scan-In/D001_Card';
import D001_Button from './../../../components/design/4Scan-In/D001_button';
import D001_Header from "./../../../components/design/4Scan-In/D001-header";

//import color library
import { RGBACOLORS } from '../../../utils/colors/color_library';

//import recyclerlistview
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider
} from 'recyclerlistview';

//import moment js
import moment from 'moment';

//import url from backend
import { baseURL } from "./../../../utils/config";

//import realm db
import Realm from "realm";

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

export default class D001 extends Component {
    constructor(props) {
        super(props);

        /**
        * RUN LOCAL DATABASE (MONGO REALM)
        */
        this.initDatabase()


        /**
        * DATA PROVIDER FUNCTION FOR RECYCLER LIST VIEW
        */
        let dp = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        /**
        * LAYOUT PROVIDER FUNCTION FOR RECYCLER LIST VIEW
        */
        this.layoutProvider = new LayoutProvider(
            index => {
                return index;
            },
            (type, dim) => {
                dim.width = Dimensions.get('window').width;
                dim.height = 80;
            }
        );

        this.state = {

            /**
            * CONTAIN DATA PROVIDER IN STATE
            */
            dataProvider: dp.cloneWithRows([]),

            /**
            * STATEMENT FOR CONDITIONAL RENDERING IN GENERAL RENDERING
            */
            isEmpty: true,

            isError: false,
            isServerSideError: false,
            isClientSideError: false,

            /**
            * STATEMENT FOR FINAL OVERLAY (CONDITIONAL RENDERING)
            */
            isOverlayVis: false,
            isOverlayVis2: false,

            /**
            * CONTAINER FOR GETDATA FUNCTION
            */
            newData: [],

            /**
            * VALUE FOR JUDUL DOKUMEN FORM
            */
            judulDokumenVal: this.props.route.params.title,
            autoFocus: false,
            editable: true,

            refreshing: false,

        };

        this.rowRenderer = this.rowRenderer.bind(this);
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
        console.log('database sudah jalan di D001!')
    }

    /**
    * FUNCTION FOR FINAL SUCCESS OVERLAY 
    */
    toggleOverlayVis1 = () => {
        this.setState({ isOverlayVis: true })
    }

    toggleOverlayVis2 = () => {
        this.setState({ isOverlayVis: false })
    }

    /**
    * FUNCTION FOR FINAL FAILED OVERLAY 
    */
    toggleOverlayVis3 = () => {
        this.setState({ isOverlayVis2: true })
    }

    toggleOverlayVis4 = () => {
        this.setState({ isOverlayVis2: false })
    }

    /**
    * FUNCTION FOR SETUP ROW RENDERER (RECYCLER LIST VIEW)
    */
    rowRenderer = (type, data) => {
        const { by, tipe, date, status } = data

        return <View style={{ marginLeft: 15 }}>
            <D001_Card2
                iconName={"circle-o"}
                iconType={"font-awesome"}
                iconColor={(status == null ? RGBACOLORS.primaryBlue : "#FF8C00")}
                iconSize={30}
                text1={by}
                fontSizeText1={16}
                fontFamilyTetxt1={'Open-Sans'}
                fontWeightText1={"500"}
                text2={`${tipe} : ${moment(date).format("D MMMM YYYY HH:mm")}`}
                fontSizeText2={14}
                fontFamilyText2={"Open-Sans"}
                fontWeightText2={"500"}
                text3={(status == null ? "" : "PENDING")}
            />
        </View>
    }

    /**
    * FUNCTION FOR PROVIDE DATA (RECYCLERLISTVIEW)
    */
    getData = async (cb) => {
        try {
            this.setState({ isLoading: true })

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/document-details?document_no=${this.props.route.params.document_no}`, requestOptions)
            const data = await res.json()
            const stat = await res.status

            if (stat >= 200 && stat <= 300) {
                for (var i in data.history) {
                    this.state.newData.push({
                        "by": data.history[i].by,
                        "tipe": data.history[i].type,
                        "date": data.history[i].date,
                        "status": data.history[i].status
                    })
                }

                this.setState({
                    dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                    isEmpty: false,
                    isLoading: false
                })
            }
            if (stat >= 400 && stat <= 500) {

                // if (stat == 404) {
                //     console.log(data.description);
                //     logger.error(`@Gleenald HTTP Stat: 404,{function: getData(), page: D001}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                // }

                console.log(data.description);
                //logger.error(`@Gleenald HTTP Stat: 400,{function: getData(), page: D002}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isEmpty: true,
                    isLoading: false,
                    //isClientSideError: true
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: getData(), page: D002}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isEmpty: true,
                    isLoading: false,
                    isServerSideError: true
                })
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: getData(), page: D002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({
                isLoading: false,
                isError: true
            })
        }

    }

    goHome = () => {
        try {
            this.props.navigation.push("HomePage", {
                name: this.realmDb.objects("Login")[0]["username"], divisi: this.realmDb.objects("Login")[0]["divisi"]
            })

            this.setState({ isOverlayVis: false })
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: goHome(), page: D002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({ isError: true })
        }
    }

    componentDidMount() {
        this.getData()
    }

    render() {

        const { document_no, date, nama_customer } = this.props.route.params;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: RGBACOLORS.white
                }}
            >
                {/* Header Section */}
                <View>
                    <D001_Header
                        backgroundColor={RGBACOLORS.white}
                        leftIconOnPress={
                            () => {
                                try {
                                    this.props.navigation.goBack()
                                }
                                catch (err) {
                                    console.log(err);
                                    logger.error(`@Gleenald Application catch error, {function: getBack(), page: D002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                                    this.setState({ isError: true })
                                }
                            }
                        }
                        leftIcon={'chevron-left'}
                        leftIconType={'font-awesome-5'}
                        leftIconSize={25}
                        leftIconColor={RGBACOLORS.black}

                        centerText={'Detail Dokumen'}
                        centerTextColor={RGBACOLORS.black}
                        centerTextFontFamily={'Open-Sans'}
                        centerTextFontSize={20}
                        centerTextFontWeight={"700"}
                    />
                </View>

                {/* DocNo Card Section */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    <D001_Card
                        backgroundColor={RGBACOLORS.lightGray}
                        borderColor={RGBACOLORS.white}
                        width={width - 40}
                        height={height / 5.5}
                        borderRadius={10}
                        marginTop={"5%"}

                        fontWeightText1={'500'}
                        fontFamilyText1={'Open-Sans'}
                        fontSizeText1={14}
                        marginTopText1={15}
                        text1={moment(date).format("D MMMM YYYY")}

                        fontWeightText2={'500'}
                        fontFamilyText2={'Open-Sans'}
                        fontSizeText2={14}
                        marginTopText2={15}
                        text2={document_no}

                        fontWeightText3={'500'}
                        fontFamilyText3={'Open-Sans'}
                        fontSizeText3={14}
                        marginTopText3={15}
                        text3={nama_customer}

                        customerHeight={height - 700}
                        customerWidth={width / 2}
                    />
                </View>

                {/* Text Judul Dokumen */}
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: "5%",
                        marginLeft: "5%"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "700",
                            fontFamily: "Open-Sans",
                            color: "rgba(82, 87, 92, 1)"
                        }}
                    >
                        Remarks / Notes :
                    </Text>
                </View>

                {/* Form Judul Dokumen */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 0
                    }}
                >
                    <TextInput
                        placeholder={"masukkan Remarks / Notes"}
                        placeholderTextColor={"rgba(187, 187, 187, 1.0)"}
                        style={{
                            backgroundColor: RGBACOLORS.white,
                            width: width / 1.1,
                            borderBottomWidth: 1.5,
                            borderBottomColor: "rgba(202, 204, 207, 1)",
                            color: RGBACOLORS.primaryBlue
                        }}
                        value={this.state.judulDokumenVal}
                        autoFocus={this.state.autoFocus}
                        onChangeText={
                            (x) => {
                                this.setState({ judulDokumenVal: x })
                            }
                        }
                    />

                </View>

                {/* recyclerlistview */}
                <View
                    style={{
                        flex: 1,
                        marginTop: "5%"
                    }}
                >
                    {this.displayBody()}

                </View>

                {/* Footer */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        height: 60,
                        width: width,
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingTop: 10,
                        paddingBottom: 10
                    }}
                >
                    <D001_Button
                        title={"Serahkan Dokumen"}
                        backgroundColor={RGBACOLORS.primaryBlue}
                        onPress={() => { this.submit() }}
                        width={width - 80}
                        height={40}
                        borderRadius={10}
                        disabled={false}
                        type={"solid"}

                    />

                    <Overlay
                        isVisible={this.state.isOverlayVis}
                        overlayStyle={{
                            width: 320,
                            height: 240,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 20
                            }}
                        >
                            <Icon
                                name="checkbox-marked-circle-outline"
                                type="material-community"
                                size={65}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 10
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Open-Sans",
                                    fontWeight: "700",
                                    fontSize: 14,
                                    backgroundColor: RGBACOLORS.lightBlue,
                                    color: RGBACOLORS.primaryBlue
                                }}
                            >
                                {document_no}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 0
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Open-Sans",
                                    fontWeight: "700",
                                    fontSize: 16,
                                    color: RGBACOLORS.black
                                }}
                            >
                                Dokumen Berhasil Diserahkan!
                        </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 10
                            }}
                        >
                            <Button
                                title="Ok"
                                onPress={this.goHome}

                                containerStyle={{
                                    marginTop: 10,
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
                            />
                        </View>

                    </Overlay>

                    <Overlay
                        isVisible={this.state.isOverlayVis2}
                        onBackdropPress={() => { this.toggleOverlayVis4() }}
                        overlayStyle={{
                            width: 320,
                            height: 240,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 7.5
                            }}
                        >
                            <Icon
                                name="alert-circle-outline"
                                type="material-community"
                                size={65}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 5
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Open-Sans",
                                    fontWeight: "700",
                                    fontSize: 14,
                                    backgroundColor: RGBACOLORS.lightBlue,
                                    color: RGBACOLORS.primaryBlue
                                }}
                            >
                                {document_no}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 0
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Open-Sans",
                                    fontWeight: "700",
                                    fontSize: 16,
                                    color: RGBACOLORS.black
                                }}
                            >
                                Dokumen gagal diserahkan!
                        </Text>

                            <Text
                                style={{
                                    fontFamily: "Open-Sans",
                                    fontWeight: "600",
                                    fontSize: 14,
                                    color: RGBACOLORS.red,
                                    marginTop: 5
                                }}
                            >
                                Sudah ada Proses Scan Out di Dokumen Ini
                        </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 10
                            }}
                        >
                            <Button
                                title="Ok"
                                onPress={
                                    () => {

                                        this.setState({ isOverlayVis2: false })
                                    }
                                }
                                containerStyle={{
                                    marginTop: 10,
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
                            />
                        </View>
                    </Overlay>

                </View>

                {/* Loading Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.isLoading}
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
                        overlayStyle={{
                            width: 320,
                            height: 220,
                            borderRadius: 10
                        }}
                        onBackdropPress={
                            () => {
                                this.setState({ isClientSideError: false })
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
                                    400! Client Error.
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
                                            this.setState({ isClientSideError: false });
                                        }
                                    }
                                />
                            </View>
                        </View>
                    </Overlay>
                </View>
            </View>
        )
    }


    /**
    * FUNCTION FOR POSTING DATA TO API
    */

    submit = async () => {
        try {

            this.setState({ isLoading: true })

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "type": "out",
                "document_no": this.props.route.params.document_no,
                "remark": this.state.judulDokumenVal,
                "tanggal": moment(this.props.route.params.date).format("YYYY-MM-DD"),
                "nama_customer": this.props.route.params.nama_customer
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/document-update`, requestOptions);
            const stat = await res.status;
            const data = await res.json();

            console.log(`data berhasil di submit (proses scan-out) ${this.props.route.params.document_no}`);

            if (stat >= 200 && stat <= 300) {
                this.setState({ isOverlayVis: true })
                this.setState({ isLoading: false })

                logger.log(`Username: ${this.realmDb.objects("Login")[0]["username"]}, ScanOut`);
                logger.log(`Application sent this data to Backend ${raw}`);
                logger.log(`Backend Response: ${data.description}`);

                console.log(`Username: ${this.realmDb.objects("Login")[0]["username"]}, ScanOut`)
                console.log(`Application send this data to backend: ${raw}`);
                console.log(`Response from backend: ${data.description}`);
            }
            if (stat >= 400 && stat <= 500) {
                this.setState({ isOverlayVis2: true, isLoading: false });
                logger.error(`@Gleenald, ScanOut, POST DocumentTracker Error, ScanOut! HTTP Stat ${stat}, Username: ${this.realmDb.objects("Login")[0]["username"]}, Response from Backend : ${data.description}`)
                logger.error(`App send to Backend: ${raw}`);

                console.log(data.description);
                console.log(stat);
            }
            if (stat <= 500 && stat >= 600) {
                this.setState({ isServerSideError: true, isLoading: false })
                logger.error(`@Gleenald, ScanOut, POST DocumentTracker Error, ScanOut! HTTP Stat ${stat}, Username: ${this.realmDb.objects("Login")[0]["username"]}, Response from Backend : ${data.description}`)
                logger.error(`App send to Backend: ${raw}`);

                console.log(data.description);
                console.log(stat);
            }

        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: submit(), page:D002}, logMsg: ${err}, Username: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({ isLoading: false });
            this.setState({ isError: true });
        }
    }

    displayBody() {
        if (this.state.isEmpty == false) {
            return (
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <RecyclerListView
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.state.dataProvider}
                        rowRenderer={this.rowRenderer}
                        scrollViewProps={{
                            refreshControl: (
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={
                                        async () => {
                                            try {
                                                this.setState({ refreshing: true })
                                                this.getData()
                                                this.setState({ refreshing: false })
                                            }
                                            catch (err) {
                                                console.log(err);
                                                logger.error(`@Gleenald Application catch error, {function: refresh(), page: D002}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                                                this.setState({ isError: true })
                                            }
                                        }
                                    }
                                />
                            )
                        }}
                    >
                    </RecyclerListView>
                </View>
            )
        }
        if (this.state.isEmpty == true) {
            return (
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}
                >

                    <View>
                        <Icon name="package-variant" type="material-community" size={100} color={RGBACOLORS.gray2} />
                    </View>

                    <Text>Tidak Ada Data..</Text>

                </View>
            )
        }
    }
}
