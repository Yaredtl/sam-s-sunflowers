document.getElementById('florBtn').addEventListener('click', function() {
    const canvas = document.getElementById('florCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración del ramo de flores
    const flowers = [
        { x: canvas.width / 2, y: 90, size: 1.0, delay: 0 },
        { x: canvas.width / 2 - 80, y: 130, size: 0.8, delay: 50 },
        { x: canvas.width / 2 + 70, y: 120, size: 0.9, delay: 70 },
        { x: canvas.width / 2 - 50, y: 170, size: 0.7, delay: 90 },
        { x: canvas.width / 2 + 40, y: 180, size: 0.75, delay: 110 }
    ];

    const petalLength = 40;
    const petalWidth = 20;
    const numPetals = 14;

    // Variables para la animación
    let animationStep = 0;
    const totalSteps = 300;

    // Función para dibujar el fondo del cielo
    function drawSky() {
        // Gradiente de cielo
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#87CEEB'); // Azul cielo claro arriba
        skyGradient.addColorStop(0.6, '#B0E0E6'); // Azul muy claro en el medio
        skyGradient.addColorStop(1, '#F0F8FF'); // Casi blanco abajo
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Función para dibujar un pétalo
    function drawPetal(centerX, centerY, index, progress, size) {
        if (progress <= 0) return;
        
        const angle = (2 * Math.PI / numPetals) * index;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.scale(progress * size, progress * size);
        
        ctx.beginPath();
        ctx.ellipse(0, -(petalLength * size)/2, (petalWidth * size)/2, petalLength * size, 0, 0, 2 * Math.PI);
        
        const gradient = ctx.createRadialGradient(0, -(petalLength * size)/2, 0, 0, -(petalLength * size)/2, petalLength * size);
        gradient.addColorStop(0, '#ffed4e');
        gradient.addColorStop(0.5, '#ffd700');
        gradient.addColorStop(1, '#ffb347');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#e6ac00';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }

    // Función para dibujar el centro de una flor
    function drawFlowerCenter(centerX, centerY, progress, size) {
        if (progress <= 0) return;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(progress * size, progress * size);
        
        // Centro exterior naranja
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, 2 * Math.PI);
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
        centerGradient.addColorStop(0, '#ff8c00');
        centerGradient.addColorStop(0.7, '#ffa500');
        centerGradient.addColorStop(1, '#ff7f00');
        ctx.fillStyle = centerGradient;
        ctx.fill();

        // Centro interior marrón
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#8b4513';
        ctx.fill();

        // Puntos de semillas
        ctx.fillStyle = '#654321';
        for (let i = 0; i < 8; i++) {
            const angle = (2 * Math.PI / 8) * i;
            const dotX = Math.cos(angle) * 5;
            const dotY = Math.sin(angle) * 5;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.restore();
    }

    // Función para dibujar una flor completa
    function drawFlower(flower, overallProgress) {
        const { x, y, size, delay } = flower;
        
        // Calcular el progreso específico de esta flor
        const startTime = 0.3 + (delay / totalSteps);
        if (overallProgress < startTime) return;
        
        const flowerDuration = 0.5;
        const flowerProgress = Math.min(1, (overallProgress - startTime) / flowerDuration);
        
        // Dibujar pétalos uno por uno
        for (let i = 0; i < numPetals; i++) {
            const petalStartTime = (i / numPetals) * 0.6; // 60% del tiempo para pétalos
            const petalDuration = 0.4;
            
            if (flowerProgress > petalStartTime) {
                const petalProgress = Math.min(1, (flowerProgress - petalStartTime) / petalDuration);
                drawPetal(x, y, i, petalProgress, size);
            }
        }

        // Dibujar centro cuando la mayoría de pétalos estén listos
        if (flowerProgress > 0.5) {
            const centerProgress = Math.min(1, (flowerProgress - 0.5) / 0.5);
            drawFlowerCenter(x, y, centerProgress, size);
        }
    }

    // Función para dibujar el terreno verde
    function drawGround(progress) {
        if (progress < 0.02) return;
        
        const groundProgress = Math.min(1, (progress - 0.02) / 0.1);
        
        ctx.save();
        
        // Terreno base
        const groundHeight = 40;
        const groundY = canvas.height - groundHeight;
        
        // Gradiente para el terreno
        const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
        groundGradient.addColorStop(0, '#90EE90'); // Verde claro arriba
        groundGradient.addColorStop(0.3, '#32CD32'); // Verde medio
        groundGradient.addColorStop(1, '#228B22'); // Verde oscuro abajo
        
        ctx.fillStyle = groundGradient;
        ctx.globalAlpha = groundProgress;
        
        // Dibujar terreno con forma suave
        ctx.beginPath();
        ctx.moveTo(0, groundY + 10);
        
        // Crear ondulaciones suaves en la superficie
        const segments = 8;
        for (let i = 0; i <= segments; i++) {
            const x = (canvas.width / segments) * i;
            const variation = Math.sin((i / segments) * Math.PI * 2) * 5;
            const y = groundY + variation;
            
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                const prevX = (canvas.width / segments) * (i - 1);
                const controlX = prevX + (x - prevX) / 2;
                const controlY = y;
                ctx.quadraticCurveTo(controlX, controlY, x, y);
            }
        }
        
        // Completar el rectángulo del terreno
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Pequeñas briznas de hierba
        if (groundProgress > 0.7) {
            const grassProgress = (groundProgress - 0.7) / 0.3;
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 1;
            ctx.globalAlpha = grassProgress;
            
            // Dibujar pequeñas briznas de hierba
            for (let i = 0; i < 15; i++) {
                const x = (canvas.width / 16) * (i + 1) + (Math.random() - 0.5) * 20;
                const baseY = groundY + Math.sin((i / 15) * Math.PI * 2) * 5;
                const height = 8 + Math.random() * 8;
                
                ctx.beginPath();
                ctx.moveTo(x, baseY);
                ctx.lineTo(x + (Math.random() - 0.5) * 4, baseY - height);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    // Función para dibujar los tallos
    function drawStems(progress) {
        if (progress < 0.05) return;
        
        const stemProgress = Math.min(1, (progress - 0.05) / 0.25);
        
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Punto de unión del ramo
        const bundleX = canvas.width / 2;
        const bundleY = canvas.height - 30;

        // Dibujar cada tallo individualmente
        flowers.forEach((flower, index) => {
            if (stemProgress > 0) {
                ctx.beginPath();
                
                // Punto de inicio (debajo de la flor)
                const startX = flower.x;
                const startY = flower.y + (20 * flower.size);
                
                // Punto final (en el ramo)
                const endX = bundleX + (index - 2) * 5;
                const endY = bundleY;
                
                // Calcular la longitud del tallo basada en el progreso
                const totalLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const currentLength = totalLength * stemProgress;
                
                // Calcular punto actual del tallo
                const ratio = currentLength / totalLength;
                const currentX = startX + (endX - startX) * ratio;
                const currentY = startY + (endY - startY) * ratio;
                
                // Dibujar el tallo
                ctx.moveTo(startX, startY);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            }
        });
    }

    // Animación principal
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const progress = animationStep / totalSteps;

        // 1. Dibujar fondo del cielo primero
        drawSky();

        // 2. Dibujar terreno
        drawGround(progress);

        // 3. Dibujar tallos
        drawStems(progress);

        // 4. Dibujar flores
        flowers.forEach(flower => {
            drawFlower(flower, progress);
        });

        // Continuar animación
        if (animationStep < totalSteps) {
            animationStep++;
            requestAnimationFrame(animate);
        }
    }

    // Iniciar animación
    animate();
});




