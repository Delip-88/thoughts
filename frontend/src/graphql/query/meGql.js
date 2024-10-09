import { gql } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
        username
        email
        posts {
            _id
            title
            content
            tags
            createdAt
            likes {
                _id
                username
            }
        }
        _id
        createdAt
    }
  }
`;

export default ME_QUERY;
