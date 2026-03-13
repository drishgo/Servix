# import tools here...
from tools.calculator import calculator
from tools.uppercase import uppercase
from tools.getAllTools import getTools
from tools.exitAgent import exitAgent
from tools.dateAndTime import currentTime
from tools.weather import fetch_weather
# registry is basically a simple dictionary having a structured metadata about the tools and their name.

tools = {
    "Time":{
        "description":"tells the current date and time",
        "function": currentTime
    },
    "calculator":{
        "description":"performs arithmetic calculations",
        "function" : calculator
    },
    "weather":{
        "description":"fetches the current weather for a specified location",
        "function": fetch_weather
    }

}
