print("\n\n\n\n\n\n\n Fibonachi number pattern!!!")
def fib(n):
    if n== 0:
        return 0
    if n== 1:
        return 1
    return fib(n-1) + fib(n-2)
    
m=input("enter number:  ")
print(fib(int(m)))
