// @flow
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation ConnectProjectMutation($input: ConnectProjectInput!) {
        connectProject(input: $input)
    }
`)
