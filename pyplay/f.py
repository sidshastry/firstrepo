# A function encompasses a set of logical instructions which does something specific..
# like for ex. calculating area of a square, or a rectangle etc.,
# For a function, we need to give inputs using which it can compute result.
# Inputs are called parameters.
# Once a function computes its result, it can then use `return` to return that value.

# In python, you use `def` statement to create a function.
# def <function_name>(p1, p2, p3, p4, p5....):
# .... compute something here..
# ..... more computation...
#    return <value>

# To calculate area of a rectangle, we need length and breadth
def calc_area_rectangle(l, b):
    area = l * b
    return area

# Now that we wrote the code for calculating area, we can calculate area
# of any rectange we want. 
# To calculate the area of a rectangle, you need to `invoke` the function.
# Or in other words, call the function.
# 
# How to call a function?
# Simply use the name of the function, and pass the parameters with any values you want.
# And, you can capture the return from the function in some variable.
# 

print(calc_area_rectangle(20, 30))
print(calc_area_rectangle(5, 36))
print(calc_area_rectangle(23452, 23432423))