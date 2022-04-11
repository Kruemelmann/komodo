package cmd

import (
	"github.com/spf13/cobra"
)

var cfgFile string

func init() {
	rootCmd.CompletionOptions.DisableDefaultCmd = true
	rootCmd.CompletionOptions.DisableNoDescFlag = true
	rootCmd.CompletionOptions.DisableDescriptions = true
}

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "komodo",
	Short: "Komodo is a small wrapper around the LaTex build tool you preferred",
	Long:  `Komodo can be used to build LaTex Files and serve them to a webbrowser. You can even start a watcher so that you dont need to restart komodo and it automaticaly build you tex file on change.`,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			cmd.Help()
		}
		//TODO add for latex and bibtex
		//if checkForTools() != nil {
		//color.Red("")
		//}
	},
}

func Execute() {
	cobra.CheckErr(rootCmd.Execute())
}
