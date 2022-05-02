package command

import (
	"log"
	"os/exec"
)

func CommandRun(cmdstr string, filename string) {
	out, err := exec.Command(cmdstr, filename).Output()
	if err != nil {
		log.Printf("%s, %s", err, out)
	}
}
