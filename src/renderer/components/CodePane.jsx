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
} from '@chakra-ui/react';
import { AiOutlinePlaySquare, AiFillSave } from 'react-icons/ai';
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

  const onSave = () => {
    const value = editorRef.current?.getValue();
    const scriptValue = `${value};${suffixScript}`;
    dispatch(setPreloadScript(scriptValue));
  };

  return (
    <Flex flex={1} flexDirection="column">
      <CodeEditorToolbar onSave={onSave} />
      <CodeEditor ref={editorRef} defaultScript={defaultScript} />
    </Flex>
  );
}

function CodeEditorToolbar({ onSave }) {
  return (
    <HStack p={0} spacing={5} mb={2}>
      <Spacer />
      <IconButton
        variant="ghost"
        aria-label="Save"
        size="sm"
        icon={<Icon as={AiFillSave} w={6} h={6} color="teal" />}
        onClick={onSave}
      />
    </HStack>
  );
}
