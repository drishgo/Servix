from tools.registry import tools
from agent.llm import LLMClient
from agent.prompt_builder import build_tool_prompt
from agent.tool_executor import execute_tool
from agent.memory import ConversationMemory
class Agent:
    def __init__(self):
        self.tools = tools
        self.system_prompt = build_tool_prompt(tools=self.tools)
        self.client = LLMClient()
        self.memory = ConversationMemory(self.system_prompt)
    
    def run(self,user_input):
        self.memory.add("user",user_input)

        output = self.client.generate(self.memory.get())

        self.memory.add("assistant",output)

        tool_result = execute_tool(output,self.tools)
        
        if tool_result is not None:
            if tool_result == "goodbye":
                return "goodbye"
            
            # As per your preference: Directly return the tool's explicit output
            # instead of asking the LLM to rewrite it.
            tool_output_str = str(tool_result)
            self.memory.add("assistant", f"Tool Output: {tool_output_str}")
            return f"{tool_result}" # Returning explicit tool result directly.

        return output

