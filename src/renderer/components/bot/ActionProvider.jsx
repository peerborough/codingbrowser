import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {},
        });
      })}
    </>
  );
};

export default ActionProvider;
