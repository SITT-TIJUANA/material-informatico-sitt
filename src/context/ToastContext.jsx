import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ToastContainer from '../components/Toast.jsx';

const ToastContext = createContext(null);

// Referencia global para poder notificar desde fuera de componentes React
// (por ejemplo, desde el interceptor de errores de axios en api/client.js).
let notificarFueraDeReact = null;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const cerrar = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notificar = useCallback(({ tipo = 'exito', titulo, mensaje, acciones = [], duracion = 7000 }) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, tipo, titulo, mensaje, acciones }]);
    if (duracion) setTimeout(() => cerrar(id), duracion);
    return id;
  }, [cerrar]);

  notificarFueraDeReact = notificar;

  return (
    <ToastContext.Provider value={{ notificar, cerrar }}>
      {children}
      <ToastContainer toasts={toasts} onCerrar={cerrar} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// Para usar fuera de componentes (ej. interceptores). Si el provider aún no montó, no hace nada.
export function notificarGlobal(datos) {
  notificarFueraDeReact?.(datos);
}
