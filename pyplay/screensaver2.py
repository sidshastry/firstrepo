import turtle
import time
turtles = [
    {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (33, 65),
        "sleep_seconds": 2,
        "end_xy": (55, 55),
        "end_color": "purple"
    
    },

    {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "yellow"
    
    },

    {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "yellow"
    
    },
        {
        "shape": "triangle",
        "start_color": "black",
        "start_xy": (55, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "darkred"
    
    },
        {
        "shape": "circle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (1, 3),
        "end_color": "yellow"
    
    },
        {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (9, 18),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "yellow"
    
    },
        {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (11, 23),
        "sleep_seconds": 2,
        "end_xy": (44, 44),
        "end_color": "green"
    
    },
        {
        "shape": "square",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "yellow"
    
    },
        {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 12),
        "end_color": "yellow"
    
    },
        
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (24, 10),
        "end_color": "blue"
    
    },
    }
        
        "shape": "square",
        "start_color": "black",
        "start_xy": (103, 4),
        "sleep_seconds": 2,
        "end_xy": (24, 10),
        "end_color": "blue"
    
    },
]


for t in turtles:
    tt = turtle.Turtle()
    tt.penup()
    tt.shape(t["shape"])
    tt.fillcolor(t["start_color"])
    tt.goto(t["start_xy"][0], t["start_xy"][1])
    time.sleep(t["sleep_seconds"])
    tt.goto(t["end_xy"][0], t["end_xy"][1])
    tt.fillcolor(t["end_color"])