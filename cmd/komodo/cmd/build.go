package cmd

import (
	"fmt"

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

func buildCommand(fname string) error {
	//TODO Read this
	command.CommandRun("pdflatex", fname)
	return nil
}
