#!/bin/bash

### Build release artifacts using Bazel.
mkdir bin \
    bin/linux/ \
    bin/linux/amd64 \
    bin/linux/arm64 \
    bin/darwin \
    bin/darwin/amd64 \
    bin/darwin/arm64

bazelisk build \
    //cmd/komodo:cross_linuxamd64 \
    //cmd/komodo:cross_darwinamd64 \
    //cmd/komodo:cross_darwinarm64
echo

#     //cmd/komodo:cross_linuxarm64 \
#cp  bazel-out/*/bin/cmd/komodo/cross_linuxarm64_/cross_linuxarm64 bin/linux/arm64/komodo-linux-aarch64

cp  bazel-out/*/bin/cmd/komodo/cross_linuxamd64_/cross_linuxamd64 bin/linux/amd64/komodo-linux-x86_64
cp  bazel-out/*/bin/cmd/komodo/cross_darwinamd64_/cross_darwinamd64 bin/darwin/amd64/komodo-darwin-x86_64
cp  bazel-out/*/bin/cmd/komodo/cross_darwinarm64_/cross_darwinarm64 bin/darwin/arm64/komodo-darwin-aarch64

ls bin/linux/amd64 bin/linux/arm64 bin/darwin/amd64 bin/darwin/arm64
