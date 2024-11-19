import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query Users {
    users {
      _id
      username
      image {
        secure_url
        public_id
      }
    }
  }
`;

export const USER_BY_ID = gql`
  query searchuserbyid($id: ID!) {
    user(id: $id) {
      _id
      username
      image {
        secure_url
        public_id
      }
    }
  }
`;
