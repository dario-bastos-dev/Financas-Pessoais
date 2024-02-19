let vazio = [];
//lista de despesas
class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  //Verificando se a despesa possui valor
  validarDados() {
    for (let i in this) {

      if (this[i] == undefined || this[i] == "" || this[i] == null) {

        for (let i in this) {

          if (this[i] == undefined || this[i] == "" || this[i] == null) {
            vazio.push(i);
          }
        }
        return false;
      }
    }
    return true;
  }
}

//Banco de Dados
class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }
  //Salvamento dentro de Local Storage
  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }
  //Recuperar registros feitos
  recuperarTodosRegistros() {
    let despesas = Array()
    let id = localStorage.getItem('id')

    for(let i = 1; i <= id; i++) {

      let despesa = JSON.parse(localStorage.getItem(i))

      if(despesa == null) {
        continue
      }

      despesa.id = i
      despesas.push(despesa)
    }
   return despesas
  }

  //Pesquisar registro existente
  pesquisar(despesas) {
    let despesasFiltradas = Array()

    despesasFiltradas = this.recuperarTodosRegistros()

    if(despesas.ano != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.ano == despesas.ano)
    }

    if(despesas.mes != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.mes == despesas.mes)
    }

    if(despesas.dia != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.dia == despesas.dia)
    }

    if(despesas.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.tipo == despesas.tipo)
    }

    if(despesas.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.descricao == despesas.descricao)
    }

    if(despesas.valor != "") {
      despesasFiltradas = despesasFiltradas.filter( d => d.valor == despesas.valor)
    }

    return despesasFiltradas
  }

  //Remover registro
  remover(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd();

// Função para salvar a despesa
function cadastrarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesas = new Despesa(ano, mes, dia, tipo, descricao, valor);

  //Gravada com sucesso
  if (despesas.validarDados()) {

    bd.gravar(despesas);

    document.getElementById("modalTituloCor").className = "modal-header text-success"
    document.getElementById("modalTitulo").innerHTML = "Registro feito com sucesso"
    document.getElementById("modalConteudo").innerHTML = `Seus dados foram salvos!`
    document.getElementById("botao2").className = "btn btn-success"
    document.getElementById("botao2").innerHTML = "Voltar"

    $("#modalGeral").modal("show");

    document.getElementById("ano").value = ""
    document.getElementById("mes").value = ""
    document.getElementById("dia").value = ""
    document.getElementById("tipo").value = ""
    document.getElementById("descricao").value = ""
    document.getElementById("valor").value = ""

    for(let i=0; 6 >= i; i++) {
        vazio.pop()
    }

   

    console.log(ano, mes, dia, tipo, descricao, valor)

  } 
  //Erro na gravação
  else {
    let prefixo;

    if(vazio.length == 1) {
        prefixo = "O seguinte campo não foi preenchido"

    } else {
        prefixo = "Os seguintes campos não foram preenchidos"
    }

    vazio.join()

    document.getElementById("modalTituloCor").className = "modal-header text-danger"
    document.getElementById("modalTitulo").innerHTML = "Erro na gravação"
    document.getElementById("modalConteudo").innerHTML = `${prefixo}: ${vazio}`
    document.getElementById("botao2").className = "btn btn-danger"
    document.getElementById("botao2").innerHTML = "Voltar e corrigir"


    $("#modalGeral").modal("show");

    for(let i=0; 6 >= i; i++) {
        vazio.pop()
    }
  }
}

//Função para carregar as despesas
function carregarListaDespesas(despesas = Array(), filtro = false) {
  //Verificando se é uma filtragem 
  if(despesas.length == 0 && filtro == false) { 
     despesas = bd.recuperarTodosRegistros()
  } 

  //Mostrando a despesa filtrada
  let listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ""

 despesas.forEach(function(d) {
    let linha = listaDespesas.insertRow()

    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //Botão para remover despesa
    let btn = document.createElement("button")
    btn.className = "btn btn-danger"
    btn.innerHTML = "<i class='fas fa-times'></i>"
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function() {
      let id = this.id.replace("id_despesa_", "")

      bd.remover(id)

      document.getElementById("modalTituloCor").className = "modal-header text-success"
      document.getElementById("modalTitulo").innerHTML = "Registro removido com sucesso"
      document.getElementById("modalConteudo").innerHTML = `Seus registro foi removido!`
      document.getElementById("botao2").className = "btn btn-success"
      document.getElementById("botao2").innerHTML = "Voltar" 

      $("#modalGeral").modal("show");

      
    }
    linha.insertCell(4).append(btn)
  })
}

//Função para pesquisar despesa
function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;
  
  let despesas = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let filtro = bd.pesquisar(despesas)

  carregarListaDespesas(filtro, true)
}