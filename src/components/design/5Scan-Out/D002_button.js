import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Overlay, Icon } from 'react-native-elements';

export default class D002_Button extends Component {
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
            </View> 
        )
    }
}
