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
        let lastTime = 0;

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;

        // Physics constants (adjusted for Delta Time in seconds)
        // Previous maxSpeed was 0.6 px/frame. At 60fps that's 36px/sec.
        // We want slower, ambient feel. Let's try 15-20 px/sec.
        const maxSpeed = 20;
        const boundaryMargin = 100;
        const turnSpeed = 200; // Force to apply when hitting boundary (per second)
        const wanderStrength = 5; // Random force intensity

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

                // Initial velocity
                const angle = Math.random() * Math.PI * 2;
                // Initialize with random fraction of maxSpeed
                const startSpeed = maxSpeed * (0.5 + Math.random() * 0.5);
                this.vx = Math.cos(angle) * startSpeed;
                this.vy = Math.sin(angle) * startSpeed;

                this.size = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.wanderAngle = Math.random() * Math.PI * 2;
            }

            update(dt: number) {
                // Organic Wander Force
                // Wiggle angle over time
                this.wanderAngle += (Math.random() - 0.5) * 5 * dt;

                // Add wander vector to velocity
                this.vx += Math.cos(this.wanderAngle) * wanderStrength * dt;
                this.vy += Math.sin(this.wanderAngle) * wanderStrength * dt;

                // Soft Boundary (Steering) - Avoid walls smoothly
                // We add force relative to how close we are to edge? 
                // Simple constant force is stable enough if tuned.
                if (this.x < boundaryMargin) this.vx += turnSpeed * dt;
                if (this.x > canvas!.width - boundaryMargin) this.vx -= turnSpeed * dt;
                if (this.y < boundaryMargin) this.vy += turnSpeed * dt;
                if (this.y > canvas!.height - boundaryMargin) this.vy -= turnSpeed * dt;

                // Speed Limit (Damping)
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }

                // Apply velocity
                this.x += this.vx * dt;
                this.y += this.vy * dt;

                // REMOVED HARD CLAMP
                // We let them go slightly offscreen if momentum carries them, 
                // the steering force will naturally bring them back.
                // This prevents the "hit wall and stop/teleport" effect.
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

        const animate = (timestamp: number) => {
            if (!ctx || !canvas) return;

            // Calculate Delta Time (in seconds)
            if (!lastTime) lastTime = timestamp;
            const dt = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            // Cap dt to prevent huge jumps if tab was inactive (e.g. max 0.1s)
            const safeDt = Math.min(dt, 0.1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Background
            if (backgroundColor !== 'transparent') {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Update & Draw
            particles.forEach((particle, index) => {
                particle.update(safeDt);
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
                        // Smooth cubic fade-out
                        const alpha = 1 - (distance / connectionDistance);
                        ctx.globalAlpha = alpha * alpha * alpha;

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
        // Start animation loop
        requestAnimationFrame(animate);

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
