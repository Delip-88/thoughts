import { gql } from "@apollo/client";

const RESEND_CODE = gql`
mutation resendCode($email: String!){
    resendCode(email: $email){
        message,
        success
    }
}
`

export default RESEND_CODE