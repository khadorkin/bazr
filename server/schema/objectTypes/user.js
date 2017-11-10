// external imports
import { GraphQLObjectType, GraphQLString } from 'graphql'

export default new GraphQLObjectType({
    name: 'User',
    sqlTable: 'users', // the SQL table for this object type is called "accounts"
    uniqueKey: 'id', // id is different for every row
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: () => 'john jacob'
        }
    })
})
