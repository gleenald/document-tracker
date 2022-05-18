import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SearchBar, Header, Icon } from 'react-native-elements';

import Search001CenterHeader from "./Search001-centerHeader";

import {RGBACOLORS} from "./../../../utils/colors/color_library";

export default class Search001_Header extends Component {
    
    render() {
        return (
            <View>
                <Header
                    backgroundColor={RGBACOLORS.white}
                    leftComponent={{
                        icon: this.props.leftIcon,
                        onPress: this.props.leftIconOnPress,
                        type: this.props.leftIconType,
                        size: this.props.leftIconSize,  
                        iconStyle: { 
                            color: this.props.leftIconColor,
                        }
                       
                    
                    }}
                    containerStyle={{
                        
                        
                    }}
                    centerComponent={
                        <Search001CenterHeader />
                    }
                />
 
            </View>
        )
    }
}
