type .\.nvmrc | %{$_ -replace "v",""} | %{nvm install $_}
type .\.nvmrc | %{$_ -replace "v",""} | %{nvm use $_}

# This enables the use of the bundled Yarn.
npm i -g corepack
corepack enable
