import React from 'react';
import {Button, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          title={'1. IntroSlider'}
          onPress={() => navigation.navigate('IntroSlider')}
        />
        <Button
          title={'2. UseCallBackScreen'}
          onPress={() => navigation.navigate('UseCallBackScreen')}
        />
        <Button
          title={'3. Lottery Ticket Animation'}
          onPress={() => navigation.navigate('LotteryTicketAnimationScreen')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
