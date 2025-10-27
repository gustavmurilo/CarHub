// Lógica para não permitir que um tipo de usuário acesse o perfil de outros

$(document).ready(function() {
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
            const tipoUser = response.tipo_usuario;

            if (tipoUser === 1) {
                window.location.href = 'administrador-perfil.html';
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
})

// Aparecer mensagem caso cadastrar veículo dê certo

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

// Exibir mensagem de reserva
$(document).ready(function() {
    const mensagemLocalStorage = localStorage.getItem('msgPerfil');

    if (mensagemLocalStorage) {
        alertMessage(mensagemLocalStorage, 'success');
        localStorage.removeItem('msgPerfil');
    };
})

// Fazer o nav funcionar

// Função para trocar a borda roxa do A que for clicado
function selecionarA(clicado) {
    $('nav').find('a').each(function(_, a) {
        if (a !== clicado) {
            $(a).removeClass('selecionado')
        } else {
            $(a).addClass('selecionado')
        }
    })
}

$(document).ready(function() {
    $("#link_minhaConta").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'flex');
        $('#reservas').css('display', 'none');

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })

    $("#link_reservas").on("click", function() {
        const elementoClicado = this;
        selecionarA(elementoClicado);

        $('#minha-conta').css('display', 'none');
        $('#reservas').css('display', 'flex');

        if ($(window).width() <= WIDTH_RESPONSIVO) {
            fecharBarraLateral();
        }
    })
});

// Fechar barra lateral
function fecharBarraLateral() {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 899);
}

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

        const pReservadoPor = $('<p></p>').addClass('reservado-por').html(`Reservado por <span>${veiculo.nome_cliente}</span>`)
    
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
    
        // Descrição do veículo
        const pDesc = $("<p></p>").text(veiculo.versao); // Inserir versão do carro
    
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
        divItensCard.append(h3Title, pDesc, containerInfoCard, h3Price, buttonDetalhes);
    
        // Junta a imagem e os itens ao card
        divCard.append(img, pReservadoPor, divItensCard);
    
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
            listaVeicCarro = response.carros;

            listaVeicMotos = response.motos;
        
            const $divReservas = $('#div-reservas');

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
        },
        error: function (response) {
            alert(response.responseJSON.error);
        }
    })
}

// Ao abrir o site, carregar reservas
$(document).ready(() =>{
    buscarReservas();
});