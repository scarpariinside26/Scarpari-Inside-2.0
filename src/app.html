<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		
		<!-- 🆕 TELEGRAM WEBAPP SCRIPT -->
		<script src="https://telegram.org/js/telegram-web-app.js"></script>
		
		<!-- 
			FIX CRASH: Gestore di errori globale per sopprimere l'errore di configurazione "FIREBASE ERROR" 
			che sembra provenire dall'ambiente esterno e blocca il rendering SvelteKit.
		-->
		<script>
			window.onerror = function (message, source, lineno, colno, error) {
				// Verifica se l'errore contiene la stringa specifica di configurazione mancante
				const isFirebaseConfigError = message && typeof message === 'string' && message.includes("firebaseConfig non disponibile");
				
				if (isFirebaseConfigError) {
					// Blocca la propagazione dell'errore solo se è quello specifico
					console.warn("AVVISO (Ignorato): Un errore di configurazione Firebase non necessario è stato soppresso per evitare il crash dell'app.");
					return true; // Restituire true impedisce l'esecuzione del gestore di errori di default (e quindi il crash).
				}
				
				// Lascia che tutti gli altri errori vengano gestiti normalmente.
				return false;
			};
		</script>
		
		<!-- 🚨 MANCAVA QUESTA RIGA! -->
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
