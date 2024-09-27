import { gql } from "@apollo/client"

const NEW_PASSWORD = gql`
mutation resetrequest($token : String!, $password: String!){
  newPassword(token: $token, password: $password){
    message,
    success
  }
}

`

export default NEW_PASSWORD