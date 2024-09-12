const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const { json } = require('body-parser');
const { error } = require('console');

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { user, message } = authMiddleware({ req });
    
    if(message) {
      console.log('Apollo Server Error:', error);
    }

    return { user, error };
    
  },
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', async () => {
  await startApolloServer();
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
