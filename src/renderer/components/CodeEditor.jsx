import Editor from '@monaco-editor/react';

export default function ({ defaultValue = '' }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue={defaultValue}
      options={{ minimap: { enabled: false } }}
    />
  );
}
