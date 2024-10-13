import { gql } from "@apollo/client";

export const GET_UPLOAD_SIGNATURE = gql`
    mutation getUploadSignature($tags: [String],$upload_preset: String!, $uploadFolder: String!){
        getUploadSignature(tags: $tags, upload_preset: $upload_preset,uploadFolder: $uploadFolder){
            timestamp
            signature
        }
    }

`

export const GET_DELETE_SIGNATURE = gql `
    mutation getDeleteSignature($publicId: String!){
        getDeleteSignature(publicId: $publicId){
            timestamp
            signature
        }
    }
`