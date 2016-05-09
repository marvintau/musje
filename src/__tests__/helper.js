var chai = require('chai');
var chaiDeepMatch = require('chai-deep-match');

chai.use( chaiDeepMatch );

GLOBAL.expect = chai.expect;
