import { gql } from "@apollo/client";

export const FETCH_POSTS = gql`
  query FETCH_POSTS($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      _id
      title
      content
      category
      tags
      likes {
        _id
      }
      comments {
        _id
      }
      image {
        public_id
        secure_url
      }
      createdAt
      author {
        _id
        username
        image {
          public_id
          secure_url
        }
      }
    }
  }
`;

export const FETCH_POST_BY_ID = gql`
  query post($id: ID!) {
    post(id: $id) {
      _id
      title
      content
      category
      tags
      createdAt
      image {
        public_id
        secure_url
      }
      likes {
        _id
      }
      author {
        _id
        username
        image {
          public_id
          secure_url
        }
      }
    }
  }
`;
