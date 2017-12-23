// external imports
import React from 'react'
import { graphql } from 'react-relay'
import { H1 } from 'quark-web'
// local imports
import { QueryRenderer } from '~/client/components'

const FundDetail = ({ match: { params: { address } } }) => (
    <QueryRenderer
        query={graphql`
            query FundDetailQuery($address: String!) {
                contract: fundContract(address: $address) {
                    address
                    fund {
                        name
                    }
                }
            }
        `}
        variables={{ address }}
        render={({ contract }) => (
            <React.Fragment>
                <H1>{contract.fund.name}</H1>
            </React.Fragment>
        )}
    />
)

export default FundDetail
