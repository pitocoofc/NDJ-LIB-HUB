🛠️ Ndj-lib | Hub de Instalação
O comando definitivo para gerenciar suas instâncias Ndj. 🛰️
Este repositório é o Instalador Oficial da Ndj-lib. Em vez de baixar arquivos pesados ou clonar múltiplos repositórios, você usa este hub para injetar a versão desejada diretamente no seu ambiente de trabalho.
🚀 Versões Disponíveis no Portal
Através do instalador, você tem acesso imediato a:
Ndj-Lite: Focada em performance extrema e baixo consumo de RAM para Termux.
Ndj-Full: A experiência completa com todos os módulos e mistérios da lib.
Ndj-Canary: Versões de teste com recursos experimentais antes de todo mundo.
📥 Como Iniciar a Instalação
No seu Termux (ou qualquer terminal com Node.js), execute o ritual:
# 1. Obtenha o hub instalador
git clone https://github.com/pitocoofc/Ndj-lib.git

# 2. Entre no diretório
cd Ndj-lib
chmod +x ndj

# 3. Inicie o seletor de versões
./ndj portal


🧠 Como o Hub Funciona
O instalador utiliza uma arquitetura de entrega sob demanda. Quando você seleciona uma versão:
Ele se conecta ao nosso repositório de versões (NDJ-LIB-version).
Puxa o arquivo index.js via stream (economizando até 150MB de RAM durante o processo).
Configura o ambiente local para rodar a versão escolhida instantaneamente.
⚠️ Aviso Importante
NÃO BAIXE DIRETAMENTE: O repositório de versões é uma biblioteca de suporte. Para garantir que os arquivos funcionem e não quebrem o seu bot, utilize sempre o comando ./ndj portal deste hub.
Desenvolvido com foco em otimização por ghost ou pitocoofc. 👾




## 🛡️ Licença e Direitos

Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo sob os termos da **GNU General Public License** conforme publicada pela Free Software Foundation; tanto a **versão 2** da Licença, como (a seu critério) qualquer versão posterior.

Este programa é distribuído na esperança de que possa ser útil, mas **SEM NENHUMA GARANTIA**. Veja a licença completa no arquivo `LICENSE` para mais detalhes.
