import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

function continuityDefaults() {
  return {
    firstDeliveryExplained: false,
    feedbackMemoryExplained: false,
    offers: {
      weeklyRoutine: {status:'not_offered'},
      inbox: {status:'not_offered'},
      midweekCheckIn: {status:'not_offered'}
    },
    coaching: {recentTips:[]}
  };
}

function addMissingDefaults(value, defaults, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw Error(`${label} must be an object; existing state was not replaced`);
  }
  for (const [key, fallback] of Object.entries(defaults)) {
    if (!Object.hasOwn(value,key)) value[key]=structuredClone(fallback);
    else if (fallback && typeof fallback==='object' && !Array.isArray(fallback)) {
      addMissingDefaults(value[key],fallback,`${label}.${key}`);
    }
  }
  return value;
}

export function initializeWorkspace(target) {
  if (!target || !path.isAbsolute(target)) throw Error('Provide the selected workspace as an absolute path');
  const root = fs.realpathSync(target);
  if (!fs.statSync(root).isDirectory() || root === path.parse(root).root) throw Error('Select a project folder, not a drive root');
  const directories = ['data/private/linkedin', 'research/private', 'state', 'plans'];
  // Do not follow an existing junction/symlink out of the selected workspace.
  for (const relative of directories) {
    let current = root;
    for (const part of relative.split('/')) {
      current = path.join(current, part);
      if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw Error('Workspace directory is a link: ' + current);
    }
  }
  const progressPath=path.join(root,'state','progress.json');
  let originalProgress, upgradedProgress;
  if (fs.existsSync(progressPath)) {
    if (fs.lstatSync(progressPath).isSymbolicLink()) throw Error('Workspace progress file is a link');
    originalProgress=fs.readFileSync(progressPath,'utf8');
    let progress;
    try { progress=JSON.parse(originalProgress); }
    catch { throw Error('Progress is not valid JSON; existing state was not replaced'); }
    const before=JSON.stringify(progress);
    addMissingDefaults(progress,{continuity:continuityDefaults()},'Progress');
    if (JSON.stringify(progress)!==before) upgradedProgress=JSON.stringify(progress,null,2)+'\n';
  }
  for (const relative of directories) fs.mkdirSync(path.join(root, relative), {recursive:true});
  const files = {
    'state/business.md': '# Business and conversation goals\n\nNot yet learned. Use only this workspace and sources the user supplies or authorizes.\n',
    'state/progress.json': JSON.stringify({schema:'prospecting-progress-1',setupComplete:false,target:15,coverage:{},decisions:[],continuity:continuityDefaults(),nextAction:'Learn name, website or business description, and invite corrections.'},null,2)+'\n',
    'state/.gitignore': '*\n', 'research/private/.gitignore': '*\n',
    'data/private/.gitignore': '*\n', 'plans/.gitignore': '*\n'
  };
  const created=[];
  for (const [relative, content] of Object.entries(files)) {
    const destination=path.join(root,relative);
    if (fs.existsSync(destination)) continue;
    fs.writeFileSync(destination,content,{flag:'wx'}); created.push(relative);
  }
  if (upgradedProgress!==undefined) {
    // Detect intervening changes; this is not a lock against simultaneous writers.
    if (fs.readFileSync(progressPath,'utf8')!==originalProgress) throw Error('Progress changed during initialization; retry from current state');
    const temporary=progressPath+'.'+process.pid+'.'+Date.now()+'.tmp';
    try {
      fs.writeFileSync(temporary,upgradedProgress,{flag:'wx'});
      fs.renameSync(temporary,progressPath);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }
  return {workspace:root,linkedinFolder:path.join(root,'data','private','linkedin'),created,preservedExistingState:true,continuityUpgraded:upgradedProgress!==undefined};
}

if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(initializeWorkspace(process.argv[2]),null,2)); }
  catch(error) { console.error(error.message); process.exitCode=1; }
}
