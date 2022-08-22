import {
  forwardRef,
  useRef,
  useState,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import Editor from '@monaco-editor/react';
import useResizeObserver from '@react-hook/resize-observer';

const useSize = (target) => {
  const [size, setSize] = useState(0);

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

function CodeEditor({ defaultScript, monacoOptions }, ref) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

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
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
      ref={containerRef}
    >
      <Editor
        width={containerSize.width}
        height={containerSize.height}
        defaultLanguage="javascript"
        defaultValue={defaultScript}
        options={monacoOptions}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default forwardRef(CodeEditor);
