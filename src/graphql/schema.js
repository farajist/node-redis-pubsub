const { gql } = require('apollo-server');
const typeDefs = gql`
    type Proxy {
        address: String
    }

    type Issue {
        key: String
    }

    input TaskInput {
        address: String
        key: String 
    }

    type Task {
        id: ID!
        proxy: Proxy
        issue: Issue
    }
    
    type Query {
        _dummy: String
    }

    type Mutation {
        createTask(taskInput: TaskInput): Task
    }

    type Subscription {
        taskSubmitted: Task
    }
`

module.exports = typeDefs