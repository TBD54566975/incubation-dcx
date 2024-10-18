# Incubation-DCX - Local Development

Incubation-DCX is a Typescript monorepo containing multiple services and packages. To faciliate easier local develpoment, we've included a Devcontainers configuration/environment. Each service/library in the `packages` directory has its own, independent Devcontainer, and Docker Compose is used to orchestrate these services and packages so that you can develop against any given combination of services without having to manually manage multiple independent processes.

<br/>

# Setup

Devcontainers environments require the follwing:

- Docker
- Docker Compose
- A compatible editor or IDE (see below)

The majority of the documentation here will cover using the Devcontainer environment with VSCode, with links to any additional documentation required to run in alternate editors or environments.

> [!NOTE]
> For users of VSCode-fork editors like Cursor, the same steps <i>should</i> apply but are not guaranteed to work. Check your given editor's support for Devcontainers before continuing.

To get started, follow the setup guide for Docker for your given OS.

| Operating System | Docker Install Docs              | Docker Compose Install Docs      |
| ---------------- | -------------------------------- | -------------------------------- |
| Windows          | https://docs.docker.com/desktop/ | N/A                              |
| MacOS            | https://docs.docker.com/desktop/ | N/A                              |
| Linux            | https://docs.docker.com/engine/  | https://docs.docker.com/compose/ |

<br/>

We recommend the following setup guides for each editor:

- [VSCode](https://code.visualstudio.com/docs/devcontainers/tutorial)
- [Neovim](https://github.com/esensar/nvim-dev-container)
- [IntelliJ IDEA](https://www.jetbrains.com/help/idea/connect-to-devcontainer.html) (this documentation applies to Jetbrains IDEs in general)

Once you've followed the steps linked in the documentation above, continue to the next section below!

<br/>

# Development

To start the Devcontainer environment for VSCode for the Incubation-DCX repository, press:

```bash
# Windows/Linux
CTRL + Shift + P
```

or

```bash
# MacOS
CMD + Shift + P
```

and select the:

`Dev Containers: Rebuild Container`

option. This will begin building all Devcontainer images for all services/packages listed in the `docker-compose.yml` file.

> [!NOTE]
> When launching the Devcontainer environment for the first time it will take a few minutes for the images to finish building and all the necessesary networking/options to setup. After that first process, opening the Devcontainer environment should only take a few seconds <i>unless</i> you choose to rebuild the Devcontainers without cache.

The Devcontainer environment is configured in such a way that non-active containers (all Devcontainer services in the `docker-compose.yml` file thatnot selected as your active development container) will install their dependencies and run the appropriate service/server (if any) in the background via the `command` specified in the `docker-compose.yml` file. You selected container will install dependencies in the foreground, ensuring your environment is ready to go!

For convenience, we've included `Just` and a `justfile` to help run commands for install, running services, stopping services, etc. If you're new to `Just` or command runners in general, [we recommend getting started with some documentation here](https://just.systems/man/en/). You can run `Just` commands from any subdirectory, and they will execute from the base directory of this repository.

Currently supported commands include:

- `just install` - Installs monorepo-wide dependencies and then the dependencies in each service/package subdirectory in the `packages` directory.
- `just run <SERVICE>` - Runs the service specified in the root `package.json`.
- `just test` - Runs all tests for all services/packages in the monorepo.
- `just lint <LINT_TYPE=""/"fix">` - Runs `pnpm lint` for all services/packages in the monorepo. If the optional positional argument of `LINT_TYPE` is set to `fix` the lint fixes will be executed inline, i.e.:

```bash
just lint fix
```

- `just build <CLEAN="true"> <BUILD_TESTS="false">` - Builds all services/packages in the monorepo. If `clean` is set to `true`, the command will remove all previous build artifacts. If `build_tests` is set to `true`, the command will build all NodeJS tests.

<br/>

# Making Changes

As this repo changes, the local development environment will likewise need to change and grow! This section covers how to make some common changes:

#### Updating the Justfile

The `justfile` for this repository is currently located at the root of the repository so that it is easy to find and edit/use. Were recommend using `Just`'s support for inline Bash and NodeJS scripts to faciliate complex commands, and to write such command in a way such that they use parameters and arguments to address the needs of each service and/or package, delegating service-specific criterion to that service or package's `package.json`. For example, if we wanted to write a command to stop a given service from running, inside its `package.json` we might write:

```json
{
    ...
    "scripts": {
        ...
        "stop": "kill $(lsof -t -i:3000) && echo 'Stopped service running on :3000'"
    }
}
```

In the root `justfile` we would then add the following command:

```bash
stop service:
    #!/usr/bin/env bash
    # Don't forget the shebang! at the start or Just won't know it's a Bash script!

    SERVICE_DIR="{{ justfile() }}/packages/{{ service }}"

    cd "$SERVICE_DIR" && pnpm stop
```

### Adding a New Devcontainer

To add a new Devcontainer using the existing NodeJS Devcontainer in `<ROOT>/.devcontainer/images`, add a block to the `docker-compose.yml` as below:

```yaml
# docker-compose.yml
services:
  my-new-service:
    command: bash /app/run.sh <SERVICE_NAME_HERE>
    build:
      context: ..
      dockerfile: ./.devcontainer/images/Dockerfile.node
      ssh:
        - default=${SSH_AUTH_SOCK}
      secrets:
        - npm_token

    volumes:
      - ..:/workspace
      - ../.git:/workspace/.git
      - ../.devcontainer:/workspace/.devcontainer
      - ${HOME}/.ssh:/root/.ssh
      - ${HOME}/.git:/root/.git
    stdin_open: true
    tty: true
```

We recommend leaving the `ssh`, `secrets`, `volumes`, and other options as-default for the best compatibility, and deferring service or package specific setup commands/details to their respective `package.json` scripts.

To add a non-Devcontainer dependency, add the service to the `docker-compose.yml` as you normally would, taking care to specify service dependencies. For example:

```yaml
# docker-compose.yml
services:
  my-new-service:
    command: bash /app/run.sh <SERVICE_NAME_HERE>
    build:
      context: ..
      dockerfile: ./.devcontainer/images/Dockerfile.node
      ssh:
        - default=${SSH_AUTH_SOCK}
      secrets:
        - npm_token

    volumes:
      - ..:/workspace
      - ../.git:/workspace/.git
      - ../.devcontainer:/workspace/.devcontainer
      - ${HOME}/.ssh:/root/.ssh
      - ${HOME}/.git:/root/.git
    depends_on:
      - postgres
    stdin_open: true
    tty: true

  postgres:
    image: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mypgdbpass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  pgadmin_data:
```

### Modifying the Background Startup Script

All Devcontainers in the environment use a single `run.sh` script, which invokes the same `Just` commands you do to perform setup. The workflow for modifying background container startup is as follows:

1. Add a new Just command in the `justfile` at the root of the repository (see the above section).
2. In the `<ROOT_DIR>/.devcontainer/scripts/shared/run.sh` script, add the command as appropriate.

### Modifying the Devcontainer

All services and packages in this repository use the same `Devcontainer`, located at `<ROOT_DIR>/.devcontainer/images`. If you need to make changes to this image (i.e. adding a C-binary dependency, etc.) do so there.

Global NPM packages (`eslint`, `typescript`, etc.) are installed via a script located at `<ROOT_DIR>/.devcontainer/scripts/node/install_global_npm_deps.sh`. By default, the following are installed as global NPM packages:

- `pnpm`
- `turbo`
- `eslint`
- `typescript`

> [!WARNING]
> We <i><b>strongly</b></i> advise against modifying the `common_debian.sh` script located at `<ROOT_DIR>/.devcontainer/scripts/shared`. This script installs devtooling and dependencies used by the `Devcontainer`, and should only be modified if the version of Debian used by the repository's `Devcontainer` image changes.
