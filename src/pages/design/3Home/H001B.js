import React, { Component } from 'react';

//import react-native
import {
    Text,
    View,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    TextInput,
} from 'react-native';

//import library react native elements
import {
    Icon,
    Button,
    Overlay,
    Chip
} from 'react-native-elements';

//import Component
import H001_Card1 from "./../../../components/design/3Home/H001-card1";
import H001_Header2 from "./../../../components/design/3Home/H001-header2";


//import color library
import { RGBACOLORS } from "./../../../utils/colors/color_library";

//import recyclerlistview
import {
    RecyclerListView,
    DataProvider,
    LayoutProvider
} from 'recyclerlistview';

//import Rounded Check Box Library
import RoundedCheckbox from "react-native-rounded-checkbox";

//import react-native-date-picker
import DateTimePicker from '@react-native-community/datetimepicker';

//import moment
import moment from 'moment';

//import url from backend
import { baseURL } from "./../../../utils/config";

//import realm db
import Realm from "realm";

//import rn-fab
import FAB from 'react-native-fab';

//import rn calendar
import {
    Calendar,
    LocaleConfig
} from 'react-native-calendars';

//import telegram logger
import { TelegramLogger } from 'node-telegram-log';


/**
* DEFINE DATE
*/
LocaleConfig.locales['id'] = {
    monthNames: ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id'

/**
* DEFINE SCREEN DIMENSIONS
*/
const { height, width } = Dimensions.get('window');

/**
* DEFINE TELEGRAM LOGGER
*/
const logger = new TelegramLogger("5035979844:AAH50oirpx1fFdRoBpstovW8vJJWvP4W42c", "-653733508");


export default class H001B extends Component {
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
            },
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

            /**
            * STATEMENT FOR SORT AND FILTER OVERLAY (CONDITIONAL RENDERING)
            */
            isMenu: false,
            isSort: false,
            isFilter: false,
            isSearch: false,

            isLoading: false,

            isError: false,
            isServerSideError: false,
            isClientSideError: false,

            /**
            * STATEMENT FOR DATEPICKER OVERLAY (CONDITIONAL RENDERING)
            */
            datePicker1: false,
            datePicker2: false,

            /**
            * STATEMENT FOR CHECKBOX IN SORT OVERLAY 
            */
            isChecked1: false,
            isChecked2: false,

            /**
            * STATEMENT FOR CHIP IN FILTER OVERLAY 
            */
            inChip: false,
            outChip: false,
            pendingChip: true,
            allChip: false,

            inChipDisable: false,
            outChipDisable: false,
            pendingChipDisable: false,
            allChipDisable: false,

            /**
            * DATE CONTAINER FOR FILTER OVERLAY 
            */
            date1: new Date(),
            date2: new Date(),

            markedDate1: {},
            markedDate2: {},

            documentCount: 0,
            newData: [],
            totalDocument: 0,
            documentPage: 1,
            limitPage: 5,

            refreshing: false,
            useFilter: false,
            useSort: false,
            useSearch: false,

            Search: "",

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
        console.log('database sudah jalan di H001B!')
    }

    /**
    * FUNCTION FOR CHECKBOX IN SORT OVERLAY
    */
    toggleCheckbox1 = () => {
        if (this.state.isChecked2 == false) {
            this.setState({ isChecked1: !this.state.isChecked1 })
        }
        if (this.state.isChecked2 == true) {
            this.setState({ isChecked1: !this.state.isChecked1 })
            this.setState({ isChecked2: false })
        }
    }

    toggleCheckbox2 = () => {
        if (this.state.isChecked1 == false) {
            this.setState({ isChecked2: !this.state.isChecked2 })

        }
        if (this.state.isChecked1 == true) {
            this.setState({ isChecked2: !this.state.isChecked2 })
            this.setState({ isChecked1: false })
        }
    }

    /**
    * FUNCTION FOR SETUP ROW RENDERER (RECYCLER LIST VIEW)
    */
    rowRenderer = (type, data) => {

        const { document_no, title, tipe, date, status } = data
        return <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15
            }}
        >
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
                text1={"Nomor DOK:" + document_no}
                //text2
                text2FontSize={12}
                text2FontColor={RGBACOLORS.black}
                text2FontFamily={"Open-Sans"}
                text2FontWeight={"500"}
                text2={title}
                //divider
                dividerOrientation={"horizontal"}
                dividerColor={RGBACOLORS.gray}
                //text3
                text3={"Type : " + tipe}
                text3a={(status == null ? "" : "PENDING")}
                //text4
                text4={moment(date).format("D MMMM YYYY HH:mm")}
                onPressCard={
                    () => {
                        try {
                            this.props.navigation.push("DocumentHistoryPage", {
                                document_no: document_no,
                                title: title,
                                date: date
                            })
                        }
                        catch (err) {
                            console.log(err);
                            logger.error(`@Gleenald Application catch error, {function: navigateDetailPage(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
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
            this.setState({ isLoading: true })

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const res = await fetch(`${baseURL}/document-list?limit=5&page=${this.state.documentPage}`, requestOptions);
            const data = await res.json();
            const stat = await res.status;

            if (stat >= 200 && stat <= 300) {
                for (var i in data.data) {
                    this.state.newData.push({
                        "document_no": data.data[i].document_no,
                        "title": data.data[i].nama_customer,
                        "date": data.data[i].description.date,
                        "status": data.data[i].description.status,
                        "tipe": data.data[i].description.type
                    })
                }

                this.setState({
                    dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                    isLoading: false,
                    documentCount: this.state.newData.length,
                    totalDocument: data.meta.total
                })

                console.log(this.state.totalDocument)

                if (this.state.newData == 0) {
                    this.setState({ isEmpty: true })
                } else {
                    this.setState({ isEmpty: false })
                }
            }
            if (stat >= 400 && stat <= 500) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 400,{function: getData(), page:H001B}, ClientSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isClientSideError: true,
                    isLoading: false
                })
            }
            if (stat >= 500 && stat <= 600) {
                console.log(data.description);
                logger.error(`@Gleenald HTTP Stat: 500,{function: getData(), page:H001B}, ServerSide Error NodeMsg: ${data.description}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
                this.setState({
                    isServerSideError: true,
                    isLoading: false
                })
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: getData(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
            this.setState({
                isLoading: false,
                isError: true
            })
        }

    }

    loadMore = () => {
        try {
            this.setState({ documentPage: this.state.documentPage + 1 }, async () => {
                this.setState({ isLoading: true })
                //sort + filter
                if (this.state.useSort == true && this.state.useFilter == true && this.state.useSearch == false) {
                    console.log('load more sort + filter');


                    let sortType;
                    if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                        sortType = 'desc'
                    }
                    if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                        sortType = 'asc'
                    }

                    const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                    const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                    let filter_type;
                    let filter_status;
                    //MONO OPTION
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                        filter_type = 'in';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'out';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'out';
                        filter_status = 'pending';
                    }
                    //MULTI OPTION
                    if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'in,out';
                        filter_status = 'null,null';
                    }
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'in,out';
                        filter_status = 'null,pending';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                        filter_type = 'out,out';
                        filter_status = 'null,pending';
                    }
                    //ALL OPTION
                    if (this.state.allChip == true) {
                        filter_type = 'null';
                        filter_status = 'null';
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                            this.setState({ isLoading: false })
                        } else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //sort + search
                if (this.state.useSort == true && this.state.useFilter == false && this.state.useSearch == true) {
                    console.log('load more sort + search')
                    let sortType;
                    if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                        sortType = 'desc'
                    }
                    if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                        sortType = 'asc'
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}&sort_date=${sortType}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    console.log(stat)
                    console.log(data)

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //filter + search
                if (this.state.useSort == false && this.state.useFilter == true && this.state.useSearch == true) {
                    console.log('load more filter + search')

                    const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                    const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                    let filter_type;
                    let filter_status;
                    //MONO OPTION
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                        filter_type = 'in';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'out';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'out';
                        filter_status = 'pending';
                    }
                    //MULTI OPTION
                    if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'in,out';
                        filter_status = 'null,null';
                    }
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'in,out';
                        filter_status = 'null,pending';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                        filter_type = 'out,out';
                        filter_status = 'null,pending';
                    }
                    //ALL OPTION
                    if (this.state.allChip == true) {
                        filter_type = 'null';
                        filter_status = 'null';
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }


                }
                //all
                if (this.state.useSort == true && this.state.useFilter == true && this.state.useSearch == true) {
                    console.log('load more all')
                    let sortType;
                    if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                        sortType = 'desc'
                    }
                    if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                        sortType = 'asc'
                    }

                    const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                    const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                    let filter_type;
                    let filter_status;
                    //MONO OPTION
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                        filter_type = 'in';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'out';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'out';
                        filter_status = 'pending';
                    }
                    //MULTI OPTION
                    if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'in,out';
                        filter_status = 'null,null';
                    }
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'in,out';
                        filter_status = 'null,pending';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                        filter_type = 'out,out';
                        filter_status = 'null,pending';
                    }
                    //ALL OPTION
                    if (this.state.allChip == true) {
                        filter_type = 'null';
                        filter_status = 'null';
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}&filter_document_no=${this.state.Search}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //no all
                if (this.state.useSort == false && this.state.useFilter == false && this.state.useSearch == false) {
                    console.log('load more no all')

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}`, requestOptions);
                    const stat = await res.status;
                    const data = await res.json();

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //sort
                if (this.state.useSort == true && this.state.useFilter == false && this.state.useSearch == false) {
                    console.log('load more sort')
                    let sortType;
                    if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                        sortType = 'desc'
                    }
                    if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                        sortType = 'asc'
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //filter
                if (this.state.useSort == false && this.state.useFilter == true && this.state.useSearch == false) {
                    console.log('load more filter')

                    const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                    const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                    let filter_type;
                    let filter_status;
                    //MONO OPTION
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                        filter_type = 'in';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'out';
                        filter_status = 'null';
                    }
                    if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'out';
                        filter_status = 'pending';
                    }
                    //MULTI OPTION
                    if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                        filter_type = 'in,out';
                        filter_status = 'null,null';
                    }
                    if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                        filter_type = 'in,out';
                        filter_status = 'null,pending';
                    }
                    if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                        filter_type = 'out,out';
                        filter_status = 'null,pending';
                    }
                    //ALL OPTION
                    if (this.state.allChip == true) {
                        filter_type = 'null';
                        filter_status = 'null';
                    }

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
                //search
                if (this.state.useSort == false && this.state.useFilter == false && this.state.useSearch == true) {
                    console.log('load more search')

                    let myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                    let requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}`, requestOptions);
                    const data = await res.json();
                    const stat = await res.status;

                    if (stat >= 200 && stat <= 300) {
                        if (data.data.length == 0) {
                            console.log('kosong')
                        }
                        else {
                            for (var i in data.data) {
                                this.state.newData.push({
                                    "document_no": data.data[i].document_no,
                                    "title": data.data[i].nama_customer,
                                    "date": data.data[i].description.date,
                                    "status": data.data[i].description.status,
                                    "tipe": data.data[i].description.type
                                })
                            }

                            console.log(this.state.newData);

                            this.setState({
                                dataProvider: this.state.dataProvider.cloneWithRows(this.state.newData),
                                documentCount: this.state.newData.length,
                                isLoading: false
                            })
                        }
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }


    sort = () => {
        this.setState({ documentPage: 1 }, async () => {
            this.setState({ isLoading: true, useSort: true })

            let sortType;
            if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                sortType = 'desc'
            }
            if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                sortType = 'asc'
            }

            //sorts
            if (this.state.useFilter == false && this.state.useSearch == false) {
                console.log('sort')
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;


                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSort: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSort: false,
                            checked1: false,
                            checked2: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //sorts + filter
            if (this.state.useFilter == true && this.state.useSearch == false) {
                console.log('sort + filter')
                const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                let filter_type;
                let filter_status;

                //MONO OPTION
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                    filter_type = 'in';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'out';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'out';
                    filter_status = 'pending';
                }
                //MULTI OPTION
                if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'in,out';
                    filter_status = 'null,null';
                }
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'in,out';
                    filter_status = 'null,pending';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                    filter_type = 'out,out';
                    filter_status = 'null,pending';
                }
                //ALL OPTION
                if (this.state.allChip == true) {
                    filter_type = 'null';
                    filter_status = 'null';
                }

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSort: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSort: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //sorts + search
            if (this.state.useFilter == false && this.state.useSearch == true) {
                console.log('sort + search')
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}&sort_date=${sortType}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSort: false
                        })
                    }
                    if (data.data.length !== 0) {
                        var x = []
                        for (var i in data.data) {
                            x.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(x)

                        this.setState({
                            isEmpty: false,
                            newData: x,
                            dataProvider: this.state.dataProvider.cloneWithRows(x),
                            isLoading: false,
                            isSort: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //sorts + filter + search
            if (this.state.useFilter == true && this.state.useSearch == true) {
                console.log('sort + search + filter')
                const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                let filter_type;
                let filter_status;

                //MONO OPTION
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                    filter_type = 'in';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'out';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'out';
                    filter_status = 'pending';
                }
                //MULTI OPTION
                if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'in,out';
                    filter_status = 'null,null';
                }
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'in,out';
                    filter_status = 'null,pending';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                    filter_type = 'out,out';
                    filter_status = 'null,pending';
                }
                //ALL OPTION
                if (this.state.allChip == true) {
                    filter_type = 'null';
                    filter_status = 'null';
                }

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSort: false
                        })
                    }
                    if (data.data.length !== 0) {
                        var newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSort: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
        })
    }

    filter = () => {
        this.setState({ documentPage: 1 }, async () => {
            this.setState({ isLoading: true, useFilter: true })

            const date1 = moment(this.state.date1).format("YYYY-MM-DD");
            const date2 = moment(this.state.date2).format("YYYY-MM-DD");

            let filter_type;
            let filter_status;
            //MONO OPTION
            if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                filter_type = 'in';
                filter_status = 'null';
            }
            if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                filter_type = 'out';
                filter_status = 'null';
            }
            if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                filter_type = 'out';
                filter_status = 'pending';
            }
            //MULTI OPTION
            if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                filter_type = 'in,out';
                filter_status = 'null,null';
            }
            if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                filter_type = 'in,out';
                filter_status = 'null,pending';
            }
            if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                filter_type = 'out,out';
                filter_status = 'null,pending';
            }
            //ALL OPTION
            if (this.state.allChip == true) {
                filter_type = 'null';
                filter_status = 'null';
            }

            //just filter
            if (this.state.useSort == false && this.state.useSearch == false) {
                console.log('filter')
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isFilter: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isFilter: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //filter + sorts
            if (this.state.useSort == true && this.state.useSearch == false) {
                console.log('filter + sort')
                let sortType;
                if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                    sortType = 'desc'
                }
                if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                    sortType = 'asc'
                }

                console.log(sortType);

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                console.log(stat);
                console.log(data);

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSort: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isFilter: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //filter + search
            if (this.state.useSort == false && this.state.useSearch == true) {
                console.log('filter + search')
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isFilter: false
                        })
                    }
                    if (data.data.length !== 0) {
                        var x = []
                        for (var i in data.data) {
                            x.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(x)

                        this.setState({
                            isEmpty: false,
                            newData: x,
                            dataProvider: this.state.dataProvider.cloneWithRows(x),
                            isLoading: false,
                            isFilter: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //filter + sort + search
            if (this.state.useSort == true && this.state.useSearch == true) {
                console.log('filter + search + sort')
                let sortType;
                if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                    sortType = 'desc'
                }
                if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                    sortType = 'asc'
                }

                console.log(sortType);

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                console.log(stat);
                console.log(data);

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isFilter: false
                        })
                    }
                    if (data.data.length !== 0) {
                        var newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isFilter: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
        })
    }

    search = () => {
        this.setState({ documentPage: 1 }, async () => {
            this.setState({ useSearch: true })
            //search
            if (this.state.useSort == false && this.state.useFilter == false) {
                console.log('search')
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSearch: false
                        })
                    }
                    if (data.data.length !== 0) {
                        let newArr = []
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }
                        console.log(newArr)
                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSearch: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //search + sort
            if (this.state.useSort == true && this.state.useFilter == false) {
                console.log('search + sort')
                let sortType;
                if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                    sortType = 'desc'
                }
                if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                    sortType = 'asc'
                }

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&sort_date=${sortType}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSearch: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSearch: false,
                            checked1: false,
                            checked2: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //search + filter
            if (this.state.useSort == false && this.state.useFilter == true) {
                console.log('search + filter')
                const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                let filter_type;
                let filter_status;
                //MONO OPTION
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                    filter_type = 'in';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'out';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'out';
                    filter_status = 'pending';
                }
                //MULTI OPTION
                if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'in,out';
                    filter_status = 'null,null';
                }
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'in,out';
                    filter_status = 'null,pending';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                    filter_type = 'out,out';
                    filter_status = 'null,pending';
                }
                //ALL OPTION
                if (this.state.allChip == true) {
                    filter_type = 'null';
                    filter_status = 'null';
                }

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSearch: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSearch: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
            //search + sort + filter
            if (this.state.useSort == true && this.state.useFilter == true) {
                console.log('search + sort + filter')
                let sortType;
                if (this.state.isChecked1 == true && this.state.isChecked2 == false) {
                    sortType = 'desc'
                }
                if (this.state.isChecked1 == false && this.state.isChecked2 == true) {
                    sortType = 'asc'
                }

                const date1 = moment(this.state.date1).format("YYYY-MM-DD");
                const date2 = moment(this.state.date2).format("YYYY-MM-DD");

                let filter_type;
                let filter_status;
                //MONO OPTION
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == false) {
                    filter_type = 'in';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'out';
                    filter_status = 'null';
                }
                if (this.state.inChip == false && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'out';
                    filter_status = 'pending';
                }
                //MULTI OPTION
                if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == false) {
                    filter_type = 'in,out';
                    filter_status = 'null,null';
                }
                if (this.state.inChip == true && this.state.outChip == false && this.state.pendingChip == true) {
                    filter_type = 'in,out';
                    filter_status = 'null,pending';
                }
                if (this.state.inChip == false && this.state.outChip == true && this.state.pendingChip == true) {
                    filter_type = 'out,out';
                    filter_status = 'null,pending';
                }
                //ALL OPTION
                if (this.state.allChip == true) {
                    filter_type = 'null';
                    filter_status = 'null';
                }

                let myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${this.realmDb.objects("Login")[0].token}`);

                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const res = await fetch(`${baseURL}/document-list?limit=${this.state.limitPage}&page=${this.state.documentPage}&filter_date_from=${date1}&filter_date_to=${date2}&filter_type=${filter_type}&filter_status=${filter_status}&filter_document_no=${this.state.Search}`, requestOptions);
                const data = await res.json();
                const stat = await res.status;

                if (stat >= 200 && stat <= 300) {
                    if (data.data.length == 0) {
                        this.setState({
                            isEmpty: true,
                            isLoading: false,
                            isSearch: false
                        })
                    }
                    if (data.data.length !== 0) {
                        newArr = [];
                        for (var i in data.data) {
                            newArr.push({
                                "document_no": data.data[i].document_no,
                                "title": data.data[i].nama_customer,
                                "date": data.data[i].description.date,
                                "status": data.data[i].description.status,
                                "tipe": data.data[i].description.type
                            })
                        }

                        console.log(newArr)

                        this.setState({
                            isEmpty: false,
                            newData: newArr,
                            dataProvider: this.state.dataProvider.cloneWithRows(newArr),
                            isLoading: false,
                            isSearch: false,
                            documentCount: this.state.newData.length,
                            totalDocument: data.meta.total
                        })
                    }
                }
            }
        })
    }

    /**
    * FUNCTION FOR DATE FILTER 
    */
    getDataFilter = () => {
        try {
            this.setState({ isLoading: true })
            let startDate = moment(this.state.date1).startOf('date').format()
            let endDate = moment(this.state.date2).startOf('date').format()

            let x = this.state.newData.filter(function (a) {

                let xz = moment(a.date).startOf('date').format()

                return (xz >= startDate && xz <= endDate)

            })

            function isIn(y) {
                return y.tipe == "in"
            }

            function isOut(e) {
                return e.tipe == "out" && e.status == null
            }

            function isPending(n) {
                return n.status == "pending"
            }

            function isInPending(n) {
                return n.tipe == "in" || n.status == "pending"
            }

            function isOutPending(y) {
                return y.tipe == "out" || y.status == "pending"
            }

            function isInOut(k) {
                return k.tipe == "in" || k.tipe == "out"
            }

            if (this.state.inChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isIn)) })
                this.setState({ isFilter: false, documentCount: x.filter(isIn).length })

                if (x.filter(isIn).length === 0) {
                    this.setState({ isEmpty: true })
                }
            }
            if (this.state.outChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isOut)) })
                this.setState({ isFilter: false, documentCount: x.filter(isOut).length })

                if (x.filter(isOut).length === 0) {
                    this.setState({ isEmpty: true })
                }

            }
            if (this.state.pendingChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isPending)) })
                this.setState({ isFilter: false, documentCount: x.filter(isPending).length })

                if (x.filter(isPending).length === 0) {
                    this.setState({ isEmpty: true })
                }
            }


            if (this.state.inChip == true && this.state.outChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isInOut)) })
                this.setState({ isEmpty: false })
                this.setState({ isFilter: false, documentCount: x.filter(isInOut).length })


                if (x.filter(isInPending).length === 0) {
                    this.setState({ isEmpty: true })
                }
            }


            if (this.state.outChip == true && this.state.pendingChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isOutPending)) })
                this.setState({ isEmpty: false })
                this.setState({ isFilter: false, documentCount: x.filter(isOutPending).length })

                if (x.filter(isOutPending).length === 0) {
                    this.setState({ isEmpty: true })
                }
            }
            if (this.state.inChip == true && this.state.pendingChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x.filter(isInPending)) })
                this.setState({ isEmpty: false })
                this.setState({ isFilter: false, documentCount: x.filter(isInPending).length })

                if (x.filter(isInOut).length === 0) {
                    this.setState({ isEmpty: true })
                }
            }


            if (this.state.allChip == true) {
                this.setState({ dataProvider: this.state.dataProvider.cloneWithRows(x) })
                this.setState({ isFilter: false, documentCount: x.length })

                if (x.length === 0) {
                    this.setState({ isEmpty: true })
                }
            }
            this.setState({ isLoading: false })
        }
        catch (err) {
            console.log(err)
            logger.error(`@Gleenald Application catch error, {function: filter(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({
                isLoading: false,
                isError: true
            })
        }
    }

    goToSearch = () => {
        try {
            this.props.navigation.push("SearchPage");
            this.setState({ isMenu: false });
        }
        catch (err) {
            console.log(err);
            logger.error(`@Gleenald Application catch error, {function: goToSearch(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
            this.setState({ isError: true });
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
                        leftIconSize={26}
                        leftIconColor={RGBACOLORS.black}
                        leftIconOnPress={
                            () => {
                                try {
                                    this.props.navigation.navigate("HomePage")
                                }
                                catch (err) {
                                    console.log(err);
                                    logger.error(`@Gleenald Application catch error, {function: goBack(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`);
                                    this.setState({ isError: true });
                                }
                            }
                        }
                        basePaddingTop={30}
                        centerText={`Daftar Dokumen (${this.state.totalDocument})`}
                        centerTextColor={RGBACOLORS.black}
                        centerTextFontFamily={'Open-Sans'}
                        centerTextFontSize={20}
                        centerTextFontWeight={"700"}

                    />
                </View>

                {/* Body Section */}
                <View
                    style={{
                        flex: 1
                    }}
                >
                    {this.displayBody()}
                </View>

                {/* Footer */}
                <View>
                    <FAB
                        buttonColor={RGBACOLORS.primaryBlue}
                        iconTextColor="white"
                        visible={true}
                        onClickAction={
                            () => {
                                this.setState({ isMenu: true })
                            }
                        }
                        iconTextComponent={
                            <Icon
                                name="menu"
                                type="material"
                                color="white"
                            />
                        }
                    />
                </View>

                {/* Menu Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.isMenu}
                        onBackdropPress={() => { this.setState({ isMenu: false }) }}
                        overlayStyle={{
                            width: 320,
                            height: 230,
                            borderRadius: 10
                        }}
                    >
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Button
                                title={"Sort"}
                                type={"Solid"}

                                containerStyle={{
                                    marginTop: 15
                                }}

                                icon={
                                    <Icon
                                        name={"sort"}
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
                                onPress={
                                    () => { this.setState({ isSort: true, isMenu: false }) }
                                }
                            />

                            <Button
                                title={"Filter"}
                                type={"Solid"}

                                containerStyle={{
                                    marginTop: 15
                                }}

                                icon={
                                    <Icon
                                        name={"filter"}
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
                                onPress={
                                    () => { this.setState({ isFilter: true, isMenu: false }) }
                                }
                            />

                            <Button
                                title={"Search"}
                                type={"Solid"}

                                containerStyle={{
                                    marginTop: 15
                                }}

                                icon={
                                    <Icon
                                        name={"magnify"}
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
                                onPress={
                                    () => { this.setState({ isSearch: true, isMenu: false }) }
                                }
                            />
                        </View>
                    </Overlay>
                </View>

                {/* Sort Overlay */}
                <View>
                    <Overlay
                        overlayStyle={{
                            width: 320,
                            height: 200,
                            borderRadius: 10
                        }}
                        onBackdropPress={
                            () => {
                                this.setState({ isSort: false })
                            }
                        }
                        isVisible={this.state.isSort}
                    >
                        <View
                            style={{
                                marginTop: 20,
                                marginLeft: 10,
                                flexDirection: "column"
                            }}
                        >
                            {/* Part Terbaru */}
                            <View
                                style={{
                                    flexDirection: "row"
                                }}
                            >

                                <RoundedCheckbox
                                    isChecked={this.state.checked1}
                                    active={this.state.isChecked1}
                                    onPress={() => { this.toggleCheckbox1() }}
                                    text={<Icon
                                        name="check"
                                        type="material-community"
                                        color={(this.state.isChecked1 == false) ? "#f0f0f0" : RGBACOLORS.white}
                                    />}
                                    checkedColor={RGBACOLORS.primaryBlue}
                                    outerSize={30}
                                    innerSize={30}
                                />

                                <View
                                    style={{
                                        marginLeft: 20
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontFamily: "Open-Sans",
                                            fontWeight: "700",
                                            color: ((this.state.isChecked1 == false) ? RGBACOLORS.gray : RGBACOLORS.primaryBlue),
                                            marginTop: 2
                                        }}
                                    >
                                        Terbaru
                                    </Text>
                                </View>
                            </View>

                            {/* Part Terlama */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginTop: 30
                                }}
                            >
                                <RoundedCheckbox
                                    isChecked={this.state.checked2}
                                    active={this.state.isChecked2}
                                    onPress={() => { this.toggleCheckbox2() }}
                                    text={<Icon
                                        name="check"
                                        type="material-community"
                                        color={(this.state.isChecked2 == false) ? "#f0f0f0" : RGBACOLORS.white}
                                    />}
                                    checkedColor={RGBACOLORS.primaryBlue}
                                    outerSize={30}
                                    innerSize={30}

                                />

                                <View style={{ marginLeft: 20 }}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontFamily: "Open-Sans",
                                            fontWeight: "700",
                                            color: ((this.state.isChecked2 == false) ? RGBACOLORS.gray : RGBACOLORS.primaryBlue),
                                            marginTop: 2
                                        }}
                                    >
                                        Terlama
                                    </Text>
                                </View>
                            </View>

                            {/* Button Part */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Button
                                    title="Apply"
                                    buttonStyle={{
                                        marginTop: 20,
                                        width: 100,
                                        marginRight: 10,
                                        backgroundColor: RGBACOLORS.primaryBlue,
                                        borderRadius: 5
                                    }}
                                    onPress={this.sort}

                                />
                            </View>
                        </View>
                    </Overlay>
                </View>

                {/* Filter Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.isFilter}
                        onBackdropPress={
                            () => {
                                this.setState({ isFilter: false })
                            }
                        }
                        overlayStyle={{
                            width: 320,
                            height: 370,
                            borderRadius: 10
                        }}
                    >
                        {/* Small Title */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                    fontWeight: "600"
                                }}
                            >
                                Filter
                            </Text>

                            <Text
                                style={{
                                    marginRight: 5,
                                    marginTop: 5
                                }}
                                onPress={
                                    () => {
                                        this.setState
                                            ({
                                                inChip: false,
                                                outChip: false,
                                                pendingChip: true,
                                                allChip: false,
                                                date1: new Date(),
                                                date2: new Date()
                                            })
                                    }
                                }
                            >
                                RESET
                            </Text>
                        </View>

                        {/* Filter Part */}
                        <View
                            style={{
                                flexDirection: "row"
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: 5,
                                    marginTop: 20,
                                    color: "rgba(82, 87, 92, 1)",
                                    fontWeight: "600",
                                    fontSize: 16
                                }}
                            >
                                Filter Berdasarkan
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 10
                            }}
                        >
                            <Button
                                title="Scan In"
                                type="outline"
                                buttonStyle={{
                                    marginRight: 10,
                                    borderRadius: 20,
                                    width: 100,
                                    borderWidth: 1,
                                    borderColor: (this.state.inChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue,
                                    backgroundColor: (this.state.inChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "white" : "#F2F7FB",
                                }}
                                titleStyle={{
                                    color: (this.state.inChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue
                                }}
                                disabled={(this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? true : false}
                                onPress={
                                    () => {
                                        this.setState({ inChip: !this.state.inChip })
                                    }
                                }
                            />
                            <Button
                                title="Scan Out"
                                type="outline"
                                buttonStyle={{
                                    marginRight: 10,
                                    borderRadius: 20,
                                    width: 100,
                                    borderWidth: 1,
                                    borderColor: (this.state.outChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue,
                                    backgroundColor: (this.state.outChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "white" : "#F2F7FB",
                                }}
                                titleStyle={{
                                    color: (this.state.outChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue
                                }}
                                disabled={(this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? true : false}
                                onPress={
                                    () => { this.setState({ outChip: !this.state.outChip }) }
                                }

                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 15
                            }}
                        >
                            <Button
                                title="Scan Out - Pending"
                                type="outline"
                                buttonStyle={{
                                    marginRight: 10,
                                    borderRadius: 20,
                                    width: 180,
                                    borderWidth: 1,
                                    borderColor: (this.state.pendingChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue,
                                    backgroundColor: (this.state.pendingChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "white" : "#F2F7FB",
                                }}
                                titleStyle={{
                                    color: (this.state.pendingChip == false || this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "rgba(82, 87, 92, 1)" : RGBACOLORS.primaryBlue
                                }}
                                disabled={(this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? true : false}
                                onPress={
                                    () => {
                                        this.setState({ pendingChip: !this.state.pendingChip })
                                    }
                                }
                            />
                            <Button
                                title="Semua"
                                type="outline"
                                buttonStyle={{
                                    marginRight: 10,
                                    borderRadius: 20,
                                    width: 100,
                                    borderWidth: 1,
                                    borderColor: (this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? RGBACOLORS.primaryBlue : "rgba(82, 87, 92, 1)",
                                    backgroundColor: (this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? "#F2F7FB" : "white",
                                }}
                                titleStyle={{
                                    color: (this.state.allChip == true || this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) ? RGBACOLORS.primaryBlue : "rgba(82, 87, 92, 1)",
                                }}
                                disabled={false}
                                onPress={
                                    () => {
                                        this.setState({ allChip: !this.state.allChip })
                                        this.setState({ inChipDisable: !this.state.inChipDisable, outChipDisable: !this.state.outChipDisable, pendingChipDisable: !this.state.pendingChipDisable })

                                        if (this.state.inChip == true && this.state.outChip == true && this.state.pendingChip == true) {
                                            this.setState({ inChip: false, outChip: false, pendingChip: false, allChip: false })
                                        }

                                    }
                                }
                            />
                        </View>

                        {/* Date Part */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: "rgba(82, 87, 92, 1)",
                                    marginTop: 20
                                }}
                            >
                                Tanggal Akitivitas Terakhir
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <View style={{ marginLeft: 5, marginTop: 10 }}>
                                    <Text>Dari</Text>

                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ marginRight: 10, fontWeight: "700" }}>{(this.state.date1 === "") ? moment(new Date()).format("D MMM YYYY") : moment(this.state.date1).format("D MMM YYYY")}</Text>
                                        <Icon name="chevron-down" type="material-community" size={20} onPress={() => { this.setState({ datePicker1: true, isFilter: false }) }} />
                                    </View>
                                </View>

                                <View style={{ marginRight: 5, marginTop: 10 }}>
                                    <Text>Sampai</Text>

                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ marginRight: 10, fontWeight: "700" }}>{(this.state.date2 === "") ? moment(new Date()).format("D MMM YYYY") : moment(this.state.date2).format("D MMM YYYY")}</Text>
                                        <Icon name="chevron-down" type="material-community" size={20} onPress={() => { this.setState({ datePicker2: true, isFilter: false }) }} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Apply Button Part */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 30
                            }}
                        >
                            <Button
                                title="Terapkan"
                                buttonStyle={{
                                    borderRadius: 10,
                                    backgroundColor: RGBACOLORS.primaryBlue,
                                    width: 280
                                }}
                                onPress={this.filter}
                            />
                        </View>
                    </Overlay>
                </View>

                {/* Search Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.isSearch}
                        onBackdropPress={() => { this.setState({ isSearch: false }) }}
                        overlayStyle={{
                            width: 310,
                            height: 180,
                            borderRadius: 10,
                        }}
                    >
                        <View
                            style={{
                                marginTop: 20,
                                marginLeft: 5
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontWeight: '600'
                                    }}
                                >
                                    No. Docnum
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
                                        (y) => { this.setState({ Search: y }) }
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginRight: 12,
                                    marginTop: 10
                                }}
                            >
                                <Button
                                    title={"Search"}
                                    buttonStyle={{
                                        width: 75,
                                        height: 37,
                                        marginTop: 10,
                                        backgroundColor: RGBACOLORS.primaryBlue,
                                        borderRadius: 5
                                    }}
                                    type={"solid"}
                                    onPress={this.search}
                                />
                            </View>

                        </View>
                    </Overlay>
                </View>

                {/* Calendar #1 Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.datePicker1}
                        onBackdropPress={() => { this.setState({ datePicker1: false, isFilter: true }) }}
                        overlayStyle={{
                            width: 300,
                            height: 450,
                            borderRadius: 10
                        }}
                    >
                        <Calendar
                            minDate={'2020-01-01'}
                            onDayPress={
                                (day) => {
                                    let x = {};
                                    x[day.dateString] = { selected: true }
                                    this.setState({ markedDate1: x, date1: day.dateString })
                                }
                            }
                            theme={{
                                selectedDayBackgroundColor: RGBACOLORS.primaryBlue,
                                selectedDayTextColor: RGBACOLORS.white,
                                todayTextColor: RGBACOLORS.primaryBlue,
                                arrowColor: RGBACOLORS.primaryBlue,
                                'stylesheet.calendar.header': {
                                    dayTextAtIndex0: {
                                        color: RGBACOLORS.red
                                    },
                                    dayTextAtIndex1: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex2: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex3: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex4: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex5: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex6: {
                                        color: RGBACOLORS.red
                                    }
                                }
                            }}
                            markedDates={this.state.markedDate1}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                position: 'absolute',
                                bottom: 30,
                                right: 10
                            }}
                        >
                            <Button
                                title="Terapkan"
                                type={"clear"}
                                buttonStyle={{
                                    width: 90,
                                }}
                                titleStyle={{
                                    color: RGBACOLORS.primaryBlue
                                }}
                                onPress={
                                    () => {
                                        this.setState({ datePicker1: false, isFilter: true })
                                    }}
                            />
                        </View>
                    </Overlay>
                </View>

                {/* Calendar #2 Overlay */}
                <View>
                    <Overlay
                        isVisible={this.state.datePicker2}
                        onBackdropPress={() => { this.setState({ datePicker2: false, isFilter: true }) }}
                        overlayStyle={{
                            width: 300,
                            height: 450,
                            borderRadius: 10
                        }}
                    >
                        <Calendar
                            minDate={'2020-01-01'}
                            onDayPress={
                                (day) => {
                                    let x = {};
                                    x[day.dateString] = { selected: true }
                                    this.setState({ markedDate2: x, date2: day.dateString })
                                }
                            }
                            theme={{
                                selectedDayBackgroundColor: RGBACOLORS.primaryBlue,
                                selectedDayTextColor: RGBACOLORS.white,
                                todayTextColor: RGBACOLORS.primaryBlue,
                                arrowColor: RGBACOLORS.primaryBlue,
                                'stylesheet.calendar.header': {
                                    dayTextAtIndex0: {
                                        color: RGBACOLORS.red
                                    },
                                    dayTextAtIndex1: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex2: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex3: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex4: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex5: {
                                        color: RGBACOLORS.primaryBlue
                                    },
                                    dayTextAtIndex6: {
                                        color: RGBACOLORS.red
                                    }
                                }
                            }}
                            markedDates={this.state.markedDate2}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                position: 'absolute',
                                bottom: 30,
                                right: 10
                            }}
                        >
                            <Button
                                title="Terapkan"
                                type={"clear"}
                                buttonStyle={{
                                    width: 90,
                                }}
                                titleStyle={{
                                    color: RGBACOLORS.primaryBlue
                                }}
                                onPress={
                                    () => {
                                        this.setState({ datePicker2: false, isFilter: true })
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
    * CONDITIONAL RENDERING FOR BODY SECTION
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
                                                this.props.navigation.push("DocumentListPage")
                                                this.setState({ refreshing: false })
                                            }
                                            catch (err) {
                                                console.log(err)
                                                logger.error(`@Gleenald Application catch error,{function: refresh(), page:H001B}, logMsg: ${err}, USERNAME: ${this.realmDb.objects("Login")[0]["username"]}`)
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
                                    <View>

                                    </View>
                                )
                            }
                        }}
                    >
                    </RecyclerListView>
                </View >
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
