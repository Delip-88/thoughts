import { gql } from "@apollo/client";

const LOGOUT_USER = gql`
mutation logout{
    logout{
        message
        success
    }
}
`

export default LOGOUT_USER