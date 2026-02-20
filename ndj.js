#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-version/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", size: "1.2MB" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", size: "1.5MB" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const args = process.argv.slice(2);
if (args[0] !== 'portal') {
    console.log("\n❌ Erro: Use o comando: ./ndj portal");
    process.exit(0);
}

console.log(`
=========================================
      NDJ-LIB PORTAL - FULL EDITION      
=========================================
`);

Object.keys(versoes).forEach(key => {
    console.log(`[${key}] Versão ${versoes[key].nome} (${versoes[key].size})`);
});

rl.question("\nDigite o número da versão (ou 'sair'): ", (opt) => {
    if (opt.toLowerCase() === 'sair') process.exit(0);
    
    const v = versoes[opt];
    if (!v) {
        console.log("❌ Opção inválida!");
        process.exit(0);
    }

    const destPath = path.join(process.cwd(), "index.js");
    const fileUrl = `${repoBase}/${v.folder}/index.js`;
    const fileStream = fs.createWriteStream(destPath);

    console.log(`\n📥 Baixando v${v.nome} de NDJ-LIB-version...`);

    https.get(fileUrl, (res) => {
        if (res.statusCode !== 200) {
            console.log(`❌ Erro no Servidor: ${res.statusCode}`);
            process.exit(1);
        }

        res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log("✅ Instalação concluída com sucesso!");
            console.log(`📂 Arquivo salvo em: ${destPath}`);
            console.log("🚀 Inicie com: node index.js");
            process.exit(0);
        });
    }).on('error', (err) => {
        console.log("❌ Erro de conexão: " + err.message);
        process.exit(1);
    });
});
