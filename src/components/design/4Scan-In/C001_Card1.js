import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {Card} from 'react-native-elements';
import { borderColor } from 'styled-system';

export default class C001_Card1 extends Component {
    render() {
        return (
            <View>
                <Card 
                    containerStyle={{
                        backgroundColor:this.props.mainBoxBackgroundColor,
                        borderColor:this.props.mainBoxBorderColor,
                        borderRadius:this.props.mainBoxBorderRadius,
                        width:this.props.mainBoxWidth,
                        height:this.props.mainBoxHeight
                    }}
                >
                    <Text
                        style={{
                            fontFamily:this.props.titleFontFamily,
                            fontSize:this.props.titleFontSize,
                            fontWeight:this.props.titleFontWeight,
                            height:60,
                            marginTop:-7
                        }}
                    >
                        {this.props.title}
                    </Text>
                </Card>
            </View>
        )
    }
}


