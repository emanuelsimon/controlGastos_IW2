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

        const comercio = this.extraerComercio(texto)
        const monto = this.extraerMonto(texto)
        const fecha = this.extraerFecha(texto)
        const categoria = this.inferirCategoria(texto, comercio || '')

        return {
            texto,
            comercio,
            monto,
            fecha,
            categoria
        }
    }

    private extraerMonto(texto: string): number | null {
    // Busca TOTAL: $157,800.00 o TOTAL $157.800,00
    const patronTotalConSimbolo = /TOTAL[:\s]+\$\s*([\d,\.]+)/i
    const matchConSimbolo = texto.match(patronTotalConSimbolo)
    if (matchConSimbolo) {
        const valor = matchConSimbolo[1]
        // Formato $157,800.00 (coma=miles, punto=decimal)
        if (/,\d{3}\.\d{2}$/.test(valor)) {
            return parseFloat(valor.replace(',', ''))
        }
        // Formato $157.800,00 (punto=miles, coma=decimal)
        if (/\.\d{3},\d{2}$/.test(valor)) {
            return parseFloat(valor.replace('.', '').replace(',', '.'))
        }
        return parseFloat(valor.replace(/[,$]/g, ''))
    }

    // Busca TOTAL seguido directamente de un número
    const patronTotal = /TOTAL\s+([\d.,]+)/i
    const matchTotal = texto.match(patronTotal)
    if (matchTotal) {
        const valor = matchTotal[1]
        if (/\.\d{2}$/.test(valor)) {
            return parseFloat(valor)
        }
        return parseFloat(valor.replace(/\./g, '').replace(',', '.'))
    }

    // Fallback: último número grande antes de TOTAL
    const indexTotal = texto.toUpperCase().indexOf('TOTAL')
    if (indexTotal > 0) {
        const textoAntesTotal = texto.substring(0, indexTotal)
        const numeros = textoAntesTotal.match(/\d{4,}[.,]\d{2}/g)
        if (numeros && numeros.length > 0) {
            const ultimo = numeros[numeros.length - 1]
            if (/\.\d{2}$/.test(ultimo)) {
                return parseFloat(ultimo)
            }
            return parseFloat(ultimo.replace(/\./g, '').replace(',', '.'))
        }
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
        const lineas = texto.split(/[\t\n\r]/)
            .map(l => l.trim())
            .filter(l => l.length > 4 && !/^\d/.test(l) && !/CUIT|IVA|Fecha|Hora|Caja|Oper/i.test(l))

        // Priorizar líneas con razón social
        const conRazonSocial = lineas.find(l => /S\.R\.L|S\.A\.|SRL|SA\b/i.test(l))
        if (conRazonSocial) return conRazonSocial

        // Priorizar líneas con "de" indicando nombre de persona
        const conNombre = lineas.find(l => /\bde\b/i.test(l) && l.length > 8)
        if (conNombre) return conNombre

        // Primera línea con texto significativo
        return lineas[0] || null
    }

    private inferirCategoria(texto: string, comercio: string): string {
        const textoCompleto = (texto + ' ' + comercio).toUpperCase()

        const categorias: { [key: string]: string[] } = {
            'Alimentación': ['SUPER', 'MERCADO', 'MARKET', 'ALMACEN', 'ALIMENTOS', 'CARNICERIA', 'VERDULERIA', 'PANADERIA', 'FIAMBRERIA'],
            'Combustible': ['YPF', 'SHELL', 'BP', 'AXION', 'PUMA', 'COMBUSTIBLE', 'NAFTA', 'ESTACION'],
            'Salud': ['FARMACIA', 'FARM', 'DROGUERIA', 'CLINICA', 'MEDICO', 'HOSPITAL', 'OPTICA'],
            'Ocio': ['CINE', 'TEATRO', 'RESTAURANT', 'BAR', 'CAFE', 'DELIVERY', 'RAPPI', 'PEDIDOS'],
            'Transporte': ['UBER', 'CABIFY', 'TAXI', 'REMIS', 'TREN', 'COLECTIVO', 'PEAJE'],
            'Educación': ['LIBRERIA', 'UNIVERSIDAD', 'COLEGIO', 'ESCUELA', 'CURSO', 'LIBRO'],
            'Hogar': ['FERRETERIA', 'MUEBLES', 'ELECTRODOMESTICO', 'PINTURA', 'CORRALON'],
            'Ropa': ['ROPA', 'INDUMENTARIA', 'CALZADO', 'ZAPATERIA', 'BOUTIQUE'],
            'Servicios': ['TELEFONICA', 'CLARO', 'PERSONAL', 'MOVISTAR', 'LUZ', 'GAS', 'AGUA', 'INTERNET'],
        }

        for (const [categoria, palabras] of Object.entries(categorias)) {
            if (palabras.some(p => textoCompleto.includes(p))) {
                return categoria
            }
        }

        return 'Otro'
    }
}