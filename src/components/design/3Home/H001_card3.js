import React, { Component } from 'react';

import {
    Text,
    View,
    Dimensions
} from 'react-native';

import {
    Icon
} from 'react-native-elements';


const { height, width } = Dimensions.get('window')


export default class H001_Card3 extends Component {
    render() {
        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        height: 110,
                        width: width - 40,
                    }}
                >
                    <Icon
                        name={this.props.iconName}
                        type={this.props.iconType}
                        color={this.props.iconColor}
                        size={this.props.iconSize}
                        containerStyle={{
                            marginTop: 5
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: this.props.fontSizeText1,
                                fontFamily: this.props.fontFamilyText1,
                                fontWeight: this.props.fontWeightText1
                            }}
                        >
                            {this.props.text1}
                        </Text>

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: width - 90
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: this.props.fontSizeText2,
                                    fontFamily: this.props.fontFamilyText2,
                                    fontWeight: this.props.fontWeightText2
                                }}
                            >
                                {this.props.text2}
                            </Text>
                            <Text
                                style={{
                                    color: "#FF8C00"
                                }}
                            >
                                {this.props.text2a}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: width - 120,
                                marginTop: 10
                            }}
                        >
                            <Text style={{ color: "rgba(82, 87, 92, 1)" }}>{this.props.text3}</Text>
                        </View>
                    </View>

                    <View>

                    </View>
                </View>
            </View>
        )
    }
}
