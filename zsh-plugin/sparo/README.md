# sparo zsh plugin

This "sparo" zsh plugin provides many aliases just like [git zsh plugin](https://github.com/ohmyzsh/ohmyzsh/blob/master/plugins/git/README.md) does.

## Install & Update

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/tiktok/sparo/main/zsh-plugin/sparo/install.sh)" "" main
```

To use it, add `sparo` to the plugins array in your zshrc file:

```shell
plugins=(... sparo)
```

Or, manually load it by appending the following code to your zshrc file:

source $ZSH/custom/plugins/sparo/sparo.plugin.zsh

## Aliases

| Alias                  | Command
| :--------------------- | :-------------------------------------------------- |
| `sa`                   | `sparo add`                                         |
| `sb`                   | `sparo branch`                                      |
| `sco`                  | `sparo checkout`                                    |
| `scm`                  | `sparo checkout $(git_main_branch)`                 |
| `scl`                  | `sparo clone`                                       |
| `sc`                   | `sparo commit`                                      |
| `scmsg`                | `sparo commit --message`                            |
| `sc!`                  | `sparo commit --amend`                              |
| `sd`                   | `sparo diff`                                        |
| `sf`                   | `sparo fetch`                                       |
| `sfo`                  | `sparo fetch origin`                                |
| `sl`                   | `sparo pull`                                        |
| `sp`                   | `sparo push`                                        |
| `spf!`                 | `sparo push --force`                                |
| `spf`                  | `sparo push --force-with-lease --force-if-includes` |
| `srb`                  | `sparo rebase`                                      |
| `srba`                 | `sparo rebase --abort`                              |
| `srbc`                 | `sparo rebase --continue`                           |
| `srbi`                 | `sparo rebase --interactive`                        |
| `sst`                  | `sparo status`                                      |


## Functions

| Command                | Description                                                                    |
| :--------------------- | :----------------------------------------------------------------------------- |
| `git_main_branch`      | Returns the name of the main branch: `main` if it exists, `master` otherwise.  |