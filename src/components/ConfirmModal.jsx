import React from 'react';
import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18, color: '#fff', letterSpacing: '-0.5px' }}>{title}</h2>
    <div style={{ marginBottom: 32, color: '#b3b8d0', fontSize: 16, lineHeight: 1.6 }}>{description}</div>
    <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
      <button onClick={onClose} style={{ padding: '12px 28px', borderRadius: 10, border: '1.5px solid #23263a', background: '#181c2f', color: '#b3b8d0', fontWeight: 700, fontSize: 16, transition: 'all 0.2s', cursor: 'pointer' }}>{cancelText}</button>
      <button onClick={onConfirm} style={{ padding: '12px 28px', borderRadius: 10, background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 2px 8px rgba(79,57,246,0.10)', transition: 'all 0.2s', cursor: 'pointer' }}>{confirmText}</button>
    </div>
  </Modal>
);

export default ConfirmModal;
