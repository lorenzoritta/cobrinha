
$().ready(function () {
    var canvas = $("#quadro")[0];
    var ctx = canvas.getContext("2d");
    var colisao = false;
    var tamanhoSegmento = 15;
    var pontuacao = 0;

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

    var obj2 = {
        "vx": 0,
        "vy": 0,
        "x": canvas.width / 2,
        "y": canvas.height / 2,
        "l": tamanhoSegmento,
        "a": tamanhoSegmento,
        "cor": "pink",
        atualiza: function () {
            this.x += this.vx;
            this.y += this.vy;
        },
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

    function apagarTela() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function detectaLimite(obj) {
        if (obj.x < 0) {
            obj.x = 0;
            obj.vx = 0;
            return true;
        }
        if (obj.y < 0) {
            obj.y = 0;
            obj.vy = 0;
            return true;
        }
        if (obj.x + obj.l > canvas.width) {
            obj.x = canvas.width - obj.l;
            obj.vx = 0;
            return true;
        }
        if (obj.y + obj.a > canvas.height) {
            obj.y = canvas.height - obj.a;
            obj.vy = 0;
            return true;
        }
        return false;
        
    }

    function desenharTela() {
        apagarTela();

        // Atualiza a posição da cauda (do fim até a cabeça)
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i].x = snake[i - 1].x;
            snake[i].y = snake[i - 1].y;
        }

        // Atualiza a cabeça
        snake[0].x += snake[0].vx;
        snake[0].y += snake[0].vy;

        detectaColisao(snake[0], obj2);

        if (colisao == true) {
            pontuacao++;
            // Adiciona novo segmento na posição da cauda
            let ultimo = snake[snake.length - 1];
            snake.push({
                x: ultimo.x,
                y: ultimo.y,
                l: tamanhoSegmento,
                a: tamanhoSegmento,
                cor: "blue"
            });

            // Move obj2 para nova posição
            obj2.x = Math.random() * (canvas.width - obj2.l);
            obj2.y = Math.random() * (canvas.height - obj2.a);
        }

        var gameover = detectaLimite(snake[0]);

        // Desenha todos os segmentos da snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = snake[i].cor;
            ctx.fillRect(snake[i].x, snake[i].y, snake[i].l, snake[i].a);
        }

        // Desenha o objeto alvo
        obj2.desenharObjeto();
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText("Pontuação: " + pontuacao, 10, 20);


        if(!gameover){
            requestAnimationFrame(desenharTela);
        }
    }

    // Movimentação da cabeça
    $(window).keydown(function (event) {
        if (event.which == 37) { // esquerda
            snake[0].vx = -2;
            snake[0].vy = 0;
        }
        if (event.which == 39) { // direita
            snake[0].vx = 2;
            snake[0].vy = 0;
        }
        if (event.which == 38) { // cima
            snake[0].vy = -2;
            snake[0].vx = 0;
        }
        if (event.which == 40) { // baixo
            snake[0].vy = 2;
            snake[0].vx = 0;
        }
    });

    // Inicia a animação
    desenharTela();
});