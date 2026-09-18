import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

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
  for (const relative of directories) fs.mkdirSync(path.join(root, relative), {recursive:true});
  const files = {
    'state/business.md': '# Business and conversation goals\n\nNot yet learned. Use only this workspace and sources the user supplies or authorizes.\n',
    'state/progress.json': JSON.stringify({schema:'prospecting-progress-1',setupComplete:false,target:15,coverage:{},decisions:[],nextAction:'Learn name, website or business description, and invite corrections.'},null,2)+'\n',
    'state/.gitignore': '*\n', 'research/private/.gitignore': '*\n',
    'data/private/.gitignore': '*\n', 'plans/.gitignore': '*\n'
  };
  const created=[];
  for (const [relative, content] of Object.entries(files)) {
    const destination=path.join(root,relative);
    if (fs.existsSync(destination)) continue;
    fs.writeFileSync(destination,content,{flag:'wx'}); created.push(relative);
  }
  return {workspace:root,linkedinFolder:path.join(root,'data','private','linkedin'),created,preservedExistingState:true};
}

if (process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(initializeWorkspace(process.argv[2]),null,2)); }
  catch(error) { console.error(error.message); process.exitCode=1; }
}
