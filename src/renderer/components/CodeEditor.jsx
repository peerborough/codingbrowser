import { forwardRef, useRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ defaultValue = '' }, ref) {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue();
    },
  }));

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue={defaultValue}
      options={{ minimap: { enabled: false } }}
      onMount={handleEditorDidMount}
    />
  );
}

export default forwardRef(CodeEditor);
