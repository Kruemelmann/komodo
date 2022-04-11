package web

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func ReadFileHandler(filename string) func(w http.ResponseWriter, r *http.Request) {
	trimname := strings.TrimSuffix(filename, filepath.Ext(filename))
	return func(w http.ResponseWriter, r *http.Request) {
		dat, err := os.ReadFile(trimname + ".pdf")
		if err != nil {
			fmt.Println(err)
		}
		w.Header().Set("Content-type", "application/pdf")
		w.Write(dat)
	}
}
