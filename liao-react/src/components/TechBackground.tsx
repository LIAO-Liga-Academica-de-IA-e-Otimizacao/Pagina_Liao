import React, { useEffect, useRef } from 'react';

interface TechBackgroundProps {
    colors?: string[];
    backgroundColor?: string;
    mode?: 'fixed' | 'absolute';
    opacity?: number;
}

const TechBackground: React.FC<TechBackgroundProps> = ({
    colors = ['#4cc9f0', '#0b132b', '#00f5d4'],
    backgroundColor = '#050a14',
    mode = 'fixed',
    opacity = 1
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const maxSpeed = 0.6; // Limits the chaos
        const boundaryMargin = 100; // Distance from edge to start turning
        const turnSpeed = 0.05; // How fast they turn away from edges

        // Resize handling
        const resizeCanvas = () => {
            if (mode === 'absolute' && canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            wanderAngle: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;

                // Initial gentle velocity
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * maxSpeed;
                this.vy = Math.sin(angle) * maxSpeed;

                this.size = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.wanderAngle = Math.random() * Math.PI * 2;
            }

            update() {
                // Organic Wander Force
                // Changes the angle slightly every frame for fluidity like a swimming fish/organism
                this.wanderAngle += (Math.random() - 0.5) * 0.2; // Wiggle range

                // Add wander vector to velocity
                const wanderWeight = 0.05;
                this.vx += Math.cos(this.wanderAngle) * wanderWeight;
                this.vy += Math.sin(this.wanderAngle) * wanderWeight;

                // Soft Boundary (Steering) - Avoid walls smoothly
                if (this.x < boundaryMargin) this.vx += turnSpeed;
                if (this.x > canvas!.width - boundaryMargin) this.vx -= turnSpeed;
                if (this.y < boundaryMargin) this.vy += turnSpeed;
                if (this.y > canvas!.height - boundaryMargin) this.vy -= turnSpeed;

                // Speed Limit (Damping)
                // Keeps them stable, preventing infinite acceleration
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }

                // Apply velocity
                this.x += this.vx;
                this.y += this.vy;

                // Hard clamp just in case (e.g. resize) to keep them on screen
                // But try not to hit this in normal flow to avoid "teleporting"
                if (this.x < 0) this.x = 0;
                if (this.x > canvas!.width) this.x = canvas!.width;
                if (this.y < 0) this.y = 0;
                if (this.y > canvas!.height) this.y = canvas!.height;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Background
            if (backgroundColor !== 'transparent') {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Update & Draw
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                // Connections
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        const gradient = ctx.createLinearGradient(particle.x, particle.y, particles[j].x, particles[j].y);
                        gradient.addColorStop(0, particle.color);
                        gradient.addColorStop(1, particles[j].color);

                        ctx.strokeStyle = gradient;
                        // Smooth cubic fade-out for opacity: (1 - x)^3 falls off slower then drops
                        const alpha = 1 - (distance / connectionDistance);
                        ctx.globalAlpha = alpha * alpha * alpha; // Softer falloff

                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1.0;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors, backgroundColor, mode]);

    return (
        <canvas
            ref={canvasRef}
            className={`${mode === 'fixed' ? 'fixed inset-0' : 'absolute inset-0'} w-full h-full pointer-events-none`}
            style={{ zIndex: 0, opacity }}
        />
    );
};

export default TechBackground;
