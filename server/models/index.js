const { gql } = require('apollo-server-express');
const User = require('./User');
const Book = require('./book');

const typeDefs = gql`
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
`;

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (!context.user) {
          throw new Error('Not logged in');
        }
        return await User.findById(context.user._id);
      },
      user: async (parent, { id }) => {
        return await User.findById(id);
      },
    },

    Mutation: {
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },

      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new Error('Incorrect password');
        }
        const token = signToken(user);
        return { token, user };
      },

      saveBook: async (parent, { bookId }, context) => {
        if (!context.user) {
          throw new Error('Not logged in');
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      },
      
      removeBook: async (parent, { bookId }, context) => {
        if (!context.user) {
          throw new Error('Not logged in');
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      },
    },
  };

module.exports = { User, typeDefs, resolvers };
