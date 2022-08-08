import { useState, useEffect } from 'react';
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

export default function ({
  searchValue,
  iconState,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
}) {
  const [_searchValue, _setSearchValue] = useState('');
  const handleSearchValueChange = (event) =>
    _setSearchValue(event.target.value);

  useEffect(() => {
    _setSearchValue(searchValue);
  }, [searchValue]);

  return (
    <HStack p="1" spacing="0">
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Go back"
        icon={
          <AiOutlineArrowLeft
            color={iconState.canGoBack ? 'black' : 'lightgray'}
          />
        }
        onClick={onGoBack}
      />
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Go forward"
        icon={
          <AiOutlineArrowRight
            color={iconState.canGoForward ? 'black' : 'lightgray'}
          />
        }
        cursor="pointer"
        onClick={onGoForward}
      />
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label="Reload this page"
        icon={<AiOutlineReload />}
        onClick={onReload}
      />
      <InputGroup size="sm">
        <InputLeftElement
          pointerEvents="none"
          children={<AiOutlineSearch color="grey" />}
        />
        <Input
          variant="outline"
          placeholder="Search or enter web address"
          value={_searchValue}
          onChange={handleSearchValueChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (onNavigate) onNavigate(getUrl(_searchValue));
            }
          }}
        />
      </InputGroup>
    </HStack>
  );
}

function getUrl(value) {
  if (!value) return null;
  const protocols = ['http://', 'https://', 'file://', 'app://'];
  const isProtocol = protocols.find((protocol) => value.startsWith(protocol));
  return isProtocol
    ? value
    : `https://www.google.com/search?q=${encodeURI(value)}`;
}
