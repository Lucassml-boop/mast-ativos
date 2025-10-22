import { useState } from 'react';
import { createPortal } from 'react-dom';
import './AuthBox.scss';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Props = {
	open: boolean;
	onClose: () => void;
};

export default function AuthBox({ open, onClose }: Props) {
	const [isRegister, setIsRegister] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open) return null;

	const handleLogin = async () => {
		setLoading(true);
		setError(null);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			onClose();
		} catch (e: any) {
			setError(e.message || 'Erro ao autenticar');
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async () => {
		setLoading(true);
		setError(null);
		try {
			const userCred = await createUserWithEmailAndPassword(auth, email, password);
			// Create user doc with isAdmin=false by default
			await setDoc(doc(db, 'users', userCred.user.uid), { email, isAdmin: false });
			onClose();
		} catch (e: any) {
			setError(e.message || 'Erro ao registrar');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		await signOut(auth);
		onClose();
	};

	return createPortal(
		<div className="authbox-backdrop" onClick={onClose}>
			<div className="authbox" onClick={(e) => e.stopPropagation()}>
				<button className="close-btn" onClick={onClose} aria-label="Fechar">✕</button>
				<div className="tabs">
					<div className={`tab ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)}>Login</div>
					<div className={`tab ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)}>Registrar</div>
				</div>
				<h3 style={{ marginTop: 6 }}>{isRegister ? 'Criar nova conta' : 'Acesse sua conta'}</h3>
				<div className="authbox-form" style={{ display: 'grid', gap: 10, marginTop: 6 }}>
					<input
						type="email"
						className="auth-input"
						placeholder="email@grupomast.com.br"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						/>
					<input
						type="password"
						className="auth-input"
						placeholder="Senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						/>
					{error && <div style={{ color: 'red' }}>{error}</div>}
					<div className="actions">
						{!isRegister ? (
							<button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
								Entrar
							</button>
						) : (
							<button className="btn btn-primary" onClick={handleRegister} disabled={loading}>
								Registrar
							</button>
						)}
						<button className="btn btn-secondary" onClick={() => setIsRegister(!isRegister)} disabled={loading}>
							{isRegister ? 'Já tenho conta' : 'Criar conta'}
						</button>
						<button className="btn" onClick={handleLogout} disabled={loading}>
							Sair
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
}
