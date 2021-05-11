package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello, playground")
	var b string
	fmt.Print("Enter your name : ")
	fmt.Scanln(&b)
	fmt.Printf("Hello %s, you are awesome!", b)
}
