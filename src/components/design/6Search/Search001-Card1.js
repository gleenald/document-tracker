import React, { Component } from 'react';
import { Text, View } from 'react-native';
//import library react native elements
//import library react native elementsot
import {Card, Icon, Divider } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {RGBACOLORS} from "./../../../utils/colors/color_library";

export default class Search001_Card1 extends Component {
    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={this.props.onPressCard}>
                    <Card 
                        containerStyle={{
                            backgroundColor:this.props.backgroundColor,
                            borderColor:this.props.borderColor,
                            borderRadius:this.props.borderRadius,
                            width:this.props.width,
                            height:this.props.height
                        }}
                    >
                        <View
                            style={{
                                flexDirection:'row'
                            }}
                        >
                            <View 
                                style={{
                                    marginTop:5,
                                }}
                            >
                                <Icon
                                    name={this.props.iconName}
                                    type={this.props.iconType}
                                    color={this.props.iconColor}
                                />    
                            </View>
                            
                            <View style={{marginLeft:15, marginBottom:10}}>
                                <Text
                                    style={{
                                        fontSize:this.props.text1FontSize,
                                        color:this.props.text1FontColor,
                                        fontFamily:this.props.text1FontFamily,
                                        fontWeight:this.props.text1FontWeight
                                    }}
                                >
                                    {this.props.text1}
                                </Text>

                                <Text
                                    style={{
                                        fontSize:this.props.text2FontSize,
                                        color:this.props.text2FontColor,
                                        fontFamily:this.props.text2FontFamily,
                                        fontWeight:this.props.text2FontWeight,
                                        height:15,
                                        width:250,
                                    }}
                                >
                                    {this.props.text2}
                                </Text>
                            </View>
                            
                        </View>

                        <Divider 
                            orientation={this.props.dividerOrientation}
                        />

                        <View
                            style={{
                                marginLeft:35,
                                marginTop:10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:12
                                }}
                            >{this.props.text3}</Text>
                            <View style={{flexDirection:"row", marginTop:5}}>
                                    <Icon name="corner-down-right" type="feather" color={RGBACOLORS.red} size={20} containerStyle={{
                                        marginLeft:5
                                    }}/>
                                    <Text 
                                        style={{
                                            marginLeft:7,
                                            marginTop:5,
                                            fontSize:12
                                        }}
                                    >
                                        {this.props.text4}
                                    </Text>
                            </View>
                        </View>
                    </Card>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
