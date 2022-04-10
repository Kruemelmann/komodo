#!/bin/bash

### Build release artifacts using Bazel.
mkdir bin \
    bin/linux/ \
    bin/linux/amd64 \
    bin/darwin \
    bin/darwin/amd64 \
    bin/darwin/arm64

bazelisk build \
    //cmd/komodo:cross_linuxamd64 \
    //cmd/komodo:cross_darwinamd64 \
    //cmd/komodo:cross_darwinarm64
echo

cp  bazel-out/*/bin/cmd/komodo/cross_linuxamd64_/cross_linuxamd64 bin/linux/amd64/komodo
cp  bazel-out/*/bin/cmd/komodo/cross_darwinamd64_/cross_darwinamd64 bin/darwin/amd64/komodo
cp  bazel-out/*/bin/cmd/komodo/cross_darwinarm64_/cross_darwinarm64 bin/darwin/arm64/komodo

ls bin/linux/amd64 bin/darwin/amd64 bin/darwin/arm64
