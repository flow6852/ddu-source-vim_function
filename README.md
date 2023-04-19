# ddu-source-vim_function

Vim function source for ddu.vim.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddu.vim

https://github.com/Shougo/ddu.vim

### ddu-kind-vim_type

https://github.com/flow6852/ddu-kind-vim_type

## Configuration

```vim
	cmap <silent> <C-h> <Cmd>call DduKindVim_typeSetcmdline()<CR>

	function DduKindVim_typeSetcmdline()
	    let getcmdline = getcmdline()
	    call feedkeys("\<Esc>", 't')
	    call ddu#start({'name': 'vim_type', 'sources': [
	        \ {'name': 'vim_variable', 'params': {'bufnr': bufnr('%')}},
	        \ {'name': 'vim_option', 'params': {'bufnr': bufnr('%')}},
	        \ {'name': 'vim_function'},
	        \ {'name': 'vim_command'},
	        \ {'name': 'vim_event'}],
	        \ 'actionParams': {'getcmdline': getcmdline}})
	endfunction
```
