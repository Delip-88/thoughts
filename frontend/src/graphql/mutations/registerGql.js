import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation Register($user: userInput!) {
  register(user: $user) {
    message,
    success
  }
}
`;

export default REGISTER_USER;
