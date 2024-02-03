/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const emojis = [
  '😄','😃','😀','😊','😉','😍','🔶','🔷', '🚀'
];

export const lambdaHandler = async (event) => {
  let response;
  try {
    const rank = event.queryStringParameters.rank;
    const rankEmoji = emojis[ rank > emojis.length ? emojis.length-1 : rank];
    response = {
      headers: {
          'Content-type': 'application/json'
      },
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello, check out the emoji!',
        input: rankEmoji
      })
    };
  } catch (err) {
    response = {
      headers: {
          'Content-type': 'application/json'
      },
      statusCode: 400,
      body: JSON.stringify('Wrong request: an empty rank query parameter')
    };
    console.info(`${err}`);
  }
  return response;
}
