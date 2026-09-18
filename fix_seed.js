const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Replace users setDoc
content = content.replace(/INITIAL_USERS\.forEach\(\(u\) => setDoc\(doc\(db, 'users', u\.id\), u\)\);/g, '');

// Replace leads setDoc
content = content.replace(/INITIAL_LEADS\.forEach\(\(l\) => setDoc\(doc\(db, 'leads', l\.id\), l\)\);/g, '');

// Replace visits setDoc
content = content.replace(/INITIAL_VISITS\.forEach\(\(v\) => setDoc\(doc\(db, 'visits', v\.id\), v\)\);/g, '');

// Replace commissions setDoc
content = content.replace(/INITIAL_COMMISSIONS\.forEach\(\(c\) => setDoc\(doc\(db, 'commissions', c\.id\), c\)\);/g, '');

// Replace chatMessages setDoc
content = content.replace(/INITIAL_CHAT_MESSAGES\.forEach\(\(m\) => setDoc\(doc\(db, 'chatMessages', m\.id\), m\)\);/g, '');

// Replace notifications setDoc
content = content.replace(/INITIAL_NOTIFICATIONS\.forEach\(\(n\) => setDoc\(doc\(db, 'notifications', n\.id\), n\)\);/g, '');

// Replace CRM Tasks setDoc
content = content.replace(/INITIAL_CRM_TASKS\.forEach\(\(t\) => setDoc\(doc\(db, 'crmTasks', t\.id\), t\)\);/g, '');

// Replace siteConfig setDoc
content = content.replace(/setDoc\(doc\(db, 'settings', 'siteConfig'\), INITIAL_SITE_CONFIG\);/g, '');

// Replace master user auto-creation
content = content.replace(/setDoc\(doc\(db, 'users', masterTemplate\.id\), masterTemplate\);/g, '');

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Fixed auto-seeding in AppContext.tsx');
