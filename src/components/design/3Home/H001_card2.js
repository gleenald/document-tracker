import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';

import { RGBACOLORS } from '../../../utils/colors/color_library';

const { height, width } = Dimensions.get('window')

export default class H001_Card2 extends Component {
    render() {
        return (
            <View>
                <Card
                    containerStyle={{
                        backgroundColor: this.props.backgroundColor,
                        borderColor: this.props.borderColor,
                        width: this.props.width,
                        height: this.props.height,
                        borderRadius: this.props.borderRadius,
                        marginTop: this.props.marginTop,
                        flexDirection: "column",
                        justifyContent: "flex-start",

                    }}
                >
                    <View
                        style={{
                            marginBottom: 10,
                            marginLeft: 5
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: this.props.fontWeightText1,
                                fontFamily: this.props.fontFamilyText1,
                                fontSize: this.props.fontSizeText1,
                                marginBottom: this.props.marginBottomText1,
                                marginTop: this.props.marginTopText1,

                            }}
                        >
                            {this.props.text1}
                        </Text>
                        <Text
                            style={{
                                fontWeight: this.props.fontWeightText2,
                                fontFamily: this.props.fontFamilyText2,
                                fontSize: this.props.fontSizeText2,
                            }}
                        >
                            {this.props.text2}
                        </Text>
                    </View>

                    <View
                        style={{
                            width: width - 70,
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            borderRadius: 100,
                            borderColor: RGBACOLORS.primaryBlue,
                            marginBottom: 0
                        }}
                    ></View>

                    <View
                        style={{
                            marginTop: 10
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: this.props.fontWeightText3,
                                fontFamily: this.props.fontFamilyText3,
                                fontSize: this.props.fontSizeText3,
                            }}
                        >
                            {this.props.text3}
                        </Text>
                    </View>
                </Card>
            </View>
        )
    }
}
