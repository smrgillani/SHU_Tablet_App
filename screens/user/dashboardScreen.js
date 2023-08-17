import React, {useState} from 'react';
import {
  Animated,
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Switch,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';
import RNSpeedometer from 'react-native-speedometer';
import { LineChart } from "react-native-chart-kit";
import BlinkView from 'react-native-blink-view';

import fontFamily from '../../constants/fontFamily';
import images from '../../constants/images';

import { getData } from '../../service/httpService';
import * as Constant from '../../service/constantVars';

let renderScenes = {};

const Dashboard = ({navigation}) => {
  const [hubData, setHubData] = useState(undefined);
  const [selectedId, setSelectedId] = useState(1);
  const [blocksWidth, setBlocksWidth] = useState(0);
  // const [data, setData] = useState(undefined);
  const [isUtilityOn, setIsUtilityOn] = useState(false);
  const isFocused = useIsFocused();

  const layout = useWindowDimensions();

  const screenWidth = (Dimensions.get("window").width / 2);

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);
  const [renderScene, setRenderScene] = React.useState(false);

  let graphsData = {};

  const renderMetersUsage = (params) => {

  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          data: (graphsData[params.route.key] === undefined ? [0,0,0,0,0,0,0]: graphsData[params.route.key]),
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 3
        }
      ],
  };

  const chartConfig = {
    backgroundColor: "#000",
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 0) => `rgba(0, 0, 0, 0)`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      strokeWidth: "2",
      stroke: "#fff"
    },
    strokeWidth: 2,
    barPercentage: 0.5,
    propsForBackgroundLines: {
      strokeWidth: 0
    },
    useShadowColorFromDataset: false
  };

  return (<View key={params.route.key} style={{ flex: 1, backgroundColor: '#151833' }}>
    <LineChart style={{marginTop:10,marginLeft:-10}} data={data} width={screenWidth-10} height={170} chartConfig={chartConfig} bezier />
  </View>);
}

 const customTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    const meterTypes = ["WATER_METER", "GAS_METER", "ELECTRICITY_METER"];

    const meterTypesNames = ["Water", "Gas", "Electricity"];

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          let getType;

          if(hubData !== undefined){
            
            const totalDevices = hubData[0].devices.length;

            for (let d=0; d < totalDevices; d++) {

              if(hubData[0].devices[d].meterInfo.id === route.key){
                
                getType = meterTypes.indexOf(hubData[0].devices[d].meterInfo.type);
                
                if(getType > -1){
                  getType = meterTypesNames[getType];
                }

                break;
              }
            }
          }

          getType = getType;

          return (
            <TouchableOpacity
              key={i}
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <Animated.Text style={styles.tabItemText}>{getType}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  React.useEffect(() => {
    
    try {

      const loadAllCentralHub = async () => {

        await getData(`${Constant.ApiMethods.centralHubs}`, true).then((response) => {
          if (response !== undefined) {

            for (var i = 0; i < response.length; i++) {

              var meterDetailsForTabs = [];

              let scenesRender= {};

              graphsData = {}

              for (var d = 0; d < response[i].devices.length; d++) {

                meterDetailsForTabs.push({ key: response[i].devices[d].meterInfo.id, title: "First Meter" });
                // meterDetailsForTabs.push({ key: response[i].devices[d].meterInfo.id, title: response[i].devices[d].meterInfo.name });

                const tempKey = response[i].devices[d].meterInfo.id;

                graphsData[tempKey] = response[i].devices[d].dailyConsumption;

                renderScenes[tempKey] = renderMetersUsage;

              }

              setRoutes(meterDetailsForTabs);

              setRenderScene(true);

            }

            setHubData(response);

          } else {
            Alert.alert("Error","Unable to load User data, please check internet connection.");
          }
        });
      };

      // if(isFocused === true)

      loadAllCentralHub();

        let timerFunc = setInterval(()=>loadAllCentralHub(), 60000);

        return () => {
          clearTimeout(timerFunc);
        };

    } catch(e) {

    }

  }, [isFocused]);



  const meterSwitch = () => {
  }

  const getMeterIndicators = (data) => {

    const indicatorsList = [];

    if(data.meterInfo.type === "GAS_METER"){
      if(data.indicatorStateEntity !== null){
        if(data.indicatorStateEntity.gasLeakage === true){
          indicatorsList.push(<BlinkView style={{marginLeft:15, marginBottom:10}} blinking={true} delay={1000}><Image style={{ resizeMode: "stretch", height: 40}} source={images.gasLeakage} /></BlinkView>);
        }else{
          indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10 }} source={images.noGasLeakage} />);
        }
      }else{
        indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10 }} source={images.noGasLeakage} />);
      }
    }

    if(data.meterInfo.type === "ELECTRICITY_METER"){
      if(data.indicatorStateEntity !== null){ 
        if(data.indicatorStateEntity.systemActive === false){
          indicatorsList.push(<BlinkView style={{marginLeft:15, marginBottom:10}} blinking={true} delay={1000}><Image style={{ resizeMode: "stretch", height: 40, }} source={images.shortCircuit} /></BlinkView>);
        }else{
          indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10 }} source={images.noShortCircuit} />);
        }
      }else{
        indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10 }} source={images.noShortCircuit} />);
      }
    }

    if(data.meterInfo.type === "WATER_METER"){
      if(data.indicatorStateEntity !== null){
        if(data.indicatorStateEntity.waterLeakage === true){
          indicatorsList.push(<BlinkView style={{marginLeft:15, marginBottom:10}} blinking={true} delay={1000}><Image style={{ resizeMode: "stretch", height: 40, }} source={images.waterLeakage} /></BlinkView>);
        }else{
          indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10}} source={images.noWaterLeakage} />);
        }
      }else{
        indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15, marginBottom:10}} source={images.noWaterLeakage} />);
      }
    }

    let planLimit = 0;
    let planUsed = 0;
    let totalUsagePer = 0;

    if(data.plan != null){
    
      planLimit = data.plan.totalUnit;
    
      planUsed = data.plan.consumption;

      planUsed = planUsed > planLimit ? planLimit : planUsed;

      totalUsagePer = ((planUsed/planLimit)*100);

      totalUsagePer = totalUsagePer > 100 ? 100 : totalUsagePer;

    }

    if(totalUsagePer >= 90){
      indicatorsList.push(<BlinkView style={{marginLeft:15}} blinking={true} delay={1000}><Image style={{ resizeMode: "stretch", height: 40, }} source={images.resTh} /></BlinkView>);
    }else{
      indicatorsList.push(<Image style={{ resizeMode: "stretch", height: 40, marginLeft:15}} source={images.noResTh} />);
    }

    return indicatorsList;
  }

  const measureView = (event) => {
    setBlocksWidth(event.nativeEvent.layout.width);
  }

  const renderMeters = (data) => {

    const metersList = [];

    const meterTypes = ["WATER_METER", "GAS_METER", "ELECTRICITY_METER"];
    const meterTypesNames = ["Water", "Gas", "Electricity"];

    const totalDevices = (data[0].devices.length > 3 ? 3 : data[0].devices.length);

      for (let i=0; i < totalDevices; i++) {

        let planLimit = 0;
        let planUsed = 0;
        let totalUsage = 0;

        if(data[0].devices[i].plan != null){
          planLimit = data[0].devices[i].plan.totalUnit;
          planUsed = data[0].devices[i].plan.consumption;

          planUsed = planUsed > planLimit ? planLimit : planUsed;

          totalUsage = Math.round(((planUsed/planLimit)*100));
          totalUsage = totalUsage > 100 ? 100 : totalUsage;
        }

        let getType = meterTypes.indexOf(data[0].devices[i].meterInfo.type);

        if(getType > -1){
          getType = meterTypesNames[getType];
        }

        let _id = data[0].devices[i].meterInfo.id + "_" + i;

        metersList.push(
        <View key={_id} style={styles.subBlockMainView} onLayout={(event) => measureView(event)}>
          <View key={i}>
            <RNSpeedometer 
              key={data[0].devices[i].meterInfo.id}
              labels={[
                {
                  labelColor: '#48abdb',
                  activeBarColor: '#48abdb',
                },
                {
                  labelColor: '#48abdb',
                  activeBarColor: '#48abdb',
                },
                {
                  labelColor: '#48abdb',
                  activeBarColor: '#48abdb',
                },
                {
                  labelColor: '#ff2900',
                  activeBarColor: '#ff2900',
                },
              ]}
              innerCircleStyle = {{
                backgroundColor: '#151833'
              }}
              labelStyle = {{display: 'none'}}
              value={planUsed}
              minValue = {0}
              allowedDecimals={0}
              maxValue = {planLimit}
              size={screenWidth - 20} 
            />
          </View>

          <View>
            <Text style={styles.subText}>{totalUsage}% Consumed</Text>
          </View>

          <View style={[styles.subMainView, {borderBottomWidth:2, marginTop:0, borderBottomColor:'#40467d'}]}>
            {getMeterIndicators(data[0].devices[i])}
          </View>

          <View style={[styles.subMainView, {borderBottomWidth:1, marginTop:10, borderBottomColor:'#40467d'}]}>
            <Text style={[styles.subMText,styles.subMLText, {marginTop:0}]}> Utility Power Switch </Text>
            <Switch
              trackColor={{ false: "#DDD", true: "#05bd05" }}
              thumbColor={"#34B6FF"}
              style={styles.btSwitch}
              ios_backgroundColor="#3e3e3e"
              value={data[0].devices[i].meterInfo.status}
            />
          </View>

          <View style={[styles.subMainView, {borderBottomWidth:2, marginTop:0, borderBottomColor:'#40467d'}]}>
            <Text style={[styles.subMText,styles.subMLText]}> Meter Name : </Text>
            <Text style={[styles.subMText,styles.subMRText, {flex:2}]}> {data[0].devices[i].meterInfo.name} </Text>
          </View>

          <View style={[styles.subMainView, {borderBottomWidth:2, marginTop:0, borderBottomColor:'#40467d', marginBottom:5}]}>
            <Text style={[styles.subMText,styles.subMLText]}> Meter Utility Type : </Text>
            <Text style={[styles.subMText,styles.subMRText, {flex:2}]}> {getType} </Text>
          </View>
        
        </View>);

      }
    return metersList;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainView}>
        
        {hubData && renderMeters(hubData)}

        {renderScene && <TabView
          style={{flexBasis: '50%'}} 
          navigationState={{ index, routes }}
          renderScene={SceneMap(renderScenes)}
          renderTabBar={customTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
      />}

      </View>

    </View>
  );
};
export default Dashboard;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151833'
  },
  mainView: {
    margin:5,
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subBlockMainView: {
    flexBasis: '50%',
  },
  subMainView: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin:5,
    marginTop: 10,
  },
  subMText: {
    fontSize: 18,
    marginTop:10,
    marginBottom:10,
    fontFamily: fontFamily.Nunito_Regular,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
    flexDirection: "row",
    flex: 2,
  },
  subMLText: {
    textAlign: 'left',
  },
  subMRText: {
    textAlign: 'right',
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    padding: 16,
    marginRight:2,
    fontWeight: 'bold',
    alignItems: 'center',
    backgroundColor:'#44b5fc',
  },
  tabItemText: {
    color: '#161832',
    fontSize:17,
    fontWeight: 'bold',
  },
  cardView: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    resizeMode: 'center',
  },
  priceText: {
    fontSize: 30,
    fontFamily: fontFamily.Nunito_Bold,
    color: '#A884FF',
    textAlign: 'center',
    marginBottom: 17,
  },
  titleText: {
    fontSize: 16,
    fontFamily: fontFamily.Nunito_Regular,
    color: '#707070',
    textAlign: 'center',
  },
  sliderCard: {
    padding: 20,
    borderRadius: 30,
    // width: ITEM_WIDTH,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imgView: {
    width: 50,
    height: 50,
    // backgroundColor: '#A884FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatSliderView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  listCard: {
    marginLeft: 10,
    marginRight: 10,
  },
  btnView: {
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 30,
  },

  commonBtn: {
    elevation: 5,
    height: 50,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signUpText: {
    fontFamily: fontFamily.Nunito_Regular,
    fontSize: 16,
    color: '#fff',
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor : '#4c4e61',
    borderRadius:50,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
  },
  arrowImageStyle: {
    resizeMode: 'contain',
    height: '65%',
  },
  subText: {
    fontSize: 18,
    marginTop:10,
    fontFamily: fontFamily.Nunito_Regular,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
  },
});