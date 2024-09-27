import { gql } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      _id
      email
      username
      createdAt
    }
  }
`;

export default ME_QUERY;
