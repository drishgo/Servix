from agent.core import Agent 

agent = Agent()

while True:
    query = input("You: ")
    result = agent.run(query)
    if result == "goodbye":
        break
    else:
        print("Agent: "+ result)
    