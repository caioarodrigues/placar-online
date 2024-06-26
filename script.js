const jogadores = [];
const pontuacaoInicial = 0;
const sectionEditarJogadoresStyle = document.querySelector('.section-editar-jogadores').style;
const btnConcluiEdicaoStyle = document.querySelector('#btn-conclui-edicao').style;
const btnEditaJogadoresStyle = document.querySelector('#btn-edita-jogadores').style;
const inputNome = document.querySelector('#nome-jogador');
const tableMostrarJogadores = document.querySelector('.table-mostrar-jogadores');
const tbodyMostrarJogadores = document.querySelector('.tbody-mostrar-jogadores')
const getNome = () => inputNome.value;
const limpaInputNome = () => inputNome.value = '';
const localStorageKey = 'jogadores'; 

function salvaCacheNavegador(){
    let jogadoresString = JSON.stringify(jogadores);
    
    if(!localStorage.getItem(localStorageKey)){
        localStorage.setItem(localStorageKey, jogadoresString);

        return;
    }
    
    jogadoresString = JSON.stringify(jogadores);
    localStorage.removeItem(localStorageKey);
    localStorage.setItem(localStorageKey, jogadoresString);
}

function carregaCacheNavegador(){
    const jogadoresArr = JSON.parse(localStorage.getItem(localStorageKey));

    jogadores.push( ...jogadoresArr );
    addTodosJogadoresNaTable();
}

function limpaTableJogadores(){
    document.querySelectorAll('.tbody-mostrar-jogadores tr')
        .forEach(node => node.remove());
}

function addTodosJogadoresNaTable(){
    const novoArr = jogadores.sort((a, b) => b.pontuacao - a.pontuacao);

    novoArr.forEach(jogador => {
        const jogadorTD = criaTR(jogador);

        tbodyMostrarJogadores.appendChild(jogadorTD);
    });
}

function jogadorExistente(jogador = {}){
    const { nome } = jogador;
    const resultado = !!jogadores.find(j => j.nome === nome);

    return resultado;
}

function criaTR(jogador = {}){
    function criaTD(conteudo, id = null){
        const td = document.createElement('td');
        td.innerText = conteudo;
    
        if(id) td.setAttribute('id', id);

        return td;
    }

    const { nome, pontuacao } = jogador;
    const tr = document.createElement('tr');
    const nomeTD = criaTD(nome);
    const pontuacaoTD = criaTD(pontuacao);

    tr.appendChild(nomeTD);
    tr.appendChild(pontuacaoTD);

    return tr;
}

function atualizaTabelaJogadores(){
    const jogador = jogadores.at(-1);
    const jogadorTD = criaTR(jogador);

    tbodyMostrarJogadores.appendChild(jogadorTD);
}

function criaHeader(jogador){
    const { nome } = jogador;
    const header = document.createElement('header');
    const span = document.createElement('span');
    const input = document.createElement('input');
    input.setAttribute('id', 'input-nome-jogador');

    input.value = nome;
    span.innerText = nome;
    header.appendChild(input);

    return header;
}

function criaMain(jogador){
    function getNomeJogador(e){
        const nome = e.target.parentElement.parentNode
            .querySelector('#input-nome-jogador').value; 
        
        return nome; 
    }

    function getNomeAntigo(e){
        const nome = e.target.parentElement.className;

        return nome;
    }

    function getPontuacaoJogador(e){
        return e.target.parentElement.querySelector('#pontuacao-jogador');
    }

    function removeArticle(e){
        e.target.parentElement.parentNode.remove();
    }

    const { pontuacao, nome } = jogador;
    const main = document.createElement('main');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const btnSalvar = criaBotao('salvar');
    const btnAdd = criaBotao('+');
    const btnSub = criaBotao('-');
    const btnDel = criaBotao('remover');

    main.setAttribute('class', nome);
    span.setAttribute('id', 'pontuacao-jogador');

    btnSalvar.onclick = e => {
        const nomeAntigoJogador = getNomeAntigo(e);

        for(let i in jogadores){
            const { nome } = jogadores[i];

            if(nome === nomeAntigoJogador){
                const nomeAtual = getNomeJogador(e);

                console.log("nome atual: " + nomeAtual)
                jogadores[i].nome = nomeAtual;
                salvaCacheNavegador();

                return;
            }
        }
    }

    btnAdd.onclick = e => {
        const nome = getNomeJogador(e);
        const pontuacao = getPontuacaoJogador(e);

        jogadores.forEach(jogador => {
            if(jogador.nome === nome){
                jogador.pontuacao++;
                pontuacao.innerHTML = jogador.pontuacao;

                salvaCacheNavegador();
            }
        });
    }

    btnSub.onclick = e => {
        const nome = getNomeJogador(e);
        const pontuacao = getPontuacaoJogador(e);

        jogadores.forEach(jogador => {
            if(jogador.nome === nome && jogador.pontuacao > 0){
                jogador.pontuacao--;
                pontuacao.innerHTML = jogador.pontuacao;

                salvaCacheNavegador();
            }
        });
    }

    btnDel.onclick = e => {
        const nomeJogador = getNomeJogador(e);

        for(let i in jogadores){
            const { nome, pontuacao } = jogadores[i];

            if(nome === nomeJogador){
                jogadores.splice(i, 1);
                removeArticle(e);
                salvaCacheNavegador();
            
                return;
            }
        }
    }

    span.innerText = pontuacao;

    div.appendChild(span);
    main.appendChild(div);
    main.appendChild(btnSalvar);
    main.appendChild(btnAdd);
    main.appendChild(btnSub);
    main.appendChild(btnDel);

    return main;
}

function criaBotao(conteudo, id = null){
    const btn = document.createElement('button');

    if(id) btn.setAttribute('id', id);
    
    btn.innerText = conteudo;

    return btn;
}

function criaArticleJogador(jogador, classe = null){
    const header = criaHeader(jogador);
    const main = criaMain(jogador);
    const article = document.createElement('article');

    if(classe)
        article.setAttribute('class', classe);

    article.appendChild(header);
    article.appendChild(main);
    document.querySelector('.section-editar-jogadores').appendChild(article);
}

document.querySelector('#btn-add-jogador').onclick = e => {
    const nome = getNome();
    
    e.preventDefault();

    if(nome !== ''){
        const pontuacao = pontuacaoInicial;
        const thisJogador = { nome, pontuacao };
        
        if(jogadorExistente(thisJogador)){
            alert('este jogador já existe!');
            return;
        }
        
        jogadores.push(thisJogador);
        atualizaTabelaJogadores();
        salvaCacheNavegador();
    }

    limpaInputNome();
}

document.querySelector('#btn-edita-jogadores').onclick = e => {
    sectionEditarJogadoresStyle.display = 'flex';
    btnConcluiEdicaoStyle.display = 'inline';
    tableMostrarJogadores.style.display = 'none';
    btnEditaJogadoresStyle.display = 'none';
    inputNome.disabled = true;
    
    jogadores.forEach(jogador => {
        criaArticleJogador(jogador, 'article-jogador');
    });
    
    limpaInputNome();
    limpaTableJogadores();
    e.preventDefault();
}

document.querySelector('#btn-conclui-edicao').onclick = e => {
    sectionEditarJogadoresStyle.display = 'none';
    btnConcluiEdicaoStyle.display = 'none';
    tableMostrarJogadores.style.display = 'block';
    btnEditaJogadoresStyle.display = 'inline';
    inputNome.disabled = false;

    document.querySelectorAll('.article-jogador').forEach(article => {
        article.remove();
    });
    
    limpaTableJogadores();
    addTodosJogadoresNaTable();
    salvaCacheNavegador();
    e.preventDefault();
}

carregaCacheNavegador();