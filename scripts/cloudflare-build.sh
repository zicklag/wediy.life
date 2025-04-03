#!/bin/env bash

set -ex

# Install deno
curl -fsSL https://deno.land/install.sh | sh
deno="$HOME/.deno/bin/deno"

# Install dependencies
$deno install --allow-scripts
$deno run build
