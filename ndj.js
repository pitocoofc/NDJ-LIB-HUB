#!/usr/bin/env node
/*
 * Ndj-lib Installer Hub - "The Surgeon" Edition
 * Copyright (C) 2026 pitocoofc | GPL v2
 */

const https = require('https');
const fs = require('fs');
const readline = require('readline');

const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-versions-/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", desc: "Versão Estável (Recomendada)" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", desc: "Novos Recursos (Instável)" }
};

const idiomas = {
    "1": { nome: "Português", file: "pt.dnt" },
    "2": { nome: "English", file: "en.dnt" },
    "3": { nome: "Español", file: "esp.dnt" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Função auxiliar para download síncrono
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
            if (res.statusCode !== 200) reject(`Status: ${res.statusCode}`);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e.message); });
    });
}

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

rl.question("\n\x1b[36mEscolha uma versão:\x1b[0m ", async (opt) => {
    const v = versoes[opt];
    if (!v) { console.log("Saindo..."); process.exit(0); }

    console.log("\n--- Idiomas Disponíveis ---");
    Object.keys(idiomas).forEach(i => console.log(`[${i}] ${idiomas[i].nome}`));

    rl.question("\n\x1b[36mEscolha o idioma:\x1b[0m ", async (iOpt) => {
        const lang = idiomas[iOpt] || idiomas["1"];

        try {
            console.log(`\n\x1b[33m[1/2]\x1b[0m Baixando núcleo de \x1b[1mv${v.nome}\x1b[0m...`);
            // Baixa o index.js padrão (o esqueleto)
            await downloadFile(`${repoBase}/${v.folder}/index.js`, "index.js");

            console.log(`\x1b[33m[2/2]\x1b[0m Aplicando patch de tradução [\x1b[1m${lang.nome}\x1b[0m]...`);
            // Baixa o patch .dnt temporário
            await downloadFile(`${repoBase}/${v.folder}/${lang.file}`, "patch.temp");

            // A "Cirurgia": Lê o patch e injeta no index.js
            const patchContent = fs.readFileSync("patch.temp", "utf8");
            fs.writeFileSync("index.js", patchContent);

            // Limpeza
            fs.unlinkSync("patch.temp");

            console.log("\x1b[32m%s\x1b[0m", "\n✅ SUCESSO: Ndj-lib instalada e traduzida!");
            console.log("Para iniciar, use: \x1b[1mnode index.js\x1b[0m\n");
            process.exit(0);

        } catch (e) {
            console.log("\x1b[31m\n❌ ERRO NA INSTALAÇÃO:\x1b[0m " + e);
            process.exit(1);
        }
    });
});
