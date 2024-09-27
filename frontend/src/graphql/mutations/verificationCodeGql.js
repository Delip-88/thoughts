import { gql } from "@apollo/client";

const VERIFICATION_CODE= gql`
mutation verfyuser($email: String!,$code: String!){
  verifyUser(email: $email,code: $code){
    token,
    user{
        username,
        email
    }
  }
}
`

export default VERIFICATION_CODE