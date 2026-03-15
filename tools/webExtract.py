import os
from tavily import TavilyClient

def web_extract(url: str):
    try:
        web_extract_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        response = web_extract_client.extract(urls=url)
        return response
    except Exception as e:
        print(f"TAVILY_API_KEY NOT FOUND {e}")
        return "TAVILY_API_KEY NOT FOUND"