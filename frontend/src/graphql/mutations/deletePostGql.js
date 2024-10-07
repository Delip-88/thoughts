import { gql } from "@apollo/client";

const DELETE_POST_BY_ID = gql`
    mutation deletePost($id: ID!){
        deletePost(id: $id){
            message
            success
        }
    }

`
export default DELETE_POST_BY_ID