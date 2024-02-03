'use strict';

import { lambdaHandler } from '../../app.mjs';
import { expect } from 'chai';
var event, context;

event = {
    queryStringParameters: { rank: 1 }
}
const emoji ='😃';
const expected_result = {
    input: emoji
}

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.input).to.be.equal(expected_result.input);
    });
});
