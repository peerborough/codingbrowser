import {
  Box,
  Flex,
  HStack,
  Select,
  IconButton,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { GrPlay } from 'react-icons/gr';
import CodeEditor from './CodeEditor';

export default function () {
  return (
    <Flex flex={1} flexDirection="column">
      <CodeEditorToolbar />
      <CodeEditor />
    </Flex>
  );
}

function CodeEditorToolbar() {
  return (
    <HStack bg="blackAlpha.100" p={1} spacing={5}>
      <Select placeholder="Add Event Handler" size="sm" bg="white">
        <option value="option1">OnWillNavigate</option>
        <option value="option2">OnDOMReady</option>
        <option value="option3">OnDOMChange</option>
      </Select>
      <Spacer />
      <Switch size="md" />
    </HStack>
  );
}
