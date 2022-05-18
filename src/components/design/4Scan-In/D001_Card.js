import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import { height } from 'styled-system';
import { RGBACOLORS } from '../../../utils/colors/color_library';


export default class D001_Card extends Component {
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
                        justifyContent: "center",

                    }}
                >
                    <View
                        style={{
                            flexDirection: "column",
                            // justifyContent:"center",
                            alignItems: "flex-start"
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row"
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: RGBACOLORS.primaryBlue
                                }}
                            >
                                Tanggal :
                            </Text>

                            <Text
                                style={{
                                    fontWeight: this.props.fontWeightText1,
                                    fontFamily: this.props.fontFamilyText1,
                                    fontSize: this.props.fontSizeText1,
                                }}
                            >
                                {this.props.text1}
                            </Text>
                        </View>

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: 5
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: RGBACOLORS.primaryBlue
                                }}
                            >
                                Nomor DOK :
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
                                display: "flex",
                                flexDirection: "row",
                                marginTop: 5,
                                height: this.props.customerHeight,
                                width: this.props.customerWidth
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "700",
                                    color: RGBACOLORS.primaryBlue
                                }}
                            >
                                Nama Customer :
                            </Text>

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
                    </View>
                </Card>
            </View>
        )
    }
}
