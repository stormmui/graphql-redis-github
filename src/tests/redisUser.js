
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readLocation, readName } from '../redis/readUtils';
import { writeLocation, writeName } from "../redis/writeUtils";

describe('Star Wars Query Tests', () => {
  describe('Basic Queries', () => {
    it('Correctly identifies R2-D2 as the hero of the Star Wars Saga', async () => {
      const query = `
        query HeroNameQuery {
          hero {
            name
          }
        }
      `;
      const result = await graphql(StarWarsSchema, query);
      expect(result).to.deep.equal({
        data: {
          hero: {
            name: 'R2-D2',
          },
        },
      });
    });
  });
});
