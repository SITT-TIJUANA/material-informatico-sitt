function EstilosPacman() {
  return (
    <style>{`
      .pacman-wrapper { position: relative; width: 70px; height: 26px; }
      .pacman-wrapper .packman { position: absolute; top: 50%; left: 13px; }
      .pacman-wrapper .packman::before {
        content: ''; position: absolute; width: 26px; height: 13px;
        background-color: #EFF107; border-radius: 60px 60px 0 0;
        transform: translate(-50%, -50%); transform-origin: center bottom;
        animation: pac-top 0.5s linear infinite;
      }
      .pacman-wrapper .packman::after {
        content: ''; position: absolute; width: 26px; height: 13px;
        background-color: #EFF107; border-radius: 0 0 60px 60px;
        transform: translate(-50%, 50%); transform-origin: center top;
        animation: pac-bot 0.5s linear infinite;
      }
      @keyframes pac-top {
        0% { transform: translate(-50%, -50%) rotate(0); }
        50% { transform: translate(-50%, -50%) rotate(-30deg); }
        100% { transform: translate(-50%, -50%) rotate(0); }
      }
      @keyframes pac-bot {
        0% { transform: translate(-50%, 50%) rotate(0); }
        50% { transform: translate(-50%, 50%) rotate(30deg); }
        100% { transform: translate(-50%, 50%) rotate(0); }
      }
      .pacman-wrapper .dots .dot {
        position: absolute; top: 4px; width: 5px; height: 5px; border-radius: 50%;
        background: #ffffff; box-shadow: 0 0 3px rgba(0,0,0,0.15);
      }
      .pacman-wrapper .dots .dot:nth-child(1) { left: 47px; animation: dot-stage1 0.5s infinite; }
      .pacman-wrapper .dots .dot:nth-child(2) { left: 31px; animation: dot-stage1 0.5s infinite; }
      .pacman-wrapper .dots .dot:nth-child(3) { left: 16px; animation: dot-stage1 0.5s infinite; }
      .pacman-wrapper .dots .dot:nth-child(4) { left: 4px; animation: dot-stage2 0.5s infinite; }
      @keyframes dot-stage1 { 0% { transform: translate(0, 0); } 100% { transform: translate(-12px, 0); } }
      @keyframes dot-stage2 { 0% { transform: scale(1); } 5%, 100% { transform: scale(0); } }
    `}</style>
  );
}
