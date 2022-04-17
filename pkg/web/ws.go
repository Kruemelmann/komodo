package web

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var ws_connection *websocket.Conn

//TODO later add line changed to this
func UpdateGui() {
	if ws_connection != nil {
		ws_connection.WriteJSON("changed")
	}
}

func BuildPdfWebsocket() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		con, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}
		ws_connection = con
	}
}
