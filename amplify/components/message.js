import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';

const Messages = ({ tenantId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const query = `
        query ListMessages {
          listMessages(filter: { tenantId: { eq: "${tenantId}" } }) {
            items {
              content
              createdAt
            }
          }
        }
      `;
      try {
        const result = await API.graphql({ query });
        setMessages(result.data.listMessages.items);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    fetchMessages();
  }, [tenantId]);

  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.createdAt}>{msg.content}</li>
      ))}
    </ul>
  );
};

export default Messages;
