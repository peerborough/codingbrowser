import { forwardRef, useRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ defaultScript }, ref) {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue();
    },
    hasTextFocus: () => {
      return editorRef.current?.hasTextFocus();
    },
    selectAllTexts: () => {
      const model = editorRef.current?.getModel();
      if (model) {
        editorRef.current?.setSelection(model.getFullModelRange());
      }
    },
  }));

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      defaultValue={defaultScript}
      options={{ minimap: { enabled: false } }}
      onMount={handleEditorDidMount}
    />
  );
}

export default forwardRef(CodeEditor);
