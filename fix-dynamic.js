const fs = require('fs');
const path = require('path');

function ensureDynamic(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            ensureDynamic(fullPath);
        } else if (fullPath.endsWith('route.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes("export const dynamic = 'force-dynamic';")) {
                content += "\nexport const dynamic = 'force-dynamic';\n";
                fs.writeFileSync(fullPath, content);
                console.log('Added dynamic export to:', fullPath);
            }
        }
    });
}

ensureDynamic(path.join(__dirname, 'src/app/api'));
process.exit(0);
