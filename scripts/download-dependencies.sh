#!/bin/bash
set -x
set -e

mkdir -p opt
pushd opt


if [[ ! -e ./ffmpeg ]]; then
    curl -sL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar x -J
    find .
    cp $(find . -iname ffmpeg | head -1) ffmpeg
    cp $(find . -iname ffprobe | head -1) ffprobe
    rm -rf ffmpeg-*
fi

if [[ ! -e ./OpenSans-Bold.ttf ]]; then
    curl -sL 'https://github.com/google/fonts/blob/master/apache/opensans/OpenSans-Bold.ttf?raw=true' > OpenSans-Bold.ttf
fi
