import React, {useState, useEffect} from 'react';
import Home from '../screens/Home';
import Journal from '../screens/Journal';
import Explore from '../screens/Explore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Player from '../comp/Player';
import PlanInfo from '../screens/PlanInfo';
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
} from '@react-navigation/stack';
import R from '../res/R';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SignIn from '../screens/SignIn';
import {StyleSheet} from 'react-native';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={Home} />
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
              config: {duration: 3},
            },
            close: {
              animation: 'timing',
              config: {duration: 3},
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
        name="Premium"
        component={Premium}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
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
      <Stack.Screen
        name="SignIn"
        component={SignIn}
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
      activeColor={R.colors.primary}
      inactiveColor="darkgrey"
      barStyle={hideTab ? styles.hide : styles.show}
      backBehavior="initialRoute">
      <Tab.Screen
        name="Home"
        component={HomeStack}
        listeners={({route}) => {
          route.state?.index === 0 ? setfocus(true) : setfocus(false);

          route.state?.index === 1 && setHide(true);
        }}
        options={{
          tabBarLabel: R.locale.home,
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="home" color={color} size={hp(3)} />
          ),
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
          tabBarLabel: R.locale.explore,
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="search" color={color} size={hp(2.6)} />
          ),
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
          tabBarLabel: R.locale.journal,
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="book" color={color} size={hp(2.6)} />
          ),
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
          tabBarLabel: R.locale.settings,
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="cog" color={color} size={hp(2.6)} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;

const styles = StyleSheet.create({
  hide: {opacity: 0, height: 0, backgroundColor: R.colors.background},
  show: {backgroundColor: R.colors.background, elevation: 10},
});
