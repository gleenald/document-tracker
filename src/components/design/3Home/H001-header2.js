import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Header } from 'react-native-elements';

export default class H001_Header2 extends Component {
    render() {
        return (
            <View>
                <Header
                    backgroundColor={this.props.backgroundColor}
                    containerStyle={{
                        paddingTop: this.props.basePaddingTop
                    }}
                    leftComponent={{
                        icon: this.props.leftIcon,
                        onPress: this.props.leftIconOnPress,
                        type: this.props.leftIconType,
                        size: this.props.leftIconSize,
                        iconStyle: {
                            color: this.props.leftIconColor,
                            marginLeft: 7
                        }
                    }}
                    centerComponent={{
                        text: this.props.centerText,
                        style: {
                            color: this.props.centerTextColor,
                            fontFamily: this.props.centerTextFontFamily,
                            fontSize: this.props.centerTextFontSize,
                            fontWeight: this.props.centerTextFontWeight,
                            marginTop: 3.5,
                            width: 300
                        }


                    }}
                    centerContainerStyle={{
                        marginLeft: 100,
                        marginTop: -5
                    }}
                    rightComponent={{
                        icon: this.props.rightIcon,
                        type: this.props.rightIconType,
                        size: this.props.rightIconSize,
                        onPress: this.props.rightIconOnPress,
                        iconStyle: {
                            color: this.props.rightIconColor,
                            marginRight: 9
                        }

                    }}
                    rightContainerStyle={{
                        // marginRight:10
                    }}
                />
            </View>
        )
    }
}


