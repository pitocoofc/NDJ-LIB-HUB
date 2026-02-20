const https = require('https');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Configuração das versões disponíveis no repositório NDJ-LIB-version
const repoBase = "https://raw.githubusercontent.com/pitocoofc/NDJ-LIB-version/main";
const versoes = {
    "1": { nome: "1.0.9", file: "index.js", size: "1.2MB" },
    "2": { nome: "1.1.0-Canary", file: "index.js", size: "1.5MB" }
};

console.log(`
  _  _ ___   _    _ ___   _    _ _____ ___ 
 | \\| |   \\ | |  | | _ ) | |  |_|_   _| __|
 | .\` | |) || |__| | _ \\ | |__| | | | | _| 
 |_|\\_|___/ |____|_|___/ |____|_| |_| |___| LITE
`);

console.log("Selecione a versão para instalar:");
Object.keys(versoes).forEach(key => {
    console.log(`[${key}] Versão ${versoes[key].nome} (${versoes[key].size})`);
});

rl.question("\nEscolha uma opção: ", (opt) => {
    const v = versoes[opt];
    if (!v) {
        console.log("Opção inválida!");
        process.exit();
    }

    rl.question(`Confirmar download da v${v.nome}? (s/n): `, (res) => {
        if (res.toLowerCase() !== 's') process.exit();

        const fileUrl = `${repoBase}/${v.nome}/${v.file}`;
        const fileStream = fs.createWriteStream(v.file);

        console.log(`\nBaixando de: ${v.nome}...`);

        https.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                console.log(`Erro ao baixar: Status ${response.statusCode}`);
                return process.exit();
            }

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log("\n✅ Download concluído com sucesso!");
                console.log(`Pronto! Agora você pode rodar 'node ${v.file}'`);
                process.exit();
            });
        }).on('error', (err) => {
            console.error("Erro na conexão: " + err.message);
            process.exit();
        });
    });
});
