import React, { Component } from 'react';

import { View } from 'react-native';

import { Button } from 'react-native-elements';

export default class F001_Button extends Component {
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
            </View>
        )
    }
}
