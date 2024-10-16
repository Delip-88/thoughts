import { gql } from "@apollo/client";

export const ADD_LIKE = gql`
mutation likeOnPost($id: ID!){
    likeOnPost(id: $id){
        message
        success
    }
}
`
