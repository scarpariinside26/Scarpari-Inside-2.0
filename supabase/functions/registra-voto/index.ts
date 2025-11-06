import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';
import * as crypto from 'https://deno.land/std@0.224.0/crypto/mod.ts';
import * as base64 from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import * as hex from 'https://deno.land/std@0.224.0/encoding/hex.ts';

// Configurazione Globale
// La chiave segreta del tuo Bot Telegram è LETTA dalle variabili d'ambiente di Supabase.
// NON salvarla direttamente nel codice!
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN non è configurata nelle variabili d\'ambiente di Supabase.');
}

// Funzione di utilità per la verifica della `initData`
/**
 * Verifica l'autenticità dei dati inviati da Telegram (initData)
 * @param initDataString La stringa completa di initData ricevuta dal frontend.
 * @returns true se la firma è valida, false altrimenti.
 */
async function verifyTelegramInitData(initDataString: string): Promise<boolean> {
    const data = new URLSearchParams(initDataString);
    const hash = data.get('hash');
    data.delete('hash');

    // 1. Ordina e formatta i parametri per la verifica
    const dataCheckArr: string[] = [];
    data.forEach((val, key) => dataCheckArr.push(`${key}=${val}`));
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // 2. Calcola la chiave HMAC (chiave segreta)
    // Chiave: SHA256(BOT_TOKEN)
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.digest('SHA-256', encoder.encode(TELEGRAM_BOT_TOKEN));

    // 3. Crea il messaggio da firmare
    // Messaggio: `dataCheckString`
    const dataForHash = encoder.encode(dataCheckString);

    // 4. Calcola la firma HMAC-SHA256
    const signature = await crypto.subtle.sign(
        { name: 'HMAC' },
        await crypto.subtle.importKey(
            'raw',
            secretKey,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        ),
        dataForHash
    );

    // 5. Confronta il risultato con l'hash fornito da Telegram
    const hexSignature = hex.encode(new Uint8Array(signature));
    
    // Confronto in tempo costante per prevenire attacchi di timing
    return crypto.timingSafeEqual(encoder.encode(hash as string), encoder.encode(hexSignature));
}


// Struttura del corpo della richiesta che ci aspettiamo
interface RequestBody {
    initData: string; // La stringa completa e non modificata di initData
    voteValue: number; // Il voto da registrare
}

// Handler principale della Edge Function
serve(async (req) => {
    // 1. Configurazione Supabase
    const supabaseClient = createClient(
        // URL e Anon Key sono accessibili automaticamente in Deno/Edge Functions
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        // Importante: usare il service_role per l'accesso diretto e sicuro al database
        {
            global: {
                headers: { 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` }
            }
        }
    );

    // Gestione dei metodi non POST o delle pre-flight requests (CORS)
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*', // O il tuo dominio specifico
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    if (req.method !== 'POST') {
        return new Response('Metodo non consentito. Usa POST.', { status: 405 });
    }

    // Imposta gli header CORS per la risposta
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Permette l'accesso da qualsiasi origine (richiesto dalle Mini App)
        'Content-Type': 'application/json',
    };

    try {
        // 2. Parsing e Validazione del Corpo
        const { initData, voteValue } = (await req.json()) as RequestBody;

        if (!initData || voteValue == null) {
            return new Response(JSON.stringify({ error: 'Dati richiesti (initData e voteValue) mancanti.' }), { status: 400, headers: corsHeaders });
        }

        // 3. Verifica l'Autenticità di Telegram (CRITICO!)
        const isValid = await verifyTelegramInitData(initData);

        if (!isValid) {
            console.error('VERIFICA FALLITA: Tentativo di invio di dati non autenticati da Telegram.');
            return new Response(JSON.stringify({ error: 'Dati Telegram non validi o manipolati.' }), { status: 401, headers: corsHeaders });
        }

        // 4. Estrazione dell'ID Utente
        // La verifica è passata, quindi estraiamo i dati utente con sicurezza.
        const urlParams = new URLSearchParams(initData);
        const userParam = urlParams.get('user');

        if (!userParam) {
             // Questo non dovrebbe accadere se il bot è configurato correttamente, ma è una safety check
             return new Response(JSON.stringify({ error: 'Dati utente non trovati nell\'initData verificata.' }), { status: 400, headers: corsHeaders });
        }

        const userObject = JSON.parse(userParam);
        const userId = userObject.id;

        // 5. Inserimento/Aggiornamento del Voto nel Database
        // Utilizziamo l'upsert per registrare un nuovo voto o aggiornare il precedente.
        const { data, error } = await supabaseClient
            .from('votes') // Sostituisci 'votes' con il nome della tua tabella
            .upsert(
                {
                    user_id: userId,
                    vote_value: voteValue,
                    updated_at: new Date().toISOString()
                },
                {
                    onConflict: 'user_id', // Specifica la colonna da usare come identificatore univoco
                    ignoreDuplicates: false,
                }
            )
            .select();

        if (error) {
            console.error('Errore Database:', error);
            return new Response(JSON.stringify({ error: 'Errore durante il salvataggio del voto nel database.', details: error.message }), { status: 500, headers: corsHeaders });
        }

        // 6. Successo
        return new Response(JSON.stringify({ message: 'Voto registrato con successo!', data: data }), {
            status: 200,
            headers: corsHeaders,
        });

    } catch (error) {
        console.error('Errore imprevisto nel server:', error);
        return new Response(JSON.stringify({ error: 'Errore interno del server.' }), { status: 500, headers: corsHeaders });
    }
});
