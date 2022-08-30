import { useRef, useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useResizeObserver from 'use-resize-observer';
import { useCodeEditor } from './useCodeEditors';

export default function CodeEditor({ tabKey }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const versionRef = useRef(-1);
  const [mounted, setMounted] = useState(false);
  const {
    language,
    monacoOption,
    register,
    unregister,
    load,
    setDirty,
    isDifferentWithSavedValue,
  } = useCodeEditor({
    tabKey,
  });
  const { width, height } = useResizeObserver({
    ref: containerRef,
    round: Math.floor,
  });

  useEffect(() => {
    if (tabKey && mounted) {
      register(tabKey, editorRef.current);
    }

    return () => {
      unregister(tabKey);
    };
  }, [tabKey, mounted]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    setMounted(true);
    load().then((value) => {
      if (value) {
        editor.setValue(value);
      }
    });
  }

  const handleChange = async (newValue, event) => {
    const versionId = event.versionId;
    const pervVersionId = versionRef.current;

    versionRef.current = versionId;

    if (event.isUndoing || event.isRedoing) {
      const modified = await isDifferentWithSavedValue(newValue);
      setDirty(modified);
    } else if (versionId >= 3 && versionId !== pervVersionId) {
      setDirty(true);
    }
  };

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
        defaultLanguage={language}
        options={monacoOption}
        onMount={handleEditorDidMount}
        onChange={handleChange}
      />
    </div>
  );
}
