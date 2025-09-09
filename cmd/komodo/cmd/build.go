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
	buildCmd.PersistentFlags().StringP("directory", "d", ".", "Specify the directory where commands should be executed")
}

// buildCmd represents the build command
var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fname, _ := cmd.Flags().GetString("filename")
		watch, _ := cmd.Flags().GetBool("watch")
		directory, _ := cmd.Flags().GetString("directory")
		
		buildFunc := func(filename string) error {
			return buildCommandInDir(filename, directory)
		}
		
		if watch == true {
			fmt.Println("Watcher called")
			watcher.WatchFile(fname, buildFunc)
		} else {
			fmt.Println("Komodo building ...")
			fmt.Println("(-w or --watch to enable watcher)")
			err := buildFunc(fname)
			if err != nil {
				fmt.Println(err)
			}
		}
	},
}

func fileWithExtensionExist(ext string) bool {
	return fileWithExtensionExistInDir(ext, ".")
}

func fileWithExtensionExistInDir(ext string, dir string) bool {
	found := false
	files, err := ioutil.ReadDir(dir)
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
	return buildCommandInDir(fname, ".")
}

func buildCommandInDir(fname string, workingDir string) error {
	if err := command.CommandRunInDir("pdflatex", fname, workingDir); err != nil {
		return err
	}
	
	if fileWithExtensionExistInDir(".bib", workingDir) {
		trimmedName := strings.TrimSuffix(fname, filepath.Ext(fname))
		if err := command.CommandRunInDir("bibtex", trimmedName, workingDir); err != nil {
			return err
		}
		if err := command.CommandRunInDir("pdflatex", fname, workingDir); err != nil {
			return err
		}
	}
	
	if err := command.CommandRunInDir("pdflatex", fname, workingDir); err != nil {
		return err
	}
	
	return nil
}
