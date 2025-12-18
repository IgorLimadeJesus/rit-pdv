import React, { useState } from 'react';
import Modal from './Modal';

const paymentMethods = [
  { key: 'dinheiro', label: 'Dinheiro', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><rect x="3" y="7" width="18" height="10" rx="2" stroke="#b3b8d0" strokeWidth="1.5"/><circle cx="12" cy="12" r="2.5" stroke="#b3b8d0" strokeWidth="1.5"/></svg> },
  { key: 'credito', label: 'Crédito', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><rect x="3" y="7" width="18" height="10" rx="2" stroke="#b3b8d0" strokeWidth="1.5"/><rect x="7" y="15" width="4" height="2" rx="1" fill="#b3b8d0"/></svg> },
  { key: 'debito', label: 'Débito', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><rect x="3" y="7" width="18" height="10" rx="2" stroke="#b3b8d0" strokeWidth="1.5"/><rect x="13" y="15" width="4" height="2" rx="1" fill="#b3b8d0"/></svg> },
  { key: 'pix', label: 'PIX', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><rect x="5" y="9" width="14" height="6" rx="2" stroke="#b3b8d0" strokeWidth="1.5"/><rect x="9" y="5" width="6" height="14" rx="2" stroke="#b3b8d0" strokeWidth="1.5"/></svg> },
];

const FinalizeSaleModal = ({ isOpen, onClose, items, total, onSelectPayment }) => {
  const [selected, setSelected] = useState(null);

  // Corrigir: só chama onSelectPayment ao clicar em Confirmar
  const handleSelect = (key) => setSelected(key);
  const handleConfirm = () => selected && onSelectPayment && onSelectPayment(selected);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.5px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: '#fff', borderRadius: 8, width: 32, height: 32, fontSize: 20 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" fill="none"/><path d="M7 12h10M7 16h10M7 8h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
        Finalizar Pagamento
      </h2>
      <div style={{ background: '#23263a', borderRadius: 12, padding: 18, marginBottom: 22 }}>
        <div style={{ color: '#b3b8d0', fontSize: 14, marginBottom: 8 }}>{items.length} itens</div>
        <ul style={{ fontFamily: 'inherit', color: '#fff', fontSize: 15, marginBottom: 8 }}>
          {items.map((it, idx) => (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{it.qty}x {it.name}</span>
              <span>R$ {Number(it.price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 10 }}>
          <span style={{ color: '#fff' }}>Total</span>
          <span style={{ color: 'var(--primary-color)', fontSize: 18 }}>R$ {Number(total).toFixed(2)}</span>
        </div>
      </div>
      <div style={{ color: '#b3b8d0', fontSize: 15, fontWeight: 500, marginBottom: 10 }}>Forma de Pagamento</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
        {paymentMethods.map(m => (
          <button
            key={m.key}
            onClick={() => handleSelect(m.key)}
            style={{
              padding: '18px 0',
              borderRadius: 12,
              border: selected === m.key ? '2px solid var(--primary-color)' : '1.5px solid #23263a',
              background: selected === m.key ? '#23263a' : '#181c2f',
              color: selected === m.key ? '#fff' : '#b3b8d0',
              fontWeight: 700,
              fontSize: 16,
              fontFamily: 'inherit',
              boxShadow: selected === m.key ? '0 2px 8px rgba(79,57,246,0.10)' : 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
      <div style={{ position: 'sticky', left: 0, right: 0, bottom: 0, margin: '0 -2.2rem', padding: 0, background: 'transparent', zIndex: 2 }}>
        <button
          disabled={selected === null}
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '18px 0',
            borderRadius: '0 0 16px 16px',
            background: selected !== null ? '#2ED47A' : '#23263a',
            color: selected !== null ? '#181C24' : '#b3b8d0',
            fontWeight: 800,
            fontSize: 18,
            border: 'none',
            boxShadow: selected !== null ? '0 2px 8px rgba(46,212,122,0.10)' : 'none',
            cursor: selected !== null ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginTop: 8,
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><rect width="22" height="22" fill="none"/><circle cx="12" cy="12" r="10" stroke={selected !== null ? '#181C24' : '#b3b8d0'} strokeWidth="2"/><path d="M9 12.5l2 2 4-4" stroke={selected !== null ? '#181C24' : '#b3b8d0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Confirmar R$ {Number(total).toFixed(2)}
        </button>
      </div>
    </Modal>
  );
};

export default FinalizeSaleModal;
