# 一键部署到 GitHub Pages
# 用法：在 PowerShell 中运行 .\scripts\deploy.ps1

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

# 确保 gh 在 PATH 中
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')

Write-Host "==> 检查 GitHub 登录状态..."
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "尚未登录 GitHub，请按提示完成浏览器授权："
  gh auth login --hostname github.com --git-protocol https --web
}

$User = (gh api user -q .login)
$Repo = 'booksnotes'
Write-Host "==> 当前账号: $User"
Write-Host "==> 目标仓库: $User/$Repo"

# 重新生成主页
node scripts/build-home.mjs
node scripts/inject-home-link.mjs

# 提交变更
git add -A
$status = git status --porcelain
if ($status) {
  git commit -m "Update bookshelf site"
}

# 创建远程仓库（若不存在）并推送
$remoteUrl = "https://github.com/$User/$Repo.git"
if (-not (git remote get-url origin 2>$null)) {
  git remote add origin $remoteUrl
} else {
  git remote set-url origin $remoteUrl
}

Write-Host "==> 创建/更新 GitHub 仓库..."
gh repo create $Repo --public --source=. --remote=origin --push 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "仓库已存在，直接推送..."
  git push -u origin main
}

Write-Host "==> 启用 GitHub Pages (Actions)..."
gh api -X PUT "repos/$User/$Repo/pages" -f "build_type=workflow" 2>$null

$PagesUrl = "https://$User.github.io/$Repo/"
Write-Host ""
Write-Host "部署完成！" -ForegroundColor Green
Write-Host "访问地址: $PagesUrl"
Write-Host "首次部署 Actions 需 1-3 分钟，可在 GitHub 仓库 Actions 页查看进度。"
