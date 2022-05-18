//importReact & React Native
import React, { Component } from 'react';
import { Text, View } from 'react-native';

//import React Native Elements
import { Button, Icon, Overlay } from "react-native-elements";

//import Color Library
import { RGBACOLORS } from '../../../utils/colors/color_library';

//import Rounded Check Box Library
import RoundedCheckbox from "react-native-rounded-checkbox";

//import react-native-date-picker
import DatePicker from 'react-native-date-picker';

//import moment
import moment from 'moment';


export default class H001_buttonBot extends Component {
    constructor() {
        super()
        this.state={
            
            //for overlay val
            visible:false,
            vis2:false,
            vis3:false,
            vis4: false,
            
            //for checkbox val
            isChecked1: false,
            isChecked2:false,

            //datePicker val
            
            date1 : new Date(),
            date2 : new Date(),
        }
    }
    
    toggleOverlay1 = () => {
        this.setState({visible: true})
    }
    toggleOverlay2 = () => {
        this.setState({visible : false})
    }

    toggleCheckbox1 = () => {
        if(this.state.isChecked2 == false) {
            this.setState({isChecked1 : !this.state.isChecked1})
        }
        if(this.state.isChecked2 == true) {
            this.setState({isChecked1 : false})
        }
    }

    toggleCheckbox2 = () => {
        if(this.state.isChecked1 == false) {
            this.setState({isChecked2 : !this.state.isChecked2})

        }
        if(this.state.isChecked1 == true) {
            this.setState({isChecked2 : false})
        }
    }
    
    render() {
        return (
            
            <View style={{paddingBottom:10, paddingTop:10, flexDirection:"row", justifyContent:"center"}}>
                
                <Button 
                    title="Sort"
                    onPress={this.toggleOverlay1}
                    containerStyle={{
                        width:100,
                        height:40,
                        marginRight:10,
                        borderRadius:10,
                    }}
                    buttonStyle={{backgroundColor:RGBACOLORS.primaryBlue}}
                    icon={
                        <Icon 
                            name="sort"
                            type="font-awesome"
                            containerStyle={{
                                marginRight:10
                            }}
                            color="white"
                        />
                    }
                />

                <Button 
                    title="Filter"
                    onPress={() => {this.setState({vis2: true})}}
                    containerStyle={{
                        width:100,
                        height:40,
                        marginRight:10,
                        borderRadius:10,
                    }}
                    buttonStyle={{backgroundColor:RGBACOLORS.primaryBlue}}
                    icon={
                        <Icon 
                            name="filter"
                            type="font-awesome"
                            containerStyle={{
                                marginRight:10
                            }}
                            color="white"
                        />
                    }
                />

                {/* Sort Overlay */}
                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={this.toggleOverlay2}
                    overlayStyle={{
                        width:320,
                        height:200,
                        borderRadius:20
                    }}
                >
                    
                    <View style={{marginTop:20, marginLeft:10, flexDirection:"column"}}>
                        <View style={{flexDirection:"row"}}>
                            <RoundedCheckbox 
                                isChecked={this.state.isChecked1}
                                active={this.state.isChecked1} 
                                onPress={() => {this.toggleCheckbox1()}} 
                                text={<Icon 
                                    name="check" 
                                    type="material-community" 
                                    color={(this.state.isChecked1 == false) ? "#f0f0f0" : RGBACOLORS.white} 
                                />} 
                                checkedColor={RGBACOLORS.primaryBlue}
                                outerSize={30}
                                innerSize={30}
                                    
                            />
                        
                            <View style={{marginLeft:20}}>
                                <Text
                                    style={{
                                        fontSize:18,
                                        fontFamily:"Open-Sans",
                                        fontWeight:"700",
                                        color: ((this.state.isChecked1 == false)? RGBACOLORS.gray : RGBACOLORS.primaryBlue),
                                        marginTop:2
                                    }}
                                >
                                    Terbaru
                                </Text>
                            </View>

                        </View> 

                        <View style={{flexDirection:"row", marginTop:30}}>
                            <RoundedCheckbox 
                                isChecked={this.state.checked2}
                                active={this.state.isChecked2} 
                                onPress={() => {this.toggleCheckbox2()}} 
                                text={<Icon 
                                    name="check" 
                                    type="material-community" 
                                    color={(this.state.isChecked2 == false) ? "#f0f0f0" : RGBACOLORS.white} 
                                />} 
                                checkedColor={RGBACOLORS.primaryBlue}
                                outerSize={30}
                                innerSize={30}
                                    
                            />
                        
                            <View style={{marginLeft:20}}>
                                <Text
                                    style={{
                                        fontSize:18,
                                        fontFamily:"Open-Sans",
                                        fontWeight:"700",
                                        color: ((this.state.isChecked2 == false)? RGBACOLORS.gray : RGBACOLORS.primaryBlue),
                                        marginTop:2
                                    }}
                                >
                                    Terlama
                                </Text>
                            </View>

                        </View> 

                        <View>
                            <Button 
                                title="Ok"
                                containerStyle={{
                                    alignItems:"flex-end",
                                    marginTop:15,
                                    marginRight:10
                                }}
                                buttonStyle={{
                                    width:100,
                                    borderRadius:10,
                                    backgroundColor:RGBACOLORS.primaryBlue
                                }}
                                onPress={this.props.sortOnPress}
                            />
                        </View>
                        
                    </View>
                            
                </Overlay>

                {/* Filter Overlay */}
                <Overlay
                    isVisible={this.state.vis2}
                    onBackdropPress={() => {this.setState({vis2: false})}}
                    overlayStyle={{
                        width:320,
                        height:180,
                        borderRadius:25
                    }}
                >
                    <Text
                        style={{
                            marginLeft:10,
                            marginTop:20,
                            fontSize:16,
                            fontWeight:"700",
                            fontFamily:"Open-Sans"
                        }}
                    >
                        Tanggal Serah Terima
                    </Text>
                    
                    <View style={{flexDirection:"row", marginLeft:10, marginTop:20}}>
                        
                        <View style={{marginRight:40}}>
                            
                            <Text>Dari</Text>
                            
                            <View style={{flexDirection:"row"}}>
                                <Text style={{marginRight:10, fontWeight:"700"}}>{moment(this.state.date1.toString()).format("D MMM YYYY")}</Text>
                                <Icon name="chevron-down" type="material-community" size={20} onPress={() => {this.setState({vis2: false, vis3:true})}}/>
                            </View>

                        </View>
                        
                        <View>
                            
                            <Text>Sampai</Text>
                            
                            <View style={{flexDirection:"row"}}>
                                <Text style={{marginRight:10, fontWeight:"700"}}>{moment(this.state.date2.toString()).format("D MMM YYYY")}</Text>
                                <Icon name="chevron-down" type="material-community" size={20} onPress={() => {this.setState({vis2: false, vis4:true})}}/>
                            </View>

                            
                        
                        </View>

                        
                    </View>

                    <View style={{flexDirection:"row",justifyContent:"flex-end", marginRight:10, marginTop:15}}>
                        <Button 
                            title="Ok"
                            type="solid"
                            buttonStyle={{
                                borderRadius:25,
                                width:95,
                                backgroundColor:RGBACOLORS.primaryBlue
                            }}
                            onPress={() => {this.setState({vis2: false})}}
                        />
                    </View>
                </Overlay>

                {/* Date Picker-1 */}
                <Overlay
                    isVisible={this.state.vis3}
                    onBackdropPress={() => {this.setState({vis2:true, vis3:false})}}
                    overlayStyle={{
                        width:320,
                        height:180,
                        borderRadius:25
                    }}
                >
                    <DatePicker 
                        date={this.state.date1}
                        onDateChange={x => {
                            this.setState({date1 : x})
                        }}
                        mode='date'
                        androidVariant='nativeAndroid'
                    />
                </Overlay>

                {/* Date Picker-2 */}
                <Overlay
                    isVisible={this.state.vis4}
                    onBackdropPress={() => {this.setState({vis2:true, vis4:false})}}
                    overlayStyle={{
                        width:320,
                        height:180,
                        borderRadius:25
                    }}
                >
                    <DatePicker 
                        date={this.state.date2}
                        onDateChange={x => {
                            this.setState({date2 : x})
                        }}
                        mode="date"
                        androidVariant='nativeAndroid'
                    />
                </Overlay>
            </View>
        )
    }
}
