const { gql } = require('apollo-server-express');
const User = require('./User');
const Book = require('./book');

const typeDefs = gql
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }
    
    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Query {
        me: User
        user(id: ID!): User
  }

  type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(bookId: String!): User
        removeBook(bookId: String!): User
  }

  type Auth {
        token: String
        user: User
  }
;

module.exports = { typeDefs, resolvers };
