package command

import (
	"log"
	"os/exec"
)

func CommandRun(cmdstr string, filename string) error {
	return CommandRunInDir(cmdstr, filename, ".")
}

func CommandRunInDir(cmdstr string, filename string, workingDir string) error {
	cmd := exec.Command(cmdstr, filename)
	cmd.Dir = workingDir
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Command %s failed: %s\nOutput: %s", cmdstr, err, out)
		return err
	}
	return nil
}
