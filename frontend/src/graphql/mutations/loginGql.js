import { gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation LoginUser($usernameoremail: String!, $password: String!) {
    login(usernameoremail: $usernameoremail, password: $password) {
      token,
      user {
        username
        email
      }
    }
  }
`;

export default LOGIN_USER;
