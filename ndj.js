#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const readline = require('readline');

// Configuração apontando para o seu repositório de versões
const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-version/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", size: "1.2MB" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", size: "1.5MB" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const args = process.argv.slice(2);
if (args[0] !== 'portal') {
    console.log("\n❌ Use: node ndj.js portal");
    process.exit(0);
}

console.log("\n--- NDJ-LIB: PORTAL DE INSTALAÇÃO ---");
Object.keys(versoes).forEach(key => {
    console.log(`[${key}] Versão ${versoes[key].nome} - Tamanho: ${versoes[key].size}`);
});

rl.question("\nSelecione o número da versão: ", (opt) => {
    const v = versoes[opt];
    if (!v) {
        console.log("Saindo...");
        process.exit(0);
    }

    // O arquivo será baixado na pasta onde o usuário está
    const fileUrl = `${repoBase}/${v.folder}/index.js`;
    const fileStream = fs.createWriteStream("index.js");

    console.log(`\n📥 Puxando v${v.nome} do repositório 'version'...`);

    https.get(fileUrl, (res) => {
        if (res.statusCode !== 200) {
            console.log("❌ Erro ao acessar o GitHub: " + res.statusCode);
            process.exit(1);
        }
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log("✅ Sucesso! O arquivo 'index.js' foi gerado.");
            process.exit(0);
        });
    }).on('error', (err) => {
        console.log("❌ Erro de conexão: " + err.message);
        process.exit(1);
    });
});
