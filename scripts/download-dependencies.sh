#!/bin/bash
set -x
set -e

mkdir -p opt
pushd opt


curl -sL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar x
find .
cp $(find . -iname ffmpeg | head -1) ffmpeg
cp $(find . -iname ffprobe | head -1) ffprobe
rm -rf ffmpeg-*

curl -sL 'https://github.com/google/fonts/blob/master/apache/opensans/OpenSans-Bold.ttf?raw=true' > OpenSans-Bold.ttf
