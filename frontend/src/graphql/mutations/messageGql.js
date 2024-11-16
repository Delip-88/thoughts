import { gql } from "@apollo/client";

// Fetch messages
export const GET_MESSAGES = gql`
  query GetMessages($senderId: ID!, $receiverId: ID!) {
    getMessages(senderId: $senderId, receiverId: $receiverId) {
      _id
      content
      senderId
      receiverId
      isRead
      createdAt
    }
  }
`;

// Send message
export const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(
      receiverId: $receiverId
      content: $content
    ) {
      _id
      senderId
      receiverId
      content
      isRead
      createdAt
    }
  }
`;

export const NEW_MESSAGE_SUBSCRIPTION = gql`
subscription NewMessage($receiverId: ID!) {
    newMessage(receiverId: $receiverId) {
        senderId
        receiverId
        content
        isRead
        createdAt
        _id
    }
}
`;

// Mark message as read
// export const MARK_MESSAGE_AS_READ = gql`
//   mutation MarkMessageAsRead($messageId: ID!) {
//     markMessageAsRead(messageId: $messageId)
//   }
// `;
