#!/usr/bin/env node
/*
 * Ndj-lib Installer Hub - "The Surgeon" Edition
 * Copyright (C) 2026 pitocoofc | GPL v2
 */

const https = require('https');
const fs = require('fs');
const readline = require('readline');

// Link da Warehouse corrigido conforme seu teste de curl
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

// Função de download com timeout e tratamento de erro 404
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, (res) => {
            if (res.statusCode === 404) {
                fs.unlink(dest, () => {});
                reject(`Arquivo não encontrado (404) na Warehouse.`);
                return;
            }
            if (res.statusCode !== 200) {
                fs.unlink(dest, () => {});
                reject(`Erro HTTP: ${res.statusCode}`);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        });

        request.on('error', (e) => {
            fs.unlink(dest, () => {});
            reject(`Erro de conexão: ${e.message}`);
        });

        // Timeout de 15 segundos para conexões lentas (J1 friendly)
        request.setTimeout(15000, () => {
            request.destroy();
            reject("Tempo de conexão esgotado.");
        });
    });
}

async function main() {
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
        if (!v) {
            console.log("\x1b[31mOpção inválida. Saindo...\x1b[0m");
            process.exit(0);
        }

        console.log("\n--- Idiomas Disponíveis ---");
        Object.keys(idiomas).forEach(i => console.log(`[${i}] ${idiomas[i].nome}`));

        rl.question("\n\x1b[36mEscolha o idioma:\x1b[0m ", async (iOpt) => {
            const lang = idiomas[iOpt] || idiomas["1"];

            try {
                // CORREÇÃO CRÍTICA: Removido o download do index.js que dava 404
                // Agora baixamos o .dnt e ele se torna o index.js
                console.log(`\n\x1b[33m[...]\x1b[0m Baixando e injetando núcleo [\x1b[1m${lang.nome}\x1b[0m]...`);
                
                const targetUrl = `${repoBase}/${v.folder}/${lang.file}`;
                await downloadFile(targetUrl, "index.js");

                console.log("\x1b[32m%s\x1b[0m", "\n✅ SUCESSO: Ndj-lib instalada com sucesso!");
                console.log(`Versão: \x1b[1m${v.nome}\x1b[0m | Idioma: \x1b[1m${lang.nome}\x1b[0m`);
                console.log("Para iniciar, use: \x1b[1mnode index.js\x1b[0m\n");
                
                rl.close();
            } catch (e) {
                console.log("\x1b[31m\n❌ ERRO NA INSTALAÇÃO:\x1b[0m " + e);
                console.log("\x1b[33mDica: Verifique se os arquivos .dnt estão na pasta da Warehouse.\x1b[0m");
                process.exit(1);
            }
        });
    });
}

main();
