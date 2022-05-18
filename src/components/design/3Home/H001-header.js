import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import {Card, Icon} from 'react-native-elements';

import {Button, Overlay} from 'react-native-elements';
import { color } from 'react-native-elements/dist/helpers';
import { position } from 'styled-system';

import { RGBACOLORS } from '../../../utils/colors/color_library';


export default class H001_Header extends Component {
    render() {
        
        return (
            <View>
                <View 
                    style={{
                        backgroundColor:this.props.backgroundColor,
                        height: this.props.baseHeight,
                        width: this.props.baseWidth
                    }}
                >
                    <View 
                        style={{
                            flexDirection:'row'
                        }}
                    >
                        <Text 
                            style={{
                                fontSize:this.props.text1FontSize,
                                fontWeight:this.props.text1FontWeight,
                                color:this.props.text1FontColor,
                                position: this.props.text1Position,
                                left: this.props.text1Left,
                                top: this.props.text1Top
                            }}
                        >
                            {this.props.text1}
                        </Text>
                        <Icon 
                            name={this.props.iconName}
                            type={this.props.iconType}
                            color={this.props.iconColor}
                            size={this.props.iconSize}
                            onPress={this.props.iconOnPress}
                            containerStyle={{
                                // marginTop: this.props.iconMarginTop,
                                // marginLeft: this.props.iconMarginLeft
                                position: this.props.iconPosition,
                                right: this.props.iconRight,
                                top: this.props.iconTop
                            }}
                        />
                    </View>

                    <View
                        style={{
                            alignItems:"center"
                        }}
                    >
                        <View
                            style={{
                                backgroundColor:this.props.cardBackgroundColor,
                                width:this.props.cardWidth,
                                height:this.props.cardHeight,
                                borderRadius:this.props.cardBorderRadius,
                                position: this.props.cardPosition,
                                top: this.props.cardTop,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: '#ddd',
                                borderBottomWidth: 0,
                                shadowColor: '#000000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.9,
                                shadowRadius: 3,
                                elevation: 3,
                            }}
                               
                        >
                            <View style={{flexDirection:'row'}}>
                                <Text
                                    style={{
                                        fontSize:this.props.text2FontSize,
                                        marginTop:this.props.text2MarginTop,
                                        marginLeft:10
                                    }}
                                >
                                    Hai,
                                </Text>

                                <Text  
                                    style={{
                                        fontSize:this.props.text3FontSize,
                                        fontWeight:this.props.text3FontWeight,
                                        marginTop:this.props.text2MarginTop,
                                        marginLeft:5,

                                    }}
                                >
                                    {this.props.text3}
                                </Text>
                            </View>
                            
                            <View style={{flexDirection:'row'}}>
                                <Text
                                    style={{
                                        fontSize:this.props.text4FontSize,
                                        marginTop:5,
                                        marginLeft:10
                                    }}
                                >
                                    Divisi :
                                </Text>

                                <Text  
                                    style={{
                                        fontSize:this.props.text5FontSize,
                                        fontWeight:this.props.text5FontWeight,
                                        color:this.props.text5FontColor,
                                        marginTop:5,
                                        marginLeft:5,

                                    }}
                                >
                                    {this.props.text5}
                                </Text>
                            </View>
                        
                        </View>
                    </View>
                </View>

                <View>
                    <Overlay
                        isVisible={this.props.isVisible}
                        onBackdropPress={this.props.onBackdropPress}
                        overlayStyle={{
                            width:320,
                            height:175,
                            borderRadius:10
                        }}
                    >
                        <View style={{marginLeft:15}}>
                            <Text
                                style={{
                                    fontWeight:"700",
                                    color:RGBACOLORS.gray,
                                    fontSize:18,
                                    marginTop:10,
                                    
                                }}
                            >
                                Akun
                            </Text>
                        
                            
                            <Text
                                style={{
                                    fontWeight:"700",
                                    color:RGBACOLORS.gray,
                                    fontSize:14,
                                    marginTop:15
                                }}
                            >
                                Apa Anda yakin ingin keluar ?
                            </Text>
                            
                        
                            <View 
                                style={{
                                    marginTop:30,
                                    flexDirection:"row"
                                }}
                            >
                                <Button
                                    title={this.props.titleButton1}
                                    type={this.props.typeButton1}
                                    buttonStyle={{
                                        borderRadius: this.props.borderRadiusButton1,
                                        borderWidth: this.props.borderWidthButton1,
                                        fontWeight: this.props.fontWeightButton1,
                                        width: this.props.widthButton1,
                                        height: this.props.heightButton1,
                                        marginRight: this.props.marginRightButton1
                                    }}
                                    onPress={this.props.onPressButton1}
                                    // disabled = {this.props.signOutDisabled}
                                />

                                <Button
                                    title={this.props.titleButton2}
                                    // type={this.props.typeButton2}
                                    buttonStyle={{
                                        borderRadius:this.props.borderRadiusButton2,
                                        backgroundColor:RGBACOLORS.primaryBlue,
                                        width:this.props.widthButton2,
                                        height:this.props.heightButton2,

                                    }}
                                    onPress={this.props.onPressButton2}
                                    // disabled = {this.props.signOutDisabled}
                                />

                            </View>
                        </View>

                            

                        

                    </Overlay>
                </View>
            </View>
        )
    }

    
    
}
