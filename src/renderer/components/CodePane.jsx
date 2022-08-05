import {
  Box,
  HStack,
  Select,
  IconButton,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { AiOutlinePlaySquare } from 'react-icons/ai';
import { GrPlay } from 'react-icons/gr';

export default function () {
  return (
    <Box>
      <CodeEditorToolbar />
      <Box>editor</Box>
    </Box>
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
      <Switch size="md" ari />
    </HStack>
  );
}
