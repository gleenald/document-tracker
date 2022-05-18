import React, { Component } from 'react';
import { Text, View } from 'react-native';
//import library react native elements
import { Button, Overlay, Icon } from 'react-native-elements';
//import color library
import { RGBACOLORS } from '../../../utils/colors/color_library';



export default class D001_Button extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false
        }
    }
    toggleOverlay1 = () => {
        this.setState({visible: true})
    }
    toggleOverlay2 = () => {
        this.setState({visible : false})
    }


    render() {
        return (
            <View>
                <Button 
                    title={this.props.title}
                    disabled={this.props.disabled}
                    type="solid"
                    onPress={this.props.onPress}
                    buttonStyle={{
                    backgroundColor: this.props.backgroundColor,
                    width: this.props.width,
                    height: this.props.height,
                    borderRadius: this.props.borderRadius,
                    }}
                />

                {/* Success Mode Overlay */}
                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={this.toggleOverlay2}
                    overlayStyle={{
                        width:this.props.overlay1Width,
                        height:this.props.overlay1Height,
                        borderRadius:this.props.overlay1BorderRadius,
                    }}
                >
                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center",
                            marginTop:10
                        }}
                   >
                        <Icon 
                            name={this.props.iconName1}
                            type={this.props.iconType1}
                            size={this.props.iconSize1}
                        />
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center"
                        }}
                   >
                        <Text
                            style={{
                                fontFamily:this.props.text1FontFamily1,
                                fontWeight:this.props.text1FontWeight1,
                                fontSize:this.props.text1FontSize1,
                                backgroundColor:this.props.text1BackgroundColor1,
                                color:this.props.text1Color1
                            }}
                        >
                            {this.props.text1}
                        </Text>
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center",
                            marginTop:10
                        }}
                   >
                       <Text
                            style={{
                                fontFamily:this.props.text2FontFamily1,
                                fontWeight:this.props. text2FontWeight1,
                                fontSize:this.props.text2FontSize1,
                                color:this.props.text2FontColor1
                            }}
                        >
                           {this.props.judul}
                        </Text>
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center"
                        }}
                   >
                        <Button 
                            title={this.props.buttonTitle1}
                            onPress={this.props.onPressSuccess}
                            containerStyle={{
                                marginTop:30,
                                borderRadius:this.props.buttonBorderRadius1,
                                width:this.props.buttonWidth1
                            }}
                            buttonStyle={{
                                backgroundColor:this.props.buttonBackgroundColor1
                            }}
                            titleStyle={{
                                fontSize:this.props.buttonFontSize1,
                                fontFamily:this.props.buttonFontFamily1,
                                fontWeight:this.props.buttonFontWeight1,
                                color:this.props.buttonFontColor1
                            }}
                        />
                   </View>
                </Overlay>

                {/* Failed Mode Overlay */}
                {/* <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={this.toggleOverlay2}
                    overlayStyle={{
                        width:this.props.overlay2Width,
                        height:this.props.overlay2Height,
                        borderRadius:this.props.overlay2BorderRadius,
                    }}
                >
                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center",
                            marginTop:15
                        }}
                   >
                        <Icon 
                            name={this.props.iconName2}
                            type={this.props.iconType2}
                            size={this.props.iconSize2}
                        />
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center",
                            marginTop:10
                        }}
                   >
                        <Text
                            style={{
                                fontFamily:this.props.text1FontFamily2,
                                fontWeight:this.props.text1FontWeight2,
                                fontSize:this.props.text1FontSize2,
                                backgroundColor:this.props.text1BackgroundColor2,
                                color:this.props.text1FontColor2
                            }}
                        >
                            {this.props.text1}
                        </Text>
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center",
                            marginTop:5
                        }}
                   >
                       <Text
                            style={{
                                fontFamily:this.props.text2FontFamily2,
                                fontWeight:this.props.text2FontWeight2,
                                fontSize:this.props.text2FontSize2,
                                color:this.props.text2FontColor2
                            }}
                        >
                           {this.props.text2}
                        </Text>
                   </View>

                   <View
                        style={{
                            flexDirection:"row",
                            justifyContent:"center"
                        }}
                   >
                        <Button 
                            title={this.props.buttonTitle2}
                            onPress={this.toggleOverlay2}
                            containerStyle={{
                                marginTop:30,
                                borderRadius:this.props.buttonBorderRadius2,
                                width:this.props.buttonWidth2
                            }}
                            buttonStyle={{
                                backgroundColor:this.props.buttonBackgroundColor2
                            }}
                            titleStyle={{
                                fontSize:this.props.buttonFontSize2,
                                fontFamily:this.props.buttonFontFamily2,
                                fontWeight:this.props.buttonFontWeight2,
                                color:this.props.buttonFontColor2
                            }}
                        />
                   </View>
                </Overlay> */}
            </View>
        )
    }
}
