const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('route.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            if (lines[0].includes("export const dynamic = 'force-dynamic';")) {
                lines.shift(); // remove the first line
                content = lines.join('\n');
                if (!content.includes("export const dynamic = 'force-dynamic';")) {
                    content += "\nexport const dynamic = 'force-dynamic';\n";
                }
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    });
}

processDir(path.join(__dirname, 'src/app/api'));
process.exit(0);
