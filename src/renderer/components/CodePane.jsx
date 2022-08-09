import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  HStack,
  Select,
  Icon,
  IconButton,
  Spacer,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { VscDebugRerun } from 'react-icons/vsc';
import CodeEditor from './CodeEditor';
import { setPreloadScript } from '../slices/editorSlice';

const defaultScript = `function onPageReady() {
  // Write code to be called when document in the given page is loaded
  
}
`;

const suffixScript = `
window.addEventListener('DOMContentLoaded', (event) => {
  if (onPageReady) onPageReady();
});
`;

export default function () {
  const editorRef = useRef();
  const dispatch = useDispatch();

  const onRerun = () => {
    const value = editorRef.current?.getValue();
    const scriptValue = `${value};${suffixScript}`;
    dispatch(setPreloadScript(scriptValue));
  };

  return (
    <Tabs
      size="sm"
      display="flex"
      flex={1}
      flexDirection="column"
      variant="unstyled"
      h="full"
      w="full"
    >
      <TabList h="9" bg="blackAlpha.50">
        <HStack w="full" py={0}>
          <Tab _selected={{ color: 'gray.700', bg: 'white' }} h="full">
            index.js
          </Tab>
          <Spacer />
          <IconButton
            variant="ghost"
            aria-label="Rerun"
            size="sm"
            colorScheme="blackAlpha"
            icon={<Icon as={VscDebugRerun} w={5} h={5} color="teal" />}
            onClick={onRerun}
          />
          <Box>&nbsp;</Box>
        </HStack>
      </TabList>
      <TabPanels display="flex" flex={1}>
        <TabPanel p={0} display="flex" flex={1}>
          <Flex flex={1}>
            <CodeEditor ref={editorRef} defaultScript={defaultScript} />
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );

  return (
    <Flex flex={1} flexDirection="column">
      <CodeEditor ref={editorRef} defaultScript={defaultScript} />
    </Flex>
  );
}
