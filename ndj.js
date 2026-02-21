#!/usr/bin/env node
/*
 * Ndj-lib Installer Hub - Lean Edition (Otimizado para Espaço)
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const versoes = {
    "1": { 
        nome: "1.0.9", 
        repo: "https://github.com/pitocoofc/Ndj-lib.git", 
        desc: "Versão Estável (Limpeza de Mídia Ativada)" 
    }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Função para deletar arquivos inúteis e economizar ~9.5MB
function limparArquivosPesados(diretorio) {
    const extensoesParaRemover = ['.mp4', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    
    if (!fs.existsSync(diretorio)) return;

    const arquivos = fs.readdirSync(diretorio);

    arquivos.forEach(arquivo => {
        const caminhoCompleto = path.join(diretorio, arquivo);
        const stat = fs.statSync(caminhoCompleto);

        if (stat.isDirectory()) {
            limparArquivosPesados(caminhoCompleto);
        } else {
            const ext = path.extname(arquivo).toLowerCase();
            if (extensoesParaRemover.includes(ext)) {
                try {
                    fs.unlinkSync(caminhoCompleto);
                } catch (e) {
                    // Ignora se o arquivo estiver ocupado
                }
            }
        }
    });
}

async function instalar(v) {
    try {
        console.log(`\n\x1b[33m[1/3]\x1b[0m 🚀 Baixando v${v.nome} de ${v.repo}...`);
        
        // Instala via NPM para garantir a hierarquia src/index.js
        execSync(`npm install ${v.repo} --save`, { stdio: 'inherit' });

        console.log(`\x1b[33m[2/3]\x1b[0m 🧹 Otimizando espaço (Removendo vídeos e imagens)...`);
        
        // O alvo é a pasta dentro de node_modules com o nome definido no package.json
        const caminhoLib = path.join(process.cwd(), 'node_modules', 'easy-djs-bot');
        limparArquivosPesados(caminhoLib);

        console.log(`\x1b[33m[3/3]\x1b[0m 🛠️  Criando ponteiro de acesso...`);
        if (!fs.existsSync('index.js')) {
            const entryCode = "const { EasyBot } = require('easy-djs-bot');\nmodule.exports = { EasyBot };";
            fs.writeFileSync('index.js', entryCode);
        }

        console.log("\x1b[32m%s\x1b[0m", "\n✅ SUCESSO: Ndj-lib instalada e otimizada!");
        console.log(`📦 Espaço economizado: ~9.5MB (Vídeos/Imagens removidos).`);
        console.log(`\nUse no seu código: \x1b[1mconst { EasyBot } = require('./index.js');\x1b[0m\n`);
        
        process.exit(0);
    } catch (e) {
        console.log("\x1b[31m\n❌ ERRO:\x1b[0m " + e.message);
        process.exit(1);
    }
}

console.clear();
console.log("\x1b[36m --- NDJ-LIB LEAN INSTALLER ---\x1b[0m\n");

Object.keys(versoes).forEach(k => {
    console.log(`\x1b[33m[${k}]\x1b[0m \x1b[1mv${versoes[k].nome}\x1b[0m - ${versoes[k].desc}`);
});

rl.question("\nInstalar agora? (Digite o número): ", (opt) => {
    const v = versoes[opt];
    if (!v) process.exit(0);
    instalar(v);
});
