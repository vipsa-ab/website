---
description: Analyze unmerged changes and create GitHub issues for each logical grouping, then link them to commits
---

Analyze all changes not yet merged into the main branch, group them into logical issues, and create GitHub issues for review before opening PRs.

## Pre-flight Checks

1. **Check for sensitive files** in staged/unstaged changes:
   ```bash
   git status --short
   git diff --cached --name-only | grep -iE '(\.env|\.key|credential|secret|pem|token|secrets)'
   git diff --name-only | grep -iE '(\.env|\.key|credential|secret|pem|token|secrets)'
   ```
   If any found, stop and ask user to handle them.

2. **Gather current state**:
   ```bash
   git status --short
   git log origin/main..HEAD --oneline
   git diff origin/main --stat
   git diff origin/main --name-only
   git stash list
   ```
   Also check untracked files that may be part of a feature.

## Change Analysis

From the output above, identify logical groupings of changes. Group by:

- **Theme/feature** — all files related to the same feature
- **Type of change** — refactors, new features, bug fixes
- **Independence** — changes that could ship independently vs. those that must ship together
- **Scope** — service/feature area, component layer (UI, logic, styles, assets)

If changes are already on commits with clear messages, use those as the basis for grouping.

## Issue Template Selection

For each group, determine the appropriate template:

| Signal | Template |
|--------|----------|
| Bug fix, error handling, broken behavior | `bug_report.yml` |
| New feature, enhancement, new capability | `feature_request.yml` |
| Refactor, performance, code quality | `feature_request.yml` (describes the improvement) |
| Config, tooling, CI, dependencies | `feature_request.yml` |
| Mixed — contains both bug fix and feature | Split into separate issues if possible, otherwise `feature_request.yml` |

## Issue Title Format

Use conventional commit style:
```
<type>(<scope>): short description
```

Examples:
- `feat(services): update Stockholm page content and imagery`
- `fix(nav): correct mobile menu z-index`
- `feat(assets): add Stockholm-specific service images`

## For Each Issue, Gather

Ask the user (one at a time):

1. **Issue title** — suggest based on the change grouping, confirm/adjust
2. **Template type** — confirm bug_report or feature_request
3. **Description** — help the user articulate:
   - Bug report: problem, expected vs actual, steps to reproduce
   - Feature request: problem solved, proposed solution, affected area
4. **Affected area** (feature_request only):
   - Pages, Components, Styles, Assets, Config, CI, Tests, Other
5. **Priority hint** — ask: Is this high, medium, or low priority?

## Issue Body Construction

### Bug Report Template:
```markdown
### Pre-flight Checks
- [x] I have searched existing issues and this is not a duplicate
- [x] I understand this issue needs status:approved before a PR can be opened

### Bug Description
<description of the bug from the changes>

### Expected Behavior
<what should happen>

### Actual Behavior
<what happens instead — use commits/diffs as reference>

### Affected Area
<file paths or components affected>

### Related Commits
```
<output of git log origin/main..HEAD --oneline for this group>
```

### Changes
| File | Change |
|------|--------|
| `path/to/file` | What changed |
```

### Feature Request Template:
```markdown
### Pre-flight Checks
- [x] I have searched existing issues and this is not a duplicate
- [x] I understand this issue needs status:approved before a PR can be opened

### Problem Description
<pain point this change solves>

### Proposed Solution
<what the change does and why>

### Affected Area
<dropdown value>

### Related Commits
```
<output of git log origin/main..HEAD --oneline for this group>
```

### Changes
| File | Change |
|------|--------|
| `path/to/file` | What changed |
```

## Execution Flow

1. **Show the proposed issue plan**:
   ```
   Proposed issues to create:
   
   Issue 1: [title]
   Template: bug_report | feature_request
   Files: file1, file2
   Commits: abc123, def456
   
   Issue 2: [title]
   ...
   ```
   Wait for user confirmation.

2. **Search for duplicates** before creating each issue:
   ```bash
   gh issue list --search "<title keywords>"
   ```
   If a matching issue exists, ask user if they want to:
   - Link the existing issue instead of creating a new one
   - Create a new one anyway
   - Skip this group

3. **Create each issue**:
   ```bash
   gh issue create --template "<template>.yml" --title "<title>" --body "<body>"
   ```

4. **Track created issues** — note the issue numbers and titles.

5. **After all issues are created**, provide a summary with:
   - Issue numbers and URLs
   - Which commits/branch relate to each
   - A reminder that issues need `status:approved` before PRs can be opened

## Post-Creation Summary

```
Created issues:

1. #[N] — feat(services): update Stockholm page
   URL: <url>
   Template: feature_request
   Commits: 398a0cd, 0423cbb
   Branch: feat/update-service-page
   → Needs status:approved before PR

2. #[M] — fix(nav): correct mobile z-index
   URL: <url>
   Template: bug_report
   Commits: abc1234
   Branch: feat/fix-nav-mobile
   → Needs status:approved before PR

Remember: Open PRs only after the maintainer adds status:approved to each issue.
```