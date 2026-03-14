# import tools here...
from tools.calculator import calculator
from tools.dateAndTime import Time
from tools.weather import fetch_weather
from tools.webSearch import web_search
from tools.webExtract import web_extract
# registry is basically a simple dictionary having a structured metadata about the tools and their name.

tools = {
    "Time":{
        "description":"tells the current time or current date and time",
        "function": Time
    },
    "calculator":{
        "description":"performs arithmetic calculations",
        "function" : calculator
    },
    "weather":{
        "description":"fetches the current weather for a specified location",
        "function": fetch_weather
    },
    "web_search": {
    "description": (
        "Search the live internet for real-time information, current events, "
        "or technical documentation not in your training data. Use this for "
        "verifying facts, checking 2025-2026 developments, or finding "
        "specific code examples. Input: A precise search query string."
        "Input: A precise search query string."
    ),
    "function": web_search
    },
    "web_extract":{
        "description":("extracts the content from a given url"
        "input: url provided by the user."
        ),
        "function": web_extract
    }

}
