# from dotenv import load_dotenv 
# from huggingface_hub import InferenceClient
# import os

# load_dotenv()
# #THIS SPECEFIC ARCHITECTURE IS A SIMPLE IMPL OF THE AGENTIC PHILOSOPHY.
# #                       USER (exposed via main.py)
# #                        |
# #                    Agent Init (listen loop)
# #                        |
# #                       Agent think or reason (generate response)
# #                        |
# #                      Output answer to query
# # #


# class SimpleAiAgent:
#     def __init__(self):
#         self.client = InferenceClient(model=os.getenv("HF_MODEL_ID") ,api_key=os.getenv("HF_TK"))
#         self.memory = []
#         print("Agent Created")
    
#     def reasoning(self,user_input):
#         self.memory.append({"role":"user","content":user_input})
    
#     # we now generate a response by thinking.

#         #the raw response we get from the genai server

#         response = self.client.chat.completions.create(
#             model = self.model_id,
#             messages = self.memory,
#             max_tokens=500
#         )
#         reply = response.choices[0].message.content
#         self.memory.append({"role":"assistant","content":reply})
#         # we now structure this response into a beautiful reply.

        
#         return reply
    
        