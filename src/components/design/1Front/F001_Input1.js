import React, { Component } from 'react';

import { 
    Text, 
    View 
} from 'react-native';

import { Input } from 'native-base';

import { Icon } from "react-native-elements";

export default class F001_Input1 extends Component {
    render() {
        return (
            <View 
                style={{
                    marginLeft:10, 
                    marginTop:80, 
                    height:100, }}>
                <Text
                    style={{
                        fontFamily:this.props.titleFontFamily,
                        fontWeight:this.props.titleFontWeight,
                        fontSize:this.props.titleFontSize,
                        color:this.props.titleFontColor,
                        marginBottom:5,
                        marginTop:10
                    }}
                >
                        {this.props.title}
                </Text>
                <View
                    style={{
                        marginTop:-7,
                        height:50
                    }}
                >
                    <Input 
                        placeholder={this.props.placeholder}
                        variant={this.props.variant}
                        type={this.props.type}
                        _focus={{
                            borderColor:this.props.focusBorderColor,
                        }}
                        InputRightElement={
                            <Icon
                                name={this.props.iconRightName}
                                type={this.props.iconRightType}
                                color={this.props.iconRightColor}
                            />
                        }
                    />
                </View>
            </View>
        )
    }
}
