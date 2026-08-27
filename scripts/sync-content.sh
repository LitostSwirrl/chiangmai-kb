#!/bin/bash
set -euo pipefail
SRC="${KB_SRC:-/Users/jinsoon/Docs/Projects/personal/thai_learning/kb}"
rsync -av --delete "$SRC/" content/
echo "synced: $(find content -name '*.md' | wc -l | tr -d ' ') files"
