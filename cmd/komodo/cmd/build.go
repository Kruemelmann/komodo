package cmd

import (
	"github.com/kruemelmann/komodo/pkg/command"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(buildCmd)

	buildCmd.PersistentFlags().StringP("filename", "f", "", "Specify the filename of the LaTex File")
}

// buildCmd represents the build command
var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fname, _ := cmd.Flags().GetString("filename")
		buildCommand(fname)
	},
}

func buildCommand(fname string) {
	command.CommandRun("pdflatex", fname)
}
