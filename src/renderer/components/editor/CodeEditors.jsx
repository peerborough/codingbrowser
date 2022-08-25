import Toolbar from './Toolbar';
import CodeEditorTabs from './CodeEditorTabs';
import { CodeEditorsProvider, useCodeEditors } from './useCodeEditors';
import './CodeEditors.css';

export default function CodeEditors() {
  const context = useCodeEditors();

  return (
    <CodeEditorsProvider value={context}>
      <Toolbar />
      <CodeEditorTabs />
    </CodeEditorsProvider>
  );
}
