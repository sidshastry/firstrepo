m=input("enter limit: ")
m=int(m)
for i in range(1, m+1):
    line = " "
    for j in range(1, i+1):
        line = line + str(j) + " "
    print(line)
