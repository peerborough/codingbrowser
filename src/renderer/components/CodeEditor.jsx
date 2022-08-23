import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';
import useResizeObserver from 'use-resize-observer';

function CodeEditor({ monacoOptions, onChange }, ref) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const { width, height } = useResizeObserver({
    ref: containerRef,
    round: Math.floor,
  });

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue();
    },
    setValue: (value) => {
      editorRef.current?.setValue(value);
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
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
      ref={containerRef}
    >
      <Editor
        width={width}
        height={height}
        defaultLanguage="javascript"
        options={monacoOptions}
        onMount={handleEditorDidMount}
        onChange={onChange}
      />
    </div>
  );
}

export default forwardRef(CodeEditor);
