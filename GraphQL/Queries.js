import { gql } from '@apollo/client';

export const LOAD_PLANETS = gql`
  query ($planetID: ID) {
    planet(planetID: $planetID) {
      name
      filmConnection {
        films {
          title
          id
        }
      }
    }
  }
`;
