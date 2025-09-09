package watcher

import (
	"os"
	"time"

	"github.com/fatih/color"
	"github.com/kruemelmann/komodo/pkg/web"
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
			dt := time.Now()
			if err != nil {
				color.Red("%s build failed for %s: %s\n", dt.Format("02.01.2006 15:04:05"), filePath, err)
			} else {
				color.Green("%s rebuild %s\n", dt.Format("02.01.2006 15:04:05"), filePath)
				web.UpdateGui()
			}

			initialStat = stat
		}

		//look for a better way than polling
		time.Sleep(1 * time.Second)
	}

	return nil
}
