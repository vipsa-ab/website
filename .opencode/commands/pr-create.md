---
description: Create a structured pull request with issue linkage, type label, checklist, and automated validation
---

Create a pull request for the current branch, following the team's issue-first enforcement system.

## Pre-flight Checks

Before opening a PR, verify ALL of the following:

1. **Branch name** matches:
   ```
   ^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$
   ```
   - Run: `git branch --show-current`
   - If invalid, stop and ask user to rename the branch

2. **Commits** follow conventional commits:
   ```
   ^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+
   ```
   - Run: `git log origin/main..HEAD --oneline` (or target base branch)
   - If any commit is malformed, stop and ask user to squash/rebase

3. **No new sensitive files** have been staged:
   - Check for `.env`, `*.key`, `credentials`, `*.pem`, `secrets.json`, `token`, `*.secret`
   - Run: `git diff --cached --name-only | grep -iE '(\.env|\.key|credential|secret|pem|token)'`
   - If any found, stop and ask

4. **No `Co-Authored-By` trailers** in commit messages:
   - Run: `git log --format="%B" -n 5 | grep -i "Co-Authored-By"`
   - If found, stop and ask to remove before continuing

## Information Gathering

Ask the user for the following (one at a time):

1. **Issue number** to link:
   - The issue MUST have the `status:approved` label
   - Example: "What's the GitHub issue number to link? (e.g. 42)"

2. **PR type** — ask which ONE applies:
   - Bug fix
   - New feature
   - Documentation only
   - Code refactoring
   - Maintenance/tooling
   - Breaking change

3. **Summary** — 1-3 bullet points of what the PR does

4. **Changes table** — ask for a list of changed files with a one-line description of each:
   - If the user can't provide it, generate it from `git diff --stat`

5. **Manual test plan** — confirm what was tested locally:
   - Example responses: "ran pnpm test", "tested contact form in dev", "verified mobile layout"

## PR Body Template

Build the PR body using this structure:

```markdown
## Linked Issue

Closes #<issue-number>

## PR Type

- [ ] Bug fix
- [ ] New feature
- [x] Documentation only
- [ ] Code refactoring
- [ ] Maintenance/tooling
- [ ] Breaking change

## Summary

- Bullet 1: what changed
- Bullet 2: what changed
- Bullet 3: what changed (optional)

## Changes

| File | Change |
|------|--------|
| `path/to/file1` | What changed |
| `path/to/file2` | What changed |

## Test Plan

- [x] All automated checks pass (CI green)
- [x] Manually tested: <user-provided test plan>
- [x] No `Co-Authored-By` trailers in commits
- [x] Conventional commit format verified
```

## Label Mapping

Apply EXACTLY one label from the checked PR type:

| Checked type | Label to apply |
|---|---|
| Bug fix | `type:bug` |
| New feature | `type:feature` |
| Documentation only | `type:docs` |
| Code refactoring | `type:refactor` |
| Maintenance/tooling | `type:chore` |
| Breaking change | `type:breaking-change` |

## Execution Flow

1. Show a summary of the PR to be created (title, body preview, label) and wait for user confirmation before creating it.
2. After confirmation, run:
   ```bash
   # Ensure branch is pushed
   git push origin $(git branch --show-current)
   ```
3. Create the PR:
   ```bash
   gh pr create --title "<title>" --body "<body>" --base <target-branch>
   ```
   - Title format: `<type>(<scope>): <description>` (e.g. `feat(services): update Stockholm page content`)
   - Use the conventional commit type matching the PR type
4. Add the type label:
   ```bash
   gh pr edit <pr-number> --add-label "<label>"
   ```
5. Report the PR URL, linked issue, and label applied.

## Checklist Reminder

Before creating the PR, confirm ALL items are checked:

- [ ] Issue has `status:approved` label
- [ ] Branch name matches the naming convention
- [ ] All commits follow conventional commit format
- [ ] No sensitive files staged
- [ ] No `Co-Authored-By` trailers in commits
- [ ] PR body includes: linked issue, checked PR type, summary, changes table, test plan
- [ ] Exactly one `type:*` label will be added to the PR