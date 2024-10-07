export const typeDefs = `#graphql
    type User {
        _id: ID! 
        username: String!   # Non-nullable username
        email: String!      # Non-nullable email
        password: String!   # Non-nullable password
        posts: [Post!]!     # Non-nullable array of non-nullable posts
        verified: Boolean!  # Non-nullable verified field
        verificationToken: String
        verificationTokenExpiresAt: String
        createdAt: String
    }

    type AuthPayload{
        token: String!
        user: User!
    }
    type Post{
        _id: ID!
        title: String!
        content: String!
        tags: [String!]!
        author:User!
        likes: [User!]     # likes by userId
        createdAt: String
        image: Image
    }
    type Image{
        public_id: String
        secure_url: String
        asset_id: String
        version: Int
        format: String
        width: Int
        height: Int
        created_at: String       

    }
    type Query{
        users: [User!]
        user(id: ID!): User 
        posts: [Post!]
        post(id: ID!): Post
        checkAuth(id: ID!): User
        me: User
    }
    type Mutation{
        addUser(user: userInput!): User
        deleteUser(id: ID!): Response!
        addPost(post: postInput!): Response!
        deletePost(id: ID!): Response!
        updateUser(user: updateUser!): User
        updatePost(post: updatePost!): Post
        login(usernameoremail: String!, password: String!): AuthPayload!
        logout: Response!
        register(user: userInput!): Response!
        verifyUser(email: String!,code: String!):AuthPayload!
        resendCode(email: String!): Response!
        passwordReset(email: String!): Response!
        newPassword(token: String!, password: String!): Response!
        getUploadSignature(tags: [String]!,upload_preset: String!, uploadFolder: String!): Signature!
        getDeleteSignature(publicId: String!): Signature!
    }
    type Signature{
        timestamp: Int!
        signature: String!
    }
    type Response{
        message: String!
        success: Boolean!
    }
    input userInput{
        username: String!
        password: String!
        email: String!
    }
    input postInput{
        authorId: ID!
        title: String!
        content: String!
        tags: [String!]!
        image: ImageInput
    }
    input ImageInput{
        public_id: String
        secure_url: String
        asset_id: String
        version: Int
        format: String
        width: Int
        height: Int
        created_at: String       

    }
    input updateUser{
        id: ID!
        email: String!
        username: String!
        password: String!
    }
    input updatePost{
        id: ID!
        title: String!
        content: String!
    }

`;
