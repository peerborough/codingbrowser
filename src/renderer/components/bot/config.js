import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'CodingBrowser';

const config = {
  initialMessages: [
    createChatBotMessage(`Start a blank application. See the source code. 🙂`),
  ],
  botName: botName,
  customComponents: {
    header: () => <></>,
  },
};

export default config;
