import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import AppPage from './AppPage';
import './App.css';
import 'allotment/dist/style.css';
import 'antd/dist/antd.css';
import 'react-chatbot-kit/build/main.css';
import '@vscode/codicons/dist/codicon.css';

loader.config({ monaco });

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
