const TASK_SUBMITTED = 'TASK_SUBMITTED';
const pubsub = require('./pubsub');

const publishRandomTask = (topic, taskInput) => {
    const id = Math.floor(Math.random() * 1000) + 1;
    pubsub.publish(topic, { taskSubmitted: { id, proxy: { address: taskInput.address, }, issue: { key: taskInput.key } } })
    return { id, ...taskInput }
}
const resolvers = {
    Subscription: {
        taskSubmitted: {
            subscribe: () => pubsub.asyncIterator(TASK_SUBMITTED),
        }
    },

    Mutation: {
        createTask: (_, { taskInput }) => {
            return publishRandomTask(TASK_SUBMITTED, taskInput)
        }
    }
}

module.exports = resolvers;