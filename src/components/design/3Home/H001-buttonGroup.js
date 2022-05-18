import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import {RGBACOLORS} from "./../../../utils/colors/color_library"

export default class H001_ButtonGroup extends Component {
    constructor () {
        super()
        this.state = {
          selectedIndex: 2,
          visible: false
        }
        this.updateIndex = this.updateIndex.bind(this)
      }
      
      updateIndex (selectedIndex) {
        this.setState({selectedIndex})
      }

      toggleOverlay1 = () => {
        this.setState({visible: true})
      }
      toggleOverlay2 = () => {
        this.setState({visible : false})
      }
      
      render () {
        const buttons = [this.props.title1, this.props.title2]
        const { selectedIndex } = this.state
      
        return (
          <View style={{backgroundColor:RGBACOLORS.white, flexDirection:"row", justifyContent:"center"}}>
            <ButtonGroup
            onPress={this.updateIndex} 
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{
                //height: 40,
                borderColor:'#ededed',
                borderRadius:10,
                width:280,
  
            }}
            buttonContainerStyle={{
                borderColor:'#ededed',
                // height:30,
                // borderRadius:15
            }}
            selectedButtonStyle={{
                backgroundColor: 'rgba(242, 247, 251, 1)',
                borderRadius:15
            }}
            selectedTextStyle={{
                color:'rgba(0, 86, 184, 1)'
            }}
            textStyle={{
                color:'black'

            }}
          />
          </View>
        )
      }
}
