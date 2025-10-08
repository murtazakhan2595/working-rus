import React, { useEffect } from 'react';

const ChatbrixWidget = () => {
  useEffect(() => {
    // Configure Chatbrix Widget
    window.ChatbrixConfig = {
      apiKey: '9CtpfNfbgZvSyRo1gMPHB1T6m3Uqb1c9',
      botId: '26e29a60-24ff-402a-b2d5-8208e015d0e1',
      theme: 'light'
    };

    // Load Chatbrix Widget
    const script = document.createElement('script');
    script.src = 'https://chatbrix.cohrus.com/widget/chatbrix-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const widget = document.getElementById('chatbrix-widget');
      if (widget) widget.remove();
    };
  }, []);

  return null; // Widget renders itself
};

export default ChatbrixWidget;