import React from 'react';
import './Modal.css';

const LoadingModal = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: 16 }} />
        <div>{message || 'Carregando...'}</div>
      </div>
    </div>
  );
};

export default LoadingModal;
