const { config } = require('dotenv');
const consoleStamp = require('console-stamp');
const { ApolloServer } = require('apollo-server');

config();
consoleStamp(console, {});

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const validateSubToken = (authToken) => {
    return authToken === process.env.SUB_TOKEN; 
}

const validateAuthToken = (token) => {
    return token === process.env.AUTH_TOKEN;
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => {
        if (connection) {
            return connection.context
        }
        else {
            const token = req.headers.authorization || '';
            if (!validateAuthToken(token)) throw new Error('Not authorized !');
            return { 'message': 'Weclome' };
        }
    },
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            if (connectionParams.authToken) {
                const valid = validateSubToken(connectionParams.authToken);
                if (valid) return { 'message' : 'Weclome' };
                else throw Error('Invalid credentials');
            }
            throw new Error('Not authorized!');
        }
    }
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
})