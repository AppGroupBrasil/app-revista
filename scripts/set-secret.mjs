import sodium from 'libsodium-wrappers';
import fs from 'fs';

const [,, name, valueArg] = process.argv;
if (!name) { console.error('Uso: node set-secret.mjs NOME [VALOR | @arquivo]'); process.exit(1); }

const TOKEN = process.env.GH_TOKEN;
const REPO = process.env.GH_REPO || 'AppGroupBrasil/app-revista';
if (!TOKEN) { console.error('GH_TOKEN obrigatório'); process.exit(1); }

let value = valueArg;
if (value?.startsWith('@')) value = fs.readFileSync(value.slice(1), 'utf8');
if (!value) value = fs.readFileSync(0, 'utf8'); // stdin

await sodium.ready;
const pk = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/public-key`, {
  headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github+json' },
}).then(r => r.json());

const enc = sodium.crypto_box_seal(
  sodium.from_string(value),
  sodium.from_base64(pk.key, sodium.base64_variants.ORIGINAL),
);
const encrypted_value = sodium.to_base64(enc, sodium.base64_variants.ORIGINAL);

const r = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/${name}`, {
  method: 'PUT',
  headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
  body: JSON.stringify({ encrypted_value, key_id: pk.key_id }),
});
if (!r.ok) { console.error(await r.text()); process.exit(1); }
console.log(`OK ${name}`);
