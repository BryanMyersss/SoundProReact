import axios from 'axios';

export const createWithAiAPI = async (rawData: string) => {
  // console.log(rawData)
  
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/products/create-with-ai`,
    { rawData },
    { withCredentials: true }
  );

  console.log(response.data)

  if (response.data.data.error) {
    return {
      message: response.data.data.error.message,
    }
  }
  
  const inputTokens = response.data.data.usage.prompt_tokens
  const outputTokens = response.data.data.usage.completion_tokens
  const tokensUsed = inputTokens + outputTokens

  // gpt 4o costs
  const inputTokensCost1M = 5 // dollars
  const outputTokensCost1M = 15 // dollars
  const model = 'gpt-4o'
  
  const amountPaid = (inputTokens * inputTokensCost1M + outputTokens * outputTokensCost1M) / 1000000;

  const openaiChoiceUnparsed = response.data.data.choices[0].message.content
  let openaiChoiceParsed = {} as any;
  try {
    openaiChoiceParsed = JSON.parse(openaiChoiceUnparsed)
    console.log(openaiChoiceParsed)
  } catch (error) {
    console.log('could not parse openaiChoice to JSON')
    return {
      message: 'could not parse openaiChoice to JSON',
    }
  }

  const productObj = { ...openaiChoiceParsed }

  if (productObj.message) {
    delete productObj.message
  }

  let message = ` Tokens used: ${tokensUsed}`
  if (openaiChoiceParsed.message) {
    message = openaiChoiceParsed.message + ` Tokens used: ${tokensUsed} \n Cost (${model}): ${amountPaid.toFixed(4)} USD`
  }

  return {
    productObj,
    message
  }
}