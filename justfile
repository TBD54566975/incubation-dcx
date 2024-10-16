install:
    #! /usr/bin/env bash

    set -e

    BASE_DIR="{{ invocation_dir_native() }}"

    for package_dir in "$BASE_DIR/packages"/*; do
        cd "$package_dir" && \
        pnpm i
    done

test:
    #! /usr/bin/env bash
    pnpm lint && \
    pnpm test && \
    pnpm test:node

lint lint_type="":
    #! /usr/bin/env bash

    if [[ lint_type == "fix" ]]; then
        pnpm lint:fix

    else
        pnpm lint
    fi

run service:
    #! /usr/bin/env bash

    SERVICE="{{ service }}"

    if [[ "$SERVICE" == "server" ]]; then
        SERVICE="_server"
    fi

    pnpm "$SERVICE"

build:
    #! /usr/bin/env bash

    pnpm clean && \
    pnpm build && \
    pnpm build:tests:node
