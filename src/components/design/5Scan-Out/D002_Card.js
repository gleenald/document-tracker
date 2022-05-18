import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';

export default class D002_Card extends Component {
    render() {
        return (
            <View>
                <Card 
                    containerStyle={{
                        backgroundColor:this.props.backgroundColor,
                        borderColor:this.props.borderColor,
                        width:this.props.width,
                        height:this.props.height,
                        borderRadius:this.props.borderRadius,
                        marginTop:this.props.marginTop,
                        flexDirection:"column",
                        justifyContent:"center",
                        
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontWeight:this.props.fontWeightText1,
                                fontFamily:this.props.fontFamilyText1,
                                fontSize:this.props.fontSizeText1,
                                marginBottom:this.props.marginBottomText1,
                                marginTop:this.props.marginTopText1,
                                marginLeft:"2%"
                            }}
                        >
                            {this.props.text1}
                        </Text>
                        <Text
                            style={{
                                fontWeight:this.props.fontWeightText2,
                                fontFamily:this.props.fontFamilyText2,
                                fontSize:this.props.fontSizeText2,
                                marginTop:"2.5%",
                                marginLeft:"2%"
                            }}
                        >
                            {this.props.text2}
                        </Text>
                    </View>
                </Card>
            </View>
        )
    }
}
