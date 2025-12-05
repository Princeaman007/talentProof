import { toast } from 'react-toastify';

/**
 * Affiche une confirmation interactive avec toast
 * @param {string} message - Le message de confirmation à afficher
 * @param {Function} onConfirm - Fonction à exécuter si l'utilisateur confirme
 * @param {Object} options - Options supplémentaires
 */
export const toastConfirm = (message, onConfirm, options = {}) => {
  const {
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    confirmColor = '#DC2626',
    cancelColor = '#6B7280',
  } = options;

  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: '15px', fontSize: '14px', color: '#374151' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            style={{
              padding: '8px 16px',
              background: confirmColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {confirmText}
          </button>
          <button
            onClick={closeToast}
            style={{
              padding: '8px 16px',
              background: cancelColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeButton: false,
      draggable: false,
      closeOnClick: false,
      style: {
        minWidth: '400px',
      },
    }
  );
};
