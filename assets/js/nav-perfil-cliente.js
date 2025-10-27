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
    }

    $.ajax({
        url: `${BASE_URL}/obter_tipo_usuario`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(dadosUser).token
        },
        success: function (response) {
            console.log(response)
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 2) {
                window.location.href = 'vendedor-perfil.html';
            }
            if (tipoUser === 1) {
                window.location.href = 'administrador-perfil.html';
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
})

// Função Alert Message

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


// Exibir mensagens ao abrir o perfil
$(document).ready(function () {
    // Exibir mensagem padrão
    const msg = localStorage.getItem('msgPerfil');

    // Caso exista a mensagem
    if (msg) {
        // Exibe a mensagem
        alertMessage(msg, 'success');

        // Remove o item do local storage
        localStorage.removeItem('msgPerfil');
    }

    // Função para verificar se possui item salvo no local storage
    function verificarReservaCompraParcelamento(localStorageItem, idDiv, linkA, terMsg) {
        // Obtém a mensagem
        const msg = localStorage.getItem(localStorageItem);
        
        // Caso exista a mensagem
        if (msg) {

            if (terMsg) {
                // Exibe a mensagem
                alertMessage(msg, 'success');
            }

            // Remove o item do local storage
            localStorage.removeItem(localStorageItem)

            // Abre a seção designada
            $('#minha-conta').css('display', 'none');
            $(`#${idDiv}`).css('display', 'flex');

            // Seleciona o A do nav correto
            let elemento = document.getElementById(linkA);
            selecionarA(elemento);
        };
    }

    // Chama a função para reservas
    verificarReservaCompraParcelamento('msgReserva', 'reservas', 'link_reservas', true);

    // Chama a função para compras a vista
    verificarReservaCompraParcelamento('msgCompraAVista', 'historico-compras', 'link_hCompras', true);

    // Chama a função para parcelamentos
    verificarReservaCompraParcelamento('msgParcelamento', 'financiamento', 'link_financiamento', true);

    // Chama a função para ver detalhes parcelamento
    verificarReservaCompraParcelamento('verDetalhesParcelamento', 'financiamento', 'link_financiamento', false);

    // Chama a função para ver detalhes da compra
    verificarReservaCompraParcelamento('verDetalhesVenda', 'historico-compras', 'link_hCompras', false);

})

// Fazer o nav funcionar

// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function (_, a) {
        if (a !== clicado) {
            $(a).removeClass('selecionado')
        } else {
            $(a).addClass('selecionado')
        }
    })
}

// Função para fechar os modais de pagar parcelas quando trocar de menu
function fecharModaisPagarParcela() {
    // Fecha as modais e o overlay
    $('#modal-pix').hide();
    $('#modal-pagar-parcela').hide();

    if ($(window).width() > WIDTH_RESPONSIVO) {
        $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
        setTimeout(() => {
            overlayBg.css('display', 'none');
        }, 660);
    }

    // Esconde a imagem do qr code a mostra a div de carregando
    $('#img-qrcode').hide();
    $('#loading-img-qrcode').show();

    // Esconde o codigo pix
    $('.div-codigo-pix').hide();

    // Desabilita o botão de confirmar pagamento
    $('#confirmar-pagamento-parcela').addClass('disabled');

    // Altera novamente o texto do valor da parcela para indefinido
    $('#valor-parcela').text('R$ ~');
    $('#p-juros').remove();
}

// Trocar a visibilidade das divs dentro do main
$(document).ready(function () {
    $("#link_minhaConta").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Fecha os modais de pagar parcela
        fecharModaisPagarParcela();

        $('#minha-conta').css('display', 'flex');
        $('#reservas').css('display', 'none');
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'none');
        $('#parcelas').css('display', 'none')
        $('#ajuda').css('display', 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })
    $("#link_reservas").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Fecha os modais de pagar parcela
        fecharModaisPagarParcela();

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'flex');
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'none');
        $('#parcelas').css('display', 'none')
        $('#ajuda').css('display', 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    $("#link_hCompras").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Fecha os modais de pagar parcela
        fecharModaisPagarParcela();

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#financiamento').css('display', 'none')
        $('#historico-compras').css('display', 'flex');
        $('#parcelas').css('display', 'none')
        $('#ajuda').css('display', 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    $("#link_financiamento").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Fecha os modais de pagar parcela
        fecharModaisPagarParcela();

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'none');
        $('#financiamento').css('display', 'flex')
        $('#parcelas').css('display', 'none')
        $('#ajuda').css('display', 'none')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    $("#link_ajuda").on("click", function () {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        // Fecha os modais de pagar parcela
        fecharModaisPagarParcela();

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'none');
        $('#historico-compras').css('display', 'none');
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display', 'none')
        $('#ajuda').css('display', 'flex')
        $('#modal-comprar').css('display', 'none')

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    // Botão de parcelas a pagar
    $("#parcelas_a_pagar").on("click", function () {
        let textoStatus = "Pendente";
        // Seleciona a option do select
        $('#status-select').val('Pendente');

        // Loop for para esconder as linhas que não forem do mesmo status
        $('tr .status-text').each(function () {
            if ($(this).text() != textoStatus) {
                $(this).closest('tr').hide();
            } else {
                $(this).closest('tr').show();
            }
        });

        // Altera a ordem da alternância de cores das tr
        alterarCoresTr();

        // Exibir a tabela de parcelas
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display', 'flex')
    })

    // Botão de parcelas pagas
    $("#parcelas_pagas").on("click", function () {
        let textoStatus = ["Amortizada", "Paga"];
        // Seleciona a option do select
        $('#status-select').val('Amortizada Paga');

        // Loop for para esconder as linhas que não forem do mesmo status
        $('tr .status-text').each(function () {
            if (textoStatus.includes($(this).text())) {
                $(this).closest('tr').show();
            } else {
                $(this).closest('tr').hide();
            }
        });

        // Altera a ordem da alternância de cores das tr
        alterarCoresTr();

        // Exibir a tabela de parcelas
        $('#financiamento').css('display', 'none')
        $('#parcelas').css('display', 'flex')
    })

    $("#voltar_parcela").on("click", function () {
        $('#financiamento').css('display', 'flex');
        $('#parcelas').css('display', 'none');
    })

    $("#pagarParcela").on("click", function () {
        $('#modal-pagar-parcela').css("display", "flex")
        overlayBg.css({
            'animation': 'aparecerOverlay 0.5s',
            'display': 'flex'
        });

        $('main').css({
            'position': 'relative',
            'z-index': '9999'
        })

        $('#parcelas').css('display', 'none');
    })

    $("#close-modal").on("click", function () {
        $('#modal-pagar-parcela').css("display", "none")
    })
});

// Fechar modal ao clicar no X
$('.btn-fechar-pagar-parcela').click(function () {
    // Fechar os modais
    $('#modal-pagar-parcela').hide();
    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
    setTimeout(() => {
        overlayBg.css('display', 'none');
    }, 660);

    $('#parcelas').css('display', 'flex');

    $('main').css({
        'position': 'static'
    })
})

$('.voltar-modal-pagar-parcela').click(function () {
    // Fechando os modais e abrindo o de compra
    $('#modal-pagar-parcela').css('display', 'flex');
    $('#modal-pix').hide();

    // Exibe a imagem do qrcode
    $('#img-qrcode').hide();
    $('#loading-img-qrcode').show();

    // Esconde o codigo pix 
    $('.div-codigo-pix').hide();

    // Desabilita o botão de confirmar pagamento
    $('#confirmar-pagamento-parcela').addClass('disabled');

    // Altera novamente o texto do valor da parcela para indefinido
    $('#valor-parcela').text('R$ ~');
    $('#p-juros').remove();
})

// Fechar barra lateral
function fecharBarraLateral() {
    $('#barra-lateral').css('animation', 'fecharBarraLateral 0.7s');
    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        $('#barra-lateral').css('display', 'none');
        $('#overlay-bg').css('display', 'none');
    }, 899);
}

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

        // Função para formatar o texto e adicionar "..."
        function limitarQntCaracteres(texto, qntMax) {
            return texto.substr(0, qntMax) + '...';
        }

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
        divCard.append(img, divItensCard);

        // Insere o card no container desejado na página
        divAppend.append(divCard);
    }
}

// Buscar reservas
function buscarReservas() {
    $.ajax({
        url: `${BASE_URL}/buscar_reservas`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            let listaVeicCarro = response.carros;

            let listaVeicMotos = response.motos;

            const $divReservas = $('#div-reservas');

            if (!listaVeicCarro.length && !listaVeicMotos.length) {
                const divPai = $('<div></div>').addClass('div-pai');
                const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
                const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
                const msg = ($('<p></p>').addClass('nada-encontrado').text('Você ainda não possui nenhuma reserva.'));

                divPai.append(icon, msg, btnBuscar);
                $divReservas.append(divPai);
                return;
            }

            // Adiciona o título da seção
            $('#reservas').prepend($('<h3></h3>').text('Veículos reservados'));

            if (listaVeicCarro.length) {
                await gerarCard(listaVeicCarro, $divReservas, "carro");
            }

            if (listaVeicMotos.length) {
                await gerarCard(listaVeicMotos, $divReservas, "moto");
            }
        },
        error: function (response) {
            const $divReservas = $('#div-reservas');

            const divPai = $('<div></div>').addClass('div-pai');
            const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
            const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
            const msg = ($('<p></p>').addClass('nada-encontrado').text('Você ainda não possui nenhuma reserva.'));

            divPai.append(icon, msg, btnBuscar);
            $divReservas.append(divPai);
        }
    })
}

// Buscar reservas
function buscarFinanciamento() {
    $.ajax({
        url: `${BASE_URL}/buscar_financiamento`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            const veiculo = response.dados_veiculo;

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
            if (comprimentoNomeVeic >= 14) {
                let qntLetrasModelo = 14 - (comprimentoMarca + 1);

                let novoModelo = limitarQntCaracteres(veiculo.modelo, qntLetrasModelo);

                spanModelo.text(novoModelo);
            } else {
                spanModelo.text(veiculo.modelo);
            }

            // Inserir nome do carro
            $("#marca-financ").append(`${veiculo.marca} `).append(spanModelo);

            // Caso exista a versão
            if (veiculo.versao) {
                let qntCaracteresVersao = veiculo.versao.length;

                // Caso a versão tenha mais ou igual a 34 caractéres
                if (qntCaracteresVersao >= 24) {
                    $("#versao-financ").text(limitarQntCaracteres(veiculo.versao, 24)); // Inserir versão do carro
                } else {
                    $("#versao-financ").text(veiculo.versao); // Inserir versão do carro
                }
            }

            // Insere o ano do modelo e ano de fabricação
            $('#ano-financ').text(`${veiculo.ano_modelo}/${veiculo.ano_fabricacao}`);

            // Insere o valor total do parcelamento
            $('.valor-total-financ').text(formatarValor(response.valor_total));

            // Insere o valor da entrada do financiamento
            $('.entrada-financ').text(`Entrada - ${formatarValor(response.entrada)}`);

            // Adicionar evento click para redirecionar para o anúncio do veículo para ver mais detalhes
            if (veiculo.tipo_veiculo === 1) {
                $('#ver_veiculo_financiamento').click(function () {
                    window.location.href = `anuncio-carro.html?id=${veiculo.id_veiculo}`;
                })
            } else {
                $('#ver_veiculo_financiamento').click(function () {
                    window.location.href = `anuncio-moto.html?id=${veiculo.id_veiculo}`;
                })
            }

            const lista_parcelas = response.lista_parcelas;

            // Limpa a tabela
            $("#tbody-parcelas").empty();

            let parcelasPagas = 0;
            // Inserir parcelas na tabela
            for (let index = 0; index < lista_parcelas.length; index++) {
                const parcela = lista_parcelas[index];

                // Cria um elemento <tr> para agrupar as colunas
                const $tr = $('<tr>');

                if (index % 2 === 0) {
                    $tr.addClass('tipo2');
                } else {
                    $tr.addClass('tipo1');
                }

                // Cria os tds que irão conter as informações
                const $tdNumParcela = $('<td>').text(parcela.num_parcela);

                const $tdValor = $('<td>').text(formatarValor(parcela.valor_parcela)).addClass('td-valor');

                const $tdValorAmortizada = $('<td>').text(formatarValor(parcela.valor_parcela_amortizada)).addClass('td-valor');

                // Formata a data
                function formatarData(data) {
                    const date = new Date(data);

                    const day = String(date.getUTCDate()).padStart(2, "0");
                    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                    const year = date.getUTCFullYear();

                    return formatted = `${day}/${month}/${year}`;
                }

                const $tdDataVencimento = $('<td>').text(formatarData(parcela.data_vencimento));

                const $tdDataPagamento = $('<td>').text(parcela.data_pagamento ? formatarData(parcela.data_pagamento) : '~');

                const $tdStatus = $('<td>').text(parcela.status == 1 ? "Pendente" : parcela.status == 2 ? "Vencida" : parcela.status == 3 ? "Paga" : "Amortizada").addClass('status-text');

                // Adiciona um a contagem de parcelas pagas
                if ($tdStatus.text() === 'Paga' || $tdStatus.text() === 'Amortizada') {
                    parcelasPagas++;
                }

                $tr.append($tdNumParcela)
                    .append($tdValor)
                    .append($tdValorAmortizada)
                    .append($tdDataVencimento)
                    .append($tdDataPagamento)
                    .append($tdStatus);

                $('#tbody-parcelas').append($tr);
            }

            // Insere a quantidade de parcelas
            $('.qnt-parcelas-financ').text(`${parcelasPagas}/${response.qnt_parcelas} parcelas`);

            // Caso exista um financiamento
            let msgParcelaPaga = localStorage.getItem('msgParcelaPaga');

            // Caso a mensagem esteja salva no local storage
            if (msgParcelaPaga) {
                // Exibe a mensagem na tela
                alertMessage(msgParcelaPaga, 'success');

                // Seleciona o link de financiamento
                let linkFinanciamento = document.getElementById('link_financiamento');
                selecionarA(linkFinanciamento);

                let textoStatus = "Pendente";

                // Da display flex na tabela de parcelas
                $('#minha-conta').css('display', 'none');
                $('#parcelas').css('display', 'flex');

                // Seleciona a option do select
                $('#status-select').val(textoStatus);

                // Loop for para esconder as linhas que não forem do mesmo status
                $('tr .status-text').each(function () {
                    if ($(this).text() != textoStatus) {
                        $(this).closest('tr').hide();
                    } else {
                        $(this).closest('tr').show();
                    }
                });

                // Altera a ordem da alternância de cores das tr
                alterarCoresTr();

                // Remove o item do local storage
                localStorage.removeItem('msgParcelaPaga');
            }
        },
        error: function () {
            const $divFinanciamentos = $('#div-financiamento');

            const divPai = $('<div></div>').addClass('div-pai');
            const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
            const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
            const msg = ($('<p></p>').addClass('nada-encontrado').text('Você não possui nenhum veículo parcelado.'));

            divPai.append(icon, msg, btnBuscar);
            $divFinanciamentos.empty().append(divPai);

            // Caso exista uma mensagem de financiamento
            let msgParcelaPaga = localStorage.getItem('msgParcelaPaga');

            // Caso a mensagem esteja salva no local storage
            if (msgParcelaPaga) {
                // Exibe a mensagem na tela
                alertMessage(msgParcelaPaga, 'success');

                // Seleciona o link de financiamento
                let linkHistoricoCompras = document.getElementById('link_hCompras');
                selecionarA(linkHistoricoCompras);

                // Da display flex na tabela de parcelas
                $('#minha-conta').css('display', 'none');
                $('#historico-compras').css('display', 'flex');

                // Remove o item do local storage
                localStorage.removeItem('msgParcelaPaga');
            }

            return;
        }
    })
}

$('#status-select').on('change', function () {
    // Obtém o valor da option selecionada
    let textoStatus = $(this).val().split(' ');

    if (textoStatus.includes('Todas')) {
        $('tr').show();
    } else {
        // Loop for para esconder as linhas que não forem do mesmo status
        $('tr .status-text').each(function () {
            if (textoStatus.includes($(this).text())) {
                $(this).closest('tr').show();
            } else {
                $(this).closest('tr').hide();
            }
        });
    }

    // Altera as cores
    alterarCoresTr();
})

function alterarCoresTr() {
    // Define o index como 0
    let index = 1;

    $('tr .status-text').each(function () {
        if ($(this).closest('tr').css('display') === 'none') {
            return;
        }

        if (index % 2 === 0) {
            $(this).closest('tr').addClass('tipo1').removeClass('tipo2');
        } else {
            $(this).closest('tr').addClass('tipo2').removeClass('tipo1');
        }
        // Soma mais um ao index
        index++;
    });
}

// Função para formatar o texto e adicionar "..."
function limitarQntCaracteres(texto, qntMax) {
    return texto.substr(0, qntMax) + '...';
}

// Buscar venda
function buscarVenda() {
    $.ajax({
        url: `${BASE_URL}/buscar_venda`,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: async function (response) {
            let listaVeicCarro = response.carros;

            let listaVeicMotos = response.motos;

            const $divHistoricoCompras = $('#div-historico-compras');

            if (!listaVeicCarro.length && !listaVeicMotos.length) {
                const divPai = $('<div></div>').addClass('div-pai');
                const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
                const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
                const msg = ($('<p></p>').addClass('nada-encontrado').text('Você ainda não possui nenhuma compra concluída.'));

                divPai.append(icon, msg, btnBuscar);
                $divHistoricoCompras.append(divPai);
                return;
            }

            // Adiciona o título da seção
            $('#historico-compras').prepend($('<h3></h3>').text('Histórico de compras'));

            if (listaVeicCarro.length) {
                await gerarCard(listaVeicCarro, $divHistoricoCompras, "carro");
            }

            if (listaVeicMotos.length) {
                await gerarCard(listaVeicMotos, $divHistoricoCompras, "moto");
            }
        },
        error: function (response) {
            const $divHistoricoCompras = $('#div-historico-compras');

            const divPai = $('<div></div>').addClass('div-pai');
            const icon = $('<i></i>').addClass('fa-solid fa-thumbs-down icon');
            const btnBuscar = $('<a></a>').attr('href', 'veiculos.html').addClass('buscar-btn').html(`Buscar veículos <i class="fa-solid fa-magnifying-glass"></i>`)
            const msg = ($('<p></p>').addClass('nada-encontrado').text('Você ainda não possui nenhuma compra concluída.'));

            divPai.append(icon, msg, btnBuscar);
            $divHistoricoCompras.append(divPai);
        }
    })
}

// Busca reservas e financiamentos
$(document).ready(() => {
    // Buscar as reservas
    buscarReservas();
    // Busca os financiamentos
    buscarFinanciamento();
    // Busca as vendas
    buscarVenda();
});

// Abre o modal de gerar o qr code do pix para pagar a parcela mais recente
$('#parcela-mais-recente').on('click', function () {
    // Exibe o modal de pix
    $('#modal-pagar-parcela').css('display', 'none');
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

    $.ajax({
        url: `${BASE_URL}/gerar_qrcode_parcela/recente`,
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob' // <- diz ao XHR para devolver um Blob
        },
        success: function (response, textStatus, jqXHR) {
            // Obtém o id da parcela e o salva em um input
            const idParcela = jqXHR.getResponseHeader('ID-PARCELA');
            $('#input-id-parcela').val(idParcela);

            // Obtém o valor da parcela
            const valorParcela = jqXHR.getResponseHeader('VALOR-PARCELA');
            // Informa o valor da parcela para o usuário
            $('#valor-parcela').text(formatarValor(valorParcela));

            // Obtém o valor da parcela
            const codigoPix = jqXHR.getResponseHeader('CODIGO-PIX');
            // Informa o valor da parcela para o usuário
            $('#p-codigo-pix').text(codigoPix);
            $('.div-codigo-pix').show();

            // Obtém o valor da parcela
            const juros = jqXHR.getResponseHeader('JUROS');
            if (juros && parseFloat(juros) > 0) {
                let textoAntigo = $('#p-mensagem-qr-code').html();

                textoAntigo += `<p id="p-juros"> (Juros: <span>${formatarValor(juros)}</span>)</p>`;

                $('#p-mensagem-qr-code').html(textoAntigo);
            }

            // Define amortizada como "0", ou seja, não amortizada
            $('#input-amortizada').val(0)

            // Habilita o botão de confirmar pagamento
            $('#confirmar-pagamento-parcela').removeClass('disabled');

            // Cria a URL utilizando a resposta BLOB obtida da API
            const url_qrcode = URL.createObjectURL(response);

            // Exibe a imagem do qrcode
            $('#img-qrcode').css({
                'background-image': `url(${url_qrcode})`,
                'display': 'flex'
            });
            $('#loading-img-qrcode').hide();
        },
        error: function (response) {
            // Exibe a mensagem de erro
            alertMessage(response.responseJSON.error, 'error');

            // Fecha as modais e o overlay
            $('#modal-pagar-parcela').css('display', 'none');
            $('#modal-pix').css('display', 'none');
            $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
            setTimeout(() => {
                overlayBg.css('display', 'none');
            }, 660);
        }
    })
})

$(document).ready(function () {
    $('#copiar-codigo-pix').click(async function () {
        // Tenta pela API moderna
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText($('#p-codigo-pix').text());

                alertMessage('Código copiado!', 'success');

                return;
            } catch (err) {
                return;
            }
        }
    })
})

// Abre o modal de gerar o qr code do pix para pagar a parcela mais recente
$('#parcela-amortizar').on('click', function () {
    // Exibe o modal de pix
    $('#modal-pagar-parcela').css('display', 'none');
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

    $.ajax({
        url: `${BASE_URL}/gerar_qrcode_parcela/amortizar`,
        headers: {
            "Authorization": "Bearer " + dadosUser.token
        },
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob' // <- diz ao XHR para devolver um Blob
        },
        success: function (response, textStatus, jqXHR) {
            // Obtém o id da parcela e o salva em um input
            const idParcela = jqXHR.getResponseHeader('ID-PARCELA');
            $('#input-id-parcela').val(idParcela);

            // Obtém o valor da parcela
            const valorParcela = jqXHR.getResponseHeader('VALOR-PARCELA');
            // Informa o valor da parcela para o usuário
            $('#valor-parcela').text(formatarValor(valorParcela));

            // Obtém o valor da parcela
            const codigoPix = jqXHR.getResponseHeader('CODIGO-PIX');
            // Informa o valor da parcela para o usuário
            $('#p-codigo-pix').text(codigoPix);
            $('.div-codigo-pix').show();

            // Define amortizada como "1", ou seja, amortizada
            $('#input-amortizada').val(1);

            // Habilita o botão de confirmar pagamento
            $('#confirmar-pagamento-parcela').removeClass('disabled');

            // Cria a URL utilizando a resposta BLOB obtida da API
            const url_qrcode = URL.createObjectURL(response);

            // Exibe a imagem do qrcode
            $('#img-qrcode').css({
                'background-image': `url(${url_qrcode})`,
                'display': 'flex'
            });
            $('#loading-img-qrcode').hide();
        },
        error: function (response) {
            // Exibe a mensagem de erro
            alertMessage(response.responseJSON.error, 'error');

            // Fecha as modais e o overlay
            $('#modal-pagar-parcela').css('display', 'none');
            $('#modal-pix').css('display', 'none');
            $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');
            setTimeout(() => {
                overlayBg.css('display', 'none');
            }, 660);
        }
    })
})

// Ao clicar no botão de confirmar pagamento de parcela
$('#confirmar-pagamento-parcela').click(function () {
    // Caso o botão esteja desabilitado, retorna
    if ($(this).hasClass('disabled')) {
        return;
    }

    // Fecha o modal de pix
    $('#modal-pix').hide();
    $('#overlay-bg').hide();

    // Position static no main para não bugar o z-index
    $('main').css('position', 'static');

    Swal.fire({
        title: "Você confirma o pagamento dessa parcela?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtém o id parcela no input hidden
            let idParcela = $('#input-id-parcela').val();

            // Obtém se é amortizada
            let amortizada = $('#input-amortizada').val();

            // Acessa a rota ajax para pagar a parcela
            $.ajax({
                url: `${BASE_URL}/pagar_parcela/${idParcela}/${amortizada}`,
                success: function (response) {
                    // Salva a mensagem no local storage
                    localStorage.setItem('msgParcelaPaga', response.success);
                    // Recarrega a página
                    window.location.reload();
                },
                error: function (response) {
                    // Exibe a mensagem de erro
                    alertMessage(response.responseJSON?.error, 'error');

                    // Fecha as modais e o overlay
                    $('#modal-pagar-parcela').css('display', 'none');
                    $('#modal-pix').css('display', 'none');
                    $('#overlay-bg').css('animation', 'sumirOverlay 0.7s');

                    setTimeout(() => {
                        overlayBg.css('display', 'none');
                    }, 660);
                }
            })
        } else {
            // Abre de volta a div de parcelamento
            $('#financiamento').css('display', 'flex');

            // Exibe a imagem do qrcode
            $('#img-qrcode').hide();
            $('#loading-img-qrcode').show();

            // Esconde o codigo pix 
            $('.div-codigo-pix').hide();

            // Desabilita o botão de confirmar pagamento
            $('#confirmar-pagamento-parcela').addClass('disabled');

            // Altera novamente o texto do valor da parcela para indefinido
            $('#valor-parcela').text('R$ ~');
            $('#p-juros').remove();
        }
    })
})