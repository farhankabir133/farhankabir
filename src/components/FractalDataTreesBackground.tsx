import React, { useRef, useEffect, useState } from 'react';

// Programming language color palettes
const LANGUAGE_COLORS: Record<string, string[]> = {
  javascript: ['#f7df1e', '#ffe066', '#f9d923', '#fffbe7'],
  python: ['#3572A5', '#ffd43b', '#306998', '#ffe873'],
  typescript: ['#3178c6', '#60a5fa', '#b2dafa', '#e0f2fe'],
  ruby: ['#cc342d', '#e06c75', '#f7b2ad', '#fff0f0'],
  go: ['#00add8', '#6ad7e5', '#b2f5ea', '#e0fcff'],
  java: ['#b07219', '#f7c873', '#e6b980', '#fff3e0'],
  default: ['#a3e635', '#bef264', '#d9f99d', '#f7fee7'],
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Packet {
  x: number;
  y: number;
  progress: number;
  color: string;
  branch: number;
  direction: 1 | -1;
}

interface Branch {
  x: number;
  y: number;
  angle: number;
  length: number;
  depth: number;
  children: Branch[];
  packets: Packet[];
  color: string;
}

const LANGUAGES = Object.keys(LANGUAGE_COLORS);

const FractalDataTreesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [language, setLanguage] = useState('javascript');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);

  // Generate fractal tree
  function createBranch(x: number, y: number, angle: number, length: number, depth: number, colorPalette: string[]): Branch {
    const color = colorPalette[depth % colorPalette.length];
    const branch: Branch = {
      x, y, angle, length, depth, children: [], packets: [], color
    };
    if (depth < 5) {
      const split = randomBetween(0.5, 0.8);
      branch.children.push(
        createBranch(
          x + Math.cos(angle - 0.3) * length * split,
          y + Math.sin(angle - 0.3) * length * split,
          angle - randomBetween(0.2, 0.5),
          length * split,
          depth + 1,
          colorPalette
        ),
        createBranch(
          x + Math.cos(angle + 0.3) * length * split,
          y + Math.sin(angle + 0.3) * length * split,
          angle + randomBetween(0.2, 0.5),
          length * split,
          depth + 1,
          colorPalette
        )
      );
    }
    return branch;
  }

  // Grow and morph tree on user action
  const growTree = () => {
    const colorPalette = LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
    setBranches([
      createBranch(width / 2, height - 40, -Math.PI / 2, 90, 0, colorPalette)
    ]);
  };

  // Morph tree to represent different languages
  useEffect(() => {
    growTree();
    // eslint-disable-next-line
  }, [language, width, height]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 900 ? window.innerWidth - 40 : 800);
      setHeight(window.innerWidth < 900 ? 320 : 400);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate data packets
  useEffect(() => {
    let frame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function drawBranch(branch: Branch) {
      ctx.save();
      ctx.strokeStyle = branch.color;
      ctx.shadowColor = branch.color;
      ctx.shadowBlur = 12 - branch.depth * 2;
      ctx.lineWidth = Math.max(2, 7 - branch.depth);
      ctx.beginPath();
      ctx.moveTo(branch.x, branch.y);
      const endX = branch.x + Math.cos(branch.angle) * branch.length;
      const endY = branch.y + Math.sin(branch.angle) * branch.length;
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
      // Draw children
      branch.children.forEach(drawBranch);
      // Draw packets
      branch.packets.forEach(packet => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 7 - branch.depth, 0, 2 * Math.PI);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 16;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
      });
    }

    function animatePackets(branch: Branch) {
      // Move packets along the branch
      branch.packets.forEach(packet => {
        packet.progress += 0.012 * packet.direction;
        if (packet.progress > 1 || packet.progress < 0) {
          packet.direction *= -1;
          packet.progress = Math.max(0, Math.min(1, packet.progress));
        }
        // Update position
        const startX = branch.x;
        const startY = branch.y;
        const endX = branch.x + Math.cos(branch.angle) * branch.length;
        const endY = branch.y + Math.sin(branch.angle) * branch.length;
        packet.x = startX + (endX - startX) * packet.progress;
        packet.y = startY + (endY - startY) * packet.progress;
      });
      branch.children.forEach(animatePackets);
    }

    function syncPackets(branch: Branch) {
      // Sync packets between branches (visualize data flow)
      if (branch.children.length > 0 && Math.random() < 0.01) {
        const child = branch.children[Math.floor(Math.random() * branch.children.length)];
        if (branch.packets.length > 0) {
          const p = branch.packets[Math.floor(Math.random() * branch.packets.length)];
          child.packets.push({ ...p, progress: 0, direction: 1 });
        }
      }
      branch.children.forEach(syncPackets);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      branches.forEach(drawBranch);
      branches.forEach(animatePackets);
      branches.forEach(syncPackets);
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [branches, width, height]);

  // Add packets on click or grow tree on double click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Find nearest branch
    let minDist = 9999;
    let nearest: Branch | null = null;
    function findNearest(branch: Branch) {
      const endX = branch.x + Math.cos(branch.angle) * branch.length;
      const endY = branch.y + Math.sin(branch.angle) * branch.length;
      const dist = Math.sqrt((endX - x) ** 2 + (endY - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = branch;
      }
      branch.children.forEach(findNearest);
    }
    branches.forEach(findNearest);
    if (nearest) {
      // Add a glowing data packet
      const colorPalette = LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
      nearest.packets.push({
        x: nearest.x,
        y: nearest.y,
        progress: 0,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        branch: nearest.depth,
        direction: 1,
      });
      setBranches([...branches]);
    }
  };

  const handleCanvasDoubleClick = () => {
    growTree();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 pointer-events-auto"
        style={{ zIndex: 1 }}
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
      />
      {/* Language selector for morphing tree */}
      <div className="absolute top-4 right-4 bg-black/70 rounded-xl p-4 z-20 flex flex-col gap-2 text-white shadow-lg" style={{ minWidth: 180 }}>
        <div className="font-bold mb-1">Tree Language</div>
        <select
          className="bg-slate-900 rounded p-2 text-white"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
          ))}
        </select>
        <div className="text-xs text-slate-400 mt-1">Click tree to add data packet. Double-click to regrow.</div>
      </div>
    </>
  );
};

export default FractalDataTreesBackground;
