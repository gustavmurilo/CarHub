$(document).ready(function() {
    // Definindo personalidades e 5 diálogos por seção
    const dialogosMascotes = {
        // Seção Cadastro - Criar Conta
        'cadastro-criar': {
            leo: [
                "Opa! Criar conta é super fácil! Eu mesmo me cadastrei em segundos! 😎",
                "Partiu se cadastrar! É só seguir o passo a passo que já era! 🚀",
                "Cadastro na NetCars é moleza! Vem comigo que eu te ajudo! 💪",
                "Ei, cadastrar aqui é rapidinho! Menos de 2 minutos e você tá dentro! ⚡",
                "Bora criar sua conta! É só clicar e pronto, você faz parte da família! 🎉"
            ],
            luna: [
                "Lembre-se de usar uma senha forte! Segurança sempre em primeiro lugar! 🔐",
                "Preencha todos os dados corretamente. Sua segurança depende disso! 📋",
                "Dica importante: use um e-mail válido para receber todas as atualizações! 📧",
                "Mantenha seus dados atualizados para uma experiência mais segura! ✨",
                "Verifique se todas as informações estão corretas antes de finalizar! ✅"
            ]
        },

        // Seção Cadastro - Login
        'cadastro-login': {
            leo: [
                "Login rapidinho e já era! Partiu navegar pela NetCars! 🚗",
                "Opa, bem-vindo de volta! Que bom te ver aqui novamente! 👋",
                "Login feito! Agora é só escolher seu carro dos sonhos! 🏎️",
                "E aí, pronto pra encontrar seu próximo carro? Vamos nessa! 🔥",
                "Logado com sucesso! Hora de explorar nossas ofertas incríveis! 🌟"
            ],
            luna: [
                "Sempre verifique se está no site oficial antes de fazer login! ✨",
                "Nunca salve senhas em computadores públicos. Sua segurança é importante! 🛡️",
                "Dica: se esqueceu a senha, use sempre a opção oficial de recuperação! 🔑",
                "Lembre-se de fazer logout ao sair, especialmente em dispositivos compartilhados! 🚪",
                "Mantenha sua sessão segura. Não compartilhe seus dados de acesso! 🔒"
            ]
        },

        // Seção Cadastro - Esqueci Senha
        'cadastro-senha': {
            leo: [
                "Relaxa! Recuperar senha aqui é super tranquilo! Já já você tá de volta! 😄",
                "Opa, esqueceu a senha? Sem stress! Vou te ajudar a recuperar rapidinho! 💡",
                "Acontece com todo mundo! Vamos resolver isso em alguns cliques! 🔧",
                "Ei, sem pânico! O processo de recuperação é bem simples e seguro! 😌",
                "Bora lá! Em poucos passos você já vai estar logado novamente! ⚡"
            ],
            luna: [
                "Siga os passos de segurança. Verifique seu e-mail cuidadosamente! 📨",
                "Dica importante: confira se o e-mail está digitado corretamente! ✍️",
                "Use uma nova senha forte e diferente das anteriores! 🔐",
                "Guarde sua nova senha em local seguro ou use um gerenciador confiável! 🗝️",
                "Após recuperar, considere ativar autenticação em dois fatores! 🛡️"
            ]
        },

        // Seção Cadastro - Completar
        'cadastro-completar': {
            leo: [
                "Quase lá! Completar o cadastro libera todas as funções legais! 🎯",
                "Vai, finaliza logo! Tá quase pronto pra aproveitar tudo aqui! 🏁",
                "Opa! Só mais alguns dados e você desbloqueia o modo completo! 🔓",
                "Vamos terminar isso! Cadastro completo = experiência completa! ✨",
                "Tá quase! Finalizar o cadastro te dá acesso a ofertas exclusivas! 💎"
            ],
            luna: [
                "Complete todas as informações para maior segurança nas transações! 📝",
                "Dados completos garantem um atendimento mais personalizado! 🎯",
                "Preencha com atenção. Informações corretas evitam problemas futuros! ⚠️",
                "Cadastro completo te dá acesso a todas as funcionalidades da plataforma! 🔑",
                "Mantenha sempre seus dados atualizados em nosso sistema! 🔄"
            ]
        },

        // Seção Comprar - Obter Veículo
        'comprar-veiculo': {
            leo: [
                "Cara, que massa! Comprar carro nunca foi tão fácil! 🎉",
                "Opa! Escolher seu carro aqui é uma experiência incrível! 🚗",
                "Que demais! Nosso catálogo tá recheado de carros tops! 🌟",
                "Ei, vai encontrar o carro perfeito aqui, pode apostar! 🎯",
                "Bora escolher seu próximo carro! Temos opções pra todos os gostos! 🔥"
            ],
            luna: [
                "Analise bem as características antes de decidir. Cada detalhe importa! 🔍",
                "Verifique o histórico completo do veículo antes da compra! 📋",
                "Compare diferentes opções para fazer a melhor escolha! ⚖️",
                "Leia atentamente todas as informações técnicas do veículo! 📖",
                "Considere seu orçamento e necessidades antes de decidir! 💰"
            ]
        },

        // Seção Comprar - Pagamento
        'comprar-pagamento': {
            leo: [
                "PIX é vida! Rápido, prático e sem complicação! 💰",
                "Opa! Temos várias formas de pagamento pra facilitar sua vida! 💳",
                "Escolhe aí! À vista ou parcelado, do jeito que for melhor pra você! 😎",
                "Pagamento aqui é tranquilão! Processo super seguro e rápido! ⚡",
                "Bora finalizar! Sistema de pagamento é confiável e protegido! 🛡️"
            ],
            luna: [
                "Escolha a forma de pagamento que melhor se adequa ao seu orçamento! 💳",
                "Analise bem as condições de parcelamento antes de decidir! 📊",
                "Verifique todas as taxas e valores antes de confirmar a compra! 🔍",
                "Guarde sempre o comprovante de pagamento para sua segurança! 📄",
                "Em caso de dúvidas sobre pagamento, consulte nosso suporte! 🤝"
            ]
        },

        // Seção Comprar - Amortização
        'comprar-amortizacao': {
            leo: [
                "Opa! Amortizar parcelas é genial pra economizar nos juros! 💡",
                "Cara, que inteligente! Pagando antecipado você sai no lucro! 📈",
                "Demais! Reduzir parcelas é estratégia de mestre! 🎯",
                "Ei, amortizar é o caminho pra quitar mais rápido! 🏃‍♂️",
                "Show! Economia de juros é sempre uma vitória! 🏆"
            ],
            luna: [
                "Calcule bem o impacto financeiro antes de amortizar parcelas! 🧮",
                "Considere sua reserva de emergência antes de usar o dinheiro! 💰",
                "Amortização reduz juros, mas analise sua situação financeira! 📊",
                "Planeje bem: amortizar pode ser muito vantajoso a longo prazo! 📅",
                "Consulte as condições específicas do seu financiamento! 📋"
            ]
        },

        // Seção Segurança - LGPD
        'seguranca-lgpd': {
            leo: [
                "Seus dados estão seguros aqui, pode confiar! 💪",
                "Opa! LGPD em dia! Seus dados são tratados com total respeito! 🛡️",
                "Tranquilo! Aqui sua privacidade é sagrada! 🔐",
                "Ei, pode ficar sossegado! Seus dados tão protegidos demais! 😌",
                "Show! Transparência e proteção de dados é nosso compromisso! ✨"
            ],
            luna: [
                "LGPD em dia! Transparência e proteção são nossas prioridades! 🛡️",
                "Seus dados pessoais são tratados com máxima segurança! 🔒",
                "Você tem controle total sobre suas informações pessoais! 🎛️",
                "Consulte nossa política de privacidade para mais detalhes! 📋",
                "Em caso de dúvidas sobre dados, nosso DPO está disponível! 👥"
            ]
        },

        // Seção Segurança - Anúncios
        'seguranca-anuncios': {
            leo: [
                "Todos os anúncios são verificados! Pode confiar de olhos fechados! 👀",
                "Cara, nossa equipe confere tudo antes de publicar! 🔍",
                "Opa! Zero golpe aqui! Tudo checado e aprovado! ✅",
                "Ei, anúncios fake? Aqui não! Nossa moderação é rígida! 🚫",
                "Relaxa! Cada anúncio passa por uma análise criteriosa! 🕵️‍♂️"
            ],
            luna: [
                "Todos os anúncios passam por rigorosa verificação de autenticidade! 🔍",
                "Nossa equipe analisa documentos e histórico antes da publicação! 📋",
                "Fique atento a preços muito abaixo do mercado! ⚠️",
                "Sempre verifique informações diretamente em nossa plataforma! 🔒",
                "Em caso de suspeita, reporte imediatamente ao nosso suporte! 🚨"
            ]
        },

        // Seção Segurança - Proteger Dados
        'seguranca-proteger': {
            leo: [
                "Opa! Proteger dados é moleza! Vou te dar umas dicas incríveis! 💡",
                "Bora ser esperto com segurança digital! É fácil e importante! 🧠",
                "Ei, algumas dicas simples e você fica protegido demais! 🛡️",
                "Cara, segurança digital não é complicado! Vou te ajudar! 🤝",
                "Show! Com essas dicas você vai ser um ninja da segurança! 🥷"
            ],
            luna: [
                "Mantenha sempre senhas seguras e exclusivas para cada conta! 🔐",
                "Ative autenticação em dois fatores sempre que possível! 📱",
                "Nunca compartilhe informações pessoais por links suspeitos! ⚠️",
                "Monitore regularmente suas contas e atividades online! 👁️",
                "Use apenas redes Wi-Fi seguras para transações importantes! 📶"
            ]
        },

        // Seção Segurança - Política
        'seguranca-politica': {
            leo: [
                "Nossa política é clara e transparente! Dá uma conferida! 📖",
                "Opa! Tudo explicadinho na nossa política de privacidade! 📄",
                "Cara, lê lá que tá tudo detalhado! Transparência total! 🔍",
                "Ei, nossa política é bem direta! Sem pegadinhas! ✨",
                "Show! Política clara = confiança garantida! 🤝"
            ],
            luna: [
                "Leia atentamente nossa política de privacidade completa! 📋",
                "Mantenha-se informado sobre como seus dados são utilizados! 📊",
                "Você pode solicitar alterações ou exclusão de dados a qualquer momento! 🔄",
                "Nossa política está sempre disponível e atualizada! ⚡",
                "Para dúvidas específicas, consulte nosso time jurídico! ⚖️"
            ]
        },

        // Seção Sobre Nós - Quem Somos
        'sobrenos-quem': {
            leo: [
                "Somos uma equipe incrível! SAGA SENAI foi demais! 🏆",
                "Cara, que time massa! Galera apaixonada por tecnologia! 🚀",
                "Opa! Nascemos no SENAI e agora estamos mudando o mercado! 💪",
                "Ei, somos jovens, criativos e cheios de energia! ⚡",
                "Show! Equipe dos sonhos construindo o futuro dos carros! 🌟"
            ],
            luna: [
                "Tecnologia e inovação para revolucionar o mercado automotivo! 🚀",
                "Nossa missão é simplificar a experiência de compra de veículos! 🎯",
                "Combinamos expertise técnica com atendimento humanizado! 🤝",
                "Desenvolvemos soluções pensando sempre na segurança do usuário! 🛡️",
                "Nosso compromisso é com transparência e qualidade em tudo! ✨"
            ]
        },

        // Seção Sobre Nós - Trajetória
        'sobrenos-trajetoria': {
            leo: [
                "Cara, que jornada! Do SENAI pro mercado! História incrível! 📚",
                "Opa! SAGA SENAI foi só o começo da nossa aventura! 🎢",
                "Ei, que evolução! De estudantes a empreendedores! 🎓",
                "Show! Nossa história começou com um sonho e muito código! 💻",
                "Demais! Do laboratório do SENAI pra revolucionar o mercado! 🔬"
            ],
            luna: [
                "Nossa trajetória é baseada em aprendizado contínuo e inovação! 📈",
                "Cada etapa foi fundamental para nosso crescimento técnico! 🔧",
                "O SAGA SENAI foi o catalisador da nossa jornada empreendedora! 🚀",
                "Aplicamos conhecimento acadêmico em soluções práticas reais! 🎯",
                "Nossa evolução reflete dedicação aos estudos e à tecnologia! 📖"
            ]
        },

        // Seção Suporte - Contatar
        'suporte-contatar': {
            leo: [
                "Tá com dúvida? Nossa equipe é tops, vai te ajudar na hora! 🤝",
                "Opa! Qualquer coisa, só chamar! Estamos aqui pra isso! 📞",
                "Cara, nosso suporte é show! Galera super prestativa! 😊",
                "Ei, não fica na dúvida! Chama a gente que resolve rapidinho! ⚡",
                "Bora conversar! Nosso time adora ajudar vocês! 💬"
            ],
            luna: [
                "Atendimento humanizado é nosso diferencial! Estamos sempre aqui! 💬",
                "Escolha o canal mais conveniente para seu tipo de solicitação! 📋",
                "Nossa equipe está treinada para resolver suas questões rapidamente! 🎯",
                "Mantenha sempre seus dados de contato atualizados! 📞",
                "Para emergências, utilize nossos canais prioritários! 🚨"
            ]
        },

        // Seção Suporte - Horário
        'suporte-horario': {
            leo: [
                "Nossos horários são super flexíveis! Sempre tem alguém pra ajudar! ⏰",
                "Opa! Atendimento em vários canais e horários! Facilita, né? 📅",
                "Cara, WhatsApp 24h! Sem stress pra falar com a gente! 📱",
                "Ei, nossos horários são pensados pra sua comodidade! 🕐",
                "Show! Sempre tem um jeitinho de te atender! 😄"
            ],
            luna: [
                "Consulte nossos horários específicos para cada canal de atendimento! ⏰",
                "Respeite os horários para garantir resposta mais rápida! 📅",
                "Fora do horário comercial, utilize canais assíncronos! 📧",
                "Planeje seu contato de acordo com a urgência da solicitação! 📋",
                "Para melhor atendimento, tenha em mãos informações relevantes! 📄"
            ]
        },

        // Seção Localização
        'localizacao': {
            leo: [
                "Vem conhecer nossa sede! Tem até café pra quem vier visitar! ☕",
                "Opa! Nossa localização é estratégica e fácil de chegar! 📍",
                "Cara, que lugar bacana! Infraestrutura completa pra te receber! 🏢",
                "Ei, passa lá! A galera adora receber visitas! 👋",
                "Show! Localização pensada pra facilitar sua vida! 🌟"
            ],
            luna: [
                "Transparência total! Nossa localização está sempre disponível! 📍",
                "Agende sua visita para um atendimento mais personalizado! 📅",
                "Nossa sede oferece toda infraestrutura para atendimento presencial! 🏢",
                "Verifique nossos horários de funcionamento antes da visita! ⏰",
                "Para visitas técnicas, entre em contato previamente! 📞"
            ]
        }
    };

    // Configurações
    const INTERVALO_ROTACAO = 30000; // 30 segundos
    let intervalos = {}; // Armazena os intervalos de cada seção
    let indicesAtuais = {}; // Armazena o índice atual de cada seção

    // Função para detectar a seção e subseção ativa
    function detectarSecaoAtiva() {
        const $secoes = $('.sec');
        let $secaoVisivel = null;
        
        $secoes.each(function() {
            const rect = this.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                $secaoVisivel = $(this);
            }
        });
        
        if (!$secaoVisivel) return null;
        
        // Detecta subseção com base no elemento visível
        const $divsVisiveis = $secaoVisivel.find('[id^="link_"]:not([style*="display: none"])');
        let subSecao = '';
        
        $divsVisiveis.each(function() {
            const $div = $(this);
            if ($div.is(':visible')) { // Elemento visível
                const id = $div.attr('id').replace('link_', '');
                
                // Mapeia IDs para categorias
                const mapeamento = {
                    // Cadastro
                    'cadastro': 'cadastro-criar',
                    'comocriarconta': 'cadastro-criar',
                    'login': 'cadastro-login', 
                    'comofazerlogin': 'cadastro-login',
                    'esquecisenha': 'cadastro-senha',
                    'comotrocarsenha': 'cadastro-senha',
                    'completacadastro': 'cadastro-completar',
                    'finalizarcadastro': 'cadastro-completar',
                    
                    // Comprar
                    'inforevisao': 'comprar-veiculo',
                    'carrorevisado': 'comprar-veiculo',
                    'financiamentoveiculos': 'comprar-pagamento',
                    'financiarusado': 'comprar-pagamento',
                    'reducaodivida': 'comprar-amortizacao',
                    'amortizarparcelas': 'comprar-amortizacao',
                    
                    // Segurança
                    'protecaodados': 'seguranca-lgpd',
                    'siteseguro': 'seguranca-lgpd',
                    'verificacaoanuncios': 'seguranca-anuncios',
                    'anunciosreais': 'seguranca-anuncios',
                    'garantiaqualidade': 'seguranca-proteger',
                    'veiculosqualidade': 'seguranca-proteger',
                    'privacidade': 'seguranca-politica',
                    'politica': 'seguranca-politica',
                    
                    // Sobre nós
                    'historiaempresa': 'sobrenos-quem',
                    'quemsomos': 'sobrenos-quem',
                    'origemnetcars': 'sobrenos-trajetoria',
                    'encontronaweb': 'sobrenos-trajetoria',
                    'redessociais': 'sobrenos-trajetoria',
                    
                    // Suporte
                    'canaisatendimento': 'suporte-contatar',
                    'falarsuporte': 'suporte-contatar',
                    'funcionamentosuporte': 'suporte-horario',
                    'horarioatendimento': 'suporte-horario',
                    
                    // Localização
                    'sinaisfraude': 'localizacao',
                    'identificargolpes': 'localizacao'
                };
                
                if (mapeamento[id]) {
                    subSecao = mapeamento[id];
                }
            }
        });
        
        return subSecao || 'cadastro-criar'; // Fallback
    }

    // Função para atualizar diálogos
    function atualizarDialogos(secao) {
        if (!dialogosMascotes[secao]) return;
        
        // Inicializa índice se não existir
        if (!indicesAtuais[secao]) {
            indicesAtuais[secao] = 0;
        }
        
        const dialogos = dialogosMascotes[secao];
        const indice = indicesAtuais[secao];
        
        // Busca todos os balões na página
        const $baloesLeo = $('.leo-texto');
        const $baloesLuna = $('.luna-texto');
        
        // Efeito de transição
        $baloesLeo.addClass('changing');
        $baloesLuna.addClass('changing');
        
        setTimeout(() => {
            // Atualiza textos
            $baloesLeo.each(function() {
                $(this).text(dialogos.leo[indice]).removeClass('changing');
            });
            
            $baloesLuna.each(function() {
                $(this).text(dialogos.luna[indice]).removeClass('changing');
            });
            
            // Força reflow para animação
            $('.balao-conteudo').each(function() {
                const $balao = $(this);
                $balao.css('animation', 'none');
                $balao[0].offsetHeight; // Trigger reflow
                $balao.css('animation', 'fadeInText 0.5s ease');
            });
        }, 300);
        
        // Avança para próximo diálogo
        indicesAtuais[secao] = (indice + 1) % dialogos.leo.length;
    }

    // Função para iniciar rotação automática
    function iniciarRotacaoAutomatica() {
        const secaoAtual = detectarSecaoAtiva();
        if (!secaoAtual) return;
        
        // Para intervalos anteriores
        $.each(intervalos, function(key, intervalo) {
            clearInterval(intervalo);
        });
        intervalos = {};
        
        // Atualiza imediatamente
        atualizarDialogos(secaoAtual);
        
        // Inicia novo intervalo
        intervalos[secaoAtual] = setInterval(() => {
            const secaoAtiva = detectarSecaoAtiva();
            if (secaoAtiva === secaoAtual) {
                atualizarDialogos(secaoAtual);
            } else {
                clearInterval(intervalos[secaoAtual]);
                delete intervalos[secaoAtual];
                iniciarRotacaoAutomatica();
            }
        }, INTERVALO_ROTACAO);
    }

    // Observer para detectar mudanças de seção (usando jQuery + Intersection Observer)
    function observarMudancasSecao() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                $.each(entries, function(index, entry) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        setTimeout(iniciarRotacaoAutomatica, 500);
                    }
                });
            }, { 
                threshold: 0.5,
                rootMargin: '0px 0px -20% 0px'
            });
            
            // Observa todas as seções
            $('.sec').each(function() {
                observer.observe(this);
            });
        } else {
            // Fallback para navegadores sem IntersectionObserver
            $(window).on('scroll resize', function() {
                setTimeout(iniciarRotacaoAutomatica, 100);
            });
        }
    }

    // Observer para detectar mudanças de conteúdo dentro das seções (usando jQuery + MutationObserver)
    function observarMudancasConteudo() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(() => {
                setTimeout(iniciarRotacaoAutomatica, 100);
            });
            
            // Observa mudanças nos estilos (display: none/block)
            $('[id^="link_"]').each(function() {
                observer.observe(this, {
                    attributes: true,
                    attributeFilter: ['style']
                });
            });
        } else {
            // Fallback para navegadores sem MutationObserver
            $('[id^="link_"]').on('DOMAttrModified propertychange', function() {
                setTimeout(iniciarRotacaoAutomatica, 100);
            });
        }
    }

    // Inicialização principal
    function inicializar() {
        // Aguarda carregamento completo da página
        setTimeout(() => {
            iniciarRotacaoAutomatica();
            observarMudancasSecao();
            observarMudancasConteudo();
        }, 1000);
    }

    // Event Handlers
    $(window).on('focus', iniciarRotacaoAutomatica);
    
    $(window).on('hashchange', () => {
        setTimeout(iniciarRotacaoAutomatica, 500);
    });

    // Detecta mudanças no DOM que podem afetar a visibilidade das seções
    $(document).on('click', '[id^="link_"], .title-aside, .li2-aside', function() {
        setTimeout(iniciarRotacaoAutomatica, 300);
    });

    // Detecta mudanças nos elementos show/hide que podem ser controlados por JavaScript
    $(document).on('DOMNodeInserted DOMNodeRemoved', function() {
        setTimeout(iniciarRotacaoAutomatica, 200);
    });

    // Inicializa o sistema
    inicializar();

    // Método público para controle manual (opcional)
    window.MascotesDialogo = {
        reiniciar: iniciarRotacaoAutomatica,
        pausar: function() {
            $.each(intervalos, function(key, intervalo) {
                clearInterval(intervalo);
            });
            intervalos = {};
        },
        alterarIntervalo: function(novoIntervalo) {
            INTERVALO_ROTACAO = novoIntervalo;
            iniciarRotacaoAutomatica();
        }
    };
});


// FALE CONOSCO ABAIXO

