import { gql } from "@apollo/client";

export const ADD_LIKE = gql`
  mutation likeOnPost($id: ID!) {
    likeOnPost(id: $id) {
      message
      success
    }
  }
`;
export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $userId: ID!, $content: String!) {
    addComment(postId: $postId, userId: $userId, content: $content) {
      message
      success
    }
  }
`;

