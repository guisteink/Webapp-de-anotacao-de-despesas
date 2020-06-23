/**
 * classe para despesas
 */
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    /**
     * tratamento de erros para entrada de dados
     */
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

/**
 * classe para o db que vai manter as despesas registradas no localStorage do browser
 */
class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    /**
     * método para identificar os ids de despesas
     */
    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    /**
     * método para gravar na instancia que contem o localStorage do browser
     * @param {classe despesa} d 
     */
    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }

    /**
     * método para mostrar as despesas registradas na instancia
     */
    recuperarTodosRegistros() {

        //array de despesas
        let despesas = Array();

        let id = localStorage.getItem('id');

        //recuperar todas as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i));

            //existe a possibilidade de haver índices que foram pulados/removidos
            //nestes casos nós vamos pular esses índices
            if (despesa === null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }

        return despesas;
    }

    /**
     * 
     * método para pesquisar despesa no db
     * @param {classe despesa} despesa
     */
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros();

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;

    }

    /**
     * método para remoçao de um id pré-determinado
     * @param {var id} id 
     */
    remover(id) {
        localStorage.removeItem(id);
    }
}

/**
 * instanciamento do bd a ser usado no browser
 */
let bd = new Bd();

/**
 * funcao global para cadastro
 */
function cadastrarDespesa() {

    //pega as variaveis de escopo do forms
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    //instacia com os valores
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //valida os dados atraves do metodo da classe e cadastra
    if (despesa.validarDados()) {
        bd.gravar(despesa);

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show');

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';

    } else {
        //falha de validacao de dados
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }
}

/**
 * funcao global para carregar despesas e mostrar
 * @param {classe despesa} despesas 
 * @param {opcao booleana para filtro} filtro 
 */
function carregaListaDespesas(despesas = Array(), filtro = false) {

    //caso nao tenha despesas, ou o filtro nao exista ele carrega na tela todas as despesas existentes
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    let listaDespesas = document.getElementById("listaDespesas ");
    listaDespesas.innerHTML = ''; //limpa o campo html
    despesas.forEach(function(d) {

        //Criando a linha (tr)
        var linha = listaDespesas.insertRow();

        //Criando as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        //Ajustar o tipo
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação';
                break
            case '2':
                d.tipo = 'Educação';
                break
            case '3':
                d.tipo = 'Lazer';
                break
            case '4':
                d.tipo = 'Saúde';
                break
            case '5':
                d.tipo = 'Transporte';
                break

        }
        //insere a informaçao carregada do localStorage nas tags para mostrar
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        //Criar o botão de exclusão
        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fa fa-times"  ></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '');
            //alert(id)
            bd.remover(id);
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
    })

}

/**
 * funcao global para pesquisa de despesa com filtro existente
 */
function pesquisarDespesa() {

    //recupera os elementos do form
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    //instancia a classe despesa
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    //instancia a classe bd
    let despesas = bd.pesquisar(despesa);

    //carrega a despesa pesquisada
    this.carregaListaDespesas(despesas, true);
}