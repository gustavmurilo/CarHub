// Função de exibir a mensagem para evitar repetir código

function alertMessage(text, type) {
    $('#divAlertMessage').css('display', 'flex')
    let bgColor = type === 'success' ? '#0bd979' : '#f71445';
    $('<p>')
        .addClass('alertMessage')
        .text(text)
        .css('background-color', bgColor)
        .appendTo('#divAlertMessage')
        .hide()
        .fadeIn(400)
        .delay(3500)
        .fadeOut(400);
}

// Exibir mensagem de cadastro de veículo
$(document).ready(function() {
    const mensagemCadVeic = localStorage.getItem('msgCadVeic');

    if (mensagemCadVeic) {
        alertMessage(mensagemCadVeic, 'success');
        localStorage.removeItem('msgCadVeic')
    };

})

// Criando o dicionário do filtro
let filtroSelect = {};

let tipoVeiculo = "";

// Aplicar filtro caso exista nome veículo no local storage

// Aplicar filtro caso exista marca no local storage
$(document).ready(() => {
    // Nome veículo like
    const nomeVeic = localStorage.getItem("nome-veic");

    if (nomeVeic) {
        let listaNomeVeic = nomeVeic.split(' ');
        let marcaVeic = listaNomeVeic[0];

        $('.itens-details li').each(function() {
            let $li = $(this);  // Garante que $li seja um objeto jQuery
            $li.removeClass('active');  // Remove classe "active" de todos
            
            
            // Se o atributo 'marca' do li for igual à marca selecionada...
            if ($li.attr('marca').toLowerCase() === marcaVeic.toLowerCase()) {
                // Adiciona a classe "active" a imagem da logomarca correspondente
                $li.addClass('active');

                let removerBtn = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
                    // Remove o filtro de estado ao clicar no X
                    $(`#filtro-marca`).remove();
                    $(`#filtro-modelo`).remove();

                    // Remover do informação do objeto
                    delete filtroSelect['marca'];
                    delete filtroSelect['nome-veic'];
                    
                    // Refaz a contagem de filtros aplicados
                    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

                    // Tira o sombreamento roxo da marca selecionada
                    $(".itens-details li").removeClass("active");
        
                    // Aplicar filtros a API quando deletar
                    buscarVeiculos();
                });

                // Adiciona o filtro de marca
                addFiltro("marca", $li.attr('marca'), removerBtn, "filtro-marca", "select", $li, false); // Parâmetro false para evitar chamar a função buscar veículos
            }
        });

        // Se a lista tiver mais de 1 item, ou seja, marca e modelo, adiciona o modelo
        if (listaNomeVeic.length > 1) {
            // Removendo o primeiro elemento (marca)
            listaNomeVeic.splice(0, 1);

            // Juntando os outros nomes para formar o modelo
            let modelo = listaNomeVeic.join(' ');

            // Obtém a div de filtro
            let divFiltro = $('#filtros-aplic');

            // Cria o botão de remover o filtro de modelo
            removerBtnModelo = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
                // Remove o filtro de estado ao clicar no X
                $(`#filtro-modelo`).remove();
                // Remover do informação do objeto
                delete filtroSelect['nome-veic'];
                
                // Refaz a contagem de filtros aplicados
                $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

                // Aplicar filtros a API quando deletar
                buscarVeiculos();
            });

            // Cria a div
            let div = $("<div></div>").attr('id','filtro-modelo').addClass('filtro');

            // Adiciona o nome do modelo a div e o botão de remover o filtro
            div.append($('<p></p>').text(modelo)).append(removerBtnModelo);
            
            // Adicionar o filtro a div de filtros
            divFiltro.append(div);
            
            // Adicionar informação no filtro
            filtroSelect['nome-veic'] = modelo;

            // Fazendo a recontagem da quantidade de filtros aplicados
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

            // Busca por veículos
            buscarVeiculos();
        }

        // Limpa a marca salva para evitar que o filtro se repita
        localStorage.removeItem("nome-veic");
    }

    // Buscar marca selecionada
    const marcaSelecionada = localStorage.getItem("filtro-marca");

    if (marcaSelecionada) {
        // Itera por cada li da lista de marcas
        $('.itens-details li').each(function() {
            let $li = $(this);  // Garante que $li seja um objeto jQuery
            $li.removeClass('active');  // Remove classe "active" de todos

            // Se o atributo 'marca' do li for igual à marca selecionada...
            if ($li.attr('marca') === marcaSelecionada) {
                $li.addClass('active');  // Adiciona a classe "active" ao elemento correspondente
                addFiltro("marca", marcaSelecionada, null, "filtro-marca", "select", $li, true);
            }
        });

        // Limpa a marca salva para evitar que o filtro se repita
        localStorage.removeItem("filtro-marca");
    }

    // Obter tipo veículo
    const tipoVeicLocalStorage = localStorage.getItem('tipo-veiculo');

    if (tipoVeicLocalStorage) {
        if (tipoVeicLocalStorage == "carro") {
            tipoVeiculo = "carro";
        } else if (tipoVeicLocalStorage === "moto") {
            tipoVeiculo = "moto";
            // Mostrar tipo moto como selecionado
            alterarTipoSelecionado(divTipoMoto, divTipoCarro, '50%', 'Motos', $('#categorias-moto'),  
            $('#categorias-carro'), $('#marcas-moto'), $('#marcas-carro'), "moto", true);
        }

        localStorage.removeItem('tipo-veiculo');
    } else {
        tipoVeiculo = "carro";
    }

    // Buscar marca selecionada
    const categoriaSelecionada = localStorage.getItem("filtro-categoria");

    if (categoriaSelecionada) {
        // Seleciona a categoria
        $(`#select-categoria-${tipoVeiculo}`).val(categoriaSelecionada);

        // Adiciona o filtro visual
        addFiltro('categoria', categoriaSelecionada, null, "categoria-veic", "select", $(`#select-categoria-${tipoVeiculo}`), false);

        // Limpa a marca salva para evitar que o filtro se repita
        localStorage.removeItem("filtro-categoria");
    }

    // Buscar Veículos com os filtros aplicados
    buscarVeiculos();
});


// Função para obter sigla dos estados
function obterSiglaEstado(estadoVeiculo) {
    return new Promise((resolve, reject) => {
        $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados', function(estados) {
            for (let estado of estados) {
                if (estado.nome === estadoVeiculo) {
                    resolve(estado.sigla);
                    return;
                }
            }
            resolve(false);
        }).fail(reject);
    });
}

// Função para formatar os valores
function formatarValor(valor) {
    // Ignora se estiver vazio
    if (!valor) {
        $(this).val('');
        return;
    }
    
    // Converte o valor para float
    const valorFloat = parseFloat(valor);
    
    // Separa parte inteira e decimal
    const parteInteira = Math.floor(valorFloat).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = (Math.round((valorFloat - Math.floor(valorFloat)) * 100))
                          .toString()
                          .padStart(2, '0');
    
    const precoFormatado = 'R$ ' + parteInteira + ',' + parteDecimal;
    
    return precoFormatado;
}

async function buscarVeiculos() {
    await $.ajax({
        method: "POST",
        url: `${BASE_URL}/buscar-${tipoVeiculo}`,
        data: JSON.stringify(filtroSelect),
        contentType: "application/json",
        success: async function(response) {
            // Alterando o número da quantidade de veículos obtidos através da resposta da API
            $("#qnt-veiculos").text(response.qnt);

            // Obtendo a div para inserir os veículos
            const $divVeic = $("#div-veiculos");

            // Limpa a div antes de adicionar outros veículos
            $divVeic.empty();
            
            $('html, body').animate({ scrollTop: 0 }, 300);

            // Obtém a lista de veículos
            const listaVeic = response.veiculos;

            if (listaVeic.length === 0) {
                const cardInvisivel = $("<div></div>").addClass("card-invisivel").css({
                    height: "300px",
                    visibility: "hidden"
                });
                $("#div-veiculos").append(cardInvisivel);
                return;
            }            

            for (veiculo of listaVeic) {
                // Cria a div card
                const divCard = $("<div></div>").addClass("card");

                const img = $("<div></div>")
                            .css({
                                "background-image": `url(${veiculo.imagens[0]})`,
                                "background-position": "center",
                                "background-repeat": "no-repeat",
                                "background-size": "cover",
                                "height": "225px"
                            })
            
                // Cria a div de itens do card
                const divItensCard = $("<div></div>").addClass("itens-card");

                let comprimentoMarca = veiculo.marca.length;
                let comprimentoModelo = veiculo.modelo.length;
                let comprimentoNomeVeic = comprimentoMarca + 1 + comprimentoModelo;
                
                // Cria o span modelo
                let spanModelo = $(`<span></span>`);

                // Função para formatar o texto e adicionar "..."
                function limitarQntCaracteres(texto, qntMax) {
                    return texto.substr(0, qntMax) + '...';
                }

                // Caso comprimento for maior ou igual a 15 caractéres
                if (comprimentoNomeVeic >= 15) {
                    let qntLetrasModelo = 15 - (comprimentoMarca + 1);

                    let novoModelo = limitarQntCaracteres(veiculo.modelo, qntLetrasModelo);

                    spanModelo.text(novoModelo);
                } else {
                    spanModelo.text(veiculo.modelo);
                }

                // Título do veículo
                const h3Title = $("<h3></h3>")
                    .append(`${veiculo.marca} `).append(spanModelo); // Inserir nome do carro
            
                // Descrição do veículo
                let pDesc;

                // Caso exista a versão
                if (veiculo.versao) { 
                    let qntCaracteresVersao = veiculo.versao.length;
    
                    // Caso a versão tenha mais ou igual a 34 caractéres
                    if (qntCaracteresVersao >= 34) {
                        pDesc = $("<p></p>").text(limitarQntCaracteres(veiculo.versao, 34)); // Inserir versão do carro
                    } else {
                        pDesc = $("<p></p>").text(veiculo.versao); // Inserir versão do carro
                    }
                }
            
                // Container das informações adicionais
                const containerInfoCard = $("<div></div>").addClass("container-info-card");
            
                // Ano do veículo
                const iconCalendar = $("<i></i>").addClass("fa-solid fa-calendar-days");
                const pYear = $("<p></p>").text(veiculo.ano_modelo); // Ano veículo

                let siglaEstado = await obterSiglaEstado(veiculo.estado);
                    
                // Localização
                const iconLocation = $("<i></i>").addClass("fa-solid fa-location-dot");

                let pLocation;

                if (veiculo.cidade.length >= 17) {
                    let cidadeFormatada = limitarQntCaracteres(veiculo.cidade, 17);

                    pLocation = $("<p></p>").text(`${cidadeFormatada} (${siglaEstado})`); // Cidade
                } else {
                    pLocation = $("<p></p>").text(`${veiculo.cidade} (${siglaEstado})`); // Cidade
                }

                // Monta a div infoCard com ícones e textos
                containerInfoCard.append(iconCalendar, pYear, iconLocation, pLocation);
            
                // Preço do veículo

                let valor = formatarValor(veiculo.preco_venda);
                const h3Price = $("<h3></h3>").text(valor); // Valor
                
                // Url para abrir a página de anúncio
                let urlAnuncio;

                if (tipoVeiculo === "carro") {
                    urlAnuncio = "anuncio-carro.html";
                } else {
                    urlAnuncio = "anuncio-moto.html";
                }

                // Botão para ver detalhes
                const buttonDetalhes = $("<a></a>")
                    .attr("href", `${urlAnuncio}?id=${veiculo.id}`) // Url para anúncio veículos passando id pela url
                    .text("Ver detalhes")
                    .addClass("ver-detalhes");
            
                // Adiciona todos os itens na div itens-card
                if (veiculo.versao) {    
                    divItensCard.append(h3Title, pDesc, containerInfoCard, h3Price, buttonDetalhes);
                } else {
                    divItensCard.append(h3Title, containerInfoCard, h3Price, buttonDetalhes);
                }
            
                // Junta a imagem e os itens ao card
                divCard.append(img, divItensCard);
            
                // Insere o card no container desejado na página
                $divVeic.append(divCard);
            }
        },
        error: function(response) {
            alertMessage(response.responseJSON.error, 'error');
            setTimeout(
                window.location.href = "index.html"
            , 3000)
        }
    })
}

// Lógica para funcionar o scroll
document.addEventListener('DOMContentLoaded', function() {
    if ($(window).width() > 860) {
        // Seleciona os elementos necessários
        const divPaiFiltro = document.querySelector('.div-pai-filtro');
        const secVeiculos = document.querySelector('.sec-veiculos'); // Utiliza a seção correta de veículos

        // Estilos originais e fixos para o filtro
        const originalStyle = {
            width: '100%',
            position: 'static',
            top: '20px'
        };
        const fixedStyle = {
            width: '430px',
            position: 'fixed',
            top: '86px'
        };
        const fixThreshold = 128.8; // Ponto de scroll a partir do qual o filtro se fixa

        function verificarScroll() {
            const scrollPosition = window.scrollY;
            const finalSecVeiculos = secVeiculos.offsetTop + secVeiculos.offsetHeight;
            const alturaFiltro = divPaiFiltro.offsetHeight;
            // Ponto onde o filtro deve parar de estar fixo
            const posicaoParada = finalSecVeiculos - alturaFiltro;

            if (scrollPosition < fixThreshold) {
                // Antes do ponto de fixação, restaura o estilo original
                Object.assign(divPaiFiltro.style, {
                    width: originalStyle.width,
                    position: originalStyle.position,
                    top: originalStyle.top,
                    left: ''
                });
            } else if (scrollPosition >= fixThreshold && scrollPosition < posicaoParada - parseFloat(fixedStyle.top)) {
                // Entre o ponto de fixação e o ponto de parada, mantém o filtro fixo
                Object.assign(divPaiFiltro.style, {
                    width: fixedStyle.width,
                    position: fixedStyle.position,
                    top: fixedStyle.top,
                    left: ''
                });
            } else {
                // Após o ponto de parada, posiciona o filtro de forma absoluta para que ele não ultrapasse a seção
                Object.assign(divPaiFiltro.style, {
                    width: fixedStyle.width,
                    position: 'absolute',
                    top: posicaoParada + 'px',
                    left: ''
                });
            }
        }

        // Eventos para atualizar o estilo conforme o scroll e redimensionamento da janela
        window.addEventListener('scroll', verificarScroll);
        window.addEventListener('resize', verificarScroll);
        verificarScroll(); // Verifica a posição inicial ao carregar
    }
});

// add filtro visual 
function addFiltro(tipo, nome, remove, id, tipoInput, input, buscarVeiculosVal) {
    if ($(input).val() === '') {            
        // Remove o filtro de estado ao clicar no X
        $(`#${id}`).remove();
        
        // Remover do informação do objeto
        delete filtroSelect[tipo];

        // Refaz a contagem de filtros aplicados
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
        
        // Busca novamente os veículos sem o filtro
        buscarVeiculos();
        return;
    }
    
    let divFiltro = $('#filtros-aplic');
    let removerBtn = remove;

    if (!remove) {
        removerBtn = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
            // Remove o filtro de estado ao clicar no X
            $(`#${id}`).remove();
            // Remover do informação do objeto
            delete filtroSelect[tipo];
            // Descelecionar select
            
            if (tipoInput === "select") {
                input.find('option[value=""]').prop('selected', true);
            } else {
                input.val("");
            }
            
            // Refaz a contagem de filtros aplicados
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

            if (tipo === 'marca') {
                // Tira o sombreamento roxo da marca selecionada
                $(".itens-details li").removeClass("active");
            }

            // Aplicar filtros a API quando deletar
            buscarVeiculos();
        });
    }

    // Remover o filtro caso já exista
    if ($(`#${id}`)) {
        ($(`#${id}`)).remove();
    }

    // Criar a div
    let div = $("<div></div>").attr('id',id).addClass('filtro');
    div.append($('<p></p>').text(nome)).append(removerBtn);

    // Adicionar informação no objeto

    if ($(input).val()) {
        if (["preco-min", "preco-max"].includes(tipo)) {
            filtroSelect[tipo] = desformatarPreco($(input).val());
        } else {
            filtroSelect[tipo] = $(input).val();
        }
    } else {
        filtroSelect[tipo] = nome;
    }

    // Adicionar o filtro a div de filtros

    divFiltro.append(div);

    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

    if (buscarVeiculosVal) {
        // Aplicar filtros e enviar para a API
        buscarVeiculos();
    }
}

// Função para trocar o filtro entre carro e moto

const divTipoCarro = $('#tipo-veic-carro');
const divTipoMoto = $('#tipo-veic-moto');
const tipoVeicBgSelecionado =  $('#tipo-veic-bg-selecionado');

// Lógica para mudar cor do selecionado
function alterarTipoSelecionado(tipo1, tipo2, posicao, texto, categoria1, categoria2, marca1, marca2, tipoFiltro, carregar) {
    if (!tipo1.hasClass('active')) {
        if (texto === 'Carros') {
            $('#h2-titulo').text(`Carros semi-novos e usados`)
        } else {
            $('#h2-titulo').text(`Motos semi-novas e usadas`)
        }


        tipo1.addClass('active');
        tipo2.removeClass('active');
        tipoVeicBgSelecionado.css('left', posicao);

        $("#tipo-veic").text(texto);

        // Lógica para trocar as categorias visíveis
        categoria1.css('display', 'flex');
        marca1.css('display', 'flex');
        
        categoria2.css('display', 'none');
        marca2.css('display', 'none');
    
        // Alterando o tipo de veículo a ser pesquisado
        tipoVeiculo = tipoFiltro;

        // Lógica para funcionar quando abrir a página
        if (carregar) {
            return;
        }

        // Limpando os filtros
        limparFiltros();
    }
}
divTipoCarro.click(() => {
   alterarTipoSelecionado(divTipoCarro, divTipoMoto, '0', 'Carros', $('#categorias-carro'), 
   $('#categorias-moto'), $('#marcas-carro'), $('#marcas-moto'), "carro"); 
})

divTipoMoto.click(() => {
    alterarTipoSelecionado(divTipoMoto, divTipoCarro, '50%', 'Motos', $('#categorias-moto'),  
    $('#categorias-carro'), $('#marcas-moto'), $('#marcas-carro'), "moto");
})

// Limpar filtros

function limparFiltros() {
    // Limpa os filtros
    filtroSelect = {};

    // Limpa a div que mostra os filtros aplicados
    $("#filtros-aplic").empty();
    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

    // Tira o sombreamento roxo da marca selecionada
    $(".itens-details li").removeClass("active");

    // Desceleciona as categorias
    $('#select-categoria-carro').val('');
    $('#select-categoria-moto').val('');

    // Desceleciona o estado
    $('#estado-select').val('');

    // Desceleciona e limpa as cidades
    const optionVazia = $('<option value=""></option>')

    $('#cidade-select').empty().append(optionVazia).attr('disabled', true);

    // Limpa os preços
    $('#input-preco-min').val('');
    $('#input-preco-max').val('');

    // Desceleciona os anos
    $('#select-ano-min').val('');
    $('#select-ano-max').val('');

    // Fecha o acordeão de cores
    $('.filtro-cor-header').removeClass('active');
    $('.filtro-cor-container').removeClass('active');

    // Remover a sigla e nome da cidade acima do filtro
    $("#cidade-container").remove();
    $("#estado-container").remove();

    // "Descheckar" as options de cores
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach((option) => {
        const checkbox = $(option).find('input[type="checkbox"]');
        if (checkbox.prop("checked")) {
            checkbox.prop("checked", false);
        }
    })

    // Refaz a busca de veículos sem nenhum filtro
    buscarVeiculos();
}

$('#limpar-filtros').click(() => {
    limparFiltros();
})

// Filtro Marca
$(".itens-details li").on("click", function() {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#filtro-marca').remove();

        // Deletar o filtro de marca
        delete filtroSelect['marca'];

        // Fazer a recontagem do número de filtros aplicados
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
        
        // Rebuscar veículos sem o filtro de marca
        buscarVeiculos();
        return;
    }
    
    $(".itens-details li").removeClass("active");
    $(this).addClass("active");

    let marca = $(this).attr('marca')

    addFiltro("marca", marca, null, "filtro-marca", "select", $(this), true);
});


// Filtro categoria

$('#select-categoria-carro').on('change', function() {
    addFiltro('categoria', $(this).val(), null, "categoria-veic", "select", $('#select-categoria-carro'), true);
})

$('#select-categoria-moto').on('change', function() {
    addFiltro('categoria', $(this).val(), null, "categoria-veic", "select", $('#select-categoria-moto'), true);
})

// Filtro Localidade

$(document).ready(function () {
    const estadoSelect = $("#estado-select"); 
    const cidadeSelect = $("#cidade-select"); 

    // Função para carregar os estados do IBGE
    function carregarEstados(select) {
        $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
            // Ordena os estados por nome
            estados.sort((a, b) => a.nome.localeCompare(b.nome));

            // Para cada estado, adiciona uma opção no select
            $.each(estados, function (index, estado) {
                select.append(`<option value="${estado.id}">${estado.nome}</option>`);
            });
        });
    }

    // Função para carregar as cidades com base no estado selecionado
    function carregarCidades(estadoId, select) {
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
            select.empty(); // Limpa as opções anteriores do select de cidades

            select.append(`<option value="">Todas</option>`)

            // Adiciona cada cidade como opção
            $.each(cidades, function (index, cidade) {
                select.append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
            });

            // Habilita o select de cidades e ativa o label (para animações ou estilos visuais)
            select.prop("disabled", false);
            select.prev("label").addClass("active");
        });
    }

    // Quando o select de estados mudar de valor, carrega as cidades correspondentes
    function addCidades(selectCid, selectEst) {
        const estadoId = $(selectEst).val();

        // Reinicia o select de cidades e desabilita-o temporariamente
        selectCid.empty().prop("disabled", true);
        // Remove a classe ativa do label de cidade caso o usuário mude de estado
        selectCid.prev("label").removeClass("active");

        if (estadoId) {
            carregarCidades(estadoId, selectCid);
        }
    };

    estadoSelect.on("change", () => {
        addCidades(cidadeSelect, estadoSelect);

        // Deleta as informações das cidades por padrão

        // Remove o filtro visual de cidade
        $('#cidade-filtro').remove();
        $("#cidade-container").remove();

        // Limpar filtros aplicados
        delete filtroSelect["cidade"];

        // Refaz a contagem de filtros aplicados
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

        const estadoId = estadoSelect.val();
        let fluxoFiltro = $('#fluxo-filtro');
        let divFiltro = $('#filtros-aplic');

        if (!estadoId) {
            // Remove o filtro visual de estado
            divFiltro.find('#estado-filtro').remove();
            fluxoFiltro.find("#estado-container").remove();
            
            // Remove o filtro visual de cidade
            divFiltro.find('#cidade-filtro').remove();
            fluxoFiltro.find("#cidade-container").remove();

            // Deleta o filtro de estado e cidade
            delete filtroSelect['cidade'];
            delete filtroSelect['estado'];

            // Refaz a contagem de filtros aplicados
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

            // Refaz a busca
            buscarVeiculos();
            
            return;
        }
        
        // Requisição para obter detalhes do estado
        $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}`, function(estado) {
            // Cria novos elementos usando $('<i>') e $('<a>') para evitar selecionar elementos já existentes
            let chevronRight = $("<i></i>").addClass("fa-solid fa-chevron-right");
            let estadoLink = $("<a></a>").text(estado.sigla);

            // Procura por um container específico para os dados dinâmicos; se não existir, cria um
            let estadoContainer = fluxoFiltro.find("#estado-container");
            if (!estadoContainer.length) {
                estadoContainer = $("<span></span>").attr("id", "estado-container");
                fluxoFiltro.append(estadoContainer);
            }
            
            // Criação do ícone de remover
            let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
                $("#estado-filtro").remove(); // Remove o filtro de estado ao clicar no X
                $("#estado-container").remove();
                $("#estado-select").val(""); // Limpa o estado selecionado

                // Remove a classe ativa do label de cidade
                // Limpa o select de cidade
                $("#cidade-select").empty().prop("disabled", true).prev("label").removeClass("active"); 

                // Remove as cidades
                $("#filtros-aplic").find('#cidade-filtro').remove();
                $("#fluxo-filtro").find("#cidade-container").remove();

                // Limpar filtros aplicados
                delete filtroSelect["estado"];
                // Limpar filtros aplicados
                delete filtroSelect["cidade"];

                // ALterar o número de filtros aplicados exibidos
                $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

                // Refaz a busca sem o filtro de cidade e estado
                buscarVeiculos();
            });

            addFiltro('estado', estado.nome, removerFiltro, 'estado-filtro', null, null, true);

            // Atualiza o container com os novos elementos (substituindo o estado anterior, se houver)
            estadoContainer.empty().append(chevronRight).append(estadoLink);

            // Remover a sigla de cidade caso troque o estado
            let cidadeContainer = fluxoFiltro.find("#cidade-container");
            if (cidadeContainer) {
                cidadeContainer.remove();
            }
        }); 
    });

    cidadeSelect.on("change", () => {
        const cidadeNome = cidadeSelect.val();

        if (cidadeNome === "") {
            // Remove o filtro visual de cidade
            $('#cidade-filtro').remove();
            $("#cidade-container").remove();

            // Limpar filtros aplicados
            delete filtroSelect["cidade"];

            // Refaz a contagem de filtros aplicados
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

            // Refaz a busca
            buscarVeiculos();

            return;
        }

        let fluxoFiltro = $('#fluxo-filtro');

        let chevronRight = $("<i></i>").addClass("fa-solid fa-chevron-right");
        let cidadeLink = $("<a></a>").text(cidadeNome);

        // Procura por um container específico para os dados dinâmicos; se não existir, cria um
        let cidadeContainer = fluxoFiltro.find("#cidade-container");
        if (!cidadeContainer.length) {
            cidadeContainer = $("<span></span>").attr("id", "cidade-container");
            fluxoFiltro.append(cidadeContainer);
        }
            
        // Criação do ícone de remoção
        let removerFiltro = $("<i></i>").addClass("fa-solid fa-x").on("click", function() {
            // Remove o filtro de estado ao clicar no X
            $("#cidade-filtro").remove();

            // Remove o nome da cidade no topo da página
            $("#cidade-container").remove();

            // Desceleciona o input
            $("#cidade-select").find('option[value=""]').prop('selected', true);

            // Limpar filtros aplicados
            delete filtroSelect["cidade"];

            // ALterar o número de filtros aplicados exibidos
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

            // Refaz a busca sem o filtro de cidade
            buscarVeiculos();
        });

        addFiltro("cidade", cidadeNome, removerFiltro, "cidade-filtro", null, null, true);

        // Atualiza o container com os novos elementos (substituindo o estado anterior, se houver)
        cidadeContainer.empty().append(chevronRight).append(cidadeLink);
    })

    // Carrega os estados assim que a página é carregada
    carregarEstados(estadoSelect);
});

// Filtro Preço Mínimo

// Evento de input para formatação em tempo real

function formatarPreco(input) {
    $(input).on('input', function() {
        // 1. Limpeza do Input: Remove caracteres não numéricos
        let valor = $(this).val().replace(/[^\d]/g, '');
        
        // Ignora se estiver vazio
        if (!valor) {
            $(this).val('');
            return;
        }
        
        // 2. Separação Parte Decimal/Inteira (considera o valor como centavos)
        const centavos = parseInt(valor, 10);
        const reais = Math.floor(centavos / 100);
        const centavosFinal = centavos % 100;
        
        // Converte para strings para formatação
        let parteInteira = reais.toString();
        const parteDecimal = centavosFinal.toString().padStart(2, '0');
        
        // 3. Formatação da Parte Inteira
        // Adiciona pontos a cada 3 dígitos
        if (parteInteira.length > 3) {
            parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        // 4. Montagem Final: Combina tudo no padrão R$ X.XXX,XX
        const precoFormatado = 'R$ ' + parteInteira + ',' + parteDecimal;
        
        // Atualiza o valor do campo
        $(this).val(precoFormatado);
    })

    $(input).on('blur', function() {
        let valor = $(this).val();
    
        // Ignora se campo estiver vazio
        if (!valor) return;
        
        // Se o valor não estiver corretamente formatado, aplica a formatação
        if (!valor.startsWith('R$')) {
            $(this).trigger('input');
        }
    })
}

// Desformatar preço
function desformatarPreco(valorFormatado) {
    // Remove "R$", espaços e pontos, troca vírgula por ponto
    let valorLimpo = valorFormatado
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    
        // Aredonda o valor para duas casas decimais
    return parseFloat(valorLimpo);
}

// Adicionando formatação de preço
formatarPreco('#input-preco-min');
formatarPreco('#input-preco-max');

$("#input-preco-min").on("input", function() {
    addFiltro("preco-min", `Mín: ${$(this).val()}`, null, "preco-min", "input", $(this), true);
})

// Filtro Preço Máximo

$("#input-preco-max").on("input", function() {
    addFiltro("preco-max", `Max: ${$(this).val()}`, null, "preco-max", "input", $(this), true);
})


// Rota para adicionar as options do select ano veículo

const anoMin = 1950;
const anoMax = new Date().getFullYear();

function addAnoInput(input) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        input.append(option);
    }
}
// Adicionado options aos inputs
addAnoInput($("#select-ano-min"));
addAnoInput($("#select-ano-max"));

// Filtro Ano Mínimo

$("#select-ano-min").on("change", function() {
    addFiltro("ano-min", `Desde ${$(this).val()}`, null, "ano-min", "input", $(this), true);

    $('#select-ano-max').empty();

    // Lógica para não permitir que ano máximo seja menor ou igual a ano mínimo

    // Adicionadno input vazio
    const optionVazia = $(`<option value="">Ano máximo</option>`);
    $('#select-ano-max').append(optionVazia);

    // Remove a div visual do ano max do filtro
    $(`#ano-max`).remove();

    // Remover ano max do filtro
    delete filtroSelect["ano-max"];
    
    // Refaz a contagem de filtros aplicados
    $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);

    // For para adicionar todos os anos que forem maiores que ano mínimo
    for (let ano = anoMax; ano > $(this).val(); ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        $('#select-ano-max').append(option);
    }
})

// Filtro Ano Máximo

$("#select-ano-max").on("change", function() {
    addFiltro("ano-max", `Até ${$(this).val()}`, null, "ano-max", "input", $(this), true);
})

// Filtro Cores
document.addEventListener('DOMContentLoaded', function() {
    const filterHeader = document.querySelector('.filtro-cor-header');
    const filterContainer = document.querySelector('.filtro-cor-container');
    
    filterHeader.addEventListener('click', function() {
        filterContainer.classList.toggle('active');
        filterHeader.classList.toggle('active');
    });
});


// Function para colocar as cores na lista
const optionItems = document.querySelectorAll('.option-item');

optionItems.forEach((item) => {
    // Seleciona o checkbox dentro do item
    const checkbox = $(item).find('input[type="checkbox"]');
    
    // Usa o evento 'change' para capturar marcação e desmarcação
    checkbox.on("change", function() {
        let cores = [];
        
        // Percorre todos os checkboxes para reconstruir a lista de cores marcadas
        optionItems.forEach((item) => {
            const cb = $(item).find('input[type="checkbox"]');
            if (cb.prop("checked")) {
                const label = $(item).find('label');
                cores.push(label.text());
            }
        });

        if (!cores.length) {
            // Deleta o filtro de cores
            delete filtroSelect['cores'];
        
            // Refaz a contagem de filtros aplicados
            $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
        } else {
            // Atualiza o filtro de cores
            filtroSelect['cores'] = cores;
        }
        
        // Atualiza o número de filtros aplicados e chama a função para buscar veículos
        $("#num-filtros-aplic").text(Object.keys(filtroSelect).length);
        buscarVeiculos();
    });
});

// Função para funcionar botão de filtro

function aparecerSumirFiltro() {
    // Verifica se o filtro está sendo exibido
    if ($('.div-pai-filtro').css('display') === "none") {
        // Aparecer o filtro e garantir que a animação seja aparecer filtro
        $('.div-pai-filtro').css({
            "display": "flex",
            "animation": "0.65s aparecerFiltro"
        })

        // Apenas para não bugar o display
        $('.div-pai-filtro').on('animationend', function() {
            $(this).css("display", "flex");
        })
    } else {
        // Trocar a animação para sumir filtro
        $('.div-pai-filtro').css({
            "animation": "0.65s sumirFiltro"
        })

        // Dar display none quando a animação terminar
        $('.div-pai-filtro').on('animationend', function() {
            $(this).css("display", "none");
        })    
    }
}

// Adicionando função aos botões
$(document).ready(function() {
    // Caso a tela seja menor que 860px (responsivo)
    if ($(window).width() < 860) {
        // Adiciona um evento click ao botão de filtro
        $('#btn-filtro').click(function() {
            aparecerSumirFiltro();
        })

        $('#fecharFiltro').click(function() {
            aparecerSumirFiltro();
        })
    }
})

