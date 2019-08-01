import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator, createAppContainer, withNavigationFocus, NavigationActions } from "react-navigation";

class FocusStateLabel extends React.Component {
  render() {
    return <Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>;
  }
}
const FocusStateLabelWrapper = withNavigationFocus(FocusStateLabel);

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        console.info('home willFocus', payload);
      }
    );
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        console.info('home didFocus', payload);
      }
    );
    this.willBlurSubscription = props.navigation.addListener(
      'willBlur',
      payload => {
        console.info('home willBlur', payload);
      }
    );
    this.didBlurSubscription = props.navigation.addListener(
      'didBlur',
      payload => {
        console.info('home didBlur', payload);
      }
    );
  }

  componentDidMount() {
    console.info('home componentDidMount');
  }

  componentWillUnmount() {
    console.info('home componentDidMount');
    this.didBlurSubscription.remove();
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
    this.willFocusSubscription.remove();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <FocusStateLabelWrapper />
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Push to Home"
          onPress={() => this.props.navigation.push('Home')}
        />
        <Button
          title="Action to Details"
          onPress={() => {
            const navigateAction = NavigationActions.navigate({
              routeName: 'Details',
            
              params: {},
            
              action: NavigationActions.back({ routeName: 'Home' }),
            });

            this.props.navigation.dispatch(navigateAction);
            
          }}
        />
      </View>
    );
  }
}



class DetailsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        console.info('Details willFocus', payload);
      }
    );
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        console.info('Details didFocus', payload);
      }
    );
    this.willBlurSubscription = props.navigation.addListener(
      'willBlur',
      payload => {
        console.info('Details willBlur', payload);
      }
    );
    this.didBlurSubscription = props.navigation.addListener(
      'didBlur',
      payload => {
        console.info('Details didBlur', payload);
      }
    );
  }

  componentDidMount() {
    console.info('Details componentDidMount');
  }

  componentWillUnmount() {
    console.info('Details componentWillUnmount');
    this.didBlurSubscription.remove();
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
    this.willFocusSubscription.remove();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}