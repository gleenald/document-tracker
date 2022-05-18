import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Header } from 'react-native-elements';

export default class D001_Header extends Component {
    render() {
        return (
            <View>
                <Header
                    backgroundColor={this.props.backgroundColor}
                    containerStyle={{
                        paddingTop:25
                    }}
                    leftComponent={{ 
                        icon: this.props.leftIcon,
                        onPress: this.props. leftIconOnPress,
                        type: this.props.leftIconType,
                        size: this.props.leftIconSize,  
                        iconStyle: { 
                            color: this.props.leftIconColor,
                            // marginLeft:5,
                            marginTop:this.props.leftMarginTop,
                            marginRight: this.props.leftMarginRight
                        }
                    }}
                    centerComponent={{ 
                        text: this.props.centerText, 
                        style: { 
                            color: this.props.centerTextColor,
                            fontFamily: this.props.centerTextFontFamily, 
                            fontSize: this.props.centerTextFontSize,
                            fontWeight: this.props.centerTextFontWeight,
                            marginTop : 3,
                            marginLeft : "0%"
                        }

                    }}
                    centerContainerStyle={{
                        marginLeft:-130,
                        marginTop:-3
                    }}
                    rightComponent={{ 
                        icon: this.props.rightIcon,
                        type: this.props.rightIconType,
                        size: this.props.rightIconSize,  
                        iconStyle: { 
                            color: this.props.rightIconColor,
                        },
                        onPress : this.props.rightOnPress
                    }}
                    rightContainerStyle={{
                        marginRight:10
                    }}
                />
            </View>
        )
    }
}


