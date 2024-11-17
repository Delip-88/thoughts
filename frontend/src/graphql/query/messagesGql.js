import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($senderId: ID!, $receiverId: ID!) {
    getMessages(senderId: $senderId, receiverId: $receiverId) {
      _id
      senderId
      receiverId
      content
      isRead
      createdAt
    }
  }
`;
