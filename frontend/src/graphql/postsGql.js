import { gql } from "@apollo/client";

const FETCH_POSTS = gql`
  query FETCH_POSTS {
    posts {
      _id
      title
      content
      tags
      image{
        public_id
        secure_url
      }
      createdAt
      author {
        username
      }
    }
  }
`;

export default FETCH_POSTS;
