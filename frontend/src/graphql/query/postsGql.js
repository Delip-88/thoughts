import { gql } from "@apollo/client";

const FETCH_POSTS = gql`
  query FETCH_POSTS {
    posts {
      _id
      title
      content
      tags
      likes{
        _id
      }
      image{
        public_id
        secure_url
      }
      createdAt
      author {
        username
        image{
          public_id
          secure_url
        }
      }
    }
  }
`;

export default FETCH_POSTS;
