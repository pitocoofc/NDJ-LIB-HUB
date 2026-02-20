const https = require('https');
const fs = require('fs');
const readline = require('readline');

// Configurações do Repositório de Versões
const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-version/main";
const versoes = {
    "1": { nome: "1.0.9", folder: "1.0.9", size: "1.2MB" },
    "2": { nome: "1.1.0-Canary", folder: "1.1.0-Canary", size: "1.5MB" }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("\n--- NDJ PORTAL: GERENCIADOR DE VERSÕES ---");
Object.keys(versoes).forEach(key => {
    console.log(`[${key}] Instalar v${versoes[key].nome} (${versoes[key].size})`);
});

rl.question("\nSelecione a versão ou 'sair': ", (opt) => {
    if (opt.toLowerCase() === 'sair') process.exit();
    const v = versoes[opt];
    
    if (v) {
        console.log(`\nIniciando transferência da v${v.nome}...`);
        // Aqui entra a lógica de download via stream que discutimos
        baixarVersao(v);
    } else {
        console.log("Opção inválida.");
        process.exit();
    }
});

function baixarVersao(v) {
    const fileUrl = `${repoBase}/${v.folder}/index.js`;
    const fileStream = fs.createWriteStream("index.js");

    https.get(fileUrl, (res) => {
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            console.log(`\n✅ v${v.nome} instalada com sucesso!`);
            process.exit();
        });
    });
}
