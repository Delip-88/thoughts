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
      success
      message
      comment {
        _id
        content
        createdAt
        commentedBy {
          _id
          username
          image {
            secure_url
          }
        }
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(commentId: $commentId, postId: $postId) {
      message
      success
    }
  }
`;
