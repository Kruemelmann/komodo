package komodo

import "embed"

//go:embed bazel-out/*/bin/ui/komodo/build
var FrontendFS embed.FS
