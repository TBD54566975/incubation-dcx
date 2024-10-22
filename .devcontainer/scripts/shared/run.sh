#!/usr/bin/env/bash

git config --global --add safe.directory /workspace

SERVICE=${1}
WORKSPACE_DIR=${WORKSPACE_DIR:-"/workspace"}

set -e

cd $WORKSPACE_DIR

pnpm install
pnpm run $SERVICE || true

sleep infinity