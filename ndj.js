#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const readline = require('readline');

const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-versions/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", desc: "Versão Estável (Recomendada)" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", desc: "Novos Recursos (Instável)" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

if (process.argv[2] !== 'portal') {
    console.log("\x1b[31m%s\x1b[0m", "\n[!] Use: ./ndj portal");
    process.exit(0);
}

console.clear();
console.log("\x1b[35m%s\x1b[0m", `
 ███▄    █ ▓█████▄  ▄▄▄       ██▓
 ██ ▀█   █ ▒██▀ ██▌▒████▄    ▓██▒
▓██  ▀█ ██▒░██   █▌▒██  ▀█▄  ▒██▒
▓██▒  ▐▌██▒░▓█▄   ▌░██▄▄▄▄██ ░██░
▒██░   ▓██░░▒████▓  ▓█   ▓██▒░██░
 ░ ▒░   ▒ ▒  ▒▒▓  ▒  ▒▒   ▓▒█░░▓  
 ░ ░░   ░ ▒░ ░ ▒  ▒   ▒   ▒▒ ░ ▒ ░
    ░   ░ ░  ░ ░  ░   ░   ▒    ▒ ░
          ░    ░          ░  ░ ░  
             ░                    
`);
console.log("\x1b[32m%s\x1b[0m", " --- PORTAL DE INSTALAÇÃO DINÂMICA --- \n");

Object.keys(versoes).forEach(k => {
    console.log(`\x1b[33m[${k}]\x1b[0m \x1b[1mv${versoes[k].nome}\x1b[0m - ${versoes[k].desc}`);
});

rl.question("\n\x1b[36mEscolha uma versão para baixar:\x1b[0m ", (opt) => {
    const v = versoes[opt];
    if (!v) {
        console.log("\x1b[31mSaindo...\x1b[0m");
        process.exit(0);
    }

    console.log(`\n\x1b[33m[...]\x1b[0m Baixando componentes de \x1b[1mv${v.nome}\x1b[0m...`);

    const fileStream = fs.createWriteStream("index.js");
    https.get(`${repoBase}/${v.folder}/index.js`, (res) => {
        if (res.statusCode !== 200) {
            console.log("\x1b[31mErro no servidor GitHub!\x1b[0m");
            process.exit(1);
        }

        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log("\x1b[32m%s\x1b[0m", "\n✅ SUCESSO: A Ndj-lib foi instalada!");
            console.log("Para iniciar o bot, use: \x1b[1mnode index.js\x1b[0m\n");
            process.exit(0);
        });
    }).on('error', (e) => {
        console.log("\x1b[31mErro de conexão:\x1b[0m " + e.message);
        process.exit(1);
    });
});
