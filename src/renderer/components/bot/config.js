import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'CodingBrowser';

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
  botName: botName,
  customComponents: {
    header: () => <></>,
  },
};

export default config;
