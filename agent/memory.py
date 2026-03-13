class ConversationMemory:
    def __init__(self,system_prompt: str = None):
        self.messages = []
        if system_prompt:
            self.add("system",system_prompt)
    
    def add(self, role: str, content: str):
        self.messages.append({
            "role":role,
            "content":content
            })
    
    def get(self):
        return self.messages

    def clear(self):
        self.messages = []
    
    def truncate(self,max_messages=20):
        if len(self.messages) > max_messages:
            self.messages = [self.messages[0]] + self.messages[-max_messages:]
            # system_prompt + most recent message.
    
