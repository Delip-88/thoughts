import { gql } from "@apollo/client";

const FORGOT_PASSWORD = gql`
mutation passwordReset($email: String!){
  passwordReset(email: $email){
    message,
    success
  }
}
`

export default FORGOT_PASSWORD