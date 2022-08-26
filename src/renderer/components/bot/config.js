import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'CodingBrowser';

const config = {
  initialMessages: [createChatBotMessage(`Press the Start button 🙂`)],
  botName: botName,
  customComponents: {
    header: () => <></>,
  },
};

export default config;
