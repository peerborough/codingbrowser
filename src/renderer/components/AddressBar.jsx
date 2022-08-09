import { useState, useEffect, useRef } from 'react';
import {
  HStack,
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineReload,
  AiOutlineClose,
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
  onStop,
}) {
  const inputRef = useRef();
  const [_searchValue, _setSearchValue] = useState('');

  const handleSearchValueChange = (event) =>
    _setSearchValue(event.target.value);

  const handleFocused = () => {
    inputRef.current?.select();
  };

  useEffect(() => {
    _setSearchValue(searchValue);
  }, [searchValue]);

  return (
    <HStack p="1" spacing="0">
      <Tooltip label="Go back" openDelay={2000}>
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
      </Tooltip>
      <Tooltip label="Go forward" openDelay={2000}>
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
      </Tooltip>
      <Tooltip
        label={
          iconState.loading ? 'Stop loading this page' : 'Reload this page'
        }
        openDelay={2000}
      >
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="gray"
          aria-label={
            iconState.loading ? 'Stop loading this page' : 'Reload this page'
          }
          icon={iconState.loading ? <AiOutlineClose /> : <AiOutlineReload />}
          onClick={iconState.loading ? onStop : onReload}
        />
      </Tooltip>
      <InputGroup size="sm">
        <InputLeftElement
          pointerEvents="none"
          children={<AiOutlineSearch color="grey" />}
        />
        <Input
          ref={inputRef}
          variant="outline"
          placeholder="Search or enter web address"
          color="gray.600"
          value={_searchValue}
          onChange={handleSearchValueChange}
          onFocus={handleFocused}
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

  // url
  const protocols = ['http://', 'https://', 'file://', 'app://'];
  const isProtocol = protocols.find((protocol) => value.startsWith(protocol));
  if (isProtocol) {
    return value;
  }

  // domain name
  const domainPattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  if (domainPattern.test(value)) {
    return `http://${value}`;
  }

  // ip address
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(value)) {
    return `http://${value}`;
  }

  // Search keyword
  return `https://www.google.com/search?q=${encodeURI(value)}`;
}
