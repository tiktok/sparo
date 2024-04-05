if typeset -f git_main_branch > /dev/null; then
  # Reuse git_main_branch if it's defined in git plugin
else
  # https://github.com/ohmyzsh/ohmyzsh/blob/1d09c6bb0a950756a65b02457842933e3aa493eb/plugins/git/git.plugin.zsh#L34
  # Check if main exists and use instead of master
  function git_main_branch() {
    command git rev-parse --git-dir &>/dev/null || return
    local ref
    for ref in refs/{heads,remotes/{origin,upstream}}/{main,trunk,mainline,default,master}; do
      if command git show-ref -q --verify $ref; then
        echo ${ref:t}
        return 0
      fi
    done

    # If no main branch was found, fall back to master but return error
    echo master
    return 1
  }
fi

# Aliases
# (order should follow README)

alias sa='sparo add'
alias sb='sparo branch'
alias sco='sparo checkout'
alias scm='sparo checkout $(git_main_branch)'
alias scl='sparo clone'
alias sc='sparo commit'
alias scmsg='sparo commit --message'
alias sc!='sparo commit --amend'
alias sd='sparo diff'
alias sf='sparo fetch'
alias sfo='sparo fetch origin'
alias sl='sparo pull'
alias sp='sparo push'
alias spf!='sparo push --force'
alias spf='sparo push --force-with-lease --force-if-includes'
alias srb='sparo rebase'
alias srba='sparo rebase --abort'
alias srbc='sparo rebase --continue'
alias srbi='sparo rebase --interactive'
alias sst='sparo status'