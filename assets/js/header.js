// URL API

// Variável Global
var BASE_URL = "http://127.0.0.1:5000";

function formatarTelefone(telefone) {
    // Remove tudo que não for dígito
    const nums = telefone.replace(/\D/g, '');

    // Usa regex para capturar (DD)(XXXXX)(XXXX) e inserir parênteses, espaço, hífen
    return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

$(document).ready(function () {
    // Buscar o nome da garagem
    $.ajax({
        url: `${BASE_URL}/obter_nome_garagem`,
        success: function (response) {
            // Insere o título da página
            let textoAntigo = $('#title-pagina').text();
            $('#title-pagina').text(`${response.primeiro_nome}${response.segundo_nome} ${textoAntigo}`);

            // Insere o primeiro e segundo nome
            $('.primeiro-nome').text(response.primeiro_nome);
            $('.segundo-nome').text(response.segundo_nome);
        }
    })

    // Buscar o telefone da garagem
    $.ajax({
        url: `${BASE_URL}/obter_footer`,
        success: function (response) {
            // Insere o título da página
            $('#telefone-footer').text(formatarTelefone(response.telefone));

            $('#email-footer').text(response.email).attr('href', `mailto:${response.email}`);

            $('#cidade-footer').text(`${response.cidade} - ${response.estado}`);
        }
    })

    // Obter a logo da garagem
    $.ajax({
        url: `${BASE_URL}/obter_logo`,
        success: function (response) {
            // Insere o primeiro e segundo nome
            $('.logo-garagem').attr('src', response.img_url);
            // Logo na página do navegador
            $('#link_icon_navegador').attr('href', response.img_url);
        }
    })

    // Obter a logo da garagem
    $.ajax({
        url: `${BASE_URL}/obter_cores`,
        success: function (response) {
            // Função para tranformar de HEX para RGB
            function hexToRgb(hex) {
                // retira o '#' e divide em pares de dígitos
                const [r, g, b] = hex
                    .replace('#', '')
                    .match(/.{2}/g)
                    .map(h => parseInt(h, 16));
                return { r, g, b };
            }

            // escurece cada canal em x%
            function darkenRgb({ r, g, b }, percent) {
                const factor = 1 - percent / 100;               // ex: 0.8 para –20%
                return {
                    r: Math.round(r * factor),
                    g: Math.round(g * factor),
                    b: Math.round(b * factor)
                };
            }

            const { r, g, b } = hexToRgb(response.cor_princ);
            const darker = darkenRgb({ r, g, b }, 15);      // –20% (mais próximo de preto)
            const hoverRoxo = `rgb(${darker.r}, ${darker.g}, ${darker.b})`;

            // Root styles
            const rootStyles = document.documentElement.style;

            // Atualiza as propriedades
            rootStyles.setProperty('--roxo', response.cor_princ);
            rootStyles.setProperty('--hover-roxo', hoverRoxo);
            rootStyles.setProperty('--cor-bg', response.cor_fund_1);
            rootStyles.setProperty('--cor-bg-sec', response.cor_fund_2);
            rootStyles.setProperty('--cor-texto', response.cor_texto);
        }
    })
})

// Abrir e fechar barra lateral
const sanduiche = $("#sanduicheHeader");
const barraLateral = $('#barra-lateral');
const overlayBg = $('#overlay-bg');
const closeBarraLateral = $('#fecharBarraLateral');

sanduiche.click(() => {
    barraLateral.css({
        'animation': 'abrirBarraLateral 0.5s',
        'display': 'flex'
    });
    overlayBg.css({
        'animation': 'aparecerOverlay 0.5s',
        'display': 'flex'
    });
});

closeBarraLateral.click(() => {
    barraLateral.css('animation', 'fecharBarraLateral 0.7s');
    overlayBg.css('animation', 'sumirOverlay 0.7s');

    setTimeout(() => {
        barraLateral.css('display', 'none');
        overlayBg.css('display', 'none');
    }, 660);
});


// Abrir modal veículos
if ($(window).width() >= 1150) {
    const itemNavVeiculos = $('#nav-veiculos');
    const modalNavVeiculos = $('#modal-nav-veiculos');

    function abrirModalVeiculos(div) {
        div.on('mouseenter', () => {
            modalNavVeiculos.css('display', 'flex');
        }).on('mouseleave', () => {
            modalNavVeiculos.css('display', 'none');
        })
    }

    abrirModalVeiculos(itemNavVeiculos);
    abrirModalVeiculos(modalNavVeiculos);
}

// Mudar perfil quando usuário estiver logado

$(document).ready(function () {
    const dadosUser = JSON.parse(localStorage.getItem('dadosUser'));

    if (dadosUser) {
        // Função para formatar o texto e adicionar "..."
        function limitarQntCaracteres(texto, qntMax) {
            return texto.substr(0, qntMax) + '...';
        }

        // Caso esteja no responsivo
        if ($(window).width() < 1148) {
            // Limita o texto
            if (dadosUser.nome_completo.length > 10) {
                $('#nomeUsuario').text(limitarQntCaracteres(dadosUser.nome_completo, 10));
            } else {
                $('#nomeUsuario').text(dadosUser.nome_completo);
            }
        } else {
            // Limita o texto
            if (dadosUser.nome_completo.length > 15) {
                $('#nomeUsuario').text(limitarQntCaracteres(dadosUser.nome_completo, 15));
            } else {
                $('#nomeUsuario').text(dadosUser.nome_completo);
            }
        }

        // Texto da tip
        $('.tip-user').text('Acessar perfil')

        // Lógica para obter tipo do usuário

        $(document).ready(function () {
            $.ajax({
                url: `${BASE_URL}/obter_tipo_usuario`,
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('dadosUser')).token
                },
                success: function (response) {
                    const tipoUser = response.tipo_usuario;

                    if (tipoUser === 3) {
                        $('#aDivEntrar').attr('href', 'cliente-perfil.html')
                    } else if (tipoUser === 2) {
                        $('#aDivEntrar').attr('href', 'vendedor-perfil.html')
                    } else if (tipoUser === 1) {
                        $('#aDivEntrar').attr('href', 'administrador-perfil.html')
                    }
                },
                error: function (response) {
                    // Caso dê erro, redireciona para a página de login
                    localStorage.removeItem('dadosUser');

                    window.location.reload();
                }
            })
        })

    } else {
        // Abrir e fechar modal login

        const closeModalLogin = $("#closeModalLogin");
        const modalLogin = $('#modal-login');

        modalLogin.css('display', 'flex');

        closeModalLogin.click(() => {
            const displayModal = modalLogin.css('display');

            if (displayModal === 'flex') {
                modalLogin.css('display', 'none');
            }
        });

        const aDivEntrar = $('#aDivEntrar');

        aDivEntrar.click(function (e) {
            if ($(window).width() <= 768) {
                aDivEntrar.attr('href', 'login.html');
                return;
            } else {
                // Evitar o recarregamento da página
                e.preventDefault();

                const displayModal = modalLogin.css('display');

                if (displayModal === 'flex') {
                    modalLogin.css('display', 'none');
                }

                if (displayModal === 'none') {
                    modalLogin.css('display', 'flex');
                }
            }
        })
    }
})

// Abrir página de carro ou motos ao clicar no modal do nav

$('#pagina-veiculo-carro').click(function () {
    localStorage.setItem('tipo-veiculo', 'carro');
    window.location.href = "veiculos.html";
})

$('#pagina-veiculo-moto').click(function () {
    localStorage.setItem('tipo-veiculo', 'moto');
    window.location.href = "veiculos.html";
})

$('#footer-motos-usadas').click(function () {
    localStorage.setItem('tipo-veiculo', 'moto');
    window.location.href = "veiculos.html";
})

