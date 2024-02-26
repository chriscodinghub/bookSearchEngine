const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const auth = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client/build as static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Define Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Use the authMiddleware function to authenticate the request
    const user = auth.authMiddleware({ req });
    return { user };
  },
});

// Start the Apollo Server before applying middleware
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// Connect to the database and start the server
db.once('open', () => {
  // Call the function to start the Apollo Server
  startApolloServer();

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`GraphQL playground at http://localhost:${PORT}${server.graphqlPath}`);
  });
});