import OpenAI from "openai";

export async function GET() {
  return Response.json({
    success: true,
    message: "Hello from the API route!",
  });
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


export async function POST(request) {
  const { message } = await request.json();
  try {
    if(!message){
      return Response.json({
        success: false,
        message: "Message is required",
      });
    }

    const response =  await client.responses.create({
    model: "llama-3.1-8b-instant",
    input: [
      {
        role: "user",
        content: message,
      },
    ],
  });
  return Response.json({
    success: true,
    message: {
      role:'bot',
      content: response.output_text
    },
  });

  }catch(error){
    return Response.json({
      success: false,
      message: {
        role:'bot',
        content:error.message || "Something went wrong",
      },
    });
  }
  
}
