"""
Problem statement:
- Take a number as in input from the user.
- Print a number triangle from 1 to the number input by the user.
- Example: Lets say the user inputs 3

Phase 1:

1
1 2
1 2 3
/ 
Phase 2:
   1
  1 25
  
 1 2 3
1 2 3 4 
"""

m= int(input("enter limit: "))
for i in range(1, m+1):
    line = ""
    for j in range(1, i+1):
        line = line + str(j) + " "
    print(line)




