import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs, Col, Row, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import Store from 'electron-store';
import CodeEditor from './CodeEditor';
import { setPreloadScript } from '../slices/editorSlice';
import { ipcRendererManager, useIpcRendererListener } from '../ipc';
import { IpcEvents } from '../../ipcEvents';
import { getAtJsPath, setAtJsPath } from '../util';
import './CodePane.css';

const { TabPane } = Tabs;

const defaultScript = `// Called whenever DOM content for each frame has been loaded
function onReady({ url }) {
  console.log(\`onReady( "\${ url }" )\`);
  
}
`;

const suffixScript = `
if (document.readyState === "complete" 
   || document.readyState === "loaded" 
   || document.readyState === "interactive") {
  if (onReady) onReady({url: window.location.href});
}
else {
  window.addEventListener('DOMContentLoaded', (event) => {
    if (onReady) onReady({url: window.location.href});
  });  
}
`;

const useSavedScript = () => {
  const [script, setScript] = useState('');
  useEffect(() => {
    (async function () {
      let value = await ipcRendererManager.invoke(
        IpcEvents.GET_STORE_VALUE,
        'cache.indexjs'
      );
      if (value == null || value.length === 0) {
        value = defaultScript;
      }
      setScript(value);
    })();
  }, []);
  return [script];
};

export default function () {
  const editorRef = useRef();
  const dispatch = useDispatch();
  const [monacoOptions, setMonacoOptions] = useState({
    minimap: {
      enabled: false,
    },
    wordWrap: 'on',
  });
  const [isDirty, setDirty] = useState(false);
  const [script] = useSavedScript();

  useIpcRendererListener(IpcEvents.MONACO_TOGGLE_OPTION, (cmd) => {
    toggleEditorOption(cmd);
  });

  useIpcRendererListener(IpcEvents.SELECT_ALL_IN_EDITOR, () => {
    if (editorRef.current?.hasTextFocus()) {
      editorRef.current?.selectAllTexts();
    }
  });

  useEffect(() => {
    if (!script) return;
    setTimeout(() => {
      editorRef.current?.setValue(script);
    }, 0);
  }, [script]);

  const onSave = async () => {
    const value = editorRef.current?.getValue();
    const scriptValue = `${value};${suffixScript}`;
    dispatch(setPreloadScript(scriptValue));

    await ipcRendererManager.invoke(
      IpcEvents.SET_STORE_VALUE,
      'cache.indexjs',
      value
    );

    setDirty(false);
  };

  const handleChange = (value) => {
    setDirty(true);
  };

  const toggleEditorOption = (path) => {
    try {
      const newOptions = { ...monacoOptions };
      const currentSetting = getAtJsPath(path, newOptions);

      setAtJsPath(path, newOptions, toggleMonaco(currentSetting));
      setMonacoOptions(newOptions);

      return true;
    } catch (error) {
      console.warn(`Editors: Could not toggle property ${path}`, error);

      return false;
    }
  };

  const toggleMonaco = (input) => {
    if (input === 'off') return 'on';
    if (input === 'on') return 'off';

    return !input;
  };

  return (
    <>
      <div style={{ height: '34px' }}>
        <Row
          style={{
            background: '#e8e8e8',
          }}
        >
          <Col flex="100px" style={{ padding: 1 }}>
            <Button
              type="text"
              icon={<SaveOutlined />}
              size="middle"
              style={{ color: '#525252', fontWeight: 'normal' }}
              onClick={onSave}
              disabled={!isDirty}
            >
              Save
            </Button>
          </Col>
          <Col flex="auto"></Col>
        </Row>
      </div>
      <div
        className="code-pane"
        style={{ height: '100%', paddingBottom: '34px', background: '#f2f2f2' }}
      >
        <Tabs defaultActiveKey="1" style={{ height: '100%' }} type="card">
          <TabPane tab="index.js" key="1">
            <CodeEditor
              ref={editorRef}
              monacoOptions={monacoOptions}
              onChange={handleChange}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
