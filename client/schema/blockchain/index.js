// external imports
import { GraphQLScalarType } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import BigNumber from 'bignumber.js'
import { Kind } from 'graphql/language'
// local imports
import { Fund } from '~/contracts'

export default makeExecutableSchema({
    typeDefs: `
        scalar BigNumber

        input DepositEtherInput {
            from: String!
            address: String!
            amount: BigNumber!
        }

        type FundContract {
            balance: BigNumber!
            address: String!
        }

        type Query {
            fundContract(address: String!): FundContract
        }

        type Mutation {
            depositEther(input: DepositEtherInput!): Boolean!
        }
    `,
    resolvers: {
        FundContract: {
            balance: ({ address }) =>
                new Promise((resolve, reject) =>
                    window.web3.eth.getBalance(address, (err, balance) => {
                        // if something went wrong
                        if (err) {
                            return reject(err)
                        }

                        // we're done compute the balance
                        return resolve(balance)
                    })
                )
        },
        Query: {
            fundContract: (_, { address }) => {
                // get the contract at the specified address
                return {
                    address
                }
            }
        },
        Mutation: {
            depositEther: (_, { input: { from: donor, address: fundAddress, amount } }) =>
                new Promise((resolve, reject) => {
                    // the acount of the user
                    const userAddress = window.web3.eth.accounts[0]
                    // the amount we are sending in wei
                    const transactionAmount = window.web3.toWei(amount, 'ether')

                    // deposit the designated amount into the fund address
                    Fund.at(fundAddress).deposit.sendTransaction(
                        // attribute the donation to the specified user
                        donor,
                        // use the given wallet source and donation amount
                        {
                            from: userAddress,
                            value: transactionAmount
                        },
                        // resolve promise appropriately
                        (err, data) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(true)
                            }
                        }
                    )
                })
        },
        BigNumber: new GraphQLScalarType({
            name: 'BigNumber',
            serialize: value => value,
            parseValue: value => {
                return new BigNumber(value)
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
                    return new BigNumber(ast.value)
                }

                return null
            }
        })
    }
})
