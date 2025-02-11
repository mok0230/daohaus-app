import { gql } from 'apollo-boost';

const baseListFields = `
  id
  aborted
  applicant
  cancelled
  cancelledAt
  createdAt
  details
  didPass
  gracePeriodEnds
  guildkick
  isMinion
  lootRequested
  memberAddress
  newMember
  noShares
  noVotes
  paymentRequested
  paymentTokenDecimals
  paymentTokenSymbol
  processed
  processor
  processedAt
  proposer
  proposalId
  proposalIndex
  sharesRequested
  sponsored
  sponsor
  sponsoredAt
  startingPeriod
  trade
  tributeOffered
  tributeTokenDecimals
  tributeTokenSymbol
  tributeToken
  votingPeriodStarts
  votingPeriodEnds
  whitelist
  yesShares
  yesVotes
  molochAddress
  molochVersion
  minionAddress
  uberHausMinionExecuted
  moloch {
    gracePeriodLength
    periodDuration
    version
    votingPeriodLength
  }
  votes {
    id
    memberAddress
    memberPower
    uintVote
    createdAt
    molochAddress
  }
  escrow {
    tokenAddresses
    tokenTypes
    tokenIds
    amounts
  }
  `;

export const PROPOSALS_LIST = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 1000
      skip: $skip
    ) {
      ${baseListFields}
    }
  }
`;

export const PROPOSAL_BY_ID = gql`
query proposals($contractAddr: String!, $skip: Int, $id: String ) {
    proposals(
      where: { molochAddress: $contractAddr, proposalId: $id }
    ) {
      ${baseListFields}
    }
  }
`;

export const PROPOSALS_LIST_IS_MEMBER = gql`
  query proposalsMember($contractAddr: String!, $skip: Int, $memberAddress: String!) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 1000
      skip: $skip
    ) {
      ${baseListFields}
      votes(where: { memberAddress: $memberAddress }) {
        id
        memberAddress
      }
    }
  }
`;

export const PROPOSALS_DISCOURSE_TOPIC = gql`
  query proposals($molochAddress: String!, $createdAt: String!) {
    proposals(
      where: { molochAddress: $molochAddress, createdAt_gt: $createdAt }
    ) {
      proposalId
    }
  }
`;
