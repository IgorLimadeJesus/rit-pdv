import React from 'react';
import Modal from './Modal';

const PixModal = ({ isOpen, onClose, pixKey, onSimulate }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18, color: '#fff', letterSpacing: '-0.5px' }}>Pagamento via Pix</h2>
    <div style={{ textAlign: 'center', marginBottom: 22 }}>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixKey)}`} alt="QR Code Pix" style={{ margin: '0 auto', borderRadius: 12, border: '2.5px solid var(--primary-color)', background: '#fff', boxShadow: '0 2px 12px rgba(79,57,246,0.10)' }} />
      <div style={{ marginTop: 14, fontSize: 16, color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '-0.2px' }}>Chave Pix: <b>{pixKey}</b></div>
    </div>
    <button onClick={onSimulate} style={{ width: '100%', padding: '16px', borderRadius: 10, background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 17, marginBottom: 12, boxShadow: '0 2px 8px rgba(79,57,246,0.10)', transition: 'all 0.2s', cursor: 'pointer' }}>Simular pagamento Pix</button>
    <button onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', color: '#b3b8d0', fontWeight: 700, fontSize: 15, cursor: 'pointer', padding: '10px 0' }}>Cancelar</button>
  </Modal>
);

export default PixModal;
