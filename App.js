import React, { Component } from 'react';

import { 
  Text, 
  View 
} from 'react-native';

//import react-navigation
import {NavigationContainer} from "@react-navigation/native";

import {
  createStackContainer, 
  createStackNavigator
} from "@react-navigation/stack";

//import component
import F001 from "./src/pages/design/1Front/F001";
import H001 from "./src/pages/design/3Home/H001";
import H001B from "./src/pages/design/3Home/H001B";
import H001C from "./src/pages/design/3Home/H001C";
import C001 from "./src/pages/design/4Scan_In/C001";
import K001 from "./src/pages/design/4Scan_In/K001";
import D001 from "./src/pages/design/4Scan_In/D001";
import C002 from "./src/pages/design/5Scan_Out/C002";
import K002 from "./src/pages/design/5Scan_Out/K002";
import D002 from "./src/pages/design/5Scan_Out/D002";
import Search001 from "./src/pages/design/6Search/Search001";


const Stack = createStackNavigator();

export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        
        <Stack.Navigator>
            
            <Stack.Screen name="FrontPage" component={F001} 
              options={{
                  headerShown:false 
              }}
            />
            
            <Stack.Screen name="HomePage" component={H001}
            options={{
              headerShown: false
              }}
            />

            <Stack.Screen name="DocumentListPage" component={H001B}
              options={{
                headerShown : false
              }}
            />

            <Stack.Screen name="DocumentHistoryPage" component={H001C}
            options={{
              headerShown : false
            }}
            />
            
            <Stack.Screen name="Camera-ScanInPage" component={C001}
              options={{
                headerShown:false
                }}
            />

            <Stack.Screen name="KeyboardInput01" component={K001}
              options={{
                headerShown: false
              }}
            />

            <Stack.Screen name="DocumentDetail-ScanInPage" component={D001} 
              options={{
                headerShown: false
              }}
            />

            <Stack.Screen name="Camera-ScanOutPage" component={C002}  
              options={{
                headerShown : false
              }}
            />

            <Stack.Screen name="KeyboardInput02" component={K002}
              options={{
                headerShown : false 
              }}
            />

            <Stack.Screen name="DocumentDetail-ScanOutPage" component={D002}
            options={{
              headerShown:false
              
              }}
            />

            <Stack.Screen name="SearchPage" component={Search001} 
            options={{
              // header: ({scene, previous, navigation}) => (
              //   <Search001_Header 
              //     leftIcon = {"chevron-left"}
              //     leftIconOnPress = {() => {navigation.goBack()}}
              //     leftIconType={"material-community"}
              //     leftIconColor={RGBACOLORS.black}
              //     leftIconSize={30}
              //   />
              // )
              headerShown: false

              
            }}
            />

        </Stack.Navigator>
        
      </NavigationContainer>
      
    )
  }
}
