import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'CodingBrowser';

const config = {
  initialMessages: [
    createChatBotMessage(`The application has been started 🙂`),
  ],
  botName: botName,
  customComponents: {
    header: () => <></>,
  },
};

export default config;
