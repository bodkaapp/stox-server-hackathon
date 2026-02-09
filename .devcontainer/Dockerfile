# ベースイメージの使用
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# rootユーザーとしてツールのインストールとユーザーの作成を実行
USER root

# # oh-my-zshのプラグインとテーマを追加
RUN apt-get update \
  && sudo apt-get install -y bat \
  && ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}" \
  && mkdir -p "$ZSH_CUSTOM/plugins" \
  && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-"$HOME/.oh-my-zsh/custom"}/plugins/zsh-autosuggestions \
  && git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-"$HOME/.oh-my-zsh/custom"}/plugins/zsh-syntax-highlighting \
  && git clone https://github.com/fdellwing/zsh-bat "$ZSH_CUSTOM/plugins/zsh-bat" \
  && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"

# zshの設定ファイルをコピー
# COPY ./zsh/.zshrc /root/.zshrc # devcontainerのcommon-utilsでインストールされるときに上書きされて、postCreateCommandでコピーされるのでコメントアウト
COPY ./zsh/p10k-instant-prompt.zsh /root/.cache/p10k-instant-prompt-root.zsh
COPY ./zsh/.p10k.zsh /root/.p10k.zsh

# lazydockerをインストール
RUN curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash

# PythonとGoogle Cloud SDKをインストール
RUN apt-get update && apt-get install -y python3 python3-pip apt-transport-https ca-certificates gnupg curl \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list \
    && apt-get update && apt-get install -y google-cloud-sdk

# Gemini CLIをグローバルにインストール
RUN npm install -g @google/gemini-cli