$().ready(function () {
    var canvas = $("#quadro")[0];
    var ctx = canvas.getContext("2d");
    var tamanhoSegmento = 15;
    var pontuacao = 0;

    // Cobra (primeiro segmento é a cabeça)
    var snake = [{
        x: 50,
        y: 50,
        l: tamanhoSegmento,
        a: tamanhoSegmento,
        cor: "blue",
        vx: 0,
        vy: 0
    }];

    // Isca
    var obj2 = {
        vx: 0,
        vy: 0,
        x: canvas.width / 2,
        y: canvas.height / 2,
        l: tamanhoSegmento,
        a: tamanhoSegmento,
        cor: "pink",
        desenharObjeto: function () {
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.l, this.a);
        }
    };

    // Detecta colisão entre cabeça da cobra e a isca
    var colisao = false;
    function detectaColisao(o1, o2) {
        var top1 = o1.y;
        var top2 = o2.y;
        var esq1 = o1.x;
        var esq2 = o2.x;
        var dir1 = o1.x + o1.l;
        var dir2 = o2.x + o2.l;
        var base1 = o1.y + o1.a;
        var base2 = o2.y + o2.a;

        if (base1 > top2 && dir1 > esq2 && base2 > top1 && dir2 > esq1) {
            colisao = true;
        } else {
            colisao = false;
        }
    }

    // Detecta se a cabeça saiu da tela
    function detectaLimite(obj) {
        return obj.x < 0 || obj.y < 0 || obj.x + obj.l > canvas.width || obj.y + obj.a > canvas.height;
    }

    // ✅ Verifica se a cabeça colidiu com o corpo
    function verificaAutoColisao() {
        let cabeca = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (cabeca.x === snake[i].x && cabeca.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // Limpa o canvas
    function apagarTela() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // ✅ Controle de velocidade
    var ultimoTempoAtualizacao = 0;
    var intervaloAtualizacao = 120;

    // Loop principal do jogo
    function desenharTela(tempoAtual) {
        requestAnimationFrame(desenharTela);

        if (tempoAtual - ultimoTempoAtualizacao < intervaloAtualizacao) {
            return;
        }
        ultimoTempoAtualizacao = tempoAtual;

        apagarTela();

        // Move o corpo da cobra
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i].x = snake[i - 1].x;
            snake[i].y = snake[i - 1].y;
        }

        // Move a cabeça
        snake[0].x += snake[0].vx;
        snake[0].y += snake[0].vy;

        // Colisão com a isca
        detectaColisao(snake[0], obj2);
        if (colisao) {
            pontuacao++;

            // Adiciona novo segmento na posição do último
            let ultimo = snake[snake.length - 1];
            snake.push({
                x: ultimo.x,
                y: ultimo.y,
                l: tamanhoSegmento,
                a: tamanhoSegmento,
                cor: "blue"
            });

            // Nova posição da isca (alinhada ao grid)
            obj2.x = Math.floor(Math.random() * (canvas.width / 15)) * 15;
            obj2.y = Math.floor(Math.random() * (canvas.height / 15)) * 15;
        }

        // ✅ Verifica se o jogo acabou
        var gameover = detectaLimite(snake[0]) || verificaAutoColisao();

        if (!gameover) {
            // Desenha a cobra
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = snake[i].cor;
                ctx.fillRect(snake[i].x, snake[i].y, snake[i].l, snake[i].a);
            }

            // Desenha a isca
            obj2.desenharObjeto();

            // Pontuação
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("Pontuação: " + pontuacao, 10, 20);
        } else {
            // ✅ Tela de Game Over
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
            ctx.font = "20px Arial";
            ctx.fillText("Pontuação final: " + pontuacao, canvas.width / 2 - 90, canvas.height / 2 + 40);
            return;
        }
    }

    // Teclas de movimento
    $(window).keydown(function (event) {
        if (event.which == 37 && snake[0].vx !== 15) { // esquerda
            snake[0].vx = -15;
            snake[0].vy = 0;
        }
        if (event.which == 39 && snake[0].vx !== -15) { // direita
            snake[0].vx = 15;
            snake[0].vy = 0;
        }
        if (event.which == 38 && snake[0].vy !== 15) { // cima
            snake[0].vy = -15;
            snake[0].vx = 0;
        }
        if (event.which == 40 && snake[0].vy !== -15) { // baixo
            snake[0].vy = 15;
            snake[0].vx = 0;
        }
    });

    // Inicia o jogo
    requestAnimationFrame(desenharTela);
});
