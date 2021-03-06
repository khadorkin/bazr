// external imports
import { GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import { connectionDefinitions, globalIdField } from 'graphql-relay'
// local imports
import { Fund, ProjectType, UserType } from '.'
import { nodeInterface } from '../interfaces'

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    interfaces: [nodeInterface],
    sqlTable: 'transactions',
    uniqueKey: 'id',
    fields: () => ({
        id: {
            ...globalIdField(),
            sqlDeps: ['id']
        },
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
        created_at: { type: new GraphQLNonNull(GraphQLString) },
        recipient: {
            type: new GraphQLNonNull(UserType),
            sqlJoin: (transactionTable, userTable) =>
                `${transactionTable}.recipientId = ${userTable}.id`
        },
        fund: {
            type: new GraphQLNonNull(Fund),
            sqlJoin: (transactionTable, fundTable) => `${transactionTable}.fund = ${fundTable}.id`
        },
        project: {
            type: new GraphQLNonNull(ProjectType),
            sqlJoin: (transactionTable, projectTable) =>
                `${transactionTable}.project = ${projectTable}.id`
        }
    })
})

export const { connectionType: TransactionConnection } = connectionDefinitions({
    nodeType: TransactionType
})
