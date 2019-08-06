const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const forEach = require('mocha-each');

const { expect } = chai;

const helpers = require('../src/helpers.js');


describe('Helpers', () => {
  describe('createAskForScoreRegExp', () => {
    forEach([
      ['score for matt', 'for ', 'matt'],
      ['score matt', undefined, 'matt'],
      ['score with matt', 'with ', 'matt'],
      ['scores for matt', 'for ', 'matt'],
      ['karma phil', undefined, 'phil']
    ])
    .it('should match the search %j', (searchQuery, middleMatch, name) => {
      const scoreMatchRegExp = helpers.createAskForScoreRegExp();
      expect(scoreMatchRegExp).to.be.a('RegExp');
      expect(searchQuery.match(scoreMatchRegExp)).to.be.an('array');
      expect(searchQuery.match(scoreMatchRegExp).length).to.equal(3);
      expect(searchQuery.match(scoreMatchRegExp)).to.deep.equal([searchQuery, middleMatch, name]);
    });
  });

  describe('createEraseUserScoreRegExp', () => {
    forEach([
      ['erase @matt cuz he is bad', '@matt', 'he is bad'],
      ['erase @frank', '@frank', undefined]
    ]).it('%j should match the erase user regexp', (searchQuery, user, reason) => {
      const eraseUserScoreRegExp = helpers.createEraseUserScoreRegExp();
      expect(eraseUserScoreRegExp).to.be.a('RegExp');
      expect(searchQuery.match(eraseUserScoreRegExp)).to.be.an('array');
      expect(searchQuery.match(eraseUserScoreRegExp).length).to.equal(3);
      expect(searchQuery.match(eraseUserScoreRegExp)).to.deep.equal([searchQuery, user, reason]);
    })
  });

  describe('createMultiUserVoteRegExp', () => {
    forEach([
      ['{@matt, @phil}++', '{@matt, @phil}++', '@matt, @phil', '++', undefined],
      ['{@matt, @phil}-- cuz they are the best team', '{@matt, @phil}-- cuz they are the best team', '@matt, @phil', '--', 'they are the best team'],
      ['{@user, @phil user}--', '{@user, @phil user}--', '@user, @phil user', '--', undefined],
    ]).
    it('should match \'%j\'', (fullText, firstMatch, names, operator, reason) => {
      const dummy = '';
      const multiUserVoteRegExp = helpers.createMultiUserVoteRegExp(); 
      expect(multiUserVoteRegExp).to.be.a('RegExp');
      expect(fullText.match(multiUserVoteRegExp)).to.be.an('array');
      expect(fullText.match(multiUserVoteRegExp).length).to.equal(5);
      expect(fullText.match(multiUserVoteRegExp)).to.deep.equal([firstMatch, names, dummy, operator, reason]);
    });
  });


  describe('cleanName', () => {
    forEach([
      ['@matt', 'matt'],
      ['hello @derp','hello @derp'],
      ['what', 'what'],
      ['', ''],
    ]).it('should clean %j of the @ sign and be %j if @ is the first char', (fullName, cleaned) => {
      expect(helpers.cleanName(fullName)).to.equal(cleaned);
    });
  });

  describe('createTopBottomRegExp', () => {
    forEach([
      ['top 10', 'top', '10'],
      ['bottom 5', 'bottom', '5']
    ])
    .it('should match %j', (requestForScores, topOrBottom, numberOfUsers) => {
      const topBottomRegExp = helpers.createTopBottomRegExp();
      expect(topBottomRegExp).to.be.a('RegExp');
      expect(requestForScores.match(topBottomRegExp)).to.be.an('array');
      expect(requestForScores.match(topBottomRegExp).length).to.equal(3);
      expect(requestForScores.match(topBottomRegExp)).to.deep.equal([requestForScores, topOrBottom, numberOfUsers]);
    });
  });

  describe('createUpDownVoteRegExp', () => {
    forEach([
      ['@matt++', '@matt++', '@matt', '++', undefined],
      ['@matt++ cuz he is awesome', '@matt++ cuz he is awesome', '@matt', '++', 'he is awesome'],
      ['\'what are you doing\'--', '\'what are you doing\'--', '\'what are you doing\'', '--', undefined],
      ['you are the best matt--', 'matt--', 'matt', '--', undefined],
      ['\'you are the best matt\'--', '\'you are the best matt\'--', '\'you are the best matt\'', '--', undefined],
      ['you are the best matt++ cuz you started #matt-s', 'matt++ cuz you started #matt-s', 'matt', '++', 'you started #matt-s'],
    ]).
    it('should match \'%j\'', (fullText, firstMatch, name, operator, reason) => {
      const upVoteOrDownVoteRegExp = helpers.createUpDownVoteRegExp(); 
      expect(upVoteOrDownVoteRegExp).to.be.a('RegExp');
      expect(fullText.match(upVoteOrDownVoteRegExp)).to.be.an('array');
      expect(fullText.match(upVoteOrDownVoteRegExp).length).to.equal(4);
      expect(fullText.match(upVoteOrDownVoteRegExp)).to.deep.equal([firstMatch, name, operator, reason]);
    });
  });
});