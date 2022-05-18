//import react
import React, { Component } from 'react';

//import react-native
import {
    Dimensions,
    Text,
    View,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

//import library react-native-elements
import { Header, Icon, Overlay, Button } from "react-native-elements";

//import component
import Search001CenterHeader from "./../../../components/design/6Search/Search001-centerHeader";
import H001_Card1 from "./../../../components/design/3Home/H001-card1";

//import Color Library
import { RGBACOLORS } from "./../../../utils/colors/color_library";

//import recyclerlistview
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider
} from 'recyclerlistview';

//import url from backend
import { baseURL } from "./../../../utils/config";

//import moment js
import moment from "moment";

//import realm db
import Realm from "realm";

//import telegram logger
import { TelegramLogger } from 'node-telegram-log';

/**
* DEFINE SCREEN DIMENSIONS
*/
const { height, width } = Dimensions.get('window')

/**
* DEFINE LOGGER TELEGRAM
*/
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-653733508");

export default class Search001 extends Component {
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
                dim.height = 140;
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
            isEmpty: false,

            isLoading: false,
            isServerSideError: false,
            isClientSideError: false,

            isError: false,

            /**
            *STORAGE FOR USER INPUT IN SEARCHBAR
            */
            searchWord: "",

            /**
            * CONTAINER FOR GETDATA FUNCTION
            */
            newArray: [],

            refreshing: false,
        }

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
        console.log('database sudah jalan di Search001!')
    }

    /**
    * FUNCTION FOR SETUP ROW RENDERER (RECYCLER LIST VIEW)
    */
    rowRenderer = (type, data) => {
        const { document_no, title, tipe, date, status } = data;

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
                text4={date}
                onPressCard={() => {
                    try {
                        this.props.navigation.navigate("DocumentHistoryPage", {
                            document_no: document_no,
                            title: title,
                            date: date
                        })
                    }
                    catch (err) {
                        console.log(err);
                        logger.error(`@Gleenald Application catch error, {function: goToDetailPage(), page:Search01}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                        this.setState({ isError: true })
                    }
                }}
            />
        </View>
    }

    /**
    * FUNCTION FOR PROVIDE DATA (RECYCLERLISTVIEW)
    */
    getData = async () => {

        try {
            this.setState({ isLoading: true });

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);
            myHeaders.append("Accept", "application/json");
            myHeaders.append('Content-Type', 'application/json');

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/document-list`, requestOptions)
            const stat = await res.status;
            const data = await res.json();

            if (stat >= 200 && stat <= 300) {

                for (var i in data.data) {

                    this.state.newArray.push({
                        "document_no": data.data[i].document_no,
                        "title": data.data[i].nama_customer,
                        "date": moment(data.data[i].description.date).format("D MMMM YYYY HH:mm"),
                        "status": data.data[i].description.status,
                        "tipe": data.data[i].description.type
                    })
                }

                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(this.state.newArray) });
                this.setState({ isLoading: false });

                if (this.state.dataProvider._data.length === 0) {
                    this.setState({ isEmpty: true })
                }
                else {
                    this.setState({ isEmpty: false })
                }
            }
            if (stat >= 400 && stat <= 500) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 400,{function: getData(), page:Search01}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isClientSideError: true,
                    isLoading: false
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: getData(), page:Search01}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isServerSideError: true,
                    isLoading: false
                })
            }

        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald Application catch error, {function: getData(), page: Search01}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({ isLoading: false })
            this.setState({ isError: true })
        }

    }

    componentDidMount() {
        this.getData()
    }


    render() {

        return (

            <View
                style={{
                    flex: 1,
                    backgroundColor: RGBACOLORS.white
                }}
            >
                {/* Header Section */}
                <View>
                    <Header
                        backgroundColor={RGBACOLORS.white}
                        leftComponent={{
                            icon: "chevron-left",
                            onPress: () => {
                                try {
                                    this.props.navigation.goBack();
                                }
                                catch (err) {
                                    console.log(`error in SearchPage, function getBack() ~ ${err}`)
                                }
                            },
                            type: "material-community",
                            size: 30,
                            iconStyle: {
                                color: RGBACOLORS.black,

                            }

                        }}
                        containerStyle={{
                            paddingTop: 30
                        }}
                        centerContainerStyle={{
                            marginLeft: 30,
                            marginBottom: 1
                        }}
                        centerComponent={
                            <Search001CenterHeader
                                SBplaceholder={"Cari Disini..."}
                                SBplatform={"android"}
                                SBbackgroundColor={RGBACOLORS.lightGray}
                                SBheight={35}
                                SBborderRadius={10}
                                sbWidth={width - 80}
                                SBonChangeText={
                                    (y) => {
                                        try {
                                            this.setState({ searchWord: y }, () => {

                                                const data = this.state.newArray

                                                const result = data.filter(y => {
                                                    return (
                                                        y.date.includes(this.state.searchWord) ||
                                                        y.document_no.includes(this.state.searchWord) ||
                                                        y.title.includes(this.state.searchWord)
                                                    )
                                                })

                                                if (result.length == 0) {
                                                    this.setState({ isEmpty: true })
                                                }

                                                if (result.length > 0) {
                                                    this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(result) })
                                                    this.setState({ isEmpty: false })
                                                }

                                            })
                                        }
                                        catch (err) {
                                            console.log(err)
                                            logger.error(`@Gleenald Application catch error, {function: search(), page:Search01}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                                            this.setState({ isError: true })
                                        }
                                    }
                                }
                            />
                        }

                    />
                </View>

                {/* Body Section */}
                {this.displayBody()}

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

    displayBody() {
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
                                                logger.error(`@Gleenald Application catch error, {function: refresh(), page:Search01}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
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
    }
}
