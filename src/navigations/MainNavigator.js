import React, {useState, useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Home from '../screens/Home';
import Journal from '../screens/Journal';
import Sleep from '../screens/Sleep';
import Explore from '../screens/Explore';
import {Icon} from 'react-native-elements';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Player from '../comp/Player';
import PlanInfo from '../screens/PlanInfo';
import {set} from 'react-native-reanimated';
import ExploreList from '../screens/ExploreList';
import ExploreFList from '../screens/ExploreFlist';
import DailyLog from '../screens/DailyLog';
import Analytics from '../screens/Analytics';
import Rewards from '../screens/Rewards';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Premium from '../screens/Premium';
import Settings from '../screens/Settings';
import ChangePref from '../screens/ChangePref';
import Terms from '../screens/Terms';
import Privacy from '../screens/Privacy';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={Home} options={{}} />
      <Stack.Screen
        name="Plan"
        component={PlanInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Player"
        component={Player}
        options={{
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {duration: 0},
            },
            close: {
              animation: 'timing',
              config: {duration: 0},
            },
          },
        }}
      />
      <Stack.Screen
        name="Premium"
        component={Premium}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const ExploreStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Explore" component={Explore} options={{}} />
      <Stack.Screen
        name="Plan"
        component={PlanInfo}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="Player"
        component={Player}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
      <Stack.Screen
        name="ExploreList"
        component={ExploreList}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="ExploreFList"
        component={ExploreFList}
        initialParams={{type: 'explore'}}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Premium"
        component={Premium}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const SleepStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sleep"
        component={Sleep}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Plan"
        component={PlanInfo}
        initialParams={{type: 'sleep'}}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Player"
        component={Player}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      {/* <Stack.Screen
        name="ExploreList"
        component={ExploreList}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      /> */}
      <Stack.Screen
        name="ExploreFList"
        initialParams={{type: 'sleep'}}
        component={ExploreFList}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const JournalStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Journal" component={Journal} />
      <Stack.Screen
        name="DailyLog"
        component={DailyLog}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Rewards"
        component={Rewards}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePref"
        component={ChangePref}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Premium"
        component={Premium}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();

const MainNavigator = () => {
  const [hideTab, setHide] = useState(false);
  const [focused, setfocus] = useState(true);

  useEffect(() => {
    focused &&
      setTimeout(() => {
        setHide(false);
      }, 400);
  }, [focused]);
  return (
    <Tab.Navigator
      sceneAnimationEnabled={false}
      activeColor="orange"
      inactiveColor="darkgrey"
      barStyle={
        hideTab
          ? {opacity: 0, height: 0, backgroundColor: '#fff'}
          : {backgroundColor: '#fff'}
      }>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);
        }}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="home" color={color} size={20} />
          ),
          tabBarColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);
        }}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="search" color={color} size={20} />
          ),
          tabBarColor: '#fff',
        }}
      />
      {/* <Tab.Screen
        name="Sleep"
        component={SleepStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);

          // return {
          //   focus: () => {
          //     setsleep(true);
          //   },
          //   blur: () => {
          //     setsleep(false);
          //   },
          // };
        }}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon
              name="moon"
              type="fontawesome"
              color={color}
              size={20}
            />
          ),
          tabBarColor: '#131953',
        }}
      /> */}
      <Tab.Screen
        name="Journal"
        component={JournalStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);
        }}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="book" color={color} size={20} />
          ),
          tabBarColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);
        }}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="cog" color={color} size={20} />
          ),
          tabBarColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;
