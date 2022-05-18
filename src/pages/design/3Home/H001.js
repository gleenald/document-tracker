//import react
import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Dimensions,
    Alert,
    StatusBar,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

//import react native elements
import { Button, Icon, Overlay } from 'react-native-elements';

//import component
import H001_Header from "./../../../components/design/3Home/H001-header";
import H001_Card1 from "./../../../components/design/3Home/H001-card1";

//import color library
import { RGBACOLORS } from '../../../utils/colors/color_library';

//import recyclerlistview
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider
} from 'recyclerlistview';

//import moment js
import moment from "moment";

//import url from backend
import { baseURL } from "./../../../utils/config";

//import realm db
import Realm from "realm";

//import rn-fab
import FAB from 'react-native-fab';

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

export default class H001 extends Component {
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
                dim.height = 150;
            }
        );

        this.state = {

            /**
            * CONTAIN DATA PROVIDER IN STATE
            */
            dataProvider: dp.cloneWithRows([]),

            /**
             * STATEMENT FOR CONDITIONAL RENDERING IN BODY
             */
            isEmpty: false,

            isOverlayVis: false,

            isLoading: false,

            isError: false,
            isServerSideError: false,
            isClientSideError: false,

            isOverlayFABVisible: false,

            refreshing: false,


            /**
             * CONTAINER FOR USERNAME AND PASSWORD
             */
            //username: "",
            //password: "",

            documentCount: 0,
            documentPage: 1,
            documentList: [],
            totalDocument: 0,
            documentLimit: 3,

            footerDisplay: "block",

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
        console.log('database sudah jalan di H001!')
    }

    /**
    * FUNCTION FOR SETUP ROW RENDERER (RECYCLER LIST VIEW)
    */
    rowRenderer = (type, data) => {
        const { document_no, title, status, date, tipe } = data
        return <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 15 }}>
            <H001_Card1
                backgroundColor={RGBACOLORS.lightGray}
                borderColor={RGBACOLORS.white}
                borderRadius={10}
                width={width - 50}
                height={130}
                //icon
                iconName={"file-check-outline"}
                iconType={"material-community"}
                iconColor={RGBACOLORS.primaryBlue}
                //text1
                text1FontSize={12}
                text1FontColor={RGBACOLORS.gray}
                text1FontFamily={"Open-Sans"}
                text1FontWeight={"500"}
                text1={"Nomor DOK : " + document_no}
                //text2
                text2FontSize={12}
                text2FontColor={RGBACOLORS.black}
                text2FontFamily={"Open-Sans"}
                text2FontWeight={"500"}
                text2={title}
                //divider
                dividerOrientation={"horizontal"}
                dividerColor={RGBACOLORS.lightGray1}
                //text3
                text3={"Tipe : " + tipe}
                text3a={(status == null ? "" : "PENDING")}
                //text4
                text4={moment(date).format("D MMMM YYYY HH:mm")}
                onPressCard={
                    () => {
                        try {
                            this.props.navigation.navigate("DocumentHistoryPage", {
                                document_no: document_no,
                                title: title,
                                date: date
                            })
                        }
                        catch (err) {
                            console.log(err)
                            logger.error(`@Gleenald Application catch error, {function: navigateDetailPage(), page:H001}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                            this.setState({ isError: true })
                        }
                    }
                }
            />
        </View>
    }

    /**
    * FUNCTION FOR PROVIDE DATA (RECYCLERLISTVIEW)
    */
    getData = async () => {
        try {
            this.setState({
                isLoading: true
            })

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/document-home?limit=${this.state.documentLimit}&page=${this.state.documentPage}`, requestOptions);
            const stat = await res.status;
            const data = await res.json();

            console.log(stat)
            console.log(data)

            if (stat >= 200 && stat <= 300) {
                let newArray = [];

                for (var i in data.data) {
                    this.state.documentList.push({
                        "document_no": data.data[i].document_no,
                        "title": data.data[i].nama_customer,
                        "date": data.data[i].description.date,
                        "status": data.data[i].description.status,
                        "tipe": data.data[i].description.type
                    })
                }

                for (i in this.state.documentList) {
                    console.log(this.state.documentList[i]["document_no"])
                }

                this.setState({
                    dataProvider: this.state.dataProvider.cloneWithRows(this.state.documentList),
                    documentCount: this.state.documentList.length,
                    isLoading: false,
                    totalDocument: data.meta.total
                })

                if (this.state.documentList.length == 0) {
                    this.setState({ isEmpty: true })
                }
                else {
                    this.setState({ isEmpty: false })
                }

                //console.log(this.state.totalDocument)
            }
            if (stat >= 400 && stat <= 500) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 400,{function: getData(), page:H001}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isClientSideError: true,
                    isLoading: false
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: getData(), page:H001}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isServerSideError: true,
                    isLoading: false
                })
            }

        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: getData(), page:H001}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({
                isEmpty: true,
                isError: true,
                isLoading: false
            })
        }
    }

    loadMore = () => {
        try {
            this.setState({ documentPage: this.state.documentPage + 1 }, async () => {
                console.log(this.state.documentPage);
                this.setState({
                    isLoading: true
                })

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-home?limit=${this.state.documentLimit}&page=${this.state.documentPage}`, requestOptions);
                const stat = await res.status;
                const data = await res.json();


                if (stat >= 200 && stat <= 300) {
                    let newArray = [];

                    for (var i in data.data) {
                        this.state.documentList.push({
                            "document_no": data.data[i].document_no,
                            "title": data.data[i].nama_customer,
                            "date": data.data[i].description.date,
                            "status": data.data[i].description.status,
                            "tipe": data.data[i].description.type
                        })
                    }

                    this.setState({
                        dataProvider: this.state.dataProvider.cloneWithRows(this.state.documentList),
                        documentCount: this.state.documentList.length,
                        isLoading: false
                    })

                    if (this.state.documentList.length == 0) {
                        this.setState({ isEmpty: true })
                    }
                    else {
                        this.setState({ isEmpty: false })
                    }
                }



                this.setState({
                    isLoading: false
                })
            });


        }
        catch (err) {

        }


    }

    /**
    * FUNCTION TO TRIGGER OVERLAY MAIN FAB
    */
    toggleFABOverlay = () => {
        this.setState({ isOverlayFABVisible: !this.state.isOverlayFABVisible })
    }

    navigateScanIn = () => {
        try {
            this.setState({ isOverlayFABVisible: false })
            this.props.navigation.push("Camera-ScanInPage")
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, { function: navigateScanIn(), page: H001 }, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]} `)
            this.setState({ isError: true })

        }
    }

    navigateScanOut = () => {
        try {
            this.setState({ isOverlayFABVisible: false })
            this.props.navigation.push("Camera-ScanOutPage")
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, { function: navigateScanOut(), page: H001 }, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]} `)
            this.setState({ isError: true })
        }
    }

    navigateDocumentListPage = () => {
        try {
            this.props.navigation.navigate("DocumentListPage")
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald Application catch error, { function: navigateDocumentListPage(), page: H001 }, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]} `);
            this.setState({ isError: true })
        }
    }

    logOut = () => {
        try {
            let login1;

            this.realmDb.write(() => {

                login1 = this.realmDb.objects("Login")[0]
                login1.username = "",
                    login1.password = "",
                    login1.token = ""
            })

            this.props.navigation.push("FrontPage");

            this.setState({ isOverlayVis: false })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald Application catch error, { function: logout(), page: H001 }, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]} `);
            this.setState({ isError: true })
        }
    }


    /**
    * FUNCTION IF USER PRESS BACK IN HOME PREVENT BACK TO LOGIN PAGE
    */
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('beforeRemove', (e) => {
            e.preventDefault()
        });
        this.getData()
        StatusBar.setHidden(true);

    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    render() {

        const { name, divisi } = this.props.route.params;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white"
                }}
            >
                {/* Header Section */}
                <View>
                    <H001_Header
                        backgroundColor={RGBACOLORS.primaryBlue}
                        baseHeight={height / 5.5}
                        baseWidth={width}

                        //text1
                        text1={"Document Tracker"}
                        text1FontSize={24}
                        text1FontWeight={"700"}
                        text1FontColor={RGBACOLORS.white}
                        text1Position={"absolute"}
                        text1Left={10}
                        text1Top={15}


                        //icon
                        iconName={"user-circle"}
                        iconType={"font-awesome"}
                        iconColor={RGBACOLORS.white}
                        iconSize={30}
                        iconOnPress={
                            () => {
                                this.setState({ isOverlayVis: true })
                            }
                        }
                        iconPosition={"absolute"}
                        iconRight={10}
                        iconTop={15}

                        //card
                        cardBackgroundColor={RGBACOLORS.white}
                        cardWidth={width - 40}
                        cardHeight={height / 8}
                        cardBorderRadius={"40%"}
                        cardPosition={"absolute"}
                        cardTop={85}

                        //text2
                        text2FontSize={16}
                        text2MarginTop={"7%"}
                        text2={"Hi,"}

                        //text3
                        text3FontSize={16}
                        text3FontWeight={"700"}
                        text3={(typeof name === 'undefined') ? "Anonymous" : name}
                        //text4
                        text4FontSize={16}
                        text4={"Divisi:"}
                        //text5
                        text5FontSize={16}
                        text5FontWeight={"500"}
                        text5FontColor={RGBACOLORS.primaryBlue}
                        text5={(typeof divisi === 'undefined') ? "Unknown" : divisi}

                        //overlay
                        isVisible={this.state.isOverlayVis}
                        onBackdropPress={
                            () => {
                                this.setState({ isOverlayVis: false })
                            }
                        }
                        //button1
                        titleButton1={"Tidak"}
                        typeButton1={"Outline"}
                        borderRadiusButton1={10}
                        borderWidthButton1={2}
                        fontWeightButton1={"700"}
                        widthButton1={130}
                        heightButton1={45}
                        marginRightButton1={10}
                        onPressButton1={
                            () => {
                                this.setState({ isOverlayVis: false })
                            }
                        }

                        //button2
                        titleButton2={"Ya"}
                        // typeButton2 = {"Solid"}
                        borderRadiusButton2={10}
                        borderWidthButton2={2}
                        fontWeightButton2={"700"}
                        widthButton2={130}
                        heightButton2={45}
                        marginRightButton2={10}
                        onPressButton2={this.logOut}
                    />
                </View>

                {/* SubHeader Section */}
                <View
                    style={{
                        backgroundColor: RGBACOLORS.white,
                        width: "100%",
                        height: "7%",
                        marginTop: 70,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={{
                            color: RGBACOLORS.black,
                            fontWeight: '600',
                            fontFamily: 'Open-Sans',
                            fontSize: 18,
                            marginLeft: 10
                        }}
                    >
                        Daftar Dokumen ({this.state.totalDocument})
                    </Text>

                    <Icon
                        name="chevron-right"
                        type="font-awesome"
                        size={25}
                        onPress={this.navigateDocumentListPage}
                        containerStyle={{
                            marginRight: 26
                        }}
                    />

                </View>

                {/* Body Section */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: RGBACOLORS.white
                    }}
                >
                    {this.displayBody()}


                </View>

                {/* Footer Section */}
                <View>
                    <FAB
                        buttonColor={RGBACOLORS.primaryBlue}
                        iconTextColor="white"
                        visible={true}
                        onClickAction={
                            () => {
                                this.setState({ isOverlayFABVisible: true })
                            }
                        }
                        iconTextComponent={
                            <Icon
                                name="qr-code-scanner"
                                type="material"
                                color="white"
                            />
                        }
                    />
                </View>

                {/* Overlay Scan */}
                <View>
                    <Overlay
                        isVisible={this.state.isOverlayFABVisible}
                        onBackdropPress={() => { this.toggleFABOverlay() }}
                        overlayStyle={{
                            width: 320,
                            height: 180,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <Button
                                title={"Scan In"}
                                type={"Solid"}

                                containerStyle={{
                                    marginTop: 15
                                }}

                                icon={
                                    <Icon
                                        name={"file-plus"}
                                        type={'material-community'}
                                        color={RGBACOLORS.primaryBlue}
                                        style={{
                                            marginRight: 8,
                                            marginLeft: 15
                                        }}
                                    />
                                }

                                buttonStyle={{
                                    width: 280,
                                    height: 50,
                                    borderRadius: 10,
                                    backgroundColor: RGBACOLORS.lightGray,
                                    flexDirection: "row",
                                    justifyContent: "flex-start"
                                }}

                                titleStyle={{
                                    color: RGBACOLORS.primaryBlue,
                                    fontSize: 16,
                                    fontWeight: "500",

                                }}
                                onPress={this.navigateScanIn}
                            />

                            <Button
                                title={"Scan Out"}
                                type={"Solid"}

                                containerStyle={{
                                    marginTop: 15
                                }}

                                icon={
                                    <Icon
                                        name={"file-send"}
                                        type={'material-community'}
                                        color={RGBACOLORS.primaryBlue}
                                        style={{
                                            marginRight: 8,
                                            marginLeft: 15
                                        }}
                                    />
                                }

                                buttonStyle={{
                                    width: 280,
                                    height: 50,
                                    borderRadius: 10,
                                    backgroundColor: RGBACOLORS.lightGray,
                                    flexDirection: "row",
                                    justifyContent: "flex-start"
                                }}

                                titleStyle={{
                                    color: RGBACOLORS.primaryBlue,
                                    fontSize: 16,
                                    fontWeight: "500",

                                }}
                                onPress={this.navigateScanOut}
                            />
                        </View>
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
                                Apakah anda ingin restart aplikasi ?
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

            </View>
        )

    }

    /**
    * FUNCTION TO DISPLAY TABLE OR NO DATA 
    */
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
                                                this.props.navigation.push("HomePage", {
                                                    name: this.realmDb.objects("Login")[0]["username"], divisi: this.realmDb.objects("Login")[0]["divisi"]
                                                })
                                                this.setState({ refreshing: false })
                                            }
                                            catch (err) {
                                                console.log(err)
                                                logger.error(`@Gleenald Application catch error, { function: refresh(), page: H001 }, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]} `)
                                                this.setState({ isError: true })
                                            }
                                        }
                                    }
                                />
                            )
                        }}
                        renderFooter={() => {
                            if (this.state.documentCount < this.state.totalDocument) {
                                return (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            marginTop: 10
                                        }}
                                    >
                                        <Button
                                            title="Load More Document"
                                            buttonStyle={{
                                                borderColor: RGBACOLORS.primaryBlue,
                                                borderRadius: 15
                                            }}
                                            type="outline"
                                            titleStyle={{ color: RGBACOLORS.primaryBlue }}
                                            containerStyle={{
                                                width: 200,
                                                marginHorizontal: 50,
                                                marginVertical: 10,
                                            }}
                                            onPress={this.loadMore}
                                        />
                                    </View>
                                )
                            }
                            if (this.state.documentCount == this.state.totalDocument) {
                                return (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            marginTop: 10
                                        }}
                                    >

                                    </View>
                                )
                            }

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
