# cli

A collection of Deno command line utils for my dev workflow.

## Requirements

- Deno
- tmux
- fzf

## Tools

You can install binaries via `deno install`. See the [docs](https://deno.land/manual/tools/script_installer) for more examples.

### git-compare

Git compare compares your checked out branch with a branch of your choice

```bash
deno install -f --allow-run https://raw.githubusercontent.com/vilbergs/cli/main/git-compare.ts
```

#### Usage


`$ git-compare [branch-to-compare]`

Example: `$ git-compare main`

<hr>

### `change-karabiner-country-code`

```bash
deno install -f --allow-read --allow-write --allow-env  https://raw.githubusercontent.com/vilbergs/cli/main/change-karabiner-country-code.ts
```

<hr>

### codegrep

Recursively search for text occurences in the whole directory

```bash
deno install -f --allow-run https://raw.githubusercontent.com/vilbergs/cli/main/codegrep.ts
```

Example: `$ codegrep someCodeA someCodeB`

<hr>

### tmux-sessionizer

```bash
deno install -f --allow-read --allow-env --allow-run https://raw.githubusercontent.com/vilbergs/cli/main/tmux-sessionizer.ts
```

<hr>


