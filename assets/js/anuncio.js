// Função de exibir a mensagem para evitar repetir código
function alertMessage(text, type) {
    $('#divAlertMessage').empty().css('display', 'flex');
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

// Declarando variável global
var tipoUser;

// Obter tipo de usuário
function obterTipoUser() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        return;
    }

    const token = dadosUser.token;

    if (!token) {
        localStorage.removeItem('dadosUser');
        localStorage.setItem('mensagem', JSON.stringify({
            "error": "Sessão não iniciada."
        }))
        window.location.href = 'login.html';
    }

    return $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            tipoUser = response.tipo_usuario;
            return;
        },
        error: function (response) {
            localStorage.removeItem('dadosUser');
            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))
            return window.location.href = "login.html";
        }
    })
}

// Função para funcionar filtro de categorias
$(document).ready(function () {

    // Verifica se tem mensagem salva no local storage
    const msgCompra = localStorage.getItem('msgCompraAdm');

    if (msgCompra) {
        // Exibe mensagem de sucesso
        alertMessage(msgCompra, 'success');

        // Remove o item do local storage
        localStorage.removeItem('msgCompraAdm');
    }

    $(".div-modelos a").on("click", function (e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        // Pega a categoria da moto
        const categoria = $(this).attr("categoria");
        const tipo = $(this).attr("tipo-veiculo");

        // Salva no localStorage
        localStorage.setItem("tipo-veiculo", tipo);
        localStorage.setItem("filtro-categoria", categoria);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";
    });
});

// Função de aplicar filtro
function aplicarFiltroMarca(div) {
    localStorage.setItem('tipo-veiculo', TIPO_VEIC);

    // Pegamos o id do elemento clicado
    const marca = $(div).attr("marca");

    // Salvamos no localStorage para usar na próxima página
    localStorage.setItem("filtro-marca", marca);

    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";
}

// Adicionando o evento aos elementos
$(document).ready(function () {
    $(`.a-marcas-${TIPO_VEIC}`).click(function (e) {
        aplicarFiltroMarca(this);
    });

    $('#logo-img').click(function () {
        aplicarFiltroMarca(this);
    })
});

// Função para inicializar o carrossel
function carregarOwlCarrossel() {
    var owl = $("#div-owl-carousel");

    // Destroi o carrossel existente para evitar duplicações
    if (owl.hasClass('owl-loaded')) {
        owl.trigger('destroy.owl.carousel');
        owl.removeClass('owl-loaded');
        owl.find('.owl-stage-outer').children().unwrap();
    }

    // Inicializa o carrossel
    owl.owlCarousel({
        loop: false,
        nav: false,
        margin: 10,
        responsive: {
            0: { items: 1 },
            580: { items: 2 },
            1240: { item: 3 }
        }
    });

    // Configura os botões de navegação
    $("#nextSlide").on("click", function () {
        owl.trigger("next.owl.carousel");
    });

    $("#prevSlide").on("click", function () {
        owl.trigger("prev.owl.carousel");
    });
}

// Função para pegar as informações do input e passar para o parágrafo

async function carregarInputs() {
    // Passar o valor dos inputs para os mirrors
    await $('input, select').each(function () {
        const id = $(this).attr('id');
        const spanMirror = $(`#mirror-${id}`);

        if (spanMirror.length) {
            $(this).css('display', 'none');
            spanMirror.text($(this).val()).css('display', 'flex');
        }
    });

    // Função especial para o input de licenciado (Sim ou Não)
    const selectLicenciado = $('#select-licenciado');
    const spanMirror = $(`#mirror-select-licenciado`);

    selectLicenciado.css('display', 'none');
    let valorLicenciado;

    if (selectLicenciado.val() === '1') {
        valorLicenciado = 'Sim';
    } else {
        valorLicenciado = 'Não';
    }

    spanMirror.text(valorLicenciado).css('display', 'flex');

    // Lógica para mostrar as barras do ano e traço da cidade
    $('#barra-ano-mirror').css('display', 'flex');
    $('#barra-ano-select').css('display', 'none');

    $('#dash-cidade-mirror').css('display', 'flex');
    $('#dash-cidade-select').css('display', 'none');
}

// Evento de input para formatação em tempo real

function formatarPreco(input) {
    $(input).on('input', function () {
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

    $(input).on('blur', function () {
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

// Função para formatar os valores
function formatarValor(valor) {
    // Ignora se estiver vazio
    if (valor < 0) {
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

const anoMin = 1950;
const anoMax = new Date().getFullYear();
const anoModelo = $('#select-ano-modelo');
const anoFabricacao = $('#select-ano-fabricacao');

function addAnoInput(input) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        input.append(option);
    }
}
// Adicionado options aos inputs
addAnoInput(anoFabricacao);

// Função para que ano de fabricação possa ser apenas 1 ano maior que ano modelo

// Função para adicionar options ano modelo
function addOptionsAnoFab(inputFab, inputMod) {
    let anoMin = parseInt(inputFab.val());

    if (!anoMin) {
        $(inputMod).empty().prop('disabled', true);
        $(`label[for="${$(inputMod).attr('id')}"]`).removeClass('active');
        return;
    }

    $(inputMod)
        .empty()
        .prop('disabled', false);

    let anoAnterior = anoMin - 1;

    if (anoAnterior < anoMin) {
        anoAnterior = anoMin;
    }

    for (let ano = anoMin; ano <= anoMin + 1; ano++) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        inputMod.append(option);
    }
}

// Função para adicionar ano modelo ao alterar
function anoFabInput(inputFab, inputMod) {
    $(inputFab).on('change', function () {
        addOptionsAnoFab(inputFab, inputMod);
    })
}

// Adicionar o evento change ao input ano modelo
anoFabInput(anoFabricacao, anoModelo);

// Formatar quilometragem
function formatarQuilometragem(quilometragem) {
    const km = Number(quilometragem);
    if (isNaN(km)) {
        return "";
    }

    // Formata o número com separador de milhar
    let formatted = km.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return `${formatted} km`;
}

function formatarQuilometragemInput(input) {
    $(input).on('input', function () {
        let valorNumerico = extrairNumeros($(input).val());
        $(input).val(formatarQuilometragem(valorNumerico));
    })

    $(input).on('blur', function () {
        let valorNumerico = extrairNumeros($(input).val());
        $(input).val(formatarQuilometragem(valorNumerico));
    })
}

formatarQuilometragemInput("#input-quilometragem");

// Extrair números
function extrairNumeros(valor) {
    // Remove qualquer caractere que não seja número
    let valorNumerico = valor.replace(/[^\d]/g, '');

    return valorNumerico;
}

// Adicionando formatação de preço
formatarPreco('#input-preco-venda');

// Alterar botão
async function alterarBotao() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'))

    // Caso exista dadosUser
    if (dadosUser) {
        await obterTipoUser();

        if (tipoUser === 2 || tipoUser === 1) {
            // Função para mudar o botão para do adm
            $('#div-button-vendedor').css('display', 'flex');
            $('#div-button-cliente').css('display', 'none');
            $('#div-button-vendido-cliente').css('display', 'none');
            $('#div-button-vendido-adm').css('display', 'none');
            $('#div-button-cancelar-reserva-cliente').css('display', 'none');
            $('#div-button-cancelar-reserva-adm').css('display', 'none');
            
            // Função para mudar a mensagem para o adm
            $('#mensagem-user').css('display', 'none');
            $('#mensagem-adm').css('display', 'flex');
            $('#mensagem-vendido-cliente').css('display', 'none');
            $('#mensagem-vendido-adm').css('display', 'none');
            $('#mensagem-reserva-cliente').css('display', 'none');
            $('#mensagem-reserva-adm').css('display', 'none');

            $('#div-icons-actions').css('display', 'flex');

            // Retorna
            return;
        }
    }

    // Função para mudar o botão para cancelar reserva
    $('#div-button-vendedor').css('display', 'none');
    $('#div-button-cliente').css('display', 'flex');
    $('#div-button-vendido-cliente').css('display', 'none');
    $('#div-button-vendido-adm').css('display', 'none');
    $('#div-button-cancelar-reserva-cliente').css('display', 'none');
    $('#div-button-cancelar-reserva-adm').css('display', 'none');

    // Função para mudar a frase que aparece caso seja o cliente que reservou
    $('#mensagem-user').css('display', 'flex');
    $('#mensagem-adm').css('display', 'none');
    $('#mensagem-vendido-cliente').css('display', 'none');
    $('#mensagem-vendido-adm').css('display', 'none');
    $('#mensagem-reserva-cliente').css('display', 'none');
    $('#mensagem-reserva-adm').css('display', 'none');

    $('#div-icons-actions').css('display', 'none');
}

// Função para carregar os estados do IBGE
function carregarEstados(select) {
    return $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
        // Ordena os estados por nome
        estados.sort((a, b) => a.nome.localeCompare(b.nome));

        // Para cada estado, adiciona uma opção no select
        $.each(estados, function (index, estado) {
            select.append(`<option value="${estado.nome}" id_estado="${estado.id}">${estado.nome}</option>`);
        });
    });
}

// Função para carregar as cidades com base no estado selecionado
function carregarCidades(estadoId, select) {
    return $.getJSON(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`, function (cidades) {
        select.empty(); // Limpa as opções anteriores do select de cidades

        // Adiciona cada cidade como opção
        $.each(cidades, function (index, cidade) {
            select.append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
        });
    });
}


// Variáveis globais
var LISTA_MANUTENCOES = [];    // Lista de manutenções carregadas
var INDEX_MANUTENCAO = 0;      // Índice da manutenção atual
var TODOS_SERVICOS = [];       // Lista de todos os serviços disponíveis

// ========== INICIALIZAÇÃO E CARREGAMENTO ==========

// Inicializar quando o documento estiver pronto
$(document).ready(async function () {
    // Formatação para os inputs de preço
    formatarPreco($('#valor-servico'));
    formatarPreco($('#valor-editar-servico'));

    // Carregar todos os serviços disponíveis para os selects
    await carregarTodosServicos();

    // Configurar listeners para os selects de serviços
    $('#select-servico').on('change', atualizarValorServico);
    
    $('#select-editar-servico').on('change', atualizarValorServicoEditar);

    // Inicializar quantidades com valor 1
    $('#quantidade-servico').val(1);
    $('#quantidade-editar-servico').val(1);

    configurarLinkServicosAdmin();
});

// Função para configurar o link de serviços para administradores
async function configurarLinkServicosAdmin() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    const $linkServicos = $('.link_para_servicos');

    await obterTipoUser();

    // Caso seja vendedor, esconde o botão
    if (tipoUser == 2) {
        $('.link_para_servicos').css('display', 'none');
        return;
    }

    // Se não houver usuário logado, não faz nada
    if (!dadosUser) {
        return;
    }
    if (dadosUser.tipo_usuario === 1) {
        $linkServicos.css('display', 'flex');

        // Adiciona o evento de clique
        $linkServicos.on('click', function() {
            // Mensagem no local storage
            localStorage.setItem('add-servico', true);
            // Redireciona para a página do perfil do adm
            window.location.href = 'administrador-perfil.html';
        });
    }
}

// Carregar todos os serviços disponíveis no banco de dados
async function carregarTodosServicos() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        return;
    }

    try {
        return $.ajax({
            url: `${BASE_URL}/servicos`,
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: function (response) {
                // Salvar serviços na variável global
                TODOS_SERVICOS = response.servicos;

                // Preencher os selects com os serviços
                preencherSelectServicos();
            }
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
    }
}

// Preencher os selects de serviços com as opções disponíveis
function preencherSelectServicos() {
    // Limpar opções existentes, mantendo a primeira
    $('#select-servico').find('option:not(:first)').remove();
    $('#select-editar-servico').find('option:not(:first)').remove();

    // Adicionar cada serviço como opção nos selects
    TODOS_SERVICOS.forEach(servico => {
        // Para o select de adicionar serviço
        const $option1 = $('<option>')
            .val(servico.id_servicos)
            .text(servico.descricao)
            .attr('data-valor', servico.valor);

        // Para o select de editar serviço
        const $option2 = $('<option>')
            .val(servico.id_servicos)
            .text(servico.descricao)
            .attr('data-valor', servico.valor);

        $('#select-servico').append($option1);
        $('#select-editar-servico').append($option2);
    });
}

// ========== MANIPULAÇÃO DO MODAL DE MANUTENÇÃO ==========

// Abrir/fechar o modal de manutenção
function modalManutencao() {
    if ($('.modal-manu').css('display') === 'flex') {
        // Fechar modal
        $('.modal-manu').css('display', 'none');
        $('#overlay-bg').css('display', 'none');
    } else {
        // Abrir modal
        $('.modal-manu').css('display', 'flex');
        $('#overlay-bg').css('display', 'flex');
    }
}

// Fechar modal com o botão X
$('#fecharModalManu').click(function () {
    modalManutencao();
    // Reexibir tela de carregamento para próxima abertura
    $('.bg-carregamento-manu').css('display', 'flex');
});

// Botão de adicionar manutenção
$('#addManutencao').click(async function () {
    // Carregar manutenções existentes
    await carregarManutencao();
    // Abrir o modal
    modalManutencao();
});

// Carregar dados das manutenções do veículo selecionado
async function carregarManutencao() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    // Desabilitar botões e limpar campos
    $('#add-servico').prop('disabled', true);
    $('#cancelar-manu').prop('disabled', true);
    $('#titleManutencao').text('');
    $('#input-date').val('');
    $('#input-obs').val('');
    $('#valor-total-manu').text(formatarValor(0));
    $('#tbody-servicos').empty();
    // Esconde o botão de gerar relatório
    $('#btn-gerar-relatorio').hide();

    try {
        // Determinar o ID do veículo com base no tipo
        let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

        $.ajax({
            url: `${BASE_URL}/manutencao_veic/${id_veic}/${TIPO_VEIC}`,
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: async function (response) {
                LISTA_MANUTENCOES = response.manutencao;

                const idAtual = $('#input-id-manutencao').val();

                if (idAtual) {
                    INDEX_MANUTENCAO = LISTA_MANUTENCOES.findIndex(m => m.id_manutencao == idAtual);
                    inserirDadosManutencao();
                } else {
                    // Define o índice para a última manutenção ou modo de adição
                    if (LISTA_MANUTENCOES.length > 0) {
                        INDEX_MANUTENCAO = LISTA_MANUTENCOES.length - 1;
                    } else {
                        INDEX_MANUTENCAO = 0; // Modo de adição quando não há manutenções
                    }

                    inserirDadosManutencao();
                }
            },
            error: function () {
                // Caso não existam manutenções, mostrar opção de adicionar
                $('#titleManutencao').text('Adicionar manutenção');
                INDEX_MANUTENCAO = 0;
                LISTA_MANUTENCOES = [];
                desabilitarSetas();
            }
        });
    } finally {
        // Desabilitar setas conforme necessário
        desabilitarSetas();

        // Ocultar tela de carregamento após um breve delay
        setTimeout(() => $('.bg-carregamento-manu').css('display', 'none'), 200);
    }
}

// Inserir dados da manutenção atual na interface
async function inserirDadosManutencao(id_manu) {
    // Se um ID foi fornecido, encontrar o índice correspondente
    if (id_manu) {
        for (let idx in LISTA_MANUTENCOES) {
            if (LISTA_MANUTENCOES[idx].id_manutencao == id_manu) {
                INDEX_MANUTENCAO = parseInt(idx);
                break;
            }
        }
    }

    // Verificar se estamos no modo de adição (índice além do tamanho da lista)
    if (INDEX_MANUTENCAO >= LISTA_MANUTENCOES.length) {
        // Modo de adição
        $('#add-servico').prop('disabled', true);
        $('#cancelar-manu').prop('disabled', true);
        $('#titleManutencao').text('Adicionar manutenção');
        $('#input-date').val('');
        $('#input-obs').val('');
        $('#valor-total-manu').text(formatarValor(0));
        $('#input-id-manutencao').val('');
        $('#tbody-servicos').empty();

        // Esconde o botão de gerar relatório
        $('#btn-gerar-relatorio').hide();
        desabilitarSetas();

        return;
    }

    // Carregar dados da manutenção atual
    const manutencao = LISTA_MANUTENCOES[INDEX_MANUTENCAO];

    // Formatar data para exibição
    const dataOriginal = manutencao.data_manutencao;
    const dataFormatada = new Date(dataOriginal).toISOString().split('T')[0];
    const [ano, mes, dia] = dataFormatada.split('-');
    const dataFormatadaBr = `${dia}/${mes}/${ano}`;

    // Preencher campos do formulário
    $('#titleManutencao').text(`Manutenção ${dataFormatadaBr}`);
    $('#input-date').val(dataFormatada);
    $('#input-obs').val(manutencao.observacao);
    $('#valor-total-manu').text(formatarValor(manutencao.valor_total));
    $('#input-id-manutencao').val(manutencao.id_manutencao);

    // Habilitar botões
    $('#add-servico').prop('disabled', false);
    $('#cancelar-manu').prop('disabled', false).css('transition', '0.3s');

    // Carregar serviços associados
    await carregarServicosManutencao(manutencao.id_manutencao);

    // Atualizar estado das setas de navegação
    desabilitarSetas();

    // Mostra o botão de gerar relatório
    $('#btn-gerar-relatorio').show();
}

// Habilitar/desabilitar setas de navegação conforme necessário
function desabilitarSetas() {
    if (!LISTA_MANUTENCOES || LISTA_MANUTENCOES.length === 0) {
        $('#manutencao-prox').addClass('disabled').prop('disabled', true);
        $('#manutencao-voltar').addClass('disabled').prop('disabled', true);
        return;
    }

    // Seta próxima (permite navegar até o modo de adição)
    if (INDEX_MANUTENCAO >= LISTA_MANUTENCOES.length) {
        $('#manutencao-prox').addClass('disabled').prop('disabled', true);
    } else {
        $('#manutencao-prox').removeClass('disabled').prop('disabled', false);
    }

    // Seta anterior
    if (INDEX_MANUTENCAO <= 0) {
        $('#manutencao-voltar').addClass('disabled').prop('disabled', true);
    } else {
        $('#manutencao-voltar').removeClass('disabled').prop('disabled', false);
    }
}

// Navegar para a manutenção anterior
$('#manutencao-voltar').click(function () {
    if ($(this).hasClass('disabled')) return;

    if (INDEX_MANUTENCAO > 0) {
        INDEX_MANUTENCAO--;
        inserirDadosManutencao();
    }
});

// Navegar para a próxima manutenção
$('#manutencao-prox').click(function () {
    if ($(this).hasClass('disabled')) return;

    INDEX_MANUTENCAO++;
    inserirDadosManutencao();
});

// ========== GERENCIAMENTO DE SERVIÇOS DA MANUTENÇÃO ==========

// Carregar serviços associados a uma manutenção
async function carregarServicosManutencao(id_manutencao) {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await $.ajax({
            url: `${BASE_URL}/manutencao_servicos/${id_manutencao}`,
            headers: { "Authorization": "Bearer " + dadosUser.token }
        });

        // Limpar tabela
        $('#tbody-servicos').empty();

        // Adicionar cada serviço com os dados completos
        response.servicos.forEach((servico, index) => {
            adicionarLinhaServicoTabela(servico, index);
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
    }
}

// Obter detalhes do serviço-manutenção (incluindo quantidade)
function obterDetalhesServicoManutencao(id_manutencao, id_servico, index) {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    // Esta função simula a obtenção de informações detalhadas do serviço
    // Na implementação real, seria necessário um endpoint específico no backend
    $.ajax({
        url: `${BASE_URL}/manutencao_servicos/${id_manutencao}/${id_servico}`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Aqui normalmente seriam recebidos dados como:
            // - Quantidade do serviço
            // - Valor total do item

            // Como não temos esse endpoint específico, vamos simular com base nos dados disponíveis
            const servico = TODOS_SERVICOS.find(s => s.id_servicos == id_servico);

            if (!servico) return;

            // Simular informações do serviço na manutenção
            // Na realidade, estes dados viriam do backend
            const quantidade = 1; // Valor padrão
            const valorTotalItem = servico.valor * quantidade;

            // Adicionar linha na tabela
            adicionarLinhaServicoTabela(servico, quantidade, valorTotalItem, index);
        },
        error: function () {
            console.error("Erro ao obter detalhes do serviço na manutenção");
        }
    });
}

// Adicionar linha de serviço na tabela
function adicionarLinhaServicoTabela(servico, index) {
    const $tr = $('<tr>').addClass(index % 2 === 0 ? 'tipo2' : 'tipo1');

    // Ícone de edição
    const $tdIcon = $('<td>').append(
        $('<i>')
            .addClass('fa-solid fa-pen-to-square editarServico')
            .attr('id_servico', servico.id_servicos)
            .css('cursor', 'pointer')
    );

    // Dados do serviço
    const $tdDescricao = $('<td>').text(servico.descricao);
    const $tdValorUnit = $('<td>').text(formatarValor(servico.valor_unitario));
    const $tdQuantidade = $('<td>').text(servico.quantidade);
    const $tdValorTotal = $('<td>').text(formatarValor(servico.valor_total_item));

    $tr.append($tdIcon, $tdDescricao, $tdValorUnit, $tdQuantidade, $tdValorTotal);
    $('#tbody-servicos').append($tr);
}
// ========== BOTÕES E AÇÕES DO MODAL DE MANUTENÇÃO ==========

// Botão Salvar Manutenção
$('#salvar-manu').click(function () {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    // Verificar se é uma nova manutenção ou atualização
    const id_manutencao = $('#input-id-manutencao').val();
    const id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

    if (!id_manutencao) {
        // Criar nova manutenção
        const dados = {
            "id_veic": id_veic,
            "tipo_veic": TIPO_VEIC,
            "data": $('#input-date').val(),
            "observacao": $('#input-obs').val()
        };

        $.ajax({
            method: "POST",
            url: `${BASE_URL}/manutencao`,
            contentType: 'application/json',
            data: JSON.stringify(dados),
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: function (response) {
                alertMessage(response.success, 'success');

                $('#input-id-manutencao').val(response.id_manutencao);

                carregarManutencao();
            },
            error: function (response) {
                alertMessage(response.responseJSON.error, 'error');
            }
        });
        return;
    }

    // Atualizar manutenção existente
    const dados = {
        "tipo_veic": TIPO_VEIC,
        "data": $('#input-date').val(),
        "observacao": $('#input-obs').val(),
        "id_manutencao": id_manutencao
    };

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/manutencao/${id_veic}`,
        contentType: 'application/json',
        data: JSON.stringify(dados),
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            alertMessage(response.success, 'success');

            carregarManutencao();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// Botão Cancelar Manutenção (inativar)
$('#cancelar-manu').click(function () {
    Swal.fire({
        title: "Deseja cancelar essa manutenção?",
        icon: "warning",
        text: "Os dados dessa manutenção nunca mais ficarão disponíveis.",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

            if (!dadosUser) {
                window.location.href = 'login.html';
                return;
            }

            const id_manutencao = $('#input-id-manutencao').val();

            if (!id_manutencao) {
                window.location.href = 'login.html';
                return;
            }

            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/manutencao/${id_manutencao}`,
                headers: {
                    "Authorization": "Bearer " + dadosUser.token
                },
                success: function (response) {
                    $('#input-id-manutencao').val('');
                    carregarManutencao();
                    alertMessage(response.success, 'success');
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            });
        }
    });
});

// ========== MODAL ADICIONAR SERVIÇO ==========

// Abrir modal de adicionar serviço
$('#add-servico').click(function () {
    $('.modal-manu').css('display', 'none');
    $('#formAddServico').css('display', 'flex');
});

// Fechar modal de adicionar serviço
$('#fecharModalAddServico').click(function () {
    $('.modal-manu').css('display', 'flex');
    $('#formAddServico').css('display', 'none');
});

// Atualizar valor do serviço quando selecionado
function atualizarValorServico() {
    const servicoId = $('#select-servico').val();

    if (!servicoId) {
        $('#valor-servico').val('R$ 0,00');
        return;
    }

    const servicoSelecionado = TODOS_SERVICOS.find(s => s.id_servicos == servicoId);

    if (servicoSelecionado) {
        $('#valor-servico').val(formatarValor(servicoSelecionado.valor));
    }
}

// Atualizar valor do serviço no modal de edição
function atualizarValorServicoEditar() {
    const servicoId = $('#select-editar-servico').val();

    if (!servicoId) {
        $('#valor-editar-servico').val('R$ 0,00');
        return;
    }

    const servicoSelecionado = TODOS_SERVICOS.find(s => s.id_servicos == servicoId);

    if (servicoSelecionado) {
        $('#valor-editar-servico').val(formatarValor(servicoSelecionado.valor));
    }
}

// Adicionar serviço à manutenção
$('#formAddServico').on('submit', function (e) {
    e.preventDefault();

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    if (!dadosUser) {
        window.location.href = "login.html";
        return;
    }

    const id_manutencao = parseInt($('#input-id-manutencao').val());
    const id_servico = parseInt($('#select-servico').val());
    const quantidade = parseInt($('#quantidade-servico').val() || 1); // Default 1 se vazio

    // Validação básica
    if (!id_servico || isNaN(id_servico)) {
        alertMessage('Selecione um serviço válido', 'error');
        return;
    }
    if (isNaN(quantidade) || quantidade < 1) {
        alertMessage('Quantidade inválida', 'error');
        return;
    }

    const dados = {
        id_manutencao: id_manutencao,
        id_servico: id_servico,
        quantidade: quantidade
    };

    $.ajax({
        method: "POST",
        url: `${BASE_URL}/manutencao_servicos`,
        data: JSON.stringify(dados),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: async function (response) {
            $('#formAddServico').hide();
            $('.modal-manu').css('display', 'flex');

            // Limpar campos
            $('#select-servico').val('');
            $('#valor-servico').val('R$ 0,00');
            $('#quantidade-servico').val(1);

            // Recarrega manutenções e mantém posição atual
            carregarManutencao();

            alertMessage('Serviço adicionado com sucesso!', 'success');
        },
        error: function (xhr) {
            const errorMsg = xhr.responseJSON?.error || "Erro ao adicionar serviço";
            console.error("Erro:", errorMsg);
            alertMessage(errorMsg, 'error');
        }
    });
});
// ========== MODAL EDITAR SERVIÇO ==========

// Abrir modal de editar serviço
$(document).on('click', '.editarServico', function () {
    const id_servico = $(this).attr('id_servico');
    const id_manutencao = $('#input-id-manutencao').val();

    if (!id_servico || !id_manutencao) {
        alertMessage("Dados incompletos", "error");
        return;
    }

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = "login.html";
        return;
    }

    // Carregar detalhes do serviço na manutenção
    carregarDetalhesServicoParaEdicao(id_manutencao, id_servico);
});

// Carregar detalhes do serviço para edição
function carregarDetalhesServicoParaEdicao(id_manutencao, id_servico) {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    $.ajax({
        url: `${BASE_URL}/manutencao_servicos/${id_manutencao}/${id_servico}`,
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + dadosUser.token,
            "Content-Type": "application/json" // Adicione este header
        },
        success: function (response) {
            // Preenche os campos corretamente
            $('#id-editar-servico').val(response.id_servicos);
            $('#select-editar-servico').val(response.id_servicos);
            $('#valor-editar-servico').val(formatarValor(response.valor_unitario));
            $('#quantidade-editar-servico').val(response.quantidade);

            // Atualiza o select
            atualizarSelectServico(response.id_servicos);

            $('.modal-manu').hide();
            $('#formEditarServico').show();
        },
        error: function () {
            return;
        }
    });
}

// Fechar modal de editar serviço
$('#fecharModalEditarServico').click(function () {
    $('.modal-manu').css('display', 'flex');
    $('#formEditarServico').css('display', 'none');
});

// Salvar alterações do serviço
$('#formEditarServico').on('submit', function (e) {
    e.preventDefault();

    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    const id_manutencao = $('#input-id-manutencao').val();
    const id_servico_original = $('#id-editar-servico').val();
    const novo_id_servico = $('#select-editar-servico').val();
    const quantidade = $('#quantidade-editar-servico').val();

    // Validação reforçada
    if (!novo_id_servico || !quantidade || quantidade < 1) {
        alertMessage("Preencha todos os campos corretamente", "error");
        return;
    }

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/manutencao_servicos/${id_manutencao}/${id_servico_original}`,
        data: JSON.stringify({
            novo_id_servico: novo_id_servico,
            quantidade: quantidade
        }),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token,
            "Content-Type": "application/json"
        },
        success: async function (response) {
            $('#formEditarServico').hide();
            $('.modal-manu').show();

            carregarManutencao();

            alertMessage("Serviço atualizado com sucesso!", "success");
        },
        error: function (xhr) {
            const errorMsg = xhr.responseJSON?.error || "Erro na atualização";
            alertMessage(errorMsg, "error");
        }
    });
});

function atualizarSelectServico(id_selecionado) {
    $('#select-editar-servico').empty().append('<option value="">Selecione...</option>');

    TODOS_SERVICOS.forEach(servico => {
        const option = $('<option>')
            .val(servico.id_servicos)
            .text(servico.descricao)
            .attr('data-valor', servico.valor)
            .prop('selected', servico.id_servicos == id_selecionado);

        $('#select-editar-servico').append(option);
    });

    // Disparar evento de change para atualizar o valor
    $('#select-editar-servico').trigger('change');
}

// Botão excluir serviço
$('#excluir-servico').click(function () {
    Swal.fire({
        title: "Deseja excluir esse serviço?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

            if (!dadosUser) {
                window.location.href = "login.html";
                return;
            }

            const id_manutencao = $('#input-id-manutencao').val();
            const id_servico = $('#id-editar-servico').val();

            if (!id_manutencao || !id_servico) {
                alertMessage("Dados incompletos", "error");
                return;
            }

            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/manutencao_servicos/${id_manutencao}/${id_servico}`,
                headers: {
                    "Authorization": "Bearer " + dadosUser.token
                },
                success: async function (response) {
                    $('#formEditarServico').css('display', 'none');
                    $('.modal-manu').css('display', 'flex');

                    carregarManutencao();

                    alertMessage(response.success || "Serviço removido com sucesso", 'success');
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            });
        }
    });
});

/*
    RESERVA
*/

// Reservar moto

$('#reservar-btn').click(function () {
    // Busca os dados do usuário
    const dadosUser = localStorage.getItem('dadosUser');

    // Verificar se existe dadosUser no local storage
    if (!dadosUser) {
        // Limpa o local storage
        localStorage.clear();

        // Caso não, define uma mensagem e redireciona para login
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))

        // Verifica o tipo do veículo
        if (TIPO_VEIC == 'carro') {
            // Salva o id do carro no local storage
            localStorage.setItem('id_carro_salvo', id_carro);
        } else {
            // Salva o id da moto no local storage
            localStorage.setItem('id_moto_salva', id_moto);
        }

        // e redireciona para login
        window.location.href = "login.html";
        return;
    }

    // Busca o token
    const token = JSON.parse(dadosUser).token;

    // Verificar se existe dadosUser no local storage
    if (!token) {
        // Limpa o local storage
        localStorage.clear();

        // Caso não, define uma mensagem
        localStorage.setItem('mensagem', JSON.stringify({
            'success': 'Faça login para concluir sua reserva!'
        }))

        // Verifica o tipo do veículo
        if (TIPO_VEIC == 'carro') {
            // Salva o id do carro no local storage
            localStorage.setItem('id_carro_salvo', id_carro);
        } else {
            // Salva o id da moto no local storage
            localStorage.setItem('id_moto_salva', id_moto);
        }

        // e redireciona para login
        window.location.href = "login.html";
        return;
    }

    // Verifica se as informações do cliente estão completas
    $.ajax({
        url: `${BASE_URL}/verificar_cadastro`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function () {
            // Caso de certo
            Swal.fire({
                title: "Deseja reservar esse veículo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0bd979",
                cancelButtonColor: "#f71445",
                confirmButtonText: "Confirmar"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Declara a variável
                    let envia;

                    // Salva as informações
                    if (TIPO_VEIC == 'carro') {
                        envia = {
                            "id_veiculo": id_carro,
                            "tipo_veiculo": "carro"
                        }
                    } else {
                        envia = {
                            "id_veiculo": id_moto,
                            "tipo_veiculo": "moto"
                        }
                    }

                    $.ajax({
                        method: "POST",
                        url: `${BASE_URL}/reservar_veiculo`,
                        contentType: 'application/json',
                        data: JSON.stringify(envia),
                        headers: {
                            "Authorization": "Bearer " + token
                        },
                        success: function (response) {
                            Swal.fire({
                                title: "Sucesso!",
                                text: response.success,
                                icon: "success",
                                confirmButtonColor: "#0bd979",
                                confirmButtonText: "Confirmar"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Salva a reserva
                                    localStorage.setItem('msgReserva', 'Veja mais informações clicando em "Ver detalhes".')
                                    // Redireciona para perfil
                                    window.location.href = "cliente-perfil.html";
                                }
                            })
                        },
                        error: function (response) {
                            Swal.fire({
                                title: "Algo deu errado...",
                                text: response.responseJSON.error,
                                icon: "error"
                            })
                        }
                    })
                }
            });
        },
        error: function (response) {
            // Define uma mensagem para o cliente
            localStorage.setItem('msgPerfil', 'Finalize seu cadastro para prosseguir com a reserva!');

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'cliente-perfil.html';
            // Retorna
            return;
        }
    });
})

/* 
    COMPRAR (GERAR VENDA)
*/

// Adicionando evento de abrir modais no botão
$(document).ready(function () {

    // Ao clicar no botão de comprar já
    $('.comprar-btn').on('click', function () {

        // Obtém os dados do usuário
        let dadosUser = localStorage.getItem('dadosUser');

        // Caso não tenha dados do usuário
        if (!dadosUser) {
            // Limpa o local storage
            localStorage.clear();

            // Define uma mensagem para o cliente
            localStorage.setItem('mensagem', JSON.stringify({
                'success': 'Faça login para completar sua compra!'
            }))

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'login.html';
            // Retorna
            return;
        }

        // Busca o token no local storage
        let token = JSON.parse(dadosUser).token;

        // Caso não tenha token, retorna
        if (!token) {
            // Limpa o local storage
            localStorage.clear();

            // Define uma mensagem para o cliente
            localStorage.setItem('mensagem', JSON.stringify({
                'success': 'Faça login para completar sua compra!'
            }))

            // Verifica o tipo do veículo
            if (TIPO_VEIC == 'carro') {
                // Salva o id do carro no local storage
                localStorage.setItem('id_carro_salvo', id_carro);
            } else {
                // Salva o id da moto no local storage
                localStorage.setItem('id_moto_salva', id_moto);
            }

            // Redireciona para login
            window.location.href = 'login.html';
            // Retorna
            return;
        }

        // Verifica se as informações do cliente estão completas
        $.ajax({
            url: `${BASE_URL}/verificar_cadastro`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function () {
                // Caso tenha, abre os modais
                $('#modal-comprar').css('display', 'flex');
                $('#overlay-bg').css('display', 'flex');
            },
            error: function (response) {
                // Define uma mensagem para o cliente
                localStorage.setItem('msgPerfil', 'Finalize seu cadastro para prosseguir com a compra!');

                // Verifica o tipo do veículo
                if (TIPO_VEIC == 'carro') {
                    // Salva o id do carro no local storage
                    localStorage.setItem('id_carro_salvo', id_carro);
                } else {
                    // Salva o id da moto no local storage
                    localStorage.setItem('id_moto_salva', id_moto);
                }

                // Redireciona para login
                window.location.href = 'cliente-perfil.html';
                // Retorna
                return;
            }
        });
    });

    // Fechar modal ao clicar no X
    $('.btn-fechar-financiamento').click(function () {
        // Fechar os modais
        $('#modal-comprar').css('display', 'none');
        $('#overlay-bg').css('display', 'none');
    })

    $('.voltar-modal-compra').click(function () {
        // Fechando os modais e abrindo o de compra
        $('#modal-comprar').css('display', 'flex');
        $('#modal-pix').css('display', 'none');
        $('#modal-financiamento').css('display', 'none');

        // Formatando o input de entrada e o select
        $('#input-entrada').val(formatarValor(0));
        $('#select-parcelas').val(1);
        $('#p-valor-total').text('~');

        // Escondendo a imagem do qr code e desabilitando botão
        $("#loading-img-qrcode").show();
        $("#img-qrcode").hide();
        $("#confirmar-compra-pix").addClass('disabled');
    })

    // Abrir modal de parcelas
    $('#visualizar-parcelas').click(function () {
        $('#modal-financiamento').css('display', 'none');
        $('#modal-parcelas').css('display', 'flex');
    })

    // Voltar para financiamento
    $('.voltar-modal-financiamento').click(function () {
        $('#modal-financiamento').css('display', 'flex');
        $('#modal-parcelas').css('display', 'none');
    })

    // Abre o modal de gerar o qr code do pix
    $('#btn-pix').on('click', function () {
        // Exibe o modal de pix
        $('#modal-comprar').css('display', 'none');
        $('#modal-pix').css('display', 'flex');

        const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

        // Caso não encontre os dados do usuário
        if (!dadosUser) {
            // Limpa o local storage
            localStorage.clear();
            // Recarrega a página
            window.location.reload();
            return;
        }

        // Insere o email do cliente
        $('#email-cliente-compra').text(dadosUser.email);

        // Botém o tipo do veículo e o id_veic
        let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
        let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

        $.ajax({
            method: 'POST',
            url: `${BASE_URL}/gerar_pix`,
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            contentType: 'application/json',
            xhrFields: {
                responseType: 'blob' // <- diz ao XHR para devolver um Blob
            },
            data: JSON.stringify({
                'tipo_veic': tipo_veic_numerico,
                'id_veic': id_veic
            }),
            success: function (response) {
                // Cria a URL utilizando a resposta BLOB obtida da API
                const url_qrcode = URL.createObjectURL(response);

                // Substitui o background da div img-qrcode colocando a imagem do qr code
                $('#img-qrcode').css('background-image', `url(${url_qrcode})`).show();

                // Esconde o qr code carregando
                $('#loading-img-qrcode').hide();

                $('#confirmar-compra-pix').removeClass('disabled');
            },
            error: function (response) {
                // Exibe a mensagem de erro
                alertMessage(response.responseJSON.error, 'error');

                // Recarrega a página 2 seg depois do erro
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        })
    })

    // Confirmar compra via pix
    $('#confirmar-compra-pix').click(function () {
        // Caso o botão esteja desabilitado, retorna
        if ($(this).hasClass('disabled')) {
            return;
        }

        Swal.fire({
            title: "Deseja confirmar a compra desse veículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0bd979",
            cancelButtonColor: "#f71445",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Botém o tipo do veículo e o id_veic
                let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
                let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

                $.ajax({
                    method: 'POST',
                    url: `${BASE_URL}/compra/a_vista`,
                    data: JSON.stringify({
                        "tipo_veic": tipo_veic_numerico,
                        "id_veic": id_veic
                    }),
                    contentType: "application/json",
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                    },
                    success: function (response) {
                        if (response.adm) {
                            // Salva a mensagem no local storage
                            localStorage.setItem('msgCompraAdm', response.success);
                            // Recarrega a página
                            window.location.reload();
                            return;
                        }

                        // Define uma mensagme para ser exibida na página de perfil
                        localStorage.setItem("msgCompraAVista", response.success);
                        // Redireciona para a página de perfil
                        window.location.href = "cliente-perfil.html";
                        return;
                    },
                    error: function (response) {
                        alertMessage(response.responseJSON.error, 'error');
                    }
                })
            }
        })
    })

    // Confirmar financiamento
    $('#confirmar-financiamento').click(function () {
        Swal.fire({
            title: "Deseja confirmar o financiamento desse veículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0bd979",
            cancelButtonColor: "#f71445",
            confirmButtonText: "Confirmar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Botém o tipo do veículo e o id_veic
                let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
                let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;
                let entrada = parseFloat(desformatarPreco($('#input-entrada').val()).toFixed(2));
                let qnt_parcelas = extrairNumeros($('#select-parcelas').val());

                let envia = {
                    "id_veiculo": parseInt(id_veic),
                    "tipo_veiculo": parseInt(tipo_veic_numerico),
                    "entrada": entrada,
                    "qnt_parcelas": parseInt(qnt_parcelas)
                }

                $.ajax({
                    method: 'POST',
                    url: `${BASE_URL}/financiamento`,
                    data: JSON.stringify(envia),
                    contentType: "application/json",
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                    },
                    success: function (response) {
                        if (response.adm) {
                            // Salva a mensagem no local storage
                            localStorage.setItem('msgCompraAdm', response.success);
                            // Recarrega a página
                            window.location.reload();
                            return;
                        }
                        
                        // Define uma mensagme para ser exibida na página de perfil
                        localStorage.setItem("msgParcelamento", response.success);
                        // Redireciona para a página de perfil
                        window.location.href = "cliente-perfil.html";
                        return;
                    },
                    error: function (response) {
                        alertMessage(response.responseJSON.error, 'error');
                    }
                })
            }
        })
    })

    // Abre o modal para financiamento
    $('#btn-financiamento').on('click', function () {
        $('#modal-comprar').css('display', 'none');
        $('#modal-financiamento').css('display', 'flex');

        // Calcular parcelas
        calcularParcelas();
    })
});

// Função para calcular obter o valor das parcelas da API
function calcularParcelas() {
    // Botém o tipo do veículo e o id_veic
    let tipo_veic_numerico = TIPO_VEIC == 'carro' ? 1 : 2;
    let id_veic = TIPO_VEIC == 'carro' ? id_carro : id_moto;

    // Caso exista a option de zero parcelas
    if ($('#option-zero-parcelas')) {
        // Remove a option de zero parcelas caso exista
        $('#option-zero-parcelas').remove();

        // Reabilita o select de parcelas
        $('#select-parcelas').prop('disabled', false);
    }

    // Obtém a entrada e parcelas
    let entrada = desformatarPreco($('#input-entrada').val()).toFixed(2);

    let qnt_parcelas = parseInt($('#select-parcelas').val());

    // Obtém o valor do financiamento e parcelas
    $.ajax({
        url: `${BASE_URL}/financiamento/${id_veic}/${tipo_veic_numerico}/${qnt_parcelas}/${entrada}`,
        success: function (response) {
            if (desformatarPreco($('#input-entrada').val()) >= response.preco_venda) {
                // Formata o valor da entrada como o preco de venda total
                $('#input-entrada').val(formatarValor(response.preco_venda))

                // Define o texto como o preco venda
                $('#p-valor-total').text(formatarValor(response.preco_venda));

                // Cria a option com valor 0
                const option = $('<option value="0" id="option-zero-parcelas">0x</option>');

                // Da append na option e a seleciona
                $('#select-parcelas').append(option).val(0).prop('disabled', true);

                return;
            }

            // Formatar valor total
            $('#p-valor-total').text(formatarValor(response.valor_total));

            const lista_parcelas = response.lista_parcelas;

            // Limpa a tabela antes de adicionar os itens
            $('#tbody-parcelas').empty();

            for (let index in lista_parcelas) {
                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo1');
                } else {
                    $tr.addClass('tipo2');
                }

                // Formata a data
                const dataSeparada = lista_parcelas[index].data.split('-');
                const dataFormatada = dataSeparada.reverse().join('/');

                // Cria os tds que irão conter as informações
                const $tdNum = $('<td>').html(index);
                const $tdValor = $('<td>').html(formatarValor(lista_parcelas[index].valor));
                const $tdData = $('<td>').html(dataFormatada);

                $tr.append($tdNum)
                    .append($tdValor)
                    .append($tdData);

                $('#tbody-parcelas').append($tr);
            }
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Adicionar formatações ao input e select
$(document).ready(function () {
    // Insere o valor R$0,00 no input
    $('#input-entrada').val(formatarValor(0));

    // Adiciona a formatar ao input quando ele for alterado
    formatarPreco($('#input-entrada'));

    // Define a quantidade mínima e máxima das parcelas
    let parcelaMin = 1;
    let parcelaMax = 60;

    // Cria o loop for
    for (let i = parcelaMin; i < parcelaMax + 1; i++) {
        // Cria a option
        const optionParcela = $(`<option value="${i}">${i}x</option>`);
        // Adiciona a option as parcelas
        $('#select-parcelas').append(optionParcela);
    }

    // Calcular o valor total ao mudar o valor da entrada
    $('#input-entrada').on('input', function () {
        calcularParcelas();
    })

    // Calcular o valor total ao trocar a quantidade de parcelas
    $('#select-parcelas').on('change', function () {
        calcularParcelas();
    })
})

// Função para fazer animação botão
$('#btn-gerar-relatorio').hover(
    function () {
        $('#texto-gerar-relatorio')
            .css({ display: 'block', opacity: 0, right: '0' })
            .stop(true, true)
            .animate(
                { right: '67%', opacity: 1 },
                260 // duração em ms
            );
    },
    function () {
        $('#texto-gerar-relatorio')
            .stop(true, true)
            .animate(
                { right: '0', opacity: 0 },
                260,
                function () {
                    // ao fim da animação, esconde de vez
                    $(this).css('display', 'none');
                }
            );
    }
);

// Gerar pdf manutenção
$('#btn-gerar-relatorio').click(function() {
    // Obtém o id da manutenção
    const id_manutencao = LISTA_MANUTENCOES[INDEX_MANUTENCAO].id_manutencao;

    // Gera a url com parâmetro id
    let url = `${BASE_URL}/relatorio/manutencao?id=${id_manutencao}`;

    // Abre o relatório em outra guia
    window.open(url, '_blank');
})
