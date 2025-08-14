$().ready(function () {
    var canvas = $("#quadro")[0];
    var ctx = canvas.getContext("2d");
    var tamanhoSegmento = 15;
    var colisao = false;
    var pontuacao = 0;
    var gameOver = false;

    // Velocidade da snake (em ms)
    var velocidade = 100;

    // Cobra: primeiro elemento é a cabeça
    var snake = [{
        x: 50,
        y: 50,
        l: tamanhoSegmento,
        a: tamanhoSegmento,
        cor: "blue",
        vx: 0,
        vy: 0
    }];

    // Objeto que a cobra deve comer
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
    }

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

    function detectaLimite(obj) {
        if (obj.x < 0) { obj.x = 0; obj.vx = 0; }
        if (obj.y < 0) { obj.y = 0; obj.vy = 0; }
        if (obj.x + obj.l > canvas.width) { obj.x = canvas.width - obj.l; obj.vx = 0; }
        if (obj.y + obj.a > canvas.height) { obj.y = canvas.height - obj.a; obj.vy = 0; }
    }

    function apagarTela() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Detecta colisão da cabeça com a própria cobra
    function detectaColisaoCobra() {
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                gameOver = true;
            }
        }
    }

    function desenharTela() {
        apagarTela();

        if (!gameOver) {
            // Atualiza os segmentos da cauda
            for (let i = snake.length - 1; i > 0; i--) {
                snake[i].x = snake[i - 1].x;
                snake[i].y = snake[i - 1].y;
            }

            // Atualiza a cabeça
            snake[0].x += snake[0].vx;
            snake[0].y += snake[0].vy;

            detectaColisao(snake[0], obj2);
            detectaColisaoCobra();

            if (colisao) {
                let ultimo = snake[snake.length - 1];
                snake.push({
                    x: ultimo.x,
                    y: ultimo.y,
                    l: tamanhoSegmento,
                    a: tamanhoSegmento,
                    cor: "blue"
                });
                pontuacao++;

                // Move obj2 para nova posição alinhada à grade
                obj2.x = Math.floor(Math.random() * (canvas.width / tamanhoSegmento)) * tamanhoSegmento;
                obj2.y = Math.floor(Math.random() * (canvas.height / tamanhoSegmento)) * tamanhoSegmento;
            }

            detectaLimite(snake[0]);

            // Desenha a cobra
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = snake[i].cor;
                ctx.fillRect(snake[i].x, snake[i].y, snake[i].l, snake[i].a);
                
            }

            // Desenha o objeto
            obj2.desenharObjeto();

            // Pontuação
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("Pontuação: " + pontuacao, 10, 20);

        } else {
            // Game Over
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
            ctx.font = "20px Arial";
            ctx.fillText("Pontuação final: " + pontuacao, canvas.width / 2 - 70, canvas.height / 2 + 30);
        }
    }

    // Controle da cabeça da cobra
    $(window).keydown(function (event) {
        if (!gameOver) {
            if (event.which == 37 && snake[0].vx === 0) { // esquerda
                snake[0].vx = -tamanhoSegmento;
                snake[0].vy = 0;
            }
            if (event.which == 39 && snake[0].vx === 0) { // direita
                snake[0].vx = tamanhoSegmento;
                snake[0].vy = 0;
            }
            if (event.which == 38 && snake[0].vy === 0) { // cima
                snake[0].vy = -tamanhoSegmento;
                snake[0].vx = 0;
            }
            if (event.which == 40 && snake[0].vy === 0) { // baixo
                snake[0].vy = tamanhoSegmento;
                snake[0].vx = 0;
            }
        }
    });

    // Inicia o loop do jogo com velocidade controlada
    setInterval(desenharTela, velocidade);
});
