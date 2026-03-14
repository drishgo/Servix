import datetime

def Time():
    # .now() gets the current local date and time
    now = datetime.datetime.now()
    
    # Format: "Day, Date Month Year - 12-hour Time"
    # Example: "Friday, 14 March 2026 - 02:25 AM"
    readable_time = now.strftime("%A, %d %B %Y - %I:%M %p")
    
    print(f"Type: {type(now)}")
    print(f"Readable Time: {readable_time}")
    
    return readable_time