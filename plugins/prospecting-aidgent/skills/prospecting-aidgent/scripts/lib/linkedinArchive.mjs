// linkedinArchive.mjs — import only the relationship facts needed for
// prospecting. Raw message bodies stay in data/private/ and never enter state,
// plans, or Sheets. LinkedIn changes archive column names over time, so column
// detection is deliberately semantic rather than tied to one export vintage.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { canonicalizeLinkedInUrl, normalizeText } from "./url.mjs";

export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  const input = String(text || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
      continue;
    }
    if (ch === '"') { quoted = true; continue; }
    if (ch === ',') { row.push(cell); cell = ""; continue; }
    if (ch === '\n') { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; continue; }
    cell += ch;
  }
  if (quoted) throw new Error("CSV has an unterminated quoted value");
  if (cell !== "" || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

export function rowsToRecords(rows) {
  const [headers = [], ...data] = rows;
  const names = headers.map(headerKey);
  return data.filter((row) => row.some((value) => String(value || "").trim())).map((row) => {
    const out = {};
    names.forEach((name, i) => { if (name) out[name] = String(row[i] || "").trim(); });
    return out;
  });
}

export function parseConnections(records) {
  const seen = new Set();
  const connections = [];
  for (const row of records || []) {
    const first = field(row, "first name", "first_name", "firstname");
    const last = field(row, "last name", "last_name", "lastname");
    const name = [first, last].filter(Boolean).join(" ") || field(row, "name", "full name", "full_name");
    const url = canonicalizeLinkedInUrl(field(row, "url", "profile url", "linkedin url", "linkedin_url"));
    const email = normalizeEmail(field(row, "email address", "email", "email_address"));
    const key = url || email || personKey(name, field(row, "company"));
    if (!name || !key || seen.has(key)) continue;
    seen.add(key);
    connections.push({
      key,
      name,
      url,
      email,
      title: field(row, "position", "title", "headline"),
      company: field(row, "company", "organization"),
      connectedOn: dateOnly(field(row, "connected on", "connected_on", "connection date")),
      source: "linkedin_connections_export",
    });
  }
  return connections;
}

export function parseMessages(records, { selfName = "", sourceName = "messages.csv", recordOffset = 2 } = {}) {
  const self = normalizeText(selfName);
  const seen = new Set();
  const messages = [];
  for (let recordIndex = 0; recordIndex < (records || []).length; recordIndex++) {
    const row = records[recordIndex];
    const from = field(row, "from", "sender", "from name", "from_name");
    const to = field(row, "to", "recipient", "to name", "to_name");
    const participants = dedupeBy(splitPeople([from, to].filter(Boolean).join(";")), normalizeText);
    const others = participants.filter((person) => normalizeText(person) && normalizeText(person) !== self);
    if (!others.length) continue;
    const other = others.length === 1 ? others[0] : "";
    const rawTimestamp = field(row, "date", "date sent", "sent at", "timestamp", "time");
    const timestamp = timestampIso(rawTimestamp);
    const date = timestamp ? timestamp.slice(0, 10) : "";
    const conversationId = field(row, "conversation id", "conversation_id", "thread id", "thread_id");
    const content = field(row, "content", "message", "body", "text");
    const direction = self && normalizeText(from) === self ? "outbound" : self && normalizeText(to) === self ? "inbound" : "unknown";
    const hash = digest([conversationId, from, to, timestamp || rawTimestamp, content].join("\u001f"));
    if (seen.has(hash)) continue;
    seen.add(hash);
    messages.push({
      key: other ? personKey(other) : `group:${digest(others.map(normalizeText).sort().join("\u001f")).slice(0, 32)}`,
      person: other,
      participants,
      groupConversation: others.length > 1,
      date,
      timestamp,
      direction,
      // A platform conversation id is not message text, but it is still an
      // unnecessary private identifier. The activity comparator needs only a
      // stable local join key, so retain a hash rather than the export value.
      conversationId: digest(conversationId || [from, to].sort().join("\u001f")).slice(0, 32),
      messageHash: hash,
      sourceLocator: { source: sourceName, record: recordOffset + recordIndex },
      source: "linkedin_messages_export",
    });
  }
  return messages;
}

export function classifyRecords(records) {
  const keys = new Set(Object.keys(records[0] || {}).map(headerKey));
  const has = (...names) => names.some((name) => keys.has(headerKey(name)));
  if (has("first name", "last name") && has("url", "profile url", "linkedin url")) return "connections";
  if (has("from", "sender") && has("to", "recipient") && has("date", "timestamp", "date sent")) return "messages";
  return "unknown";
}

// LinkedIn adds explanatory Notes lines before some CSV headers. Locate a
// semantic header in the CSV rows; do not strip lines (quoted cells may span
// lines) or let the filename alone turn arbitrary text into contact data.
export function parseLinkedInCsv(text, name = "") {
  const rows = parseCsv(text);
  let headerIndex = -1, kind = "unknown";
  for (let i = 0; i < Math.min(rows.length, 50); i++) {
    const candidate = Object.fromEntries(rows[i].map(value => [headerKey(value), ""]));
    const detected = classifyRecords([candidate]);
    if (detected !== "unknown") { headerIndex = i; kind = detected; break; }
  }
  if (headerIndex < 0) {
    if (/^(connections|messages)\.csv$/i.test(path.basename(name))) {
      throw new Error(`Could not recognize the column headings in ${path.basename(name)}; this file was not imported`);
    }
    return { kind, records: [], headerRow: null };
  }
  return { kind, records: rowsToRecords(rows.slice(headerIndex)), headerRow: headerIndex + 1 };
}

export function importLinkedInArchive(inputPath, { selfName = "" } = {}) {
  const entries = readArchiveEntries(inputPath);
  const connections = [], messages = [], sources = [], rejected = [];
  for (const entry of entries) {
    if (!/\.csv$/i.test(entry.name)) continue;
    let parsed;
    try { parsed = parseLinkedInCsv(entry.content.toString("utf8"), entry.name); }
    catch (error) { rejected.push({ name: entry.name, reason: error.message }); continue; }
    const { kind, records, headerRow } = parsed;
    sources.push({ name: entry.name, kind, rowCount: records.length, headerRow });
    if (kind === "connections") connections.push(...parseConnections(records));
    if (kind === "messages") messages.push(...parseMessages(records, { selfName, sourceName: entry.entryId || entry.name, recordOffset: (headerRow || 1) + 1 }));
  }
  const uniqueConnections = dedupeBy(connections, (row) => row.key);
  const uniqueMessages = dedupeBy(messages, (row) => row.messageHash);
  return {
    importedAt: new Date().toISOString(),
    source: { path: path.resolve(inputPath), sha256: hashInput(inputPath) },
    status: rejected.length ? "partial" : sources.some(s => s.kind !== "unknown") ? "complete" : "unrecognized",
    counts: {
      connections: uniqueConnections.length,
      messages: uniqueMessages.length,
      conversations: new Set(uniqueMessages.map(m => m.conversationId)).size,
    },
    coverage: {
      connections: sources.some(source => source.kind === "connections"),
      messages: sources.some(source => source.kind === "messages"),
    },
    sources,
    rejected,
    connections: uniqueConnections,
    messages: uniqueMessages,
  };
}

// LinkedIn normally distributes a standard deflate ZIP. Supporting stored and
// deflated entries locally avoids uploading an archive just to unpack it.
export function readArchiveEntries(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) return walkCsv(inputPath, inputPath);
  if (/\.csv$/i.test(inputPath)) return [{ name: path.basename(inputPath), entryId: path.basename(inputPath), content: fs.readFileSync(inputPath) }];
  if (/\.zip$/i.test(inputPath)) return readZipEntries(fs.readFileSync(inputPath));
  throw new Error("provide a LinkedIn export ZIP, CSV, or extracted archive folder");
}

export function readZipEntries(buffer) {
  if (buffer.length > 100 * 1024 * 1024) throw new Error("ZIP exceeds the 100 MB import limit");
  const end = findEndOfCentralDirectory(buffer);
  if (end < 0) throw new Error("ZIP central directory was not found");
  const entries = buffer.readUInt16LE(end + 10);
  if (entries > 5000) throw new Error("ZIP contains too many entries");
  const centralOffset = buffer.readUInt32LE(end + 16);
  let offset = centralOffset;
  const out = [];
  let inflatedTotal = 0;
  for (let i = 0; i < entries; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("ZIP entry is malformed");
    const flags = buffer.readUInt16LE(offset + 8);
    const method = buffer.readUInt16LE(offset + 10);
    const expectedCrc = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    inflatedTotal += uncompressedSize;
    if (uncompressedSize > 25 * 1024 * 1024 || inflatedTotal > 150 * 1024 * 1024) throw new Error("ZIP expands beyond the safe import limit");
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    if (flags & 1) throw new Error("encrypted ZIP entries are not supported");
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString(flags & 0x800 ? "utf8" : "utf8");
    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("ZIP local entry is malformed");
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(start, start + compressedSize);
    let content;
    try { content = method === 0 ? raw : method === 8 ? zlib.inflateRawSync(raw, { maxOutputLength: 25 * 1024 * 1024 + 1 }) : null; }
    catch (error) { throw new Error(`ZIP entry ${name} expands beyond the safe import limit or is corrupt`); }
    if (!content) throw new Error(`ZIP compression method ${method} is not supported`);
    if (content.length > 25 * 1024 * 1024 || inflatedTotal - uncompressedSize + content.length > 150 * 1024 * 1024) throw new Error("ZIP expands beyond the safe import limit");
    inflatedTotal = inflatedTotal - uncompressedSize + content.length;
    if (content.length !== uncompressedSize) throw new Error(`ZIP entry ${name} size does not match its directory record`);
    if (crc32(content) !== expectedCrc) throw new Error(`ZIP entry ${name} failed its integrity check`);
    if (!name.endsWith("/") && /\.csv$/i.test(name)) out.push({ name, entryId: `${i}:${name}`, content });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return out;
}

function walkCsv(dir, root = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Import path contains a symbolic link or junction: ${path.relative(root, full)}`);
    if (entry.isDirectory()) out.push(...walkCsv(full, root));
    else if (/\.csv$/i.test(entry.name)) {
      const name = path.relative(root, full).replace(/\\/g, "/");
      out.push({ name, entryId: name, content: fs.readFileSync(full) });
    }
  }
  return out;
}
function findEndOfCentralDirectory(buffer) {
  for (let i = Math.max(0, buffer.length - 65557); i <= buffer.length - 22; i++) if (buffer.readUInt32LE(i) === 0x06054b50) return i;
  return -1;
}
function headerKey(value) { return String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " "); }
function field(row, ...names) { for (const name of names) { const value = row[headerKey(name)]; if (value) return value; } return ""; }
function normalizeEmail(value) { const email = String(value || "").trim().toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ""; }
function personKey(name, company = "") { return `person:${normalizeText(name)}${company ? `:${normalizeText(company)}` : ""}`; }
function splitPeople(value) { return String(value || "").split(/[;,]/).map((v) => v.trim()).filter(Boolean); }
function dateOnly(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10); }
function timestampIso(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : date.toISOString(); }
function digest(value) { return crypto.createHash("sha256").update(Buffer.isBuffer(value) ? value : String(value)).digest("hex"); }
function dedupeBy(rows, key) { const seen = new Set(); return rows.filter((row) => !seen.has(key(row)) && seen.add(key(row))); }
function hashInput(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.isFile()) return digest(fs.readFileSync(inputPath));
  const hash = crypto.createHash("sha256");
  for (const entry of walkCsv(inputPath, inputPath).sort((a, b) => a.name.localeCompare(b.name))) hash.update(entry.name).update("\0").update(entry.content);
  return hash.digest("hex");
}

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}
