

def println(inp, n, before=False):
    """3 params"""
    if before:
        for i in range(n):
            print("\n")
    print(inp)
    if not before:
        for i in range(n):
            print("\n")



def inputln(inp2):
    inp = input(inp2 + "\n")
    return inp
def concat(l, g):
    """ 2 params"""
    return l + g

def wait(f):
    """1 param"""
    import time
    time.sleep(f)


def is_even(n):
    """
    n: Number to be evaluated
    Returns True if the number is even, else False
    """
    """1 param"""
    return n % 2 == 0