// Dicionário com a URL da foto da logo das marcas de carro
const logo_carros = {
    "Acura": "assets/img/logo-carro/acura.png",
    "Alfa Romeo": "assets/img/logo-carro/alfa romeo.png",
    "Aston Martin": "assets/img/logo-carro/aston martin.png",
    "Audi": "assets/img/logo-carro/audi.png",
    "Bentley": "assets/img/logo-carro/bentley.png",
    "BMW": "assets/img/logo-carro/bmw.png",
    "BYD": "assets/img/logo-carro/byd.svg",
    "Bugatti": "assets/img/logo-carro/bugatti.png",
    "Cadillac": "assets/img/logo-carro/cadillac.png",
    "Chevrolet": "assets/img/logo-carro/chevrolet.jpg",
    "Chery": "assets/img/logo-carro/chery.png",
    "Citroën": "assets/img/logo-carro/citroen.jpg",
    "Dodge": "assets/img/logo-carro/dodge.jpg",
    "Ferrari": "assets/img/logo-carro/ferrari.png",
    "Fiat": "assets/img/logo-carro/fiat.svg",
    "Ford": "assets/img/logo-carro/ford.png",
    "GMC": "assets/img/logo-carro/gmc.png",
    "Honda": "assets/img/logo-carro/honda.jpg",
    "Hyundai": "assets/img/logo-carro/hyundai.jpg",
    "Infiniti": "assets/img/logo-carro/infiniti.png",
    "JAC": "assets/img/logo-carro/jac.png",
    "Jeep": "assets/img/logo-carro/jeep.svg",
    "Kia": "assets/img/logo-carro/kia.jpg",
    "Land Rover": "assets/img/logo-carro/land-rover.png",
    "Lexus": "assets/img/logo-carro/lexus.jpg",
    "Maserati": "assets/img/logo-carro/maserati.jpg",
    "McLaren": "assets/img/logo-carro/mclaren.png",
    "Mazda": "assets/img/logo-carro/mazda.jpg",
    "Mini": "assets/img/logo-carro/mini.jpg",
    "Mitsubishi": "assets/img/logo-carro/mitsubishi.svg",
    "Nissan": "assets/img/logo-carro/nissan.png",
    "Peugeot": "assets/img/logo-carro/peugeot.png",
    "Porsche": "assets/img/logo-carro/porsche.png",
    "Renault": "assets/img/logo-carro/renault.png",
    "Rolls-Royce": "assets/img/logo-carro/rolls royce.png",
    "Saab": "assets/img/logo-carro/saab.png",
    "Smart": "assets/img/logo-carro/smart.jpg",
    "Subaru": "assets/img/logo-carro/subaru.jpg",
    "Suzuki": "assets/img/logo-carro/suzuki.svg",
    "Tesla": "assets/img/logo-carro/tesla.jpg",
    "Toyota": "assets/img/logo-carro/toyota.png",
    "Volkswagen": "assets/img/logo-carro/volkswagem.png",
    "Volvo": "assets/img/logo-carro/volvo.png"
}

// Declarando a variável id_carro fora da função para usá-la depois
let id_carro = '';

var TIPO_VEIC = 'carro';

$(document).ready(async function () {
    
    // Exibir mensagem de reserva
    const mensagemCancReserva = localStorage.getItem('msgCancReserva');

    if (mensagemCancReserva) {
        alertMessage(mensagemCancReserva, 'success');
        localStorage.removeItem('msgCancReserva');
    };

    // Obtém o select estado e de cidade
    const estadoSelect = $("#input-estado");
    const cidadeSelect = $("#input-cidade");

    // Adiciona o evento change ao select
    estadoSelect.on("change", () => {
        const estadoId = $(estadoSelect).find(':selected').attr('id_estado');

        if (!estadoId) {
            window.location.reload();
        }

        // Carrega as cidades referentes ao estado
        carregarCidades(estadoId, cidadeSelect);
    });

    // Carrega os estados assim que a página é carregada
    await carregarEstados(estadoSelect);

    // Recupera a query string da URL
    const urlFrontEnd = window.location.search;

    // Cria um objeto URLSearchParams
    const urlParams = new URLSearchParams(urlFrontEnd);

    // Obtém o valor do parâmetro 'id'
    id_carro = urlParams.get('id');

    if (!id_carro) {
        window.location.href = "veiculos.html";
    }

    // ESSA FUNÇÂO ESTÁ NO ANUNCIO.JS

    // Verifica se um serviço foi adicionado 
    const servicoAdd = localStorage.getItem('servico-add');

    if (servicoAdd) {
        // Carrega os dados da manutenção
        await carregarManutencao();

        // Exibe mensagem
        alertMessage(servicoAdd, 'success');

        // Remove o item do local storage
        localStorage.removeItem('servico-add');
    }

    const dadosUser = localStorage.getItem('dadosUser');
    const headers = {};
    if (dadosUser) {
        const token = JSON.parse(dadosUser).token;
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }
    }

    // Carregar dados do veículo
    $.ajax({
        method: "post",
        url: `${BASE_URL}/buscar-carro`, // URL da API para carros
        data: JSON.stringify({
            'id': id_carro
        }),
        headers: headers,
        contentType: "application/json",
        success: async function (response) {
            try {
                const infoVeic = response.veiculos[0];
                const divCarrossel = $('#div-owl-carousel');

                // Verifica se há pelo menos um veículo retornado
                if (!response.veiculos.length) {
                    // Retorna para a página veículos
                    window.location.href = "veiculos.html";
                }

                // Acessa as imagens do primeiro veículo
                const urlImagens = infoVeic.imagens;

                // Verifica se urlImagens existe e é iterável
                if (!urlImagens || !Array.isArray(urlImagens)) {
                    window.location.href = "veiculos.html";
                }

                // Limpa o conteúdo atual do carrossel
                divCarrossel.empty();

                const dt = new DataTransfer(); // Cria um objeto DataTransfer

                for (const imagem of urlImagens) {

                    // CSS para ficar todas as fotos do mesmo tamanho
                    const divImg = $('<div></div>')
                        .css({
                            "position": "relative",
                            "min-height": "350px",
                            "min-height": "400px",
                            "overflow": "hidden"
                        })

                    // Adicionando a imagem
                    const img = $('<img>').attr('src', imagem).css({
                        "height": "100%",
                        "min-width": "100%",
                        "width": "auto",
                        "display": "block",
                        "position": "absolute",
                        "top": "50%",
                        "left": "50%",
                        "transform": "translate(-50%, -50%)"
                    });

                    // Adicionando a imagem e o overlay à div principal
                    divImg.append(img);

                    // Input final placa
                    await obterTipoUser();

                    if (tipoUser === 1 || tipoUser === 2) {
                        // Criando o overlay
                        const overlay = $('<div></div>').css({
                            "cursor": "pointer",
                            "position": "absolute",
                            "top": "0",
                            "left": "0",
                            "width": "100%",
                            "height": "100%",
                            "background-color": "rgba(0, 0, 0, 0.3)", // Cor escura com transparência
                            "display": "flex",
                            "align-items": "center",
                            "justify-content": "center",
                            "flex-direction": "column",
                            "opacity": "0",
                            "transition": "opacity 0.3s ease"
                        }).addClass('overlay-img-carrossel');

                        // Adicionando o ícone e o texto ao overlay
                        const icon = $('<i class="fa-solid fa-arrow-up-from-bracket"></i>').css({
                            "font-size": "2rem",
                            "color": "#FFF",
                            "margin-bottom": "0.5rem"
                        });
                        const text = $('<span>Editar imagens</span>').css({
                            "color": "#FFF",
                            "font-size": "1rem"
                        });

                        overlay.append(icon, text);

                        // Adicionando a imagem e o overlay à div principal
                        divImg.append(overlay);

                        // Adicionando eventos de hover para mostrar/ocultar o overlay
                        if ($(window).width() < 768) {
                            overlay.css("opacity", "1");
                        } else {
                            divImg.hover(
                                function () {
                                    overlay.css("opacity", "1");
                                },
                                function () {
                                    overlay.css("opacity", "0");
                                }
                            );
                        }
                    }

                    // Adicionando divImg ao carrossel ou ao elemento desejado
                    divCarrossel.append(divImg);

                    // Realiza o fetch da imagem e obtém o Blob

                    const response = await fetch(imagem);
                    const blob = await response.blob();

                    // Extrai o nome do arquivo da URL
                    const fileName = imagem.substring(imagem.lastIndexOf('/') + 1);

                    // Cria um objeto File com o Blob
                    const file = new File([blob], fileName, { type: blob.type });

                    // Adiciona o arquivo ao DataTransfer
                    dt.items.add(file);
                }

                // Atribui os arquivos ao input file
                document.getElementById('upload-imagem').files = dt.files;

                // Carregar a miniatura das imagens atuais
                carregarPreviewImg();

                // Inicializa o carrossel após adicionar os itens
                carregarOwlCarrossel();

                // Input marca
                $("#select-marca").val(infoVeic.marca);

                // Input modelo
                $("#input-modelo").val(infoVeic.modelo);

                // Input versao
                $("#input-subtitle").val(infoVeic.versao);

                // Seleciona o estado do select
                estadoSelect.val(infoVeic.estado);

                // Obtém o id do estado
                const estadoId = $(estadoSelect).find(':selected').attr('id_estado');

                // Caso exista estado id
                if (estadoId) {
                    // Carregar cidades
                    await carregarCidades(estadoId, cidadeSelect);

                    // Seleciona a cidade
                    cidadeSelect.val(infoVeic.cidade);
                }

                // Ano fabricação
                $("#select-ano-fabricacao").val(infoVeic.ano_fabricacao);

                await addOptionsAnoFab($("#select-ano-fabricacao"), $("#select-ano-modelo"));

                // Preencher os selects de ano modelo e ano fabricação
                $("#select-ano-modelo").val(infoVeic.ano_modelo);

                // Input quilometragem
                $('#input-quilometragem').val(formatarQuilometragem(infoVeic.quilometragem));

                // select câmbio
                $("#select-cambio").val(infoVeic.cambio);

                // select categoria
                $("#select-categoria").val(infoVeic.categoria);

                // select combustível
                $("#select-combustivel").val(infoVeic.combustivel);

                // select cor
                $("#select-cor").val(infoVeic.cor);

                // select licenciado
                $("#select-licenciado").val(infoVeic.licenciado);

                // Input final placa
                await obterTipoUser();

                if (tipoUser === 1 || tipoUser === 2) {
                    $('#label-placa').text('Placa')
                    $('#input-placa').val(infoVeic.placa);
                } else {
                    const ultimoCaracterPlaca = infoVeic.placa.slice(-1);
                    $('#input-placa').val(ultimoCaracterPlaca);
                }

                // Input preço venda
                $("#input-preco-venda").val(formatarValor(infoVeic.preco_venda));

                // Carregar foto da marca do carro 
                // Carregar foto da marca da moto
                $("#logo-img")
                    .attr({
                        'src': `${logo_carros[infoVeic.marca]}`,
                        'marca': infoVeic.marca
                    })

                carregarInputs();

                if (response.reserva == true) {
                    // Função para mudar o botão para cancelar reserva
                    $('#div-button-vendedor').css('display', 'none');
                    $('#div-button-cliente').css('display', 'none');
                    $('#div-button-vendido-cliente').css('display', 'none');
                    $('#div-button-vendido-adm').css('display', 'none');

                    // Função para mudar a frase que aparece caso seja o cliente que reservou
                    $('#mensagem-user').css('display', 'none');
                    $('#mensagem-adm').css('display', 'none');
                    $('#mensagem-vendido-cliente').css('display', 'none');
                    $('#mensagem-vendido-adm').css('display', 'none');

                    if (tipoUser === 1 || tipoUser === 2) {
                        $('#div-button-cancelar-reserva-adm').css('display', 'flex');
                        $('#mensagem-reserva-adm').css('display', 'flex');

                        $('#div-button-cancelar-reserva-cliente').css('display', 'none');
                        $('#mensagem-reserva-cliente').css('display', 'none');
                    } else {
                        $('#div-button-cancelar-reserva-adm').css('display', 'none');
                        $('#mensagem-reserva-adm').css('display', 'none');

                        $('#div-button-cancelar-reserva-cliente').css('display', 'flex');
                        $('#mensagem-reserva-cliente').css('display', 'flex');
                    }

                    // Deixa invisível a div dos botões de editar e abrir manutenções
                    $('#div-icons-actions').css('display', 'none');

                    // Retira a possibilidade de editar as imagens do veículo
                    $('.overlay-img-carrossel').css('display', 'none');
                } else if (response.vendido == true) {
                    $('#div-button-vendedor').css('display', 'none');
                    $('#div-button-cliente').css('display', 'none');
                    $('#div-button-cancelar-reserva-adm').css('display', 'none');
                    $('#div-button-cancelar-reserva-cliente').css('display', 'none');
                    
                    $('#mensagem-user').css('display', 'none');
                    $('#mensagem-adm').css('display', 'none');
                    $('#mensagem-reserva-adm').css('display', 'none');
                    $('#mensagem-reserva-cliente').css('display', 'none');

                    if (tipoUser === 1 || tipoUser === 2) {
                        $('#div-button-vendido').css('display', 'flex');

                        $('#mensagem-vendido-cliente').css('display', 'none');
                        $('#mensagem-vendido-adm').css('display', 'flex');

                        if (response.parcelamento) {
                            $('#ver-detalhes').text('Ver detalhes do parcelamento').addClass('parcelamento');
                        } else {
                            $('#ver-detalhes').text('Ver detalhes da compra');
                        }
                    } else {
                        $('#div-button-vendido').css('display', 'flex');

                        $('#mensagem-vendido-cliente').css('display', 'flex');
                        $('#mensagem-vendido-adm').css('display', 'none');

                        if (response.parcelamento) {
                            $('#ver-detalhes').text('Ver detalhes do parcelamento').addClass('parcelamento');
                        } else {
                            $('#ver-detalhes').text('Ver detalhes da compra');
                        }
                    }

                    $('#ver-detalhes').click(function () {
                        
                        if ($(this).hasClass('parcelamento')) {
                            // Informa que o usuário clicou em ver detalhes do parcelamento
                            localStorage.setItem('verDetalhesParcelamento', true);
                        } else {
                            // Informa que o usuário clicou em ver detalhes da venda
                            localStorage.setItem('verDetalhesVenda', true);
                        }

                        if (tipoUser === 1) {
                            // Redireciona para a página de perfil
                            window.location.href = "administrador-perfil.html";
                        } else if (tipoUser === 2) {
                            // Redireciona para a página de perfil
                            window.location.href = "vendedor-perfil.html";
                        } else {
                            // Redireciona para a página de perfil
                            window.location.href = "cliente-perfil.html";
                        }
                    })

                    // Deixa invisível a div dos botões de editar e abrir manutenções
                    $('#div-icons-actions').css('display', 'none');

                    // Retira a possibilidade de editar as imagens do veículo
                    $('.overlay-img-carrossel').css('display', 'none');
                } else {
                    // Lógica para alterar os botões
                    await alterarBotao();
                }
            } finally {
                $('#bg-carregamento').css('display', 'none');
            }
        },
        error: function () {
            window.location.href = "veiculos.html";
        }
    });
})

// Preview Imagens

// Variável global para armazenar os arquivos
let currentFiles = new DataTransfer();

function carregarPreviewImg() {
    const inputFile = document.getElementById('upload-imagem');
    const newFiles = Array.from(inputFile.files);
    currentFiles = new DataTransfer();

    // Adiciona novos arquivos ao DataTransfer
    newFiles.forEach(file => currentFiles.items.add(file));

    // Atualiza o input com os novos arquivos
    inputFile.files = currentFiles.files;

    const previewContainer = $("#preview-container");

    previewContainer.empty();

    Array.from(inputFile.files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imgContainer = $('<div>')
                    .addClass('preview-item')
                    .css('background-image', `url(${e.target.result})`);

                const removeBtn = $('<i>')
                    .addClass('fa-solid fa-xmark remove-btn')
                    // No callback de remoção, em vez de currentFiles.items.remove(index):
                    .on('click', function () {
                        // Cria um novo DataTransfer para armazenar apenas os arquivos que você quer manter
                        let dtTemp = new DataTransfer();
                        const inputFiles = document.getElementById('upload-imagem').files;

                        // Reconstroi a lista, pulando o arquivo removido (identificado pelo index atual)
                        Array.from(inputFiles).forEach((file, i) => {
                            if (i !== index) {
                                dtTemp.items.add(file);
                            }
                        });

                        // Atualiza o input com o novo FileList
                        document.getElementById('upload-imagem').files = dtTemp.files;

                        // Atualiza o preview para refletir a nova lista de arquivos
                        carregarPreviewImg();
                    });

                imgContainer.append(removeBtn);
                previewContainer.append(imgContainer);
            };

            reader.readAsDataURL(file);
        }
    });
}

// Adicionar o evento carregar preview toda vez que input file for alterado
$("#upload-imagem").on("change", function (event) {
    carregarPreviewImg();
});

// Função de fechar modal de editar
function fecharModalEditarImagem() {
    $('#modal-editar-imagem').css('display', 'none');
    $('#overlay-bg').css('display', 'none');
}

// Função de abrir modal de editar
function abrirModalEditarImagem() {
    $('#modal-editar-imagem').css('display', 'flex');
    $('#overlay-bg').css('display', 'flex');
}

// Fechar modal editar imagem ao clicar no X
$('#closeModalEditarImagem').click(function () {
    fecharModalEditarImagem();
})

// Associando o evento de clique usando delegação de eventos
$(document).on('click', '.overlay-img-carrossel', function () {
    abrirModalEditarImagem();
});

// Editar imagens

$('#modal-editar-imagem').on('submit', function (e) {
    e.preventDefault();

    // Caso queira inspecionar os arquivos:
    const files = $('#upload-imagem')[0].files;

    // Cria um objeto FormData
    let formDataImg = new FormData();

    // Adiciona as imagens ao objeto
    for (let i = 0; i < files.length; i++) {
        formDataImg.append('imagens', files[i]);
    }

    // Requisição para editar imagens
    $.ajax({
        url: `${BASE_URL}/carro/editar_img/${id_carro}`,
        method: 'PUT',
        data: formDataImg,
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        processData: false,
        contentType: false,
        success: function () {
            // Define uma mensagem de sucesso para quando recarregar a página exibir ao usuário
            localStorage.setItem('mensagemEditado', 'Imagens do veículo editadas com sucesso!');

            // Recarrega a página para que as aplicações sejam feitas
            window.location.reload();
        },
        error: function (response) {
            // Caso dê erro, exibe a mensagem
            alertMessage(response.responseJSON.error, 'error');
        }
    })
})

// Caso dê certo o editar, exibir mensagem de sucesso ao abrir a página
$(document).ready(function () {
    // Obtêm o item do local storage
    const mensagemEditado = localStorage.getItem('mensagemEditado');

    // Caso exista alguma mensagem no local storage
    if (mensagemEditado) {
        // Mensagem de sucesso
        alertMessage(mensagemEditado, 'success');
        // Remove a mensagem depois de usá-la
        localStorage.removeItem('mensagemEditado');
    }
})

// Função para validar a placa
function validarPlaca() {
    const placa = $('#input-placa').val(); // Pega o valor da placa
    const regexMercosul = /^[A-Za-z]{3}[0-9]{1}[A-Za-z]{1}[0-9]{2}$/; // Formato ABC1D23
    const regexAntigo = /^[A-Za-z]{3}[0-9]{4}$/; // Formato ABC1234

    if (!regexMercosul.test(placa) && !regexAntigo.test(placa)) {
        alertMessage("Formato de placa inválido.", 'error');
        return false; // Retorna falso se não passar na validação
    }

    return true; // Retorna verdadeiro se for válido
}

// Adicionando evento blur ao input de placa para exibir mensagem caso esteja em um formato inválido
$('#input-placa').on('blur', function () {
    validarPlaca();
})

// Cancelar reserva
$('.cancelar-reserva').click(function () {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Você está prestes a cancelar a reserva desse veículo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/cancelar-reserva-carro/${id_carro}`, // URL da API para motos
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                contentType: "application/json",
                success: function (response) {
                    // Salva a mensagem no local storage
                    localStorage.setItem('msgCancReserva', 'Reserva cancelada com sucesso!');

                    // Recarrega a página
                    window.location.reload();
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
    })
})

// Deletar veículo
$('#deletar-veiculo').click(function () {
    Swal.fire({
        title: "Você tem certeza?",
        text: "Você está prestes a deletar os dados desse veículo para sempre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0bd979",
        cancelButtonColor: "#f71445",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: `${BASE_URL}/carro/${id_carro}`,
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function (response) {
                    // Definir mensagem de sucesso
                    localStorage.setItem('msgCadVeic', response.success);

                    // Redirecionar para a página de veículos
                    window.location.href = 'veiculos.html';
                },
                error: function (response) {
                    alertMessage(response.responseJSON.error, 'error');
                }
            })
        }
    });
})

// Variável para saber se a edição está ativa ou não
let editarOn = false;

$("#editarAnuncio").on("click", function () {
    // Verifica se os inputs não estão visíveis
    if (editarOn === false) {
        editarOn = true;

        // Altera a mensagem da dica
        $('.tip-edit').text('Descartar alterações');

        // Alterar ícone do botão de editar para X
        $(this).removeClass('fa-pencil').addClass('fa-xmark');

        $('input').each(function () {
            const id = $(this).attr('id');
            const spanMirror = $(`#mirror-${id}`)

            $(this).css('display', 'flex').attr('disabled', false);
            spanMirror.css('display', 'none');
        })


        $("input, select").prop("disabled", false);

        $("input, select").css("display", "flex");

        // Barra (/) do ano
        $('#barra-ano-mirror').css('display', 'none');
        $('#barra-ano-select').css('display', 'flex');

        // Traço (-) da cidade
        $('#dash-cidade-mirror').css('display', 'none');
        $('#dash-cidade-select').css('display', 'flex');

        $("p.input-mirror, p.select-mirror").css("display", "none");

        // Habilita o botão de salvar alterações
        $('#salvar-alteracoes').prop('disabled', false);

        // Evita que o input de imagem seja alterado
        $('#upload-imagem').css('display', 'none').prop('disabled', false);
    } else {
        editarOn = false;

        // Altera a mensagem da dica
        $('.tip-edit').text('Editar anúncio');

        // Alterar ícone do botão de editar para a caneta
        $(this).removeClass('fa-xmark').addClass('fa-pencil');

        // Seleciona *só* os campos dentro do form-de-editar-anuncio
        const $camposAnuncio = $("#form-editar-anuncio").find("input, select");

        // Ao entrar em modo editar:
        $camposAnuncio
            .css("display", "flex");

        $('#input-preco-venda').show();

        // Ao sair do modo editar (cancelar ou salvar):
        $camposAnuncio
            .css("display", "none");

        $('#input-preco-venda').hide();

        // Barra (/) do ano
        $('#barra-ano-mirror').css('display', 'flex');
        $('#barra-ano-select').css('display', 'none');

        // Traço (-) da cidade
        $('#dash-cidade-mirror').css('display', 'flex');
        $('#dash-cidade-select').css('display', 'none');

        $("p.input-mirror, p.select-mirror").css("display", "flex");

        // Habilita o botão de salvar alterações
        $('#salvar-alteracoes').prop('disabled', true);

        // Carrega o ano modelo
        $('#select-ano-fabricacao').val($('#mirror-select-ano-fabricacao').text());

        // Adiciona os anos de fabricação
        addOptionsAnoFab($("#select-ano-fabricacao"), $("#select-ano-modelo"));

        // Seleciona o estado do mirror
        $('#input-estado').val($('#mirror-input-estado').text());

        // Obtém o id do estado
        const estadoId = $('#input-estado').find(':selected').attr('id_estado');

        // Caso exista estado id
        if (estadoId) {
            // Função para adicionar cidades
            async function addCidades() {
                // Carrega as cidades do estado do mirror
                await carregarCidades(estadoId, $('#input-cidade'));

                // Seleciona a cidade do mirror
                $('#input-cidade').val($('#mirror-input-cidade').text());
            }
            // Chamando a função
            addCidades();
        }

        // Voltar o valor anterior aos inputs
        $('input, select').each(function () {
            const input = $(this);
            const id = input.attr('id');
            const spanMirror = $(`#mirror-${id}`);

            input.val(spanMirror.text());
        });

        // Função especial para o input de licenciado (Sim ou Não)
        const selectLicenciado = $('#select-licenciado');
        const spanMirror = $(`#mirror-select-licenciado`);

        let valorLicenciado;

        if (spanMirror.text() === 'Sim') {
            valorLicenciado = '1';
        } else {
            valorLicenciado = '0';
        }

        selectLicenciado.val(valorLicenciado);

        // Evita que o input de imagem seja alterado
        $('#upload-imagem').css('display', 'none').prop('disabled', false);
    }
});

function validarInputsObrigatorios() {
    let camposVazios = [];
    let camposInvalidos = [];
    let inputsValidos = true;

    // Lista de todos os campos obrigatórios que devem ser verificados
    const camposObrigatorios = [
        { id: "select-marca", nome: "Marca" },
        { id: "input-modelo", nome: "Modelo" },
        { id: "select-ano-modelo", nome: "Ano do Modelo" },
        { id: "select-ano-fabricacao", nome: "Ano de Fabricação" },
        { id: "input-subtitle", nome: "Versão" },
        { id: "select-cor", nome: "Cor" },
        { id: "select-cambio", nome: "Câmbio" },
        { id: "select-combustivel", nome: "Combustível" },
        { id: "select-categoria", nome: "Categoria" },
        { id: "input-quilometragem", nome: "Quilometragem" },
        { id: "input-estado", nome: "Estado" },
        { id: "input-cidade", nome: "Cidade" },
        { id: "input-preco-venda", nome: "Preço de Venda" },
        { id: "select-licenciado", nome: "Licenciado" },
        { id: "input-placa", nome: "Placa" }
    ];

    // Verificar cada campo obrigatório
    camposObrigatorios.forEach(campo => {
        const valor = $(`#${campo.id}`).val();

        // Se o valor for vazio, undefined, null ou só espaços em branco
        if (!valor || valor.trim() === "") {
            camposVazios.push(campo.nome);
            $(`#${campo.id}`).addClass("input-error"); // Adiciona classe de erro visual
            inputsValidos = false;
        } else {
            $(`#${campo.id}`).removeClass("input-error"); // Remove classe de erro visual

            // Verificação adicional para o preço de venda
            if (campo.id === "input-preco-venda") {
                const precoNumerico = desformatarPreco(valor);
                if (precoNumerico <= 0) {
                    camposInvalidos.push("O preço de venda deve ser maior que zero");
                    $(`#${campo.id}`).addClass("input-error");
                    inputsValidos = false;
                }
            }
        }
    });

    // Se existirem campos vazios ou inválidos, exibir mensagem
    if (camposVazios.length > 0 || camposInvalidos.length > 0) {
        let mensagem = "";

        if (camposVazios.length > 0) {
            mensagem = `Os seguintes campos devem ser preenchidos:<br><strong>${camposVazios.join("<br>")}</strong>`;
        }

        if (camposInvalidos.length > 0) {
            if (mensagem) mensagem += "<br><br>";
            mensagem += `<strong>${camposInvalidos.join("<br>")}</strong>`;
        }

        Swal.fire({
            title: "Validação de campos",
            html: mensagem,
            icon: "warning",
            confirmButtonText: "Ok"
        });
    }

    return inputsValidos;
}

// Coletar dados
function coletarDadosAtualizados() {
    return {
        marca: $("#select-marca").val(),
        modelo: $("#input-modelo").val(),
        ano_modelo: $("#select-ano-modelo").val(),
        ano_fabricacao: $("#select-ano-fabricacao").val(),
        versao: $("#input-subtitle").val(),
        cor: $("#select-cor").val(),
        renavam: $("#input-renavam") ? $("#input-renavam").val() : "",
        cambio: $("#select-cambio").val(),
        combustivel: $("#select-combustivel").val(),
        categoria: $("#select-categoria").val(),
        quilometragem: extrairNumeros($("#input-quilometragem").val()),
        estado: $('#input-estado').val(),
        cidade: $("#input-cidade").val(),
        preco_venda: desformatarPreco($("#input-preco-venda").val()),
        licenciado: $("#select-licenciado").val(),
        placa: $("#input-placa").val().toUpperCase(),
        ativo: 1
    };
}

// Salvar alterações
$("#salvar-alteracoes").off("click").on("click", function (e) {
    e.preventDefault();

    // Primeiro verifica se os inputs obrigatórios estão preenchidos e válidos (incluindo preço > 0)
    if (!validarInputsObrigatorios()) {
        return; // Para a execução se houver campos vazios ou inválidos
    }

    // Em seguida valida a placa
    let validacaoPlaca = validarPlaca();
    if (!validacaoPlaca) {
        return;
    }

    // Coleta os dados atualizados
    const dadosAtualizados = coletarDadosAtualizados();

    $.ajax({
        method: "PUT",
        url: `${BASE_URL}/carro/${id_carro}`,
        data: JSON.stringify(dadosAtualizados),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
        },
        success: function (response) {
            // Exibe uma mensagem de sucesso
            Swal.fire({
                title: "Sucesso!",
                text: response.success,
                icon: "success",
                confirmButtonText: "Ok"
            });

            // Evita que o input de imagem seja alterado
            $('#upload-imagem').css('display', 'none').prop('disabled', false);

            // Passar o valor dos inputs pros mirrors
            carregarInputs();

            // Alterar ícone do botão de editar para a caneta
            $('#editarAnuncio').removeClass('fa-xmark').addClass('fa-pencil');

            // Desabilita o botão de salvar alterações
            $('#salvar-alteracoes').prop('disabled', true);

            // Redefinindo a variável de editar para false (Não está editando)
            editarOn = false;
        },
        error: function (response) {
            // Reabilita o botão caso dê erro
            $('#salvar-alteracoes').prop('disabled', false);

            // Exibe mensagem de erro
            Swal.fire({
                title: "Erro",
                text: response.responseJSON.error,
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    });
});
