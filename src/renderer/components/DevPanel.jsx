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
import CodeEditor from './CodeEditor';

export default function () {
  return (
    <Tabs size="sm">
      <TabList overflowX="auto">
        <Tab>Code</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CodeEditor />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
