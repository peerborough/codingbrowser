import { Divider, List, Typography } from 'antd';
import Chatbot from 'react-chatbot-kit';
import config from './bot/config';
import MessageParser from './bot/MessageParser';
import ActionProvider from './bot/ActionProvider';
import './OutputMessages.css';

export default function ({ messages }) {
  return (
    <div style={{ height: '100%' }}>
      <Chatbot
        config={config}
        botName={'CodingBrowser'}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}
