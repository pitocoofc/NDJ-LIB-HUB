#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const readline = require('readline');

const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-version/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", size: "1.2MB" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", size: "1.5MB" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const args = process.argv.slice(2);
if (args[0] !== 'portal') {
    console.log("\nUso: ./ndj portal");
    process.exit();
}

console.log("\n--- NDJ PORTAL ---");
Object.keys(versoes).forEach(key => {
    console.log(`[${key}] v${versoes[key].nome} (${versoes[key].size})`);
});

rl.question("\nOpção: ", (opt) => {
    const v = versoes[opt];
    if (!v) {
        console.log("Saindo...");
        process.exit();
    }

    const fileUrl = `${repoBase}/${v.folder}/index.js`;
    const fileStream = fs.createWriteStream("index.js");

    console.log(`Baixando v${v.nome}...`);

    https.get(fileUrl, (res) => {
        if (res.statusCode !== 200) {
            console.log("Erro: " + res.statusCode);
            process.exit();
        }
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log("✅ Pronto!");
            process.exit();
        });
    }).on('error', (err) => {
        console.log("Erro: " + err.message);
        process.exit();
    });
});
    
    const v = versoes[opt];
    if (!v) {
        console.log("Opção inválida!");
        process.exit();
    }

    rl.question(`\nConfirmar download da v${v.nome}? (s/n): `, (res) => {
        if (res.toLowerCase() !== 's') {
            console.log("Operação cancelada.");
            process.exit();
        }

        const fileUrl = `${repoBase}/${v.folder}/index.js`;
        const fileStream = fs.createWriteStream("index.js");

        console.log(`\nIniciando transferência...`);

        https.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                console.log(`Erro no servidor: Status ${response.statusCode}`);
                process.exit();
            }

            // Pipe direto para o disco para economizar RAM
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`\n✅ v${v.nome} instalada com sucesso!`);
                console.log("Agora você pode iniciar com: node index.js");
                process.exit();
            });
        }).on('error', (err) => {
            console.error("Erro de conexão: " + err.message);
            process.exit();
        });
    });
});

    https.get(fileUrl, (res) => {
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            console.log(`\n✅ v${v.nome} instalada com sucesso!`);
            process.exit();
        });
    });
}
