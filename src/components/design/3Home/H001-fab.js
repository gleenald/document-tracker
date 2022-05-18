import React, { Component } from 'react';
import { Text, View } from 'react-native';
//import library react native elements
import { FAB , Icon, Button, Overlay, Card} from 'react-native-elements';
import { backgroundColor } from 'styled-system';
//import color Library
import { RGBACOLORS } from '../../../utils/colors/color_library';

export default class H001_FAB extends Component {
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
                    icon={{
                        name:this.props.iconName,
                        type:this.props.iconType,
                        size:this.props.iconSize,
                        color:this.props.iconColor
                    }}
                    type={this.props.buttonType}
                    onPress={this.props.onPress}
                    buttonStyle={{
                        width:this.props.buttonWidth,
                        height:this.props.buttonHeight,
                        borderRadius:this.props.buttonBorderRadius,
                        // borderColor:this.props. buttonBorderColor,
                        // borderWidth:this.props.buttonBorderWidth,
                        backgroundColor:this.props.buttonBackgroundColor,
                    }}
                />

                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={this.toggleOverlay2}
                    overlayStyle={{
                        width:this.props.overlayWidth,
                        height:this.props.overlayHeight,
                        borderRadius:this.props.overlayBorderRadius
                    }}
                >
                        <View style={{flexDirection:"column", alignItems:"center"}}>
                            {/* Button Scan In */}
                            <Button
                                containerStyle={{
                                    
                                    marginTop:15
                                }}
                                icon={
                                    <Icon
                                        name={this.props.iconName1}
                                        type={this.props.iconType1}
                                        color={this.props.iconColor1}
                                        style={{
                                            marginRight:8,
                                            marginLeft:15
                                        }}
                                    />
                                }
                                title={this.props.buttonTitle1}
                                type={this.props.buttonType1}
                                onPress={this.props.onPress1}
                                buttonStyle={{
                                    width:this.props.buttonWidth1,
                                    height:this.props.buttonHeight1,
                                    borderRadius:this.props.buttonBorderRadius1,
                                    backgroundColor:this.props.buttonBackgroundColor1,
                                    flexDirection:"row",
                                    justifyContent:"flex-start",
                                    
                                }}
                                titleStyle={{
                                    color:this.props.titleColor1,
                                    fontSize:this.props.titleFontSize1,
                                    fontWeight:this.props.titleFontWeight1,
                                    fontSize:this.props.titleFontSize1,
                                    
                                }}
                                

                            />

                            {/* Button Scan Out */}
                            <Button
                                containerStyle={{
                                    justifyContent:"center",
                                    marginTop:20
                                }}
                                icon={
                                    <Icon
                                        name={this.props.iconName2}
                                        type={this.props.iconType2}
                                        color={this.props.iconColor2}
                                        style={{
                                            marginRight:8,
                                            marginLeft:15
                                        }}
                                    />
                                }
                                title={this.props.buttonTitle2}
                                type={this.props.buttonType2}
                                onPress={this.props.onPress2}
                                buttonStyle={{
                                    width:this.props.buttonWidth2,
                                    height:this.props.buttonHeight2,
                                    borderRadius:this.props.buttonBorderRadius2,
                                    backgroundColor:this.props.buttonBackgroundColor2,
                                    flexDirection:"row",
                                    justifyContent:"flex-start",
                                }}
                                titleStyle={{
                                    color:this.props.titleColor2,
                                    fontSize:this.props.titleFontSize2,
                                    fontWeight:this.props.titleFontWeight2,
                                    fontSize:this.props.titleFontSize2
                                }}
                            />
                        </View>

                </Overlay>
            </View>
        )
    }
}
