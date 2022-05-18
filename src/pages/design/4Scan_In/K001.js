import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import D001_Header from "./../../../components/design/4Scan-In/D001-header";
import {RGBACOLORS} from "./../../../utils/colors/color_library"

const {height, width} = Dimensions.get('window')

export default class K001 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            FormValue : "",

            isOverlayVisible : false
        }
    }
    
    render() {
        return (
            <View
                style={{
                    flex:1,
                    backgroundColor:RGBACOLORS.white
                }}
            >
                {/* Header Section */}
                <View>
                    <D001_Header
                        backgroundColor={RGBACOLORS.white} 
                        leftIconOnPress={() => {this.props.navigation.goBack()} }
                        leftIcon={'chevron-left'}
                        leftIconType={'font-awesome-5'}
                        leftIconSize={20}
                        leftIconColor={RGBACOLORS.black}
                        leftIconOnPress={
                            () => {
                                this.props.navigation.navigate("HomePage")
                            }
                        }

                        centerText={'Manual Input'}
                        centerTextColor={RGBACOLORS.black}
                        centerTextFontFamily={'Open-Sans'}
                        centerTextFontSize={20}
                        centerTextFontWeight={"700"}

                        rightIcon={'camera'}
                        rightIconType={'material-community'}
                        rightIconColor={RGBACOLORS.black}
                        rightOnPress={
                            () => {
                                this.props.navigation.navigate("Camera-ScanInPage")
                            }
                        }
                    />
                </View>
                
                {/* Form Input #1 */}
                <View
                    style={{
                        marginTop: "5%",
                        marginLeft: "5%"
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontWeight:"700",
                                fontFamily:"Open-Sans",
                                color:"rgba(82, 87, 92, 1)",
                                fontSize:16
                            }}
                        >
                            Data QRCode
                        </Text>
                    </View>
                    <TextInput 
                        placeholder="masukkan data QR Code disini"
                        placeholderTextColor={"rgba(187, 187, 187, 1.0)"}
                        style={{
                            backgroundColor:"white",
                            borderBottomColor:"rgba(202, 204, 207, 1)",
                            borderBottomWidth:1.5,
                            width:width/1.15,
                            height:40
                        }}
                        autoFocus={true}
                        value={this.state.FormValue}
                        onChangeText={
                            (data) => {

                                let y = data.split("/")

                                if(y.length == 3) {
                                    this.props.navigation.push("DocumentDetail-ScanInPage", {
                                        document_no : y[1],
                                        title : data
                                    })
                                } else {
                                    console.log("gagal")
                                    this.setState({isOverlayVisible : true})
                                }
                            }
                        }
                    />
                </View>
                
                {/* Overlay Gagal */}
                <View>
                    <Overlay
                        isVisible = {this.state.isOverlayVisible}
                        onBackdropPress = {() => {
                            this.setState({isOverlayVisible : !this.state.isOverlayVisible})
                        }}
                        overlayStyle={{
                            width:320,
                            height:125,
                            borderRadius:10
                        }}
                    >
                        <View
                            style={{
                                marginLeft:10,
                                marginTop:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:16,
                                    fontWeight : "700",
                                    color : "red"
                                }}
                            >
                                Maaf, Dokumen yang anda Scan tidak sesuai
                            </Text>

                            <View
                                style={{
                                    flexDirection:"row",
                                    justifyContent:"flex-end"
                                }}
                            >
                                <Button 
                                    title={"Ok"}
                                    buttonStyle={{
                                        width:100,
                                        height:40,
                                        marginTop:10,
                                        marginRight:10
                                    }}
                                    type={'clear'}
                                    onPress={() => {this.setState({isOverlayVisible : false})}}
                                />


                            </View>
                        </View>
                    </Overlay>
                </View>
            </View>
        )
    }
}
