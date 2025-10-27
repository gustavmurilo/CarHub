$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        margin: 15,
        autoWidth: true,
        loop: true,
        center: true,
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2,
                nav: true
            },
            600: {
                items: 2,
                nav: true
            },
            1000: {
                items: 4,
                dots: false,
                nav: true
            }
        }
    });

    var mapeamentoSections = {
        'link_comocriarconta': 'link_cadastro',
        'link_comofazerlogin': 'link_login',
        'link_finalizarcadastro' : 'link_completacadastro',
        'link_comotrocarsenha': 'link_esquecisenha',
        'link_carrorevisado': 'link_inforevisao',
        'link_financiarusado': 'link_financiamentoveiculos',
        'link_testeveiculo': 'link_testedrive',
        'link_amortizarparcelas': 'link_reducaodivida',
        'link_comofunciona': 'link_servicosmanutencao',
        'link_fazemrevisao': 'link_revisaocompleta',
        'link_precisopagar': 'link_custosservicos',
        'link_siteseguro': 'link_protecaodados',
        'link_anunciosreais': 'link_verificacaoanuncios',
        'link_veiculosqualidade': 'link_garantiaqualidade',
        'link_politica': 'link_privacidade',
        'link_quemsomos': 'link_historiaempresa',
        'link_surgiuempresa': 'link_origemnetcars',
        'link_encontronaweb': 'link_redessociais',
        'link_documentoscompra': 'link_papeladanecessaria',
        'link_transferenciaveiculo': 'link_processotransferencia',
        'link_licenciamentoveiculo': 'link_regularizacaoveiculo',
        'link_falarsuporte': 'link_canaisatendimento',
        'link_horarioatendimento': 'link_funcionamentosuporte',
        'link_suportewhatsapp': 'link_atendimentowhatsapp',
        'link_ondeestamos': 'link_enderecoslojas',
        'link_horariofuncionamento': 'link_horariosvisita',
        'link_comochegar': 'link_rotasacesso',
        'link_identificargolpes': 'link_sinaisfraude',
        'link_dicasseguranca': 'link_comprasegura',
        'link_denunciargolpe': 'link_reportarproblemas',
        'link_formaspagamento': 'link_opcoespagamento',
        'link_parcelamento': 'link_creditoparcelado',
        'link_segurancapagamento': 'link_protecaofinanceira',
        'link_iabusca': 'link_buscainteligente',
        'link_iarecomendacoes': 'link_sugestoespersonalizadas',
        'link_iaprecos': 'link_analisemercado'
    };

    function atualizarFluxoFiltro(nome) {
        var nomesBonitinhos = {
            'cadastro': 'Cadastro',
            'comprar': 'Comprar',
            'seguranca': 'Segurança',
            'sobrenos': 'Sobre Nós',
            'suporte': 'Suporte',
            'evitegolpes': 'Localização',
        };
        $('#fluxo-filtro span').text(nomesBonitinhos[nome] || '');
    }

    $('.aside').hide();
    $('.sec').hide();
    $('#aside-cadastro').show();
    $('.sec-cadastro').show();
    $('#card-cadastro').addClass('ativo-ajuda2');
    atualizarFluxoFiltro('cadastro');

    // LocalStorage integração
    var savedCard = localStorage.getItem('faqCard');
    var savedTopic = localStorage.getItem('faqTopic');
    if (savedCard && savedTopic) {
        $('#card-' + savedCard).trigger('click');
        setTimeout(function () {
            $('#' + savedTopic).trigger('click');
            localStorage.removeItem('faqCard');
            localStorage.removeItem('faqTopic');
        }, 150);
    }

    $('.card-ajuda2').on('click', function () {
        $('.card-ajuda2').removeClass('ativo-ajuda2');
        $(this).addClass('ativo-ajuda2');
        $('.aside').hide();
        $('.sec').hide();
        $('.li-aside > h4.title-aside').removeClass('ativo');
        $('.ul2-aside').removeClass('aberto').hide();
        $('.li2-aside').removeClass('ativo-li2');
        $('.sections > section > div').hide();

        var cardId = $(this).attr('id');
        var nome = cardId.replace('card-', '');

        $('#aside-' + nome).show();
        $('.sec-' + nome).show();
        atualizarFluxoFiltro(nome);

        window.scrollTo(0, 350.3999938964844);

        var $asideAtual = $('#aside-' + nome);
        var $primeiroTitulo = $asideAtual.find('.title-aside').first();
        $primeiroTitulo.addClass('ativo');
        $primeiroTitulo.siblings('.ul2-aside').addClass('aberto').show();
        var $primeiroItem = $asideAtual.find('.li2-aside').first();
        $primeiroItem.addClass('ativo-li2');
        var targetDiv = mapeamentoSections[$primeiroItem.attr('id')];
        $('#' + targetDiv).show();
    });

    $('.li-aside > h4.title-aside').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $titulo = $(this);
        var $ul2 = $titulo.siblings('.ul2-aside');
        var estaAberto = $titulo.hasClass('ativo');

        if (estaAberto) {
            $titulo.removeClass('ativo');
            $ul2.removeClass('aberto').slideUp(300);
        } else {
            $('.li-aside > h4.title-aside').not($titulo).removeClass('ativo');
            $('.ul2-aside').not($ul2).removeClass('aberto').slideUp(300);
            $titulo.addClass('ativo');
            $ul2.addClass('aberto').slideDown(300);
        }
    });

    $('.li2-aside').on('click', function (e) {
        e.stopPropagation();
        $('.li2-aside').removeClass('ativo-li2');
        $(this).addClass('ativo-li2');
        $('.sections > section > div').hide();
        var linkId = $(this).attr('id');
        var targetDiv = mapeamentoSections[linkId];
        if (targetDiv) {
            $('#' + targetDiv).show();
        } else {
            var fallback = linkId.replace('link_', '');
            $('#link_' + fallback).show();
        }
    });
});
