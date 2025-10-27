// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

$(document).ready(function () {

    const dadosUser = localStorage.getItem('dadosUser');

    // Caso não exista item no local storage, retorna para login
    if (!dadosUser) {
        localStorage.removeItem('dadosUser');

        localStorage.setItem('mensagem', JSON.stringify({
            "error": response.responseJSON.error
        }))

        window.location.href = "login.html";

        return;
    }

    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(dadosUser).token
        },
        success: function (response) {
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 2) {
                window.location.href = 'vendedor-perfil.html';
            }
            if (tipoUser === 3) {
                window.location.href = 'cliente-perfil.html';
            }
        },
        error: function (response) {
            localStorage.removeItem('dadosUser');

            localStorage.setItem('mensagem', JSON.stringify({
                "error": response.responseJSON.error
            }))

            window.location.href = "login.html";
        }
    })

    // Obter o banner da home
    $(document).ready(function () {
        $.ajax({
            url: `${BASE_URL}/obter_banner`,
            success: function (response) {
                $('.img-preview-banner').css({
                    'background-image': `url(${response.img_url})`
                })
            }
        })
    })
})

// Aparecer mensagem
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

$(document).ready(function () {
    // Exibir mensagem de reserva
    const mensagemLocalStorage = localStorage.getItem('msgPerfil');

    if (mensagemLocalStorage) {
        alertMessage(mensagemLocalStorage, 'success');
        localStorage.removeItem('msgPerfil');
    };
})

// FUNÇÃO PARA NÃO "BUGAR" O SELECT E INPUT

// Ao carregar o documento, adiciona a classe "active" ao label anterior se o input/select tiver valor
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os selects e inputs dentro de elementos com a classe .div-input
    const inputs = document.querySelectorAll(".div-input select, .div-input input");

    inputs.forEach((input) => {
        // Adiciona um ouvinte de evento para mudanças no valor do input/select
        input.addEventListener("change", function () {
            if (this.value) {
                // Se houver valor, adiciona a classe "active" no elemento irmão anterior (geralmente o label)
                this.previousElementSibling.classList.add("active");
            } else {
                // Se não houver valor, remove a classe "active"
                this.previousElementSibling.classList.remove("active");
            }
        });

        // Ao carregar a página, se o input já tiver um valor, ativa o label correspondente
        if (input.value) {
            input.previousElementSibling.classList.add("active");
        }
    });
});

// Fazer o nav funcionar

// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function (_, a) {
        if (a !== clicado) {
            $(a).removeClass('selecionado');
        } else {
            $(a).addClass('selecionado');
        }
    });
}

// Função para exibir relatório específico
function exibirRelatorio(tipo) {
    // Esconder todas as telas de relatório
    $('#minha-conta').css('display', 'none');
    $('#editUser').css('display', 'none');
    $('.container-relatorios').css('display', 'none');
    $('#reservas').css('display', 'none');
    $('#config').css('display', 'none');

    // Mostrar apenas o relatório selecionado
    $(`#relatorio-${tipo}`).css('display', 'flex');

    // Destacar o item no submenu
    $('.sub-relatorio').removeClass('destaque');
    $(`#${tipo}`).addClass('destaque');
}

$(document).ready(function () {
    /*
        JS DO FILTRO DE MOVIMENTAÇÕES
    */

    // Obtém a data atual
    const data = new Date();

    // Obtém o ano
    const anoMax = data.getFullYear();
    const anoMin = 2020;

    // Adiciona as options de ano
    for (let ano = anoMax; ano >= anoMin; ano--) {
        $('#select-ano-mov').append(
            $('<option></option>').val(ano).text(ano)
        )
    }

    // Seleciona o ano atual
    $('#select-ano-mov').val(anoMax);

    // Obtém o mês atual
    const mesAtual = data.getMonth() + 1;

    // Limpa o select de dia e adiciona uma option vazia
    $('#select-mes-mov')
        .empty()
        .append($('<option></option>').val('').text('~'));

    const nomesMeses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    // Adiciona os meses
    for (let mes = 1; mes <= 12; mes++) {        
        $('#select-mes-mov').append(
            $('<option></option>').val(mes).text(nomesMeses[mes - 1])
        )
    }

    // Seleciona o mês atual das options
    $('#select-mes-mov').val(mesAtual)

    // Obtém o dia atual
    const diaAtual = data.getDate();

    // Função para obter a quantidade de dias no mês
    function carregarDiasNoMes(ano, mes) {
        // Retorna o último dia do mês atual
        let diasNoMes = new Date(ano, mes, 0).getDate();

        // Limpa o select de dia e adiciona uma option vazia
        $('#select-dia-mov')
            .empty()
            .append($('<option></option>').val('').text('~'));
        
        // Adiciona os dias
        for (let dia = 1; dia <= diasNoMes; dia++) {
            $('#select-dia-mov').append(
                $('<option></option>').val(dia).text(String(dia).length > 1 ? dia : `0${dia}`)
            )
        }
    }

    // Chama a função para adicionar os dias no select
    carregarDiasNoMes(anoMax, mesAtual);

    // Seleciona o dia atual
    $('#select-dia-mov').val(diaAtual);

    // Busca as movimentações
    buscarMovimentacoes(anoMax, mesAtual, diaAtual);

    // Evento de mudança no select de ano
    $('#select-ano-mov').on('change', function() {
        let ano = $(this).val();

        $('#select-mes-mov').val('');
        $('#select-dia-mov').val('').prop('disabled', true);
    
        buscarMovimentacoes(ano);
    })

    // Evento de mudança no select de mês
    $('#select-mes-mov').on('change', function() {
        let ano = $('#select-ano-mov').val();
        let mes = $(this).val();

        if (!mes) {
            $('#select-dia-mov').val('').prop('disabled', true);
        } else {        
            $('#select-dia-mov').val('').prop('disabled', false);
        }

        carregarDiasNoMes(ano, mes);

        $('#select-dia-mov').val('');
    
        buscarMovimentacoes(ano, mes);
    })

    // Evento de mudança no select de dias
    $('#select-dia-mov').on('change', function() {
        let ano = $('#select-ano-mov').val();
        let mes = $('#select-mes-mov').val();
        let dia = $(this).val();

        buscarMovimentacoes(ano, mes, dia);
    })

    // Evento de mudança no select de ano
    $('#select-ano-mov').on('change', function() {
        let ano = $(this).val();

        $('#select-mes-mov').val('');
        $('#select-dia-mov').val('');
    
        buscarMovimentacoes(ano);
    })

    /*
    JS DOS RELATÓRIOS
    */

    // Inicialmente ocultar todos os relatórios específicos
    $('.container-relatorios').hide();

    $("#link_minhaConta").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'flex');
        $('#editUser').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#servicos').css('display', 'none');
        $('#config').css('display', 'none');

        // Fecha o submenu se estiver aberto
        $('nav').css('overflow-y', 'visible');
        $('.submenu-relatorios').slideUp();

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#link_relatorios").on("click", function () {
        const elementoClicado = this;

        // Caso relatórios já esteja aberto
        if ($(elementoClicado).hasClass('selecionado') && $(window).width() > WIDTH_RESPONSIVO) {
            $('#minha-conta').css('display', 'flex');
            $('#editUser').css('display', 'none');
            $('#reservas').css('display', 'none');
            $('#servicos').css('display', 'none');
            $('.container-relatorios').css('display', 'none');
            $('#config').css('display', 'none');

            // Fecha o submenu se estiver aberto
            $('nav').css('overflow-y', 'visible');
            $('.submenu-relatorios').slideUp();

            const minhaConta = document.getElementById('link_minhaConta');
            selecionarA(minhaConta);

            // Senão, abre o submenu de relatórios
        } else {
            $('#minha-conta').css('display', 'none');
            $('#editUser').css('display', 'none');
            $('#reservas').css('display', 'none');
            $('#servicos').css('display', 'none');
            $('#config').css('display', 'none');

            // Alternar a exibição do submenu
            $(".submenu-relatorios")
                .slideDown(300, function () {
                    $('nav').css('overflow-y', 'auto');
                });

            // Exibir a página de movimentação automaticamente
            exibirRelatorio('movimentacao');
            selecionarA(elementoClicado);
        }
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#link_editUser").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'flex');
        $('#servicos').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('#config').css('display', 'none');

        // Fecha o submenu se estiver aberto
        $('nav').css('overflow-y', 'visible');
        $('.submenu-relatorios').slideUp();

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#link_servicos").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'none');
        $('#servicos').css('display', 'flex');
        $('#reservas').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('#config').css('display', 'none');

        // Fecha o submenu se estiver aberto
        $('nav').css('overflow-y', 'visible');
        $('.submenu-relatorios').slideUp();

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#link_reservas").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('#servicos').css('display', 'none');
        $('.container-relatorios').css('display', 'none');
        $('#config').css('display', 'none');

        // Fecha o submenu se estiver aberto
        $('nav').css('overflow-y', 'visible');
        $('.submenu-relatorios').slideUp();

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    // Config Garagem
    $("#link_config").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#config').css('display', 'flex');
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#servicos').css('display', 'none');
        $('.container-relatorios').css('display', 'none');

        // Fecha o submenu se estiver aberto
        $('nav').css('overflow-y', 'visible');
        $('.submenu-relatorios').slideUp();

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    // Ação ao clicar nos itens do submenu
    $("#movimentacao").on("click", function () {
        exibirRelatorio('movimentacao');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#carros").on("click", function () {
        exibirRelatorio('carros');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#motos").on("click", function () {
        exibirRelatorio('motos');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#clientes").on("click", function () {
        exibirRelatorio('clientes');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#parcelamentos").on("click", function () {
        exibirRelatorio('parcelamentos');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

    $("#manutencao").on("click", function () {
        exibirRelatorio('manutencao');
        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    });

});


$(document).ready(function () {
    // Verifica se o hash atual na URL é "#link_servicos"
    const addServico = localStorage.getItem('add-servico');

    if (addServico) {
        $('#minha-conta').css('display', 'none');
        $('#servicos').css('display', 'flex');
        // Remove do local storage
        localStorage.removeItem('add-servico');
    }
});

// Funções serviços

// Variáveis globais
var LISTA_SERVICOS = [];
var ID_MANUTENCAO_ATUAL = null;

// Função para carregar serviços quando a página carregar ou quando o link de serviços for clicado
$(document).ready(function () {
    // Inicializa os serviços quando o link for clicado
    carregarServicos();


    // Configuração revisada do input de valor principal
    $('#input-valor')
        .on('focus', function () {
            if ($(this).val().trim() === '') {
                $(this).val('R$ 0,00');
            }
        })
        .on('input', function () {
            let raw = $(this).val().replace(/[^\d]/g, '');

            if (raw.length < 3) {
                raw = raw.padStart(3, '0'); // Ex: 5 -> 005 -> 0,05
            }

            const centavos = raw.slice(-2);
            const reais = raw.slice(0, -2);

            const valorFormatado = 'R$ ' + parseInt(reais).toLocaleString('pt-BR') + ',' + centavos;
            $(this).val(valorFormatado);
        })
        .on('keydown', function (e) {
            const allowedKeys = [8, 9, 13, 37, 39, 46]; // backspace, tab, enter, arrows, delete

            // Permitir números e teclas de controle
            if (
                (e.key >= '0' && e.key <= '9') ||
                allowedKeys.includes(e.keyCode)
            ) {
                return;
            }

            e.preventDefault(); // bloqueia tudo que não for número ou controle
        });



    // Configuração dinâmica para inputs de edição
    $(document)
        .on('focus', '#valor-editar-servico', function () {
            $(this).val('R$ ' + desformatarPreco($(this).val()).toFixed(2).replace('.', ','));
        })
        .on('input', '#valor-editar-servico', function () {
            $(this).val(formatarValorDinamico($(this).val()));
        })
        .on('blur', '#valor-editar-servico', function () {
            const valor = $(this).val();
            $(this).val(valor.endsWith(',') ? valor + '00' : valor);
        });

    // Função auxiliar para posicionar cursor
    function setCaretPosition(elem, pos) {
        elem.setSelectionRange(pos, pos);
    }

    $('#add-servico').click(function () {
        adicionarServico();
    });

    $(document).on('click', '.editarServico', function () {
        const idServico = $(this).attr('id_servico');
        abrirModalEditarServico(idServico);
    });

    $('#fecharModalEditarServico').click(function () {
        $('#formEditarServico').hide();
    });

    $('#excluir-servico').click(function () {
        excluirServico();
    });

    $('#formEditarServico').hide();

    const urlParams = new URLSearchParams(window.location.search);
    const idManutencao = urlParams.get('id_manutencao');
    if (idManutencao) {
        ID_MANUTENCAO_ATUAL = idManutencao;
        $('#input-id-manutencao').val(idManutencao);
        carregarServicosManutencao(idManutencao);
    }
});

// Função para envio ao banco (exemplo)
function enviarParaBanco() {
    const valorParaBanco = desformatarPreco($('#input-valor').val());
}

// Função para carregar todos os serviços cadastrados
async function carregarServicos() {
    // Obtém o item do local storage    
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    // Verifica se existe os dados do usuário
    if (!dadosUser) {
        alertMessage("Usuário não autenticado. Redirecionando para o login...", "error");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Limpa os inputs
    $('#input-obs').val('');
    $('#input-valor').val('');
    $('#tbody-servicos').empty();

    // Exibe o loader
    $('.bg-carregamento-servicos').css('display', 'flex');

    // Acessa a função de obter os dados dos serviços
    try {
        $.ajax({
            url: `${BASE_URL}/servicos`,
            headers: {
                "Authorization": "Bearer " + dadosUser.token
            },
            success: function (response) {
                // Salva os serviços na lista
                LISTA_SERVICOS = response.servicos;

                // Insere os serviços na tabela
                inserirServicosTabela();
            },
            error: function (response) {
                // Exibe mensagem de erro
                alertMessage(response.responseJSON.error, 'error');
            }
        });
    } catch (error) {
        alertMessage("Erro ao carregar serviços.", 'error');
        $('.bg-carregamento-servicos').css('display', 'none');
    }
}

// Função para inserir serviços na tabela
function inserirServicosTabela() {
    // Limpa os elementos da tabela antes de adicionar novos
    $('#tbody-servicos').empty();

    if (!LISTA_SERVICOS || !LISTA_SERVICOS.length) {
        const $tr = $('<tr>');
        const $tdVazio = $('<td colspan="3" style="text-align: center;">').text("Nenhum serviço cadastrado");
        $tr.append($tdVazio);
        $('#tbody-servicos').append($tr);
        return;
    }

    for (let index = 0; index < LISTA_SERVICOS.length; index++) {
        // Cria um elemento <tr> para agrupar as colunas
        const $tr = $('<tr>');

        if (index % 2 === 0) {
            $tr.addClass('tipo2');
        } else {
            $tr.addClass('tipo1');
        }

        // Cria os tds que irão conter as informações
        const $tdIcon = $('<td>');
        const $icone = $('<i>')
            .addClass('fa-solid fa-pen-to-square editarServico')
            .attr('id_servico', LISTA_SERVICOS[index].id_servicos)
            .css('cursor', 'pointer');

        $tdIcon.append($icone);

        const $tdDescricao = $('<td>').text(LISTA_SERVICOS[index].descricao).addClass('descricao-td');
        const valorNumerico = LISTA_SERVICOS[index].valor;
        const valorFormatado = formatarValor(typeof valorNumerico === 'string'
            ? valorNumerico.replace('.', ',')
            : valorNumerico.toFixed(2).replace('.', ','));
        const $tdValor = $('<td>').text(valorFormatado).addClass('valor-td');

        $tr.append($tdIcon)
            .append($tdDescricao)
            .append($tdValor);

        $('#tbody-servicos').append($tr);
    }
}

// Função para adicionar serviço
function adicionarServico() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    const descricao = $('#input-obs').val();
    const valor = desformatarPreco($('#input-valor').val());
    const idManutencao = $('#input-id-manutencao').val() || ID_MANUTENCAO_ATUAL;

    if (!descricao || !valor) {
        alertMessage('Preencha todos os campos', 'error');
        return;
    }

    let envia = {
        "descricao": descricao,
        "valor": valor
    };

    // Se houver ID de manutenção, adiciona ao objeto
    if (idManutencao) {
        envia.id_manutencao = idManutencao;
    }

    $.ajax({
        method: "POST",
        url: `${BASE_URL}/servicos`,
        data: JSON.stringify(envia),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Limpa os inputs
            $('#input-obs').val('');
            $('#input-valor').val('');

            // Verifica se estamos em contexto de manutenção específica
            if (idManutencao) {
                carregarServicosManutencao(idManutencao);
            } else {
                carregarServicos(); // Recarrega todos os serviços
            }

            // Exibe mensagem de sucesso
            alertMessage(response.success, 'success');
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
}

function abrirModalEditarServico(idServico) {
    const servico = LISTA_SERVICOS.find(s => s.id_servicos == idServico);
    if (!servico) {
        alertMessage("Serviço não encontrado", "error");
        return;
    }

    // Preenche os campos e ativa os labels
    $('#id-editar-servico').val(servico.id_servicos);
    $('#descricao-editar-servico')
        .val(servico.descricao)
        .prev('label').addClass('active');
    $('#valor-editar-servico')
        .val(formatarValor(servico.valor))
        .prev('label').addClass('active');

    $('#overlay-bg').css({
        'display': 'flex',
        'animation': 'aparecerOverlay 0.5s'
    });
    $('#formEditarServico').css({ display: 'flex' });
}

// Fecha modal de editar serviço
function fecharModalEditarServico() {
    // Aplica animação de saída em ambos
    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        $('#overlay-bg').css('display', 'none');
    }, 660);

    $('#formEditarServico').css({ display: 'none' });
}

// Salvar edição de serviço
function salvarEdicaoServico() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    if (!dadosUser) {
        window.location.href = 'login.html';
        return;
    }

    const idServico = $('#id-editar-servico').val();
    const descricao = $('#descricao-editar-servico').val();
    const valor = desformatarPreco($('#valor-editar-servico').val());
    if (!descricao || !valor) {
        alertMessage('Preencha todos os campos', 'error');
        return;
    }

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/servicos/${idServico}`, // ID na URL
        data: JSON.stringify({ descricao, valor }), // Remova id_servicos do body
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        success: function (response) {
            // Fechar modal
            fecharModalEditarServico();

            // Recarregar serviços da manutenção atual
            if (ID_MANUTENCAO_ATUAL) {
                carregarServicosManutencao(ID_MANUTENCAO_ATUAL);
            } else {
                carregarServicos();
            }

            alertMessage(response.success, 'success');
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
}

function excluirServico() {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));
    const idServico = $('#id-editar-servico').val();

    if (!dadosUser || !idServico) {
        alertMessage('Operação inválida', 'error');
        return;
    }

    const doDelete = () => {
        $.ajax({
            method: "DELETE",
            url: `${BASE_URL}/servicos/${idServico}`,
            headers: { "Authorization": "Bearer " + dadosUser.token },
            success: function (response) {
                fecharModalEditarServico();
                // Recarrega os dados conforme contexto
                ID_MANUTENCAO_ATUAL
                    ? carregarServicosManutencao(ID_MANUTENCAO_ATUAL)
                    : carregarServicos();
                alertMessage(response.success, 'success');
            },
            error: function (xhr) {
                // Mensagem mais clara
                const erro = xhr.responseJSON?.error || 'Erro desconhecido';
                alertMessage(`Falha ao inativar: ${erro}`, 'error');
            }
        });
    };

    // Confirmação com SweetAlert ou prompt nativo
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Inativar serviço?',
            text: "O serviço será marcado como inativo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(result => result.isConfirmed && doDelete());
    } else {
        confirm("Confirmar inativação?") && doDelete();
    }
}
// Binds de evento
$(function () {
    // Abrir modal
    $(document).on('click', '.editarServico', function () {
        abrirModalEditarServico($(this).attr('id_servico'));
    });

    // Fechar modal ao clicar no “<” ou no overlay
    $('#fecharModalEditarServico').on('click', fecharModalEditarServico);

    // Submeter edição
    $('#formEditarServico').on('submit', function (e) {
        e.preventDefault();

        // Validação básica antes de enviar
        const valor = $('#valor-editar-servico').val();
        if (!/^R\$\s\d+([.,]\d{1,2})?$/.test(valor)) {
            alertMessage('Formato de valor inválido', 'error');
            return;
        }

        salvarEdicaoServico();

    });

    // Botão excluir
    $('#excluir-servico').on('click', excluirServico);
});

// Função auxiliar para executar a exclusão
function executarExclusao(idServico, token) {
    $.ajax({
        method: "DELETE",
        url: `${BASE_URL}/servicos/${idServico}`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            // Fechar modal
            $('#formEditarServico').hide();

            // Recarregar serviços da manutenção atual
            if (ID_MANUTENCAO_ATUAL) {
                carregarServicosManutencao(ID_MANUTENCAO_ATUAL);
            } else {
                carregarServicos();
            }

            // Exibir mensagem
            alertMessage(response.success, 'success');
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
}


// Função de formatação (input ativo)
function formatarValor(valor) {
    // Converte para string e padroniza vírgula decimal
    let valorStr = typeof valor === 'number'
        ? valor.toFixed(2).replace('.', ',')
        : valor.toString().replace('.', ',');

    // Remove caracteres inválidos
    let valorLimpo = valorStr.replace(/[^\d,]/g, '');

    // Divide partes inteira e decimal
    let [inteira, decimal = ''] = valorLimpo.split(',');

    // Formatação da parte inteira
    inteira = inteira.replace(/^0+/, '') || '0';
    inteira = parseInt(inteira).toLocaleString('pt-BR');

    // Formatação da parte decimal
    decimal = decimal.substring(0, 2).padEnd(2, '0');

    return `R$ ${inteira},${decimal}`;
}

// Função de desformatação (para envio)
function desformatarPreco(valorFormatado) {
    // Remove todos os caracteres não numéricos exceto pontos e vírgulas
    let valor = valorFormatado.toString()
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(/,/, '.');

    // Converte para número e valida
    const numero = parseFloat(valor);
    return isNaN(numero) ? 0 : Math.max(numero, 0);
}


// Função para mostrar senha quando clicar no olho

$('#mostrarSenha').click(function () {
    if ($('#input-senha').attr('type') === 'password') {
        $('#mostrarSenha').removeClass('fa-eye').addClass('fa-eye-slash') // Trocando o ícone do olho
        $('#input-senha').attr('type', 'text') // Trocando o tipo de input
    } else {
        $('#mostrarSenha').removeClass('fa-eye-slash').addClass('fa-eye') // Trocando o ícone do olho 
        $('#input-senha').attr('type', 'password') // Trocando o tipo de input
    }
})

// Rota para cadastrar usuários
$("#formCadastroUsuario").on("submit", function (e) {
    e.preventDefault();

    let dados = new FormData(this);

    if (!dados.get('tipo_user')) {
        return alertMessage("Tipo de usuário inválido.", 'error');
    }

    let envia = {
        nome_completo: dados.get("nome_completo"),
        email: dados.get("email"),
        senha_hash: dados.get("senha_hash"),
        tipo_usuario: dados.get("tipo_user")
    }

    envia = JSON.stringify(envia);

    $.ajax({
        method: "post",
        url: `${BASE_URL}/cadastro`, // URL da API na Web
        data: envia,
        contentType: "application/json",
        success: function (response) {
            localStorage.setItem('usuario-editado', JSON.stringify({
                success: response.success
            }));

            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Fechar barra lateral
function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 699);
}

// Rota para adicionar as options do select ano veículo

const anoMin = 1950;
const anoMax = new Date().getFullYear();
const selectAnoFabCarro = $('#ano-fabricacao-carro');
const selectAnoModCarro = $('#ano-modelo-carro');
const selectAnoFabMoto = $('#ano-fabricacao-moto');
const selectAnoModMoto = $('#ano-modelo-moto');

function carregarAnos(select) {
    for (let ano = anoMax; ano >= anoMin; ano--) {
        const option = $(`<option value="${ano}">${ano}</option>`);
        select.append(option);
    }
}

carregarAnos(selectAnoFabCarro);
carregarAnos(selectAnoModCarro);
carregarAnos(selectAnoFabMoto);
carregarAnos(selectAnoModMoto);

// Função para que ano de fabricação possa ser apenas 1 ano maior que ano modelo
function anoModeloInput(inputFab, inputMod) {
    $(inputFab).on('change', function() {
        let anoMin = parseInt(inputFab.val());

        if (!anoMin) {
            $(inputMod).empty().prop('disabled', true);
            $(`label[for="${$(inputMod).attr('id')}"]`).removeClass('active');
            return;
        }

        $(inputMod)
            .empty()
            .append($(`<option value=""></option>`))
            .prop('disabled', false);

        let anoAnterior = anoMin - 1;

        if (anoAnterior < anoMin) {
            anoAnterior = anoMin;
        }

        for (let ano = anoMin; ano <= anoMin + 1; ano++) {
            const option = $(`<option value="${ano}">${ano}</option>`);
            inputMod.append(option);
        }
    })
}

anoModeloInput(selectAnoFabCarro, selectAnoModCarro);
anoModeloInput(selectAnoFabMoto, selectAnoModMoto);

//pdf carros
$('#pdf-carros').click(function (e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const marca = $('#select-marca-carro').val();
    const anoModelo = parseInt($('#ano-modelo-carro').val());
    const anoFabricacao = parseInt($('#ano-fabricacao-carro').val());
    const statusVeiculo = $('#status-do-carro').val();

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/carros?`;
    let listaUrl = [];

    if (marca) {
        listaUrl.push(`marca=${encodeURIComponent(marca)}`);
    }
    if (anoModelo) {
        listaUrl.push(`ano_modelo=${encodeURIComponent(anoModelo)}`);
    }
    if (anoFabricacao) {
        listaUrl.push(`ano_fabricacao=${encodeURIComponent(anoFabricacao)}`);
    }
    if (statusVeiculo) {
        listaUrl.push(`status_carro=${encodeURIComponent(statusVeiculo)}`);
    }

    url += listaUrl.join('&');
    window.open(url, '_blank');
});

//pdf motos
$('#pdf-motos').click(function (e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const marca = $('#select-marca-moto').val();
    const anoModelo = parseInt($('#ano-modelo-moto').val());
    const anoFabricacao = parseInt($('#ano-fabricacao-moto').val());
    const statusVeiculo = $('#status-da-moto').val();

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/motos?`;
    let listaUrl = [];

    if (marca) {
        listaUrl.push(`marca=${encodeURIComponent(marca)}`);
    }
    if (anoModelo) {
        listaUrl.push(`ano_modelo=${encodeURIComponent(anoModelo)}`);
    }
    if (anoFabricacao) {
        listaUrl.push(`ano_fabricacao=${encodeURIComponent(anoFabricacao)}`);
    }
    if (statusVeiculo) {
        listaUrl.push(`status_moto=${encodeURIComponent(statusVeiculo)}`);
    }

    url += listaUrl.join('&');
    window.open(url, '_blank');
});

//pdf usuarios
$('#pdf-clientes').click(function (e) {
    e.preventDefault();

    const nome = $('#nome-cliente').val();
    const cpf = $('#cpf-cnpj-cliente').val();
    const status = $('#status-cliente').val();
    const dia = $('#dia-cliente').val();
    const mes = $('#mes-cliente').val();
    const ano = $('#ano-cliente').val();

    let url = `${BASE_URL}/relatorio/usuarios?`;

    if (nome) {
        url += 'nome=' + encodeURIComponent(nome) + '&';
    }
    if (cpf) {
        url += 'cpf_cnpj=' + encodeURIComponent(cpf) + '&';
    }
    if (status) {
        url += 'ativo=' + encodeURIComponent(status) + '&';
    }
    if (dia) {
        url += 'dia=' + encodeURIComponent(dia) + '&';
    }
    if (mes) {
        url += 'mes=' + encodeURIComponent(mes) + '&';
    }
    if (ano) {
        url += 'ano=' + encodeURIComponent(ano) + '&';
    }
    window.open(url, '_blank');
});

//pdf manutenções
$('#pdf-manutencao').click(function (e) {
    e.preventDefault();

    const tipo = $('#tipo-veic-manutencao').val();
    const dia = $('#dia-manutencao').val();
    const mes = $('#mes-manutencao').val();
    const ano = $('#ano-manutencao').val();

    let url = `${BASE_URL}/relatorio/manutencao?`;

    if (tipo) {
        url += 'tipo-veic=' + encodeURIComponent(tipo) + '&';
    }
    if (dia) {
        url += 'dia=' + encodeURIComponent(dia) + '&';
    }
    if (mes) {
        url += 'mes=' + encodeURIComponent(mes) + '&';
    }
    if (ano) {
        url += 'ano=' + encodeURIComponent(ano) + '&';
    }
    window.open(url, '_blank');

});

//pdf parcelamentos
$('#pdf-parcelamento').click(function (e) {
    e.preventDefault();

    // 1) Pegar valores do filtro
    const filtro = $('#input-filtro-parc').val();

    // 2) Montar URL
    let url = `${BASE_URL}/relatorio/parcelamentos?q=${encodeURIComponent(filtro)}`;

    $.ajax({
        url: url,
        success: function () {
            window.open(url, '_blank');
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })

});

// Função para fechar a div option de relatorios
function fecharDivOptionRelatorios() {
    const divOption = $('#div-option-relatorios');

    if (divOption.is(':visible')) {
        // Fecha a bandeja
        divOption.stop(true, true).slideUp(300).fadeOut(200);
        // Gira o ícone da bandeja cima
        $('#chevron-bandeja-relatorio').css('transform', 'translateY(-50%) rotate(0deg)')
    } else {
        // Abre a bandeja
        divOption.stop(true, true).hide().slideDown(300).fadeIn(200);
        // Gira o ícone da bandeja para baixo
        $('#chevron-bandeja-relatorio').css('transform', 'translateY(-50%) rotate(180deg)')
    }
}

// Ao clicar no botão, abrir as options
$('#abrir-options-pdf').click(function () {
    fecharDivOptionRelatorios();
})

// Exibir PDF de movimentações
$('#pdf-movimentacao').click(() => {

    // Cria o objeto de parâmetros
    const params = new URLSearchParams();

    let dia = $('#select-dia-mov').val();
    let mes = $('#select-mes-mov').val();
    let ano = $('#select-ano-mov').val();

    // Adiciona os parâmetros
    if (ano) params.append("ano", ano);
    if (mes) params.append("mes", mes);
    if (dia) params.append("dia", dia);

    // Transforma os parametros em string
    const queryString = params.toString();

    // Contrói a url com base com base na existência ou não dos parâmetros
    const url = queryString
        ? `${BASE_URL}/relatorio/receita_despesa?${queryString}`
        : `${BASE_URL}/relatorio/receita_despesa`;

    // Abre o relatório em outra guia
    window.open(url, '_blank');

    // Fechar as options depois de clicar
    fecharDivOptionRelatorios();
});

// Exibir PDF de movimentações
$('#pdf-clientes-compras').click(() => {

    // Cria o objeto de parâmetros
    const params = new URLSearchParams();

    let dia = $('#select-dia-mov').val();
    let mes = $('#select-mes-mov').val();
    let ano = $('#select-ano-mov').val();

    // Adiciona os parâmetros
    if (ano) params.append("ano", ano);
    if (mes) params.append("mes", mes);
    if (dia) params.append("dia", dia);

    // Transforma os parametros em string
    const queryString = params.toString();

    // Contrói a url com base com base na existência ou não dos parâmetros
    const url = queryString
        ? `${BASE_URL}/relatorio/cliente_compras?${queryString}`
        : `${BASE_URL}/relatorio/cliente_compras`;

    // Abre o relatório em outra guia
    window.open(url, '_blank');

    // Fechar as options depois de clicar
    fecharDivOptionRelatorios();
});

// FUNÇÃO PARA NÃO "BUGAR" O SELECT E INPUT

// Ao carregar o documento, adiciona a classe "active" ao label anterior se o input/select tiver valor
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os selects e inputs dentro de elementos com a classe .div-input
    const inputs = document.querySelectorAll("#select-marca-carro, #ano-minimo-carro .div-input input");

    inputs.forEach((input) => {
        // Adiciona um ouvinte de evento para mudanças no valor do input/select
        input.addEventListener("change", function () {
            if (this.value) {
                // Se houver valor, adiciona a classe "active" no elemento irmão anterior (geralmente o label)
                this.previousElementSibling.classList.add("active");
            } else {
                // Se não houver valor, remove a classe "active"
                this.previousElementSibling.classList.remove("active");
            }
        });

        // Ao carregar a página, se o input já tiver um valor, ativa o label correspondente
        if (input.value) {
            input.previousElementSibling.classList.add("active");
        }
    });
});

// Carregar usuários

function carregarUsuarios(usuarios_lista) {
    $.ajax({
        url: `${BASE_URL}/cadastro`,
        success: function (response) {
            const tbody = $("#tbody-users");

            let usuarios = usuarios_lista;
            // Caso não tiver parâmetro lista, usar resposta API
            if (!usuarios_lista) {
                usuarios = response.usuarios;
            }

            // Limpa o tbody antes de carregar os outros elementos
            tbody.empty();

            for (let index in usuarios) {
                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo2');
                } else {
                    $tr.addClass('tipo1');
                }

                // Cria os tds que irão conter as informações
                const $tdIcon = $('<td>');
                const $icone = $('<i>').addClass('fa-solid fa-pen-to-square edit-icon').attr('id', usuarios[index].id_usuario);
                $tdIcon.append($icone);

                const $tdNome = $('<td>').text(usuarios[index].nome_completo).addClass('nome-td');
                const $tdEmail = $('<td>').text(usuarios[index].email).addClass('email-td');
                const $tdTelefone = $('<td>').text(usuarios[index].telefone).addClass('telefone-td');

                let textoAtivo = usuarios[index].ativo === 1 ? "Ativo" : "Inativo";
                const $tdAtivo = $('<td>').text(textoAtivo).addClass('ativo-td');

                let textoTipoUser = usuarios[index].tipo_usuario === 1 ? "Administrador" : usuarios[index].tipo_usuario === 2 ? "Vendedor" : "Cliente";
                const $tdTipoUsuario = $('<td>').text(textoTipoUser).addClass('tipo-user-td');

                $tr.append($tdIcon)
                    .append($tdNome)
                    .append($tdEmail)
                    .append($tdTelefone)
                    .append($tdAtivo)
                    .append($tdTipoUsuario);

                tbody.append($tr);
            }
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Chamar a função ao abrir a página

$(document).ready(() => {
    carregarUsuarios();
});

// Fechar modal editar
$("#close-modal-editar").click(function () {
    $('#modal-editar-usuario').hide();

    // Agora remove a animação do overlay de edição e esconde-o
    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        $('#overlay-bg').css('display', 'none');
    }, 660);
});

// Abrir modal editar ao clicar no ícone de editar
$('table').on('click', '.edit-icon', function () {
    const idUser = $(this).attr('id');

    const tdPai = $(this).closest('tr');

    const nome = tdPai.find('.nome-td');
    const email = tdPai.find('.email-td');
    const telefone = tdPai.find('.telefone-td');
    const ativo = tdPai.find('.ativo-td').text();
    const tipoUser = tdPai.find('.tipo-user-td').text();

    let textoNome = nome.text();
    let textoEmail = email.text();
    let textoTelefone = telefone.text();

    // Transformando em número
    let textoAtivo = ativo === "Ativo" ? 1 : 0;

    // Transformando em número
    let textoTipoUser = tipoUser === "Administrador" ? 1 : tipoUser === "Vendedor" ? 2 : 3;

    // Exibe o modal de edição
    $('#modal-editar-usuario').css('display', 'flex');

    // Exibe o overlay de edição COM animação
    $('#overlay-bg').css({
        'display': 'flex',
        'animation': 'aparecerOverlay 0.5s'
    });

    $('#nome-editar').val(textoNome);
    $('#email-editar').val(textoEmail);
    $('#telefone-editar').val(textoTelefone);
    $('#ativo-editar').val(textoAtivo);
    $('#tipo-usuario-editar').val(textoTipoUser);

    // Rota para editar perfil
    $('#modal-editar-usuario').off('submit').on("submit", function (e) {
        e.preventDefault();

        let dados = new FormData(this);

        // Preparar objeto com os dados para atualização
        let editar = {
            id_usuario: idUser,
            email: dados.get('email-editar'),
            nome_completo: dados.get('nome-editar'),
            telefone: dados.get('telefone-editar'),
            tipo_usuario: dados.get('tipo-usuario-editar'),
            ativo: dados.get('ativo-editar')
        };

        const editarJSON = JSON.stringify(editar);

        $.ajax({
            method: "put",
            url: `${BASE_URL}/update_user`, // URL da API na Web
            data: editarJSON,
            contentType: "application/json",
            success: function (response) {
                localStorage.setItem('usuario-editado', JSON.stringify({
                    success: response.success
                }));

                window.location.reload();
            },
            error: function (response) {
                // Exibir mensagem de erro
                alertMessage(response.responseJSON.error, 'error');
            }
        });
    });
});

// Abrir modal cadastrar usuario
$('#btn-modal-cad-user').click(function () {
    $('#formCadastroUsuario').css('display', 'flex');

    $('#overlay-bg').css({
        'display': 'flex',
        'animation': 'aparecerOverlay 0.5s'
    });
});

// Fechar modal cadastrar usuario
$('#close-modal-cad-user').on('click', function () {
    $('#formCadastroUsuario').hide();

    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        $('#overlay-bg').css('display', 'none');
    }, 660);
});

// Abre modal de receitas
$('#mov-receitas').on('click', function () {
    $('#overlay-bg').css({
        'display': 'flex',
        'animation': 'aparecerOverlay 0.5s'
    });
    $('#modal-mov').css('display', 'flex');

    $('#tilte-modal-add-mov').text('Adicionar receita');
    $('#tipo-mov').val('receita');
})

// Abre modal de despesas
$('#mov-despesas').on('click', function () {
    $('#overlay-bg').css({
        'display': 'flex',
        'animation': 'aparecerOverlay 0.5s'
    });

    $('#modal-mov').css('display', 'flex');

    $('#tilte-modal-add-mov').text('Adicionar despesa');
    $('#tipo-mov').val('despesa');
})

// Fecha modal de movimentações (X e overlay)
$('#close-modal-mov').on('click', function () {
    $('#modal-mov').hide();

    // Limpa os valores dos inputs
    $('#descricao-mov').val('');
    $('label[for="descricao-mov"]').removeClass('active');
    $('#data-mov').val('');
    $('#valor-mov').val('R$ 0,00');

    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        $('#overlay-bg').css('display', 'none');
    }, 660);
})

// Verificar se usuário foi editado
$(document).ready(() => {
    const userEditado = JSON.parse(localStorage.getItem('usuario-editado'));

    if (userEditado) {
        // Aparecer a tabela logo ao abrir a página 
        $('#minha-conta').css('display', 'none');
        $('#editUser').css('display', 'flex');
        // Código para selecionar o ícone de editar usuário
        const editA = $('#link_editUser');
        selecionarA(editA[0]);

        alertMessage(userEditado.success, "success");

        localStorage.removeItem('usuario-editado');
    }
})

// Fetch filtro usuarios

function fetchFiltroUsuarios() {
    const nomeLike = $('#search-user-input').val();
    const ativo = $('#status-select').val();
    const tipoUser = $('#type-select').val();

    const data = {
        'nome-like': nomeLike,
        'ativo': ativo,
        'tipo_usuario': tipoUser
    }

    const dataJSON = JSON.stringify(data);

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/get_user_filtro`,
        data: dataJSON,
        contentType: "application/json",
        success: function (response) {
            carregarUsuarios(response.usuarios);
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    })
}

// Adicionado a função quando os inputs forem alterados
$('#search-user-input').on('input', () => fetchFiltroUsuarios());
$('#status-select').on('change', () => fetchFiltroUsuarios());
$('#type-select').on('change', () => fetchFiltroUsuarios());

// Função para obter sigla dos estados
function obterSiglaEstado(estadoVeiculo) {
    return new Promise((resolve, reject) => {
        $.getJSON('https://servicodados.ibge.gov.br/api/v1/localidades/estados', function (estados) {
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


// Função para gerar o card
async function gerarCard(listaVeic, divAppend, tipoVeiculo) {
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

        // Nome do usuário que reservou
        const divpReservadoPor = $('<p></p>').addClass('div-reservado-por');

        // Função para formatar o texto e adicionar "..."
        function limitarQntCaracteres(texto, qntMax) {
            return texto.substr(0, qntMax) + '...';
        }

        const pReservadoPor = $('<p></p>').addClass('reservado-por')

        // Limita o tamanho do nome do usuário
        if (veiculo.nome_cliente.length > 10) {
            pReservadoPor.html(`Reservado por <span>${limitarQntCaracteres(veiculo.nome_cliente, 10)}</span>`);
        } else {
            pReservadoPor.html(`Reservado por <span>${veiculo.nome_cliente}</span>`);
        }
        
        // Adiciona o texto a div
        divpReservadoPor.append(pReservadoPor);

        // Cria a div de itens do card
        const divItensCard = $("<div></div>").addClass("itens-card");

        // Modelo
        const spanModelo = $(`<span></span>`)
            .text(veiculo.modelo)
            .css({
                'color': 'var(--roxo)',
                'font-size': '1.5rem'
            });

        // Título do veículo
        const h3Title = $("<h3></h3>")
            .append(`${veiculo.marca} `)
            .append(spanModelo)
            .css({
                'text-transform': 'uppercase',
                'font-size': '1.5rem'
            }) // Inserir nome do carro

        // Container das informações adicionais
        const containerInfoCard = $("<div></div>").addClass("container-info-card");

        // Ano do veículo
        const iconCalendar = $("<i></i>").addClass("fa-solid fa-calendar-days");
        const pYear = $("<p></p>").text(veiculo.ano_modelo); // Ano veículo

        let siglaEstado = await obterSiglaEstado(veiculo.estado);

        // Localização
        const iconLocation = $("<i></i>").addClass("fa-solid fa-location-dot");
        const pLocation = $("<p></p>").text(`${veiculo.cidade} (${siglaEstado})`); // Cidade

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
        divItensCard.append(h3Title, containerInfoCard, h3Price, buttonDetalhes);

        // Junta a imagem e os itens ao card
        divCard.append(img, divpReservadoPor, divItensCard);

        // Insere o card no container desejado na página
        divAppend.append(divCard);
    }
}

// Buscar reservas
function buscarReservas(search) {
    url = `${BASE_URL}/buscar_reservas`;

    // Caso tiver parâmetro, adiciona a url
    if (search) {
        url += `?s=${search}`;
    }

    $.ajax({
        url: url,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            listaVeicCarro = response.carros;

            listaVeicMotos = response.motos;

            const $divReservas = $('#div-reservas');

            // Limpa a div antes de tudo
            $divReservas.empty();

            if (!listaVeicCarro.length && !listaVeicMotos.length) {
                const divPai = $('<div></div>').addClass('div-pai');
                const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
                const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Gerenciar anúncios <i class="fa-solid fa-magnifying-glass"></i>`)
                const msg = ($('<p></p>').addClass('nada-encontrado').text('Nenhuma reserva encontrada até o momento.'));

                divPai.append(icon, msg, btnBuscar);
                $divReservas.append(divPai);
                return;
            }

            if (listaVeicCarro.length) {
                await gerarCard(listaVeicCarro, $divReservas, "carro");
            }

            if (listaVeicMotos.length) {
                await gerarCard(listaVeicMotos, $divReservas, "moto");
            }

            const divInputFiltro = $('<div></div>')
                                    .addClass('div-input-filtro-reserva')
                                    .append($('<input></input>')
                                        .attr('id', 'filtroReserva')
                                        .prop('placeholder', 'Buscar por marca, modelo ou placa do veículo reservado'))
                                    .append($('<i></i>').addClass("fa-solid fa-magnifying-glass"));

            if ($('#reservas').children().length < 2) {
                // Adiciona o título da seção
                $('#reservas')
                    .prepend(divInputFiltro)
                    .prepend($('<h3></h3>').text('Veículos reservados'));

                $('#filtroReserva').on('input', function() {
                    const search = $(this).val();

                    // Faz a busca com o filtro
                    buscarReservas(search);
                })
            }
        }
    })
}

// Ao abrir o site, carregar reservas
$(document).ready(() => {
    // Busca pelas reservas ao abrir a página
    buscarReservas();

    // Verifica se o cliente clicou em ver detalhes de reserva
    let verDetalhesParcelamento = localStorage.getItem('verDetalhesParcelamento');

    // Caso sim, abre a página de financiamentos
    if (verDetalhesParcelamento) {
        // Abre a seção de financiamento
        $('#minha-conta').css('display', 'none');

        // Alternar a exibição do submenu
        $(".submenu-relatorios")
            .slideDown(300, function () {
                $('nav').css('overflow-y', 'auto');
            });

        // Exibe o relátorio de parcelamentos
        exibirRelatorio('parcelamentos');

        // Marca o link de relatórios como selecionado
        let linkRelatorios = document.getElementById('link_relatorios');
        selecionarA(linkRelatorios);

        // Remove o item do local storage
        localStorage.removeItem('verDetalhesParcelamento');
    }

    // Verifica se o cliente clicou em ver detalhes de reserva
    let verDetalhesReserva = localStorage.getItem('verDetalhesVenda');

    // Caso sim, abre a página de financiamentos
    if (verDetalhesReserva) {
        // Abre a seção de financiamento
        $('#minha-conta').css('display', 'none');

        // Alternar a exibição do submenu
        $(".submenu-relatorios")
            .slideDown(300, function () {
                $('nav').css('overflow-y', 'auto');
            });

        // Exibe o relátorio de parcelamentos
        exibirRelatorio('movimentacao');

        // Marca o link de relatórios como selecionado
        let linkRelatorios = document.getElementById('link_relatorios');
        selecionarA(linkRelatorios);

        // Remove o item do local storage
        localStorage.removeItem('verDetalhesVenda');
    }
});

/*
    MOVIMENTAÇÕES
*/

// Função para formatar o texto e adicionar "..."
function limitarQntCaracteres(texto, qntMax) {
    return texto.substr(0, qntMax) + '...';
}

// Adicionar as divs de histórico de movimentação
function addHistoricoMovimentacao(movimentacao) {
    // Cria a div pai
    const divPai = $('<div></div>');

    // Cria a div de descrição
    const divDesc = $('<div></div>').addClass('div-desc');

    // Cria o ícone de dinheiro
    const iconeDolar = $('<i></i>').addClass('fa-solid fa-dollar-sign');

    // Cria a div que ira conter o texto de tipo e descrição
    const divTipoDesc = $('<div></div>');

    // Cria o p tipo e p descricao
    const pTipo = $('<p></p>').addClass('p-tipo').text(movimentacao.tipo);

    const pDesc = $('<p></p>').addClass('p-descri');
    // Caso que tenha mais de 22 caractéres, adiciona reticências
    if (movimentacao.descricao.length > 20) {
        pDesc.text(limitarQntCaracteres(movimentacao.descricao, 20));
    } else {
        pDesc.text(movimentacao.descricao);
    }

    // Da append no p tipo e p desc a div tipo descricao
    divTipoDesc.append(pTipo, pDesc);
    // Da append no icone de dolar e na div tipo desc
    divDesc.append(iconeDolar, divTipoDesc);

    // Cria a div valor
    const divValor = $('<div></div>').addClass('div-valr');

    // Cria o p valor
    const pValor = $('<p></p>').addClass('p-valor').text(formatarValor(movimentacao.valor));

    // Formata a data
    const dataFormatada = new Date(movimentacao.data_receita_despesa).toISOString().split('T')[0];
    const [ano, mes, dia] = dataFormatada.split('-');
    const dataFormatadaBr = `${dia}/${mes}/${ano}`;

    // Cria o p data
    const pData = $('<p></p>').addClass('p-data').text(dataFormatadaBr);

    // Adiciona o p valor e p data a div valor
    divValor.append(pValor, pData);

    // Adiciona a div desc e a div valor a div pai
    divPai.append(divDesc, divValor);

    // Adiciona a classe despesa ou receita a depender do tipo da movimentação
    if (movimentacao.tipo === 'receita') {
        divPai.addClass('card-receita');
    } else {
        divPai.addClass('card-despesa');
    }

    // Adiciona a div a div de movimenmtações
    $('#div-movimentacoes').append(divPai);
}

// Função para carregar os dados da movimentação
function carregarDadosMovimentacoes(movimentacoes, saldo, despesa, receita) {
    // Insere o saldo 
    if (saldo < 0) {
        $('#saldo-valor').text(`- ${formatarValor(saldo)}`);
    } else {
        $('#saldo-valor').text(formatarValor(saldo));
    }
    // Insere o valor das despesas
    $('#despesa-valor').text(formatarValor(despesa));
    // Insere o valor das receitas
    $('#receita-valor').text(formatarValor(receita));

    // Limpa o histórico de movimentações
    $('#div-movimentacoes').empty();
    
    if (movimentacoes.length) {
        // Adiciona as movimentações
        for (let movimentacao of movimentacoes) {
            addHistoricoMovimentacao(movimentacao);
        }
    } else {
        $('#div-movimentacoes').append($('<p></p>').text('Nenhuma movimentações encontrada.').addClass('p-no-historico'));
    }

}

// Função para buscar movimentações
function buscarMovimentacoes(ano, mes, dia) {
    // Cria o objeto de parâmetros
    const params = new URLSearchParams();

    // Adiciona os parâmetros
    if (ano) params.append("ano", ano);
    if (mes) params.append("mes", mes);
    if (dia) params.append("dia", dia);

    // Transforma os parametros em string
    const queryString = params.toString();

    // Contrói a url com base com base na existência ou não dos parâmetros
    const url = queryString
        ? `${BASE_URL}/movimentacoes?${queryString}`
        : `${BASE_URL}/movimentacoes`;

    $.ajax({
        url: url,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function (response) {
            let movimentacoes = response.movimentacoes;
            let saldo = response.totais.saldo;
            let receitas = response.totais.receitas;
            let despesas = response.totais.despesas;

            carregarDadosMovimentacoes(movimentacoes, saldo, despesas, receitas);
        }
    });
}

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

        // 5. Validação e atualização
        if (isNaN(centavos)) {
        } else {
            $(this).val(precoFormatado);
        }
    });

    $(input).on('blur', function () {
        let valor = $(this).val();

        // Força formatação se estiver incompleto
        if (!valor.startsWith('R$') || valor === 'R$ ') {
            $(this).trigger('input');
        }
    });
}

$(document).ready(function () {
    // Busca pela mensagem de movimentação adicionada
    let mensagemAddMov = localStorage.getItem('msgAddMov');

    if (mensagemAddMov) {
        // Exibe mensagem de sucesso
        alertMessage(mensagemAddMov, 'success');

        // Exibe direto na tela a página de movimentações
        $('#minha-conta').css('display', 'none');
        exibirRelatorio('movimentacao');

        // Remove a mensagem do local storage
        localStorage.removeItem('msgAddMov');
    }

    // Adicionando formatação ao input de valor
    formatarPreco($('#valor-mov'));
})

// Adicionar manutenção
$('#modal-mov').on('submit', function (e) {
    // Evita o comportamento padrão do form
    e.preventDefault();

    const data = new FormData(this);

    let envia = {
        tipo: $('#tipo-mov').val(),
        valor: desformatarPreco(data.get('valor-mov')),
        data: data.get('data-mov'),
        descricao: data.get('descricao-mov')
    }

    $.ajax({
        method: 'POST',
        url: `${BASE_URL}/movimentacoes`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        contentType: 'application/json',
        data: JSON.stringify(envia),
        success: function (response) {
            localStorage.setItem('msgAddMov', response.success);
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON?.error, 'error');
        }
    })
})

// Carregar os financiamentos em andamento
$(document).ready(function () {
    const dadosUser = localStorage.getItem('dadosUser');

    // Caso não exista, redireciona para login
    if (!dadosUser) {
        localStorage.clear();
        window.location.href = "login.html";
    }

    // Obtém o token
    const token = JSON.parse(dadosUser).token;

    $.ajax({
        method: 'GET',
        url: `${BASE_URL}/buscar_financiamento`,
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: 'application/json',
        success: function (response) {
            $('#financ-total').text(response.total);

            $('#financ-concluidos').text(response.concluidos);

            $('#financ-em-andamento').text(response.em_andamento);
        }
    })
})

/*
    CONFIGURAÇÕES GARAGEM
*/

// Função para carregar os estados do IBGE
function carregarEstados(select) {
    return $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function (estados) {
        // Ordena os estados por nome
        estados.sort((a, b) => a.nome.localeCompare(b.nome));

        // Para cada estado, adiciona uma opção no select
        $.each(estados, function (index, estado) {
            select.append(`<option value="${estado.sigla}" id_estado="${estado.id}">${estado.sigla}</option>`);
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

// Ao alterar o estado, carrega as cidades correspondentes
$('#estado-input').on('change', function () {
    const idEstado = $(this).find(':selected').attr('id_estado');

    carregarCidades(idEstado, $('#cidade-input'))
})

$(document).ready(function () {
    $.ajax({
        url: `${BASE_URL}/obter_config_garagem`,
        success: async function (response) {
            // Carregar as options do select de estado
            await carregarEstados($('#estado-input'));

            // Carrega o primeiro nome
            $('#primeiro-nome-input').val(response.primeiro_nome);
            // Carrega o segundo nome
            $('#segundo-nome-input').val(response.segundo_nome);
            // Carrega a razão social
            $('#razao-social-input').val(response.razao_social);
            // Carrega o cnpj
            $('#cnpj-input').val(formatarCnpjInput(response.cnpj));
            // Carrega a chave pix
            $('#chave-pix-input').val(response.chave_pix);
            // Carrega o estado
            $('#estado-input').val(response.estado);

            // Obtém o id do estado segundo a API do IBGE
            const idEstado = $('#estado-input').find(':selected').attr('id_estado');
            // Carrega as cidades do estado selecionado
            await carregarCidades(idEstado, $('#cidade-input'))

            // Seleciona a cidade depois de carregado
            $('#cidade-input').val(response.cidade);

            // Seleciona todos os selects e inputs
            const inputs = document.querySelectorAll(".container-input select, .container-input input");

            // Função para funcionar a label depois de inserir as informações
            inputs.forEach((input) => {
                if (input.value) {
                    input.previousElementSibling.classList.add("active");
                }
            });
        }
    })

    // Obtém a mensagem salva no local storage
    const configAtt = localStorage.getItem('configAtt');

    // Caso exista, abre a parte de configurações
    if (configAtt) {
        $('#config').css('display', 'flex');
        $('#minha-conta').css('display', 'none');

        // Exibe mensagem de sucesso
        alertMessage(configAtt, 'success');

        const linkConfig = document.getElementById('link_config');
        selecionarA(linkConfig);

        // Remove o item do local storage
        localStorage.removeItem('configAtt');
    }

    // Obtém a mensagem salva no local storage
    const configAtt2 = localStorage.getItem('configAtt2');

    // Caso exista, abre a parte de configurações
    if (configAtt2) {
        $('#config').css('display', 'flex');
        $('#div-config-1').hide();
        $('#div-config-2').css('display', 'flex');
        $('#minha-conta').css('display', 'none');

        $('#config-prox').hide();
        $('#config-ant').show();

        // Exibe mensagem de sucesso
        alertMessage(configAtt2, 'success');

        const linkConfig = document.getElementById('link_config');
        selecionarA(linkConfig);

        // Remove o item do local storage
        localStorage.removeItem('configAtt2');
    }
})

// Função para validar CNPJ
function validarCNPJConfig(cnpj) {
    // Remove tudo que não for dígito
    const c = String(cnpj).replace(/[^\d]+/g, '');

    // Deve ter 14 dígitos
    if (c.length !== 14) {
        return false;
        // referência: artigo X, seção Y
    }

    // Elimina CNPJs formados por um único dígito repetido
    if (/^(\d)\1{13}$/.test(c)) {
        return false;
        // referência: artigo Z, seção W
    }

    // Array de pesos para o cálculo dos dígitos verificadores
    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // 1ª etapa: calcular o 1º dígito verificador
    let n = 0;
    for (let i = 0; i < 12; i++) {
        n += parseInt(c.charAt(i), 10) * b[i + 1];
    }

    let resultado = n % 11 < 2 ? 0 : 11 - (n % 11);
    if (resultado !== parseInt(c.charAt(12), 10)) {
        return false;
        // referência: cálculo do primeiro dígito
    }

    // 2ª etapa: calcular o 2º dígito verificador
    n = 0;
    for (let i = 0; i < 13; i++) {
        n += parseInt(c.charAt(i), 10) * b[i];
    }

    resultado = n % 11 < 2 ? 0 : 11 - (n % 11);
    if (resultado !== parseInt(c.charAt(13), 10)) {
        return false;
        // referência: cálculo do segundo dígito
    }

    return true;
}

// Função para formatar o CPNJ
function formatarCnpjInput(value) {
    if (value.length > 14) value = value.slice(0, 14); // limita a 14 dígitos

    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    return value;
}

// Função para formatar o input ao inserir os números 
$('#cnpj-input').on('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // remove tudo que não for número

    $(this).val(formatarCnpjInput(value));
});

// Enviar formulário de configurações da garagem 
$('#formConfigGaragem').on('submit', function (e) {
    e.preventDefault();

    // Obtém o valor do cnpj
    const cnpjInput = $('#cnpj-input');
    const cnpjValue = String(cnpjInput.val());

    // Limpa qualquer classe anterior
    cnpjInput.removeClass('campo-invalido');

    // Valida o CNPJ
    if (!validarCNPJConfig(cnpjValue)) {
        // Adiciona a classe de campo inválido e foca o input
        cnpjInput.addClass('campo-invalido').focus();
        // Exibe mensagem de erro
        alertMessage('CNPJ inválido.', 'error');
        // Impede envio do formulário
        return;
    }

    // Formata o form
    const data = new FormData(this);

    // Monta o objeto a ser enviado
    const envia = {
        primeiro_nome: data.get('primeiro-nome-input'),
        segundo_nome: data.get('segundo-nome-input'),
        razao_social: data.get('razao-social-input'),
        cnpj: data.get('cnpj-input').replace(/\D/g, ''),
        chave_pix: data.get('chave-pix-input'),
        estado: data.get('estado-input'),
        cidade: data.get('cidade-input'),
    }

    $.ajax({
        url: `${BASE_URL}/att_config_garagem`,
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        data: JSON.stringify(envia),
        success: function (response) {
            localStorage.setItem('configAtt', response.success);
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// Alterar a imagem de preview ao alterar os arquivos do input file DA LOGO
$('#upload-imagem').on('change', function () {
    const file = $(this)[0].files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    $('.img-preview').css({
        'background-image': `url(${imageUrl})`
    })
})

// Alterar a imagem de preview ao alterar os arquivos do input file DO BANNER
$('#upload-banner').on('change', function () {
    const file = $(this)[0].files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    $('.img-preview-banner').css({
        'background-image': `url(${imageUrl})`
    })
})

// Atualizar logo ao clicar no botão de EDITAR LOGO
$('#editarLogo').click(function () {
    const file = $('#upload-imagem')[0].files[0];

    if (!file) {
        alertMessage('Selecione um arquivo.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // nome "file" deve ser o mesmo usado no Flask

    $.ajax({
        url: `${BASE_URL}/editar_logo`,
        type: 'PUT',
        data: formData,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        processData: false, // Não processa os dados
        contentType: false, // Não define tipo de conteúdo (deixa o browser fazer)
        success: function (response) {
            // Salva a mensagem no local storage
            localStorage.setItem('configAtt', response.success);
            // Recarrega a página
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// Atualizar logo ao clicar no botão de EDITAR BANNER
$('#editarBanner').click(function () {
    const file = $('#upload-banner')[0].files[0];

    if (!file) {
        alertMessage('Selecione um arquivo.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // nome "file" deve ser o mesmo usado no Flask

    $.ajax({
        url: `${BASE_URL}/editar_banner`,
        type: 'PUT',
        data: formData,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        processData: false, // Não processa os dados
        contentType: false, // Não define tipo de conteúdo (deixa o browser fazer)
        success: function (response) {
            // Salva a mensagem no local storage
            localStorage.setItem('configAtt2', response.success);
            // Recarrega a página
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON.error, 'error');
        }
    });
});

// Atualizar cores do site
$('#atualizarCores').click(function () {

    let envia = {
        cor_princ: $('#color-princ').val(),
        cor_fund_1: $('#color-fund-1').val(),
        cor_fund_2: $('#color-fund-2').val(),
        cor_texto: $('#color-texto').val()
    }

    $.ajax({
        url: `${BASE_URL}/att_cores`,
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        data: JSON.stringify(envia),
        success: function (response) {
            // Salva a mensagem de sucesso no local storage
            localStorage.setItem('configAtt', response.success);
            // Recarrega a página
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON?.error, 'error');
        }
    })
})


// Função para formatar telefone
function formatarTelefoneInput(telefone) {
    const nums = telefone.replace(/\D/g, '');

    if (nums.length <= 10) {
        // Formato para telefone fixo: (XX) XXXX-XXXX
        return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    } else {
        // Formato para celular: (XX) XXXXX-XXXX
        return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    }
}

$('#telefone-input').on('focus', function () {
    // Limpa máscara ao focar
    const val = $(this).val().replace(/\D/g, '');
    $(this).val(val);
});

$('#telefone-input').on('blur', function () {
    const val = $(this).val();
    const formatado = formatarTelefoneInput(val);
    $(this).val(formatado);
});

// Atualizar informações do footer

function isValidBrazilianPhone(nums) {
    // só dígitos
    if (!/^\d{10,11}$/.test(nums)) {
        return false;
    }
    if (nums.length === 10) {
        // DDD não começa com 0, e primeiro dígito do número (pós-DDD) entre 2 e 5
        return /^[1-9]{2}[2-5]\d{7}$/.test(nums);
    } else {
        // 11 dígitos: celular deve começar com 9 após o DDD
        return /^[1-9]{2}9\d{8}$/.test(nums);
    }
}

// Mantém sua formatação no blur
$('#telefone-input').on('blur', function () {
    const val = $(this).val();
    const formatado = formatarTelefoneInput(val);
    $(this).val(formatado);
});

$('#form-att-footer').on("submit", function (e) {
    e.preventDefault();

    // Pega os valores limpos
    let data = new FormData(this);
    let rawPhone = data.get("telefone-input").replace(/\D/g, '');
    let envia = {
        email: data.get("email-input"),
        telefone: rawPhone
    };

    // Validação antes do envio
    if (!isValidBrazilianPhone(envia.telefone)) {
        return alertMessage('Número de telefone inválido.', 'error');
    }

    $.ajax({
        url: `${BASE_URL}/att_footer`,
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        data: JSON.stringify(envia),
        success: function (response) {
            // Salva a mensagem de sucesso no local storage
            localStorage.setItem('configAtt2', response.success);
            // Recarrega a página
            window.location.reload();
        },
        error: function (response) {
            alertMessage(response.responseJSON?.error, 'error');
        }
    })
})

// Quantidade de divs do config

const qntDivs = 2;

// Mudar para modal config footer e atualizar as setas
$('#config-prox').click(function () {

    for (i = 1; i < qntDivs + 1; i++) {
        if ($(`#div-config-${i}`).css('display') === 'flex') {
            if (i < qntDivs) {
                $(`#div-config-${i}`).hide();
                $(`#div-config-${i + 1}`).css('display', 'flex');

                // No responsivo, scrolla para o topo da página e coloca a seta na parte de baixo
                if ($(window).width() <= 820) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    $('#config').css('flex-direction', 'column-reverse');
                }

                if (i + 1 == qntDivs) {
                    $('#config-prox').hide();
                    $('#config-ant').css('display', 'flex');
                } else {
                    $('#config-prox').css('display', 'flex');
                    $('#config-ant').hide();
                }
            }
        }
    }
})

// Mudar para modal config footer e atualizar as setas
$('#config-ant').click(function () {

    for (i = qntDivs; i > 1; i--) {
        if ($(`#div-config-${i}`).css('display') === 'flex') {
            if (i > 1) {
                $(`#div-config-${i}`).hide();
                $(`#div-config-${i - 1}`).css('display', 'flex');
            }

            // No responsivo, scrolla para o topo da página e coloca a seta na parte de baixo
            if ($(window).width() <= 820) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                $('#config').css('flex-direction', 'column');
            }

            if (i - 1 <= 1) {
                $('#config-ant').hide();
                $('#config-prox').css('display', 'flex');
            } else {
                $('#config-ant').css('display', 'flex');
                $('#config-prox').hide();
            }
        }
    }
})