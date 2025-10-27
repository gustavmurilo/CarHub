// Obter o banner da home
$(document).ready(function() {
    $.ajax({
        url: `${BASE_URL}/obter_banner`,
        success: function (response) {
            $('.banner').css({
                'background-image': `url(${response.img_url})`
            })
        },
        error: function() {
            console.log('asdada')
        }
    })
})

// Função para trocar pesquisa entre carro e moto

const tipoVeicMoto = $("#veiculo-moto");
const tipoVeicCarro = $("#veiculo-carro")
const divInputPesquisarMoto = $('#div-input-pesquisar-moto');
const divInputPesquisarCarro = $('#div-input-pesquisar-carro');

function mudarVeiculoSelecionado(veic1, veic2, div1, div2) {
    if (veic1.hasClass('veiculo-nao-selecionado')) {
        veic1.removeClass("veiculo-nao-selecionado").addClass('veiculo-selecionado');
        div1.css('display', 'flex')
        div2.css('display', 'none')
        veic2.removeClass('veiculo-selecionado').addClass('veiculo-nao-selecionado')
    }
}

tipoVeicMoto.click(() => {
    mudarVeiculoSelecionado(tipoVeicMoto, tipoVeicCarro, divInputPesquisarMoto, divInputPesquisarCarro);
});

tipoVeicCarro.click(() => {
    mudarVeiculoSelecionado(tipoVeicCarro, tipoVeicMoto, divInputPesquisarCarro, divInputPesquisarMoto);
});

// Lógica para carregar quantidade de veículos na home

function formatarQntVeic(valor) {  
    if (valor >= 1000) {
        let qntCasasMilhar = (String(valor).length) - 3; 
        
        let valorString = String(valor);

        let milhar = valorString.slice(0, qntCasasMilhar);
        let centena = valorString.slice(qntCasasMilhar, valorString.length);
        
        return `${milhar}.${centena}`;
    }

    return valor;
}

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

        // Limpar o local storage para evitar que a mensagem de novo ao recarregar a página
        localStorage.clear();
}

$(document).ready(async function() {
    
    await $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-carro`, // URL da API para carros
        data: JSON.stringify({
            'id': null
        }),
        contentType: "application/json",
        success: function(response) {
            // Span de carros
            $('#qnt-carros').text(formatarQntVeic(response.qnt));
        },
        error: function() {
            alertMessage("Erro ao carregar quantidade de carros", "error");
        }
    })

    await $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-moto`, // URL da API para carros
        data: JSON.stringify({
            'id': null
        }),
        contentType: "application/json",
        success: function(response) {
            // Span de carros
            $('#qnt-motos').text(formatarQntVeic(response.qnt));
        },
        error: function() {
            alertMessage("Erro ao carregar quantidade de motos", "error");
        }
    })

    // Atualizar data das reservas
    await $.ajax({
        url: `${BASE_URL}/atualizar_reservas`
    })
})

// Salvar marca veículo no Local Storage

$(document).ready(function() {
    $(".a-marcas-car").on("click", function(e) {

        e.preventDefault(); // Previne o comportamento padrão do link

        localStorage.setItem('tipo-veiculo', 'carro');

        // Pegamos o id do elemento clicado
        const marca = $(this).attr("marca");

        // Salvamos no localStorage para usar na próxima página
        localStorage.setItem("filtro-marca", marca);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";  
    });
});

$(document).ready(function() {
    $(".a-marcas-moto").on("click", function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link

        localStorage.setItem('tipo-veiculo', 'moto');

        // Pegamos o id do elemento clicado
        const marca = $(this).attr("marca");

        // Salvamos no localStorage para usar na próxima página
        localStorage.setItem("filtro-marca", marca);

        // Redireciona para a página de veículos
        window.location.href = "veiculos.html";  
    });
});

// Buscar categoria

$(document).ready(function() {
    $(".div-modelos a").on("click", function(e) {
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

// Ao clicar no botão de pesquisar carro
$('#pesquisar-carros').click(function() {
    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";  
})

// Ao clicar no botão de pesquisar carro
$('#pesquisar-motos').click(function() {
    // Define o tipo de veículo como moto
    localStorage.setItem('tipo-veiculo', 'moto'); 
    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";  
})

function buscarMarcaModelo(texto, tipo) {
    // Define o tipo do veículo como carro
    localStorage.setItem('tipo-veiculo', tipo); 

    // Salvamos no localStorage para usar na próxima página
    localStorage.setItem("nome-veic", texto);
    
    // Redireciona para a página de veículos
    window.location.href = "veiculos.html";  
}

// Adicionar sugestão

function addSugestao(texto, div, tipo) {
    const pSug = $('<p></p>').addClass('sugestao');

    const iconSearch = $('<i></i>').addClass('fa-solid fa-magnifying-glass');

    pSug.append(iconSearch).append(texto);

    pSug.on('click', function() {
        buscarMarcaModelo(texto, tipo);
    });

    $(div).append(pSug);
}

// Função para buscar veículos pelo nome da marca ou modelo
function barraPesquisar(tipo, input, divSugestoes, divMarcas, divModelos) {
    $(input).on('input', function() {
        
        if ($(this).val() === '') {
            $(divSugestoes).css('display', 'none');
            return;
        }

        $.ajax({
            method: "post",
            url: `${BASE_URL}/buscar-${tipo}`, // URL da API para carros
            data: JSON.stringify({
                'nome-veic': $(input).val()
            }),
            contentType: "application/json",
            success: function(response) {
                // Div de sugestões
                $(divSugestoes).css('display', 'flex');
                    
                // Div sugestões marcas
                $(divMarcas)
                    .empty()
                    .append($('<p></p>').addClass('title-sug').text('Marcas'));

                // Div sugestões modelos
                $(divModelos)
                    .empty()
                    .append($('<p></p>').addClass('title-sug').text('Modelos'));

                const veiculos = response.veiculos;

                if (!veiculos.length) {
                    // Div de sugestões
                    $(divModelos)
                        .empty();

                    // Div de sugestões
                    $(divMarcas).empty();

                    // Cria o p de veículo não encontrado
                    const pSug = $('<p></p>').addClass('sugestao nada-encontrado');
                    const iconSearch = $('<i></i>').addClass('fa-solid fa-magnifying-glass');
                    pSug.append(iconSearch).append('Nenhum veículo encontrado.');

                    // Da append no p
                    $(divModelos).append(pSug);

                    // Retorna
                    return;
                }

                // Criando a lista de nome veículo (marca + modelo) 
                let listaMarcaModelo = [];
                
                // Criando a lista de marcas 
                let listaMarcas = [];

                // Função para buscar até 10 veículos
                let count = Math.min(10, veiculos.length);

                // Percore 10 vezes ou o tamanho da lista
                for (let i = 0; i < count; i++) {
                    // Criando o nome do veículo (Unindo marca e modelo)
                    const marcaModelo = veiculos[i].marca + ' ' + veiculos[i].modelo;

                    // Adicionando a lista para evitar duplicações
                    if (!listaMarcaModelo.includes(veiculos[i].marca)) {
                        listaMarcaModelo.push(marcaModelo);
                    }

                    // Adicionando a lista para evitar duplicações
                    if (!listaMarcas.includes(veiculos[i].marca)) {
                        listaMarcas.push(veiculos[i].marca);
                    }
                }

                // Adiciona as sugestões com base nas marcas adicionadas a lista
                for (i in listaMarcas) {
                    const marca = listaMarcas[i];

                    // Chamando função de adicionar sugestão
                    addSugestao(marca, divMarcas, tipo);
                }

                // Adiciona as sugestões com base nos nomes de veículos adicionados a lista
                for (i in listaMarcaModelo) {
                    const marcaModelo = listaMarcaModelo[i];

                    // Chamando função de adicionar sugestão
                    addSugestao(marcaModelo, divModelos, tipo);
                }
            },
            error: function() {
                alertMessage("Erro ao carregar as sugestões de veículos.", "error");
            }
        })
    })
}

// Ao carregar a página
$(document).ready(function() {
    // Adicionando a função ao input de carros
    barraPesquisar('carro', '#inputPesquisarModeloCarro', '#sugestoes-carros', '#div-marcas-carros', '#div-modelos-carros');
    
    // Adicionando a função ao input de motos
    barraPesquisar('moto', '#inputPesquisarModeloMoto', '#sugestoes-motos', '#div-marcas-motos', '#div-modelos-motos');
})

$('#inputPesquisarModeloCarro').on('blur', function() {
    // Limpa o input
    $(this).val('');
})

// Script´s para FAQ
$(document).ready(function() {
    $(".aside h4").click(function() {
        $(this).next("ul").slideToggle();
    });
});
