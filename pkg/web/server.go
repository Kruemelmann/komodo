package web

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/kruemelmann/komodo"
)

func StartServer(host, port, filename string) {
	r := mux.NewRouter()

	r.HandleFunc("/ws/pdf", BuildPdfWebsocket())
	r.HandleFunc("/pdf", ReadFileHandler(filename))

	//search for the frontend files in the filesystem
	matches, _ := fs.Glob(komodo.FrontendFS, "*/*/*/ui/komodo/build")
	if len(matches) != 1 {
		panic("missmatching count of frontend build files in FS")
	}

	feRoot, _ := fs.Sub(komodo.FrontendFS, matches[0])
	buildHandler := http.FileServer(http.FS(feRoot))
	r.PathPrefix("/").Handler(buildHandler)

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	srv := &http.Server{
		Handler:      handlers.CORS(originsOk, headersOk, methodsOk)(r),
		Addr:         host + ":" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server started on " + host + ":" + port)
	log.Fatal(srv.ListenAndServe())
}

func getAllFilenames(fs *embed.FS, path string) (out []string, err error) {
	if len(path) == 0 {
		path = "."
	}
	entries, err := fs.ReadDir(path)
	if err != nil {
		return nil, err
	}
	for _, entry := range entries {
		fp := filepath.Join(path, entry.Name())
		if entry.IsDir() {
			res, err := getAllFilenames(fs, fp)
			if err != nil {
				return nil, err
			}
			out = append(out, res...)
			continue
		}
		out = append(out, fp)
	}
	return
}
