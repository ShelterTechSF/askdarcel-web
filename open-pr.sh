#!/bin/bash

# Colors for fun and profit
BOLD="\033[1m"
YELLOW="\033[38;5;11m"
RESET="\033[0m"

# Get the current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Set base branch to `development`
# The IMPORTANT part 😅
URL="https://github.com/Exygy/askdarcel-web/compare/development...Exygy:askdarcel-web:${BRANCH_NAME}?expand=1"

# Localize rules for affirmative and negative responses (LC_MESSAGES) and write them to environment variables
set -- $(locale LC_MESSAGES)
yesexpr="$1"; noexpr="$2"; yesword="$3"; noword="$4"

# Prompt loop
while true; do
    read -p "Open a PR for your branch $(printf $BOLD$YELLOW$BRANCH_NAME$RESET) (${yesword}/${noword})? " yn
    if [[ "$yn" =~ $yesexpr ]]; then open $URL; echo "Yay, happy code review! 👏👏👏"; exit; fi
    if [[ "$yn" =~ $noexpr ]]; then echo "Oh ok. Happy coding! 👩‍💻"; exit; fi
done
