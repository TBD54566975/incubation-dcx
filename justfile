install:
    #! /usr/bin/env bash

    set -e

    pnpm i

    BASE_DIR="{{ justfile() }}"

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

build clean="true" build_tests="false":
    #! /usr/bin/env bash

    if [[ "{{ clean }}" == "true" ]]; then
        pnpm clean
    fi

    pnpm build

    if [[ "{{ build_tests }}" == "true" ]]; then
        pnpm build:tests:node
    fi
