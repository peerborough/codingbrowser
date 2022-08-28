import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import AppPage from './AppPage';
import store from './store';
import './App.css';
import 'allotment/dist/style.css';
import 'antd/dist/antd.css';
import 'react-chatbot-kit/build/main.css';

loader.config({ monaco });

export default function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppPage />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}
