import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketsService {
    constructor(private configService: ConfigService) { }

    async procesarTicket(base64Image: string) {
        const apiKey = this.configService.get('OCR_SPACE_API_KEY')!

        // Llamada a OCR.space
        const formData = new URLSearchParams()
        formData.append('base64Image', base64Image)
        formData.append('language', 'spa')
        formData.append('isTable', 'true')
        formData.append('OCREngine', '2')

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        })

        const data = await response.json()

        if (data.IsErroredOnProcessing) {
            throw new Error('Error al procesar el ticket')
        }

        const texto = data.ParsedResults[0].ParsedText
        console.log('Texto extraído:', texto)

        return {
            texto,
            comercio: this.extraerComercio(texto),
            monto: this.extraerMonto(texto),
            fecha: this.extraerFecha(texto),
            categoria: null
        }
    }

    private extraerMonto(texto: string): number | null {
        // Busca el último monto grande antes de TOTAL
        const indexTotal = texto.toUpperCase().indexOf('TOTAL')
        if (indexTotal > 0) {
            const textoAntesTotal = texto.substring(0, indexTotal)
            const numeros = textoAntesTotal.match(/\d{4,}[.,]\d{2}/g)
            if (numeros && numeros.length > 0) {
                // Toma el último número grande antes de TOTAL
                const ultimo = numeros[numeros.length - 1]
                // Si tiene punto seguido de exactamente 2 dígitos al final, es decimal
                if (/\.\d{2}$/.test(ultimo)) {
                    return parseFloat(ultimo)
                } else {
                    return parseFloat(ultimo.replace(/\./g, '').replace(',', '.'))
                }
            }
        }

        // Fallback: el número más grande del ticket
        const numeros = texto.match(/\d{4,}[.,]\d{2}/g)
        if (numeros) {
            return Math.max(...numeros.map(n =>
                parseFloat(n.replace(/\./g, '').replace(',', '.'))
            ))
        }
        return null
    }

    private extraerFecha(texto: string): string | null {
        // Busca "Fecha" seguido de una fecha
        const patronFecha = /Fecha\s+(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i
        const matchFecha = texto.match(patronFecha)
        if (matchFecha) {
            const [_, dia, mes, anio] = matchFecha
            const anioCompleto = anio.length === 2 ? `20${anio}` : anio
            return `${anioCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
        }

        // Busca cualquier fecha pero ignora años anteriores al 2020
        const patron = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g
        let match
        while ((match = patron.exec(texto)) !== null) {
            const [_, dia, mes, anio] = match
            const anioCompleto = anio.length === 2 ? `20${anio}` : anio
            if (parseInt(anioCompleto) >= 2020) {
                return `${anioCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
            }
        }
        return null
    }

    private extraerComercio(texto: string): string | null {
        // Busca líneas que contengan S.R.L, S.A, SA, SRL como indicadores de razón social
        const patronComercio = /([A-Z\s]+(?:S\.R\.L|S\.A\.|SRL|SA|S\.A))/i
        const match = texto.match(patronComercio)
        if (match) {
            return match[1].trim()
        }

        // Busca líneas con solo mayúsculas de más de 5 caracteres
        const lineas = texto.split('\n')
        for (const linea of lineas) {
            const limpia = linea.trim()
            if (limpia.length > 5 && /^[A-ZÁÉÍÓÚ\s]+$/.test(limpia)) {
                return limpia
            }
        }
        return null
    }
}