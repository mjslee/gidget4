let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Workspace/gidget4/frontend
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 pages/index.vue
badd +2 term://.//417:git\ pull
badd +1 pages/README.md
badd +1 pages/inspire.vue
badd +3 term://.//549:git\ branch\ dev
badd +1 term://.//565:git\ checkout\ dev
badd +2 term://.//589:git\ checkout\ frontend
badd +5 assets/README.md
badd +1 assets/buefy.png
badd +1 layouts/default.vue
badd +1 layouts
badd +1 pages/play.vue
badd +1 pages/App.vue
badd +1 components/Gidget/Code.vue
badd +1 components/Gidget/Dialogue.vue
badd +9 components/Gidget/Editor.vue
badd +1 components/Gidget/Game.vue
badd +17 components/Gidget/Goals.vue
badd +1 components/Gidget/Inspector.vue
badd +1 components/Gidget/Object.vue
badd +2 components/Gidget/Tile.vue
badd +1 components/Gidget/World.vue
badd +1 assets/gidget/game/gidget-game.js
badd +2 assets/gidget/game/objects/wall.js
badd +1 assets/gidget/game/objects
badd +2 assets/gidget/game/objects/test.js
badd +2 assets/gidget/game/objects/puppy.js
badd +2 assets/gidget/game/objects/index.js
badd +2 assets/gidget/game/objects/gidget.js
badd +1 assets/gidget/game/gidget-object.js
badd +2 assets/gidget/game/objects/bunny.js
badd +3 term://.//13228:git\ push\ origin\ frontend
badd +1 .session.vim
badd +1 pages
badd +5 term://.//20366:git\ push
argglobal
silent! argdel *
edit components/Gidget/Game.vue
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 67 - ((54 * winheight(0) + 36) / 72)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
67
normal! 0
lcd ~/Workspace/gidget4/frontend
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFc
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
let g:this_obsession_status = 2
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
