import { Row } from 'native-base';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SearchBar, Icon, Button } from 'react-native-elements';

import { RGBACOLORS } from '../../../utils/colors/color_library';

export default class Search001CenterHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchVal: ""
        }
    }

    render() {
        return (
            <View style={{ flexDirection: "row" }}>
                <View>
                    <SearchBar
                        placeholder={this.props.SBplaceholder}
                        platform={this.props.SBplatform}
                        inputContainerStyle={{
                            backgroundColor: this.props.SBbackgroundColor,
                            height: this.props.SBheight,
                            width: this.props.sbWidth,
                            borderRadius: this.props.SBborderRadius,
                            marginLeft: 0,
                            marginTop: -8
                        }}

                        inputStyle={{
                            fontSize: 14
                        }}

                        onChangeText={this.props.SBonChangeText}
                        value={this.props.SBval}
                    />
                </View>
            </View>
        )
    }
}
