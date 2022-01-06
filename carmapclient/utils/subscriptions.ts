import {gql} from '@apollo/client';

export const CARS_SUBSCRIPTION = gql`
  subscription {
    cars {
      id
      location {
        latitude
        longitude
      }
      destination {
        latitude
        longitude
      }
      distanceToDestination
    }
  }
`;
