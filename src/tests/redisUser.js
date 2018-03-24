
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readLocation, readName } from '../redis/readUtils';
import { writeLocation, writeName } from "../redis/writeUtils";

describe('Star Wars Query Tests', () => {
  describe('Basic Queries', () => {
    it('Write location to redis', async () => {
      writeLocation('stormasm', 'corvallis');
      writeName('stormasm', 'michael angerman');
      locationResult = locationMember('corvallis','stormasm');
      expect(locationResult).to.deep.equal(1);
      });
    });
  });
