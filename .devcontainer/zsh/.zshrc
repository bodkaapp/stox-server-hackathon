# Powerlevel10k の高速なプロンプトを有効化します。~/.zshrc の上部に記述する必要があります。
# パスワードプロンプトや [y/n] の確認など、コンソール入力を必要とする可能性のある初期化コードは、
# このブロックの上に記述する必要があります。それ以外のものはすべて下に記述してもかまいません。
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Oh My Zsh のインストールパス。
export ZSH="$HOME/.oh-my-zsh"

# 読み込むテーマ名を設定します --- "random" に設定すると、
# Oh My Zsh が読み込まれるたびにランダムなテーマが読み込まれます。
# どのテーマが読み込まれたかを知るには、echo $RANDOM_THEME を実行します。
# https://github.com/ohmyzsh/ohmyzsh/wiki/Themes を参照してください。
ZSH_THEME="devcontainers"

# 読み込むプラグイン。
# 標準プラグインは $ZSH/plugins/ にあります。
# カスタムプラグインは $ZSH_CUSTOM/plugins/ に追加できます。
# 例: plugins=(rails git textmate ruby lighthouse)
# プラグインを多く追加するとシェルの起動が遅くなるので、賢く追加してください。
plugins=(git zsh-autosuggestions zsh-syntax-highlighting docker zsh-bat)

ZSH_THEME="powerlevel10k/powerlevel10k"

source $ZSH/oh-my-zsh.sh

# ユーザー設定

# Oh My Zsh のライブラリ、プラグイン、テーマで提供されるエイリアスを上書きする個人用エイリアスを設定します。
# エイリアスはここに配置できますが、Oh My Zsh ユーザーは
# $ZSH_CUSTOM フォルダ内のトップレベルファイルに .zsh 拡張子でエイリアスを定義することが推奨されます。例:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# 有効なエイリアスの一覧を表示するには、`alias` を実行します。
zstyle ':omz:update' mode disabled

# プロンプトをカスタマイズするには、`p10k configure` を実行するか、~/.p10k.zsh を編集します。
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export PATH=$HOME/.local/bin:$PATH

# zsh履歴ファイルの場所を指定
export HISTFILE=~/.zsh/.zsh_history