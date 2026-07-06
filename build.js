const fs = require('fs');
const path = require('path');

function buildRegistry() {
    const currentDir = __dirname;
    const files = fs.readdirSync(currentDir);
    const appRegistry = [];

    // Ignored files list to keep your dashboard clean
    const ignoredFiles = ['index.html', 'build.js', 'package.json', 'package-lock.json', 'apps.json'];

    files.forEach(file => {
        if (file.endsWith('.html') && !ignoredFiles.includes(file)) {
            const filePath = path.join(currentDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Parse metadata headers using Regex
            const titleMatch = content.match(/<title>(.*?)<\/title>/i);
            const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                content.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);

            const fullTitle = titleMatch ? titleMatch[1].trim() : file;
            const description = descMatch ? descMatch[1].trim() : 'A custom standalone micro-app.';

            // Parse Emojis out of the titles for custom styling
            let icon = '📦';
            let title = fullTitle;
            const emojiRegex = /^([\u{1F300}-\u{1F9FF}移-龥]|\p{Emoji_Presentation})\s*/u;
            const match = fullTitle.match(emojiRegex);
            if (match) {
                icon = match[1];
                title = fullTitle.replace(emojiRegex, '').trim();
            }

            appRegistry.push({ file, icon, title, description });
        }
    });

    fs.writeFileSync(path.join(currentDir, 'apps.json'), JSON.stringify(appRegistry, null, 2));
    console.log(`[Arcade Build] Generated map for ${appRegistry.length} apps.`);
}

buildRegistry();