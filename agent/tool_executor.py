import json
import re

def execute_tool(output, tools):
    try:
        # LLMs often add text around JSON, so we use regex to extract the JSON block
        match = re.search(r'\{.*\}', output, re.DOTALL)
        if not match:
            return None # No JSON found, meaning no tool request

        json_str = match.group(0)
        data = json.loads(json_str)

        tool_name = data.get("tool")
        arguments = data.get("arguments", {})

        if not tool_name:
            return None

        print(f"Tool requested : {tool_name}")
        if tool_name in tools:
            print(f"Tool called : {tool_name}")
            if tool_name == "exitAgent":
                return "goodbye"
            
            return tools[tool_name]["function"](**arguments)
        else:
            return "Unknown tool request check tool registry"

    except Exception as e:
        # Failing silently if no strict JSON found instead of huge tracebacks on user chats.
        return None