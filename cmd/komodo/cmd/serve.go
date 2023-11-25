package cmd

import (
	"fmt"
	"net"
	"strconv"

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
	serveCmd.PersistentFlags().BoolP("random_port", "", false, "Specify if komodo should start on a random free port")
}

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Starts the webserver to serve the pdf file to a browser",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fname, _ := cmd.Flags().GetString("filename")
		port, _ := cmd.Flags().GetString("port")
		rport, _ := cmd.Flags().GetBool("random_port")

		go watcher.WatchFile(fname, buildCommand)

		if rport {
			random_port, err := getFreePort()
			if err != nil {
				fmt.Println(err.Error())
			}
			web.StartServer(default_host, random_port, fname)
		}
		if port != "" {
			web.StartServer(default_host, port, fname)
		} else {
			web.StartServer(default_host, default_port, fname)
		}
	},
}

func getFreePort() (string, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return "", err
	}

	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return "", err
	}
	defer l.Close()
	str_port := strconv.Itoa(l.Addr().(*net.TCPAddr).Port)
	return str_port, nil
}
