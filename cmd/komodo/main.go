package main

import (
	"fmt"

	"github.com/kruemelmann/komodo/cmd/komodo/cmd"
)

func main() {
	welcomebanner()
	cmd.Execute()
}

func welcomebanner() {

	fmt.Println(" _                        _      ")
	fmt.Println("| |__ ___  _ ___  ___  __| | ___ ")
	fmt.Println("| / // . \\| '   \\/ . \\/ .` |/ . \\")
	fmt.Println("|_\\_\\\\___/|_|_|_|\\___/\\__,_|\\___/")
	fmt.Println("")
	fmt.Println("")
}
