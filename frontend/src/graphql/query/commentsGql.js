import { gql } from "@apollo/client";

export const VIEW_POST_COMMENTS = gql`
query comment($postId: ID!) {
    comment(postId: $postId) {
        _id
        postId
        userId
        commentedBy {
            username
            image {
                public_id
                secure_url
            }
        }
        content
        createdAt
    }
}

`