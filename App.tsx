/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {ethers} from 'ethers';
import {CallWithSyncFeeRequest, GelatoRelay} from '@gelatonetwork/relay-sdk';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [taskId, setTaskId] = useState<string>('No Task');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (taskId != 'No Task') {
      return;
    }

    const callWithSyncFee= async () => {
      const counter = '0x730615186326cF8f03E34a2B49ed0f43A38c0603';
      const abi = ['function increment()'];
      const RPC_URL = `https://eth-goerli.g.alchemy.com/v2/YOUR KEY`;
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const contract = new ethers.Contract(counter, abi, provider);
      const {data} = await contract.increment.populateTransaction();

      const relay = new GelatoRelay();

      const feeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

      const request: CallWithSyncFeeRequest = {
        chainId: 5n,
        target: counter,
        data: data,
        feeToken: feeToken,
        isRelayContext: true,
      };

      const response = await relay.callWithSyncFee(request);

      setTaskId(response.taskId);

      console.log(`https://api.gelato.digital/tasks/status/${response.taskId}`);
    };

    callWithSyncFee();
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="TaskId">
            <Text style={styles.highlight}> {taskId}</Text>
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
