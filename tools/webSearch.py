import os
from tavily import TavilyClient


def web_search(query: str):
    try:
        web_search_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        response = web_search_client.search(query=query)
        return response
    except Exception as e:
        print(f"TAVILY_API_KEY NOT FOUND {e}")
        return "TAVILY_API_KEY NOT FOUND"