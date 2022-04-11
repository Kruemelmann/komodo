package web

import (
	"io/fs"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/kruemelmann/komodo"
)

func StartServer(host, port, filename string) {
	r := mux.NewRouter()

	r.HandleFunc("/ws/pdf", BuildPdfWebsocket())
	r.HandleFunc("/pdf", ReadFileHandler(filename))

	feRoot, _ := fs.Sub(komodo.FrontendFS, "ui/komodo/build")
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
