const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
};

const files = walk('c:/Users/shaik/Desktop/Sai international/sai_international_two/frontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/background:\s*'#(?:FFF|FFFFFF)'/gi, "background: 'var(--bg-card-tint)'");
  content = content.replace(/background:\s*"#(?:FFF|FFFFFF)"/gi, 'background: "var(--bg-card-tint)"');
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
