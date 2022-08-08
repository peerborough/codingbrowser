import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  HStack,
  Spacer,
  Flex,
  Box,
} from '@chakra-ui/react';
import CodePane from './CodePane';
import NetworkPane from './NetworkPane';
import CodeEditor from './CodeEditor';

export default function () {
  return (
    <Tabs size="sm" display="flex" flex={1} flexDirection="column" h="full">
      <TabList>
        <Tab>Code</Tab>
        <Tab>Network</Tab>
      </TabList>
      <TabPanels display="flex" flex={1}>
        <TabPanel p={0} display="flex" flex={1}>
          <Flex flex={1}>
            <CodePane />
          </Flex>
        </TabPanel>
        <TabPanel p={0}></TabPanel>
      </TabPanels>
    </Tabs>
  );
}
