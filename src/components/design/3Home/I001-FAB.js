import React, { Component } from 'react';
import { Text, View } from 'react-native';
//import library react native elements
import { FAB, Icon } from 'react-native-elements';


export default class I001_FAB extends Component {
    render() {
        return (
            <View>
                <FAB
                    // size={this.props.fabSize}
                    color={this.props.fabColor}
                    title={this.props.fabTitle}
                    placement='right'
                    onPress={this.props.onPress}
                    buttonStyle={{
                        width:this.props.fabWidth
                    }}
                    titleStyle={{
                        fontSize:this.props.fabTextFontSize,
                        width:this.props.fabTextAreaWidth,
                        color:this.props.fabTextColor
                    }}
                />
            </View>
        )
    }
}
