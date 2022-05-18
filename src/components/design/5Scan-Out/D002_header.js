import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Header } from 'react-native-elements';

export default class D002_Header extends Component {
    render() {
        return (
            <View>
                <Header
                    backgroundColor={this.props.backgroundColor}
                    containerStyle={{
                        paddingTop:10
                    }}
                    leftComponent={{ 
                        icon: this.props.leftIcon,
                        type: this.props.leftIconType,
                        size: this.props.leftIconSize,
                        onPress: this.props.leftIconOnPress,  
                        iconStyle: { 
                            color: this.props.leftIconColor,
                            marginLeft:10
                        }
                    }}
                    centerComponent={{ 
                        text: this.props.centerText, 
                        style: { 
                            color: this.props.centerTextColor,
                            fontFamily: this.props.centerTextFontFamily, 
                            fontSize: this.props.centerTextFontSize,
                            fontWeight: this.props.centerTextFontWeight
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
                        } 
                    }}
                    rightContainerStyle={{
                        marginRight:10
                    }}
                />
            </View>
        )
    }
}


