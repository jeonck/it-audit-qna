# Git 히스토리에서 특정 파일 완전히 제거하기

이 문서는 민감한 정보나 불필요한 파일이 Git 히스토리에 포함되었을 때, 이를 완전히 제거하는 절차를 설명합니다. 여기서는 `git-filter-repo` 도구를 사용합니다.

**경고:** 이 작업은 Git 히스토리를 강제로 덮어쓰게 되므로, 팀원과 충분히 협의한 후 신중하게 진행해야 합니다.

---

## 1. `git-filter-repo` 설치

`git-filter-repo`는 Git 히스토리를 빠르고 안전하게 필터링할 수 있는 강력한 도구입니다.

- **macOS (Homebrew 사용):**
  ```bash
  brew install git-filter-repo
  ```

- **기타 (Python pip 사용):**
  ```bash
  pip3 install git-filter-repo
  ```

## 2. 로컬에서 파일 삭제 (선택 사항)

히스토리에서 제거할 파일이 현재 로컬 디렉토리에 남아있다면 먼저 삭제합니다.

```bash
# 예시: scripts/seed.js 파일 삭제
rm scripts/seed.js
```

## 3. `git-filter-repo`를 사용하여 히스토리에서 파일 제거

다음 명령어를 실행하여 Git 히스토리에서 특정 파일(`scripts/seed.js`)을 제거합니다.

- `--path`: 제거할 파일의 경로를 지정합니다.
- `--invert-paths`: 지정된 경로를 제외하는 것이 아니라, **지정된 경로만** 제거하도록 설정합니다.
- `--force`: `git-filter-repo`는 안전을 위해 새로운 클론(fresh clone)에서만 동작하도록 설계되었습니다. 기존 저장소에서 강제로 실행하려면 이 옵션을 추가해야 합니다.

```bash
git filter-repo --path scripts/seed.js --invert-paths --force
```

이 명령을 실행하면, `git-filter-repo`는 지정된 파일이 포함되지 않은 새로운 히스토리를 생성합니다.

## 4. 원격 저장소(Remote) 다시 추가

`git-filter-repo`는 히스토리 조작 후 실수로 이전 히스토리에 덮어쓰는 것을 방지하기 위해 원격 저장소 설정을 자동으로 제거합니다. 따라서 원격 저장소를 다시 추가해야 합니다.

```bash
# 예시: 'origin'이라는 이름으로 원격 저장소 추가
git remote add origin https://github.com/your-username/your-repo.git
```

## 5. 변경된 히스토리를 원격 저장소에 강제 푸시(Force Push)

로컬에서 새로 생성된 히스토리를 원격 저장소에 반영하려면 강제 푸시를 해야 합니다.

**경고:** 강제 푸시는 원격 저장소의 히스토리를 덮어쓰므로, 다른 팀원이 작업 중인 내용이 유실되지 않도록 반드시 사전에 동기화하고 협의해야 합니다.

```bash
git push -f origin main
```

## 6. 확인

푸시가 완료된 후, GitHub 저장소에서 해당 파일이 히스토리에서 완전히 사라졌는지 확인합니다.

---

이제 민감한 정보가 포함된 파일이 Git 히스토리에서 완전히 제거되었습니다.
