package command

import (
	"log"
	"os/exec"
)

func CommandRun(cmdstr string, filename string) {
	cmd := exec.Command(cmdstr, filename)
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
}
