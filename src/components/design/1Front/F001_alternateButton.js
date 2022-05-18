import React, { Component } from 'react';

import { 
    Text, 
    View, 
} from 'react-native';

import { Button } from 'react-native-elements';

import { RGBACOLORS } from '../../../utils/colors/color_library';

export default class F001_alternateButton extends Component {
    render() {
        return (
            <View 
                style={{
                    flexDirection : "column",

                }}
            >
                <View>
                    <Button 
                        loading={true}
                        type="clear"
                        disabled={true}
                    />
                </View>
                
                <View style={{
                    marginBottom:10
                }}>
                    <Text
                        style={{
                            fontFamily  : "Open-Sans",
                            fontWeight  : "400",
                            fontSize    : 18,
                            color       : RGBACOLORS.primaryBlue
                        }}
                    > 
                        Please Wait, trying to login .. 
                    </Text>
                </View>
            </View>
        )
    }
}
