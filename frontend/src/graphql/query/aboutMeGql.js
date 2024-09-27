import { gql } from "@apollo/client";

const ABOUT_ME = gql`
query searchuserbyid($id : ID!){
  user(id : $id){
    posts {
        _id
        title
        content
        createdAt
    }

  }
}
`

export default ABOUT_ME