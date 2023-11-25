package cmd

import (
	"github.com/kruemelmann/komodo/pkg/watcher"
	"github.com/kruemelmann/komodo/pkg/web"
	"github.com/spf13/cobra"
)

var (
	default_host = "0.0.0.0"
	default_port = "9090"
)

func init() {
	rootCmd.AddCommand(serveCmd)
	serveCmd.PersistentFlags().StringP("filename", "f", "", "Specify the filename of the LaTex File")
	serveCmd.PersistentFlags().StringP("port", "p", "", "Specify the port on with komodo should start the webserver")
}

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Starts the webserver to serve the pdf file to a browser",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fname, _ := cmd.Flags().GetString("filename")
		port, _ := cmd.Flags().GetString("port")

		go watcher.WatchFile(fname, buildCommand)

		if port != "" {
			web.StartServer(default_host, port, fname)
		} else {
			web.StartServer(default_host, default_port, fname)
		}
	},
}
