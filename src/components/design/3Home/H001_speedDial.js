import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {SpeedDial} from "react-native-elements";


export default class H001_speedDial extends Component {
    constructor(props) {
        super(props);

        this.state={
            isOpen: false,
        }
    }
    
    render() {
        return (
            <View>
                <Text>asdf</Text>
                <SpeedDial 
                    isOpen={this.state.isOpen}
                    icon={{name:"edit", color:'#fff'}}
                    openIcon={{name:"close", color:"#fff"}}
                    onOpen={() => {this.setState({isOpen : !this.state.isOpen})}}
                    onClose={() => {this.setState({isOpen : !this.state.isOpen})}}
                >
                    <SpeedDial.Action
                        icon={{ name: 'add', color: '#fff' }}
                        title="Add"
                        onPress={() => console.log('Add Something')}
                    />
                    <SpeedDial.Action
                        icon={{ name: 'delete', color: '#fff' }}
                        title="Delete"
                        onPress={() => console.log('Delete Something')}
                    />
                </SpeedDial>
            </View>
        )
    }
}
