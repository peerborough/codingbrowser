import {
  HStack,
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiTwotoneLock,
  AiOutlineSearch,
} from 'react-icons/ai';

export default function () {
  return (
    <HStack p="1" spacing="0">
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Go back"
        icon={<AiOutlineArrowLeft />}
      />
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Go forward"
        icon={<AiOutlineArrowRight />}
      />
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Reload this page"
        icon={<AiOutlineReload />}
      />
      <InputGroup size="sm">
        <InputLeftElement
          pointerEvents="none"
          children={<AiOutlineSearch color="grey" />}
        />
        <Input variant="outline" placeholder="Search or enter web address" />
      </InputGroup>
    </HStack>
  );
}
