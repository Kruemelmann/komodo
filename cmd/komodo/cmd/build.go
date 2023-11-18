package cmd

import (
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"strings"

	"github.com/kruemelmann/komodo/pkg/command"
	"github.com/kruemelmann/komodo/pkg/watcher"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(buildCmd)

	buildCmd.PersistentFlags().StringP("filename", "f", "", "Specify the filename of the LaTex File")
	buildCmd.PersistentFlags().BoolP("watch", "w", false, "Start with filewatcher")
}

// buildCmd represents the build command
var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fname, _ := cmd.Flags().GetString("filename")
		watch, _ := cmd.Flags().GetBool("watch")
		if watch == true {
			fmt.Println("Watcher called")
			watcher.WatchFile(fname, buildCommand)
		} else {
			fmt.Println("Komodo building ...")
			fmt.Println("(-w or --watch to enable watcher)")
			err := buildCommand(fname)
			if err != nil {
				fmt.Println(err)
			}
		}
	},
}

func fileWithExtensionExist(ext string) bool {
	found := false
	files, err := ioutil.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range files {
		if file.Mode().IsRegular() {
			if filepath.Ext(file.Name()) == ext {
				found = true
			}
		}
	}
	return found
}

// TODO refactor to own package
func buildCommand(fname string) error {
	command.CommandRun("pdflatex", fname)
	if fileWithExtensionExist(".bib") {
		command.CommandRun("bibtex", strings.TrimSuffix(fname, filepath.Ext(fname)))
		command.CommandRun("pdflatex", fname)
	}
	command.CommandRun("pdflatex", fname)
	return nil
}
