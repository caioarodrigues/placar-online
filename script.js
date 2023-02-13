const jogadores = [];
const pontuacaoInicial = 0;
const sectionEditarJogadoresStyle = document.querySelector('.section-editar-jogadores').style;
const btnConcluiEdicaoStyle = document.querySelector('#btn-conclui-edicao').style;
const inputNome = document.querySelector('#nome-jogador');
const tableMostrarJogadores = document.querySelector('.table-mostrar-jogadores');
const tbodyMostrarJogadores = document.querySelector('.tbody-mostrar-jogadores')
const getNome = () => inputNome.value;
const limpaInputNome = () => inputNome.value = '';

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

    span.innerText = nome;
    header.appendChild(span);

    return header;
}

function criaMain(jogador){
    function getNomeJogador(e){
        return e.target.parentElement.className;
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
    const btnAdd = criaBotao('+');
    const btnSub = criaBotao('-');
    const btnDel = criaBotao('remover');

    main.setAttribute('class', nome);
    span.setAttribute('id', 'pontuacao-jogador');
    btnAdd.onclick = e => {
        const nome = getNomeJogador(e);
        const pontuacao = getPontuacaoJogador(e);

        jogadores.forEach(jogador => {
            if(jogador.nome === nome){
                jogador.pontuacao++;
                pontuacao.innerHTML = jogador.pontuacao;
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
            }
        });
    }

    btnDel.onclick = e => {
        const nome = getNomeJogador(e);
        const pontuacao = getPontuacaoJogador(e);
        const jogador = { nome, pontuacao };
        const index = jogadores.indexOf(jogador) - 1;

        jogadores.splice(index, 1);
        removeArticle(e);
    }

    span.innerText = pontuacao;

    div.appendChild(span);
    main.appendChild(div);
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
    }

    limpaInputNome();
}

document.querySelector('#btn-edita-jogadores').onclick = e => {
    sectionEditarJogadoresStyle.display = 'flex';
    btnConcluiEdicaoStyle.display = 'inline';
    tableMostrarJogadores.style.display = 'none';
    inputNome.disabled = true;

    jogadores.forEach(jogador => {
        criaArticleJogador(jogador, 'article-jogador');
    });

    limpaTableJogadores();
    e.preventDefault();
}

document.querySelector('#btn-conclui-edicao').onclick = e => {
    sectionEditarJogadoresStyle.display = 'none';
    btnConcluiEdicaoStyle.display = 'none';
    tableMostrarJogadores.style.display = 'block';
    inputNome.disabled = false;

    document.querySelectorAll('.article-jogador').forEach(article => {
        article.remove();
    });
    
    limpaTableJogadores();
    addTodosJogadoresNaTable();
    e.preventDefault();
}