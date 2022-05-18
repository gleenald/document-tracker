import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

export default class D002_Card2 extends Component {
    render() {
        return (
            <View>
                    <View 
                        style={{
                            flexDirection:'row',
                            marginLeft:10,
                        }}
                    >
                        <Icon
                            name={this.props.iconName}
                            type={this.props. iconType}
                            color={this.props.iconColor}
                            size={this.props.iconSize}
                            containerStyle={{
                                marginTop:5
                            }}
                        />
                        <View 
                            style={{
                                flexDirection:'column',
                                marginLeft:20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize:this.props.fontSizeText1,
                                    fontFamily:this.props.fontFamilyText1,
                                    fontWeight:this.props.fontWeightText1
                                }}
                            >{this.props.text1}</Text>
                            <Text
                                style={{
                                    fontSize:this.props.fontSizeText2,
                                    fontFamily:this.props.fontFamilyText2,
                                    fontWeight:this.props.fontWeightText2
                                }}
                            >{this.props.text2}</Text>
                        </View>
                    </View>
            </View>
        )
    }
}
