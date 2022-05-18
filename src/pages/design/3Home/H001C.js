//import react
import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Dimensions,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

//import library react native elements
import { Icon, Overlay, Button } from 'react-native-elements';

//import component
import H001_Card2 from './../../../components/design/3Home/H001_card2';
import H001_Card3 from './../../../components/design/3Home/H001_card3';
import H001_Header2 from "./../../../components/design/3Home/H001-header2"

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
* DEFINE TELEGRAM LOGGER
*/
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-653733508");



export default class H001C extends Component {
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
                dim.height = 100;
            }
        );

        this.state = {

            /**
            * CONTAIN DATA PROVIDER IN STATE
            */
            dataProvider: dp.cloneWithRows([]),

            refreshing: false,

            /**
            * STATEMENT FOR CONDITIONAL RENDERING IN GENERAL RENDERING
            */
            isEmpty: true,

            isLoading: false,

            isError: false,
            isServerSideError: false,
            isClientSideError: false,

            /**
            * CONTAINER FOR DATA PASSING FROM PAGE H001B
            */
            document_no: this.props.route.params.document_no,
            title: this.props.route.params.title,
            date: this.props.route.params.date
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
        console.log('database sudah jalan di H001C!')
    }

    /**
    * FUNCTION FOR SETUP ROW RENDERER (RECYCLER LIST VIEW)
    */
    rowRenderer = (type, data) => {
        const { by, types, date, remark, status } = data;

        return <View style={{ marginLeft: 15 }}>
            <H001_Card3
                iconName={"circle-o"}
                iconType={"font-awesome"}
                iconColor={(status == null ? RGBACOLORS.primaryBlue : "#FF8C00")}
                iconSize={30}
                text1={by}
                fontSizeText1={16}
                fontFamilyTetxt1={'Open-Sans'}
                fontWeightText1={"600"}
                text2={`${types}    :  ${date}`}
                text2a={(status == null ? "" : "PENDING")}
                fontSizeText2={14}
                fontFamilyText2={"Open-Sans"}
                fontWeightText2={"500"}
                text3={remark}
            />
        </View>
    }

    /**
    * FUNCTION FOR PROVIDE DATA (RECYCLERLISTVIEW)
    */
    getData = async () => {
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
            const data = await res.json();
            const stat = await res.status

            if (stat >= 200 && stat <= 300) {
                let newArray = [];

                for (var i = 0; i < data.history.length; i++) {
                    newArray.push({
                        "by": data.history[i].by,
                        "types": data.history[i].type,
                        "date": moment(data.history[i].date).format("D MMMM YYYY HH:mm"),
                        "remark": data.history[i].remark,
                        "status": data.history[i].status
                    })
                }

                this.setState({
                    dataProvider: this.state.dataProvider.cloneWithRows(newArray),
                    isLoading: false
                })

                if (newArray.length == 0) {
                    this.setState({ isEmpty: true })
                }
                else {
                    this.setState({ isEmpty: false })
                }
            }
            if (stat >= 400 && stat <= 500) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 400,{function: getData(), page:H001C}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isClientSideError: true,
                    isLoading: false,
                    isEmpty: true
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: getData(), page:H001C}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isServerSideError: true,
                    isLoading: false,
                    isEmpty: true
                })
            }
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald Application catch error, {function: getData(), page:H001C}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({ isLoading: false, isError: true })
        }

    }

    goBack = () => {
        try {
            this.props.navigation.goBack()
        }
        catch (err) {
            logger.error(`@Gleenald Application catch error,{function: goBack(), page:H001C}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({ isError: true })
            console.log(err)
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

                    <H001_Header2
                        backgroundColor={RGBACOLORS.white}

                        leftIcon={'chevron-left'}
                        leftIconType={'font-awesome-5'}
                        leftIconSize={25}
                        leftIconColor={RGBACOLORS.black}
                        leftIconOnPress={this.goBack}
                        basePaddingTop={30}
                        centerText={'Riwayat Dokumen'}
                        centerTextColor={RGBACOLORS.black}
                        centerTextFontFamily={'Open-Sans'}
                        centerTextFontSize={20}
                        centerTextFontWeight={"700"}
                    />

                </View>

                {/* SubHeader Section */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center"
                    }}
                >
                    <H001_Card2
                        backgroundColor={RGBACOLORS.lightGray}
                        borderColor={RGBACOLORS.white}
                        width={width - 40}
                        height={height / 6.0}
                        borderRadius={10}
                        marginTop={"5%"}

                        fontWeightText1={'500'}
                        fontFamilyText1={'Open-Sans'}
                        fontSizeText1={14}
                        marginBottomText1={5}
                        marginTopText1={2}
                        text1={'Nomor DOK : ' + parseInt(this.state.document_no)}

                        fontWeightText2={"700"}
                        fontFamilyText2={"Open-Sans"}
                        fontSizeText2={14}
                        text2={this.state.title}
                        fontWeightText3={"500"}
                        fontFamilyText3={"Open-Sans"}
                        fontSizeText3={14}
                        text3={moment(this.state.date).format("D MMMM YYYY HH:mm")}
                    />
                </View>

                {/* Body Section */}
                <View
                    style={{
                        flex: 1,
                        marginTop: "5%"
                    }}
                >
                    {this.displayBody()}
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
                                                console.log(err)
                                                logger.error(`@Gleenald Application catch error,{function: refresh(), page:H001C}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
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
