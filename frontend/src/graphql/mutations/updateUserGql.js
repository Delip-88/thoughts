import { gql } from "@apollo/client";

const UPDATE_USER_INFO = gql`
mutation updateUser($user: updateUser!){
    updateUser(user: $user){
        message
        success
    }
}
`

export default UPDATE_USER_INFO