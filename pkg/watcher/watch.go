package watcher

import (
	"os"
	"time"

	"github.com/fatih/color"
)

type buildFunc func(string) error

func WatchFile(filePath string, buildfunc buildFunc) error {
	initialStat, err := os.Stat(filePath)
	if err != nil {
		return err
	}

	for {
		stat, err := os.Stat(filePath)
		if err != nil {
			color.Red("%s\n", err)
			return err
		}

		if stat.Size() != initialStat.Size() || stat.ModTime() != initialStat.ModTime() {
			err := buildfunc(filePath)
			if err != nil {
				color.Red("%s\n", err)
			}
			dt := time.Now()

			color.Green("%s rebuild %s\n", dt.Format("02.01.2006 15:04:05"), filePath)
			initialStat = stat
		}

		//look for a better way than polling
		time.Sleep(1 * time.Second)
	}

	return nil
}
