import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Onboarding from '../screens/Onboarding';
import MainNavigator from './MainNavigator';
import Privacy from '../screens/Privacy';
import Terms from '../screens/Terms';
import Splash from '../screens/Splash';

const Stack = createStackNavigator();

const AppContainer = props => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Splash" component={Splash} options={{}} />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainNavigator}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppContainer;
