import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import CodePane from './CodePane';
import NetworkPane from './NetworkPane';

export default function () {
  return (
    <Tabs size="sm">
      <TabList overflowX="auto">
        <Tab>Code</Tab>
        <Tab>Network</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <CodePane />
        </TabPanel>
        <TabPanel p={0}>
          <NetworkPane />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
