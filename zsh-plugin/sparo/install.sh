#!/bin/bash

BRANCH=${1:-main}

# check existence of $ZSH/custom
if [ ! -d "$ZSH/custom/" ]; then
    echo "$ZSH/custom/ does not exist."
    exit 1
fi

# target folder
plugin_dir="$ZSH/custom/plugins/sparo"

mkdir -p "$plugin_dir"

# download sparo.plugin.zsh to plugin dir
echo "Downloading sparo.plugin.zsh to $plugin_dir from $BRANCH branch..."
curl -L "https://raw.githubusercontent.com/tiktok/sparo/$BRANCH/zsh-plugin/sparo/sparo.plugin.zsh" -o "$plugin_dir/sparo.plugin.zsh"

cat <<EOF

Sparo plugin installed!

It's necessary to do the following changes in your .zshrc file:

1. Add "sparo" in the plugins list if you are using Oh-My-Zsh

plugins=(... sparo)

OR, 2. Manually load this file by appending the following code to your .zshrc file.

source $ZSH/custom/plugins/sparo/sparo.plugin.zsh
EOF