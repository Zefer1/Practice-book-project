# Git Workflow Guide

## 1. Create a New Repository

### On GitHub
1. Go to github.com → **New repository**
2. Name it, set visibility, skip README
3. Copy the repo URL

### Locally
```bash
git init
git checkout -b dev          # start on dev, not main
git remote add origin https://github.com/user/repo.git
```

---

## 2. First Commit & Push

```bash
git add .
git commit -m "feat: initial commit"
git push -u origin dev
```

> `-u` sets the upstream so future `git push` needs no arguments.

---

## 3. Start Work on a New Feature

Always branch off `dev`, never off `main`.

```bash
git checkout dev
git pull origin dev           # sync before branching
git checkout -b feature/my-feature
```

Branch naming conventions:
- `feature/` — new functionality
- `fix/` — bug fixes
- `chore/` — tooling, deps, config

---

## 4. Make Changes & Commit

```bash
# stage specific files (safer than git add .)
git add src/routes/books.ts

# or stage everything
git add .

git status                    # verify what's staged
git commit -m "feat: add GET /books endpoint"
```

### Commit message format (Conventional Commits)
```
<type>: <short description>

feat:     new feature
fix:      bug fix
chore:    maintenance, deps
refactor: code change, no behavior change
docs:     documentation only
```

---

## 5. Push the Feature Branch

```bash
git push -u origin feature/my-feature
```

---

## 6. Open a Pull Request (PR) on GitHub

1. Go to your repo on GitHub
2. GitHub shows a banner → **Compare & pull request**
3. Set:
   - **base branch**: `dev`  ← merge INTO here
   - **compare branch**: `feature/my-feature`
4. Write a title and description
5. Click **Create pull request**

---

## 7. Review & Merge the PR

On GitHub:
- Review the diff
- Request reviewers if needed
- Once approved → **Squash and merge** (keeps `dev` history clean)
- Delete the feature branch after merge

---

## 8. Sync Local dev After Merge

```bash
git checkout dev
git pull origin dev
git branch -d feature/my-feature   # delete local branch
```

---

## 9. Repeat

```
dev (stable)
 └── feature/x    →  PR  →  dev
 └── fix/y        →  PR  →  dev
 └── feature/z    →  PR  →  dev
```

`main` is only updated from `dev` when cutting a release.

---

## Quick Reference

| Action | Command |
|---|---|
| Check status | `git status` |
| See branches | `git branch -a` |
| Switch branch | `git checkout <branch>` |
| Create + switch | `git checkout -b <branch>` |
| Pull latest | `git pull origin <branch>` |
| Stage all | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin <branch>` |
| Delete local branch | `git branch -d <branch>` |
| Delete remote branch | `git push origin --delete <branch>` |
