import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query getUserProfile($id: ID!) {
    user(id: $id) {
      _id
      username
      address
      bio
      image {
        public_id
        secure_url
      }
      posts {
        _id
        title
        content
        image {
          secure_url
          public_id
        }
        tags
        createdAt
        likes {
          _id
        }
      }
      createdAt
    }
  }
`;
