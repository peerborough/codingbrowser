import { useRef, useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useResizeObserver from 'use-resize-observer';
import { useCodeEditor } from './useCodeEditors';

export default function CodeEditor({ tabKey }) {
  const containerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [value, setValue] = useState(null);
  const { filepath, language, monacoOption, load, setDirty } = useCodeEditor({
    tabKey,
    ref: editor,
  });
  const { width, height } = useResizeObserver({
    ref: containerRef,
    round: Math.floor,
  });

  function handleEditorDidMount(editor, monaco) {
    setEditor(editor);
    load().then((value) => {
      if (value) {
        editor.setValue(value);
      }
    });
  }

  const handleChange = useCallback(
    (newValue) => {
      if (value !== null) {
        setDirty(true);
      }
      setValue(newValue);
    },
    [value]
  );

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
        path={filepath}
        defaultLanguage={language}
        options={monacoOption}
        value={value}
        onMount={handleEditorDidMount}
        onChange={handleChange}
      />
    </div>
  );
}
