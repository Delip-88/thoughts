import { gql } from "@apollo/client";

const CREATE_POST = gql`
mutation addPost($post: postInput!) {
  addPost(post: $post) {
    message
    success
  }
}
`

export default CREATE_POST