有时候用命令行比图形界面还顺手，所以按自己的印象记下常用的命令。

- `git clone [url]` 克隆仓库
- `git remote set-url origin git@github:USERNAME/REPOSITORY.git` 从HTTPS切换到SSH(就不用再输密码了)
- `git remote set-url origin https://github.com/USERNAME/REPOSITORY.git` 切换会HTTPS
- `git status` 查看当前仓库状态
- `git log` 查看当前分支的版本历史
- `git diff` 显示暂存区和工作区的差异
- `git add .` 添加所有更改到暂存区
- `git commit -m 'comit'` 提交到仓库
- `git push origin master` 推送到远程仓库
- `git commit --amend -m [message]` 用一次新的提交替代上一次提交，可以用来更改commit的提交信息
- `git branch -r / git branch` 列出所有的远程/本地分支
- `git branch -b [branch]` 新建一个分支 并跳到该分支
- `git branch --track [branch] [remote-branch]` 新建一个分支并与制定的远程分支建立追踪关系
- `git checkout [branch]` 切换到一个分支
- `git checkout -` 切换到上一个分支
- `git branch -d [branch]` 删除分支
- `git push origin --delete [branch]` 删除远程分支
- `git merge [branch]` 合并制定分支到当前分支
- `git checkout .` 恢复暂存区所有文件到工作区
- `git pull [remote] [branch]` 拉取远程分支的变化并与本地分支合并
- `git checkout [commit] [file]` 恢复某个commit的制定文件到暂存区和工作区
- `git reset [file]` 重置暂存区文件，与上一次commit保持一致，工作区不变
- `git reset --hard` 重置暂存区和工作区，与上一次commit保持一致
- `git reset --keep [commit]` 重置当前head为指定commit， 但暂存区和工作区不变
- `git revert [commit]` 新建一个commit用来撤销指定的commit

### 其他配置
- `git config --global user.name "your username"` 
- `git config --global user.email youremail`
- `ssh-keygen -t rsa` 生成私钥和公钥