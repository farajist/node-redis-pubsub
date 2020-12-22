const { config } = require('dotenv');
const { ApolloServer } = require('apollo-server');

config();

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const validateToken = (authToken) => {
    return authToken === process.env.AUTH_TOKEN; 
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            if (connectionParams.authToken) {
                const valid = validateToken(connectionParams.authToken);
                if (valid) return { "message": "Weclome" };
                else throw Error('Invalid credentials');
            }
            throw new Error('Not authorized!');
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})