import { mpClient, Preference } from '../../config/mercadopago.config.js';
import { supabase } from '../../config/supabase.config.js';

/**
 * Registra inmediatamente un pago pendiente asociado a una o más preinscripciones
 *
 * @param {Object} params
 * @param {number|string|number[]} [params.id_preinscripcion]
 * @param {number[]|string[]} [params.ids_preinscripciones]
 * @param {number|string} [params.monto]
 * @param {string} [params.titulo]
 * @returns {Promise<{ success: boolean, id_pago: number, ids_preinscripciones: number[], id_preinscripcion: number, estado_pago: string }>}
 */
export const iniciarPagoService = async ({ id_preinscripcion, ids_preinscripciones, monto, titulo }) => {
    let idsArray = [];
    if (Array.isArray(ids_preinscripciones) && ids_preinscripciones.length > 0) {
        idsArray = ids_preinscripciones.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
    } else if (typeof id_preinscripcion === 'string' && id_preinscripcion.includes(',')) {
        idsArray = id_preinscripcion.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id) && id > 0);
    } else if (id_preinscripcion) {
        const parsed = Number(id_preinscripcion);
        if (!isNaN(parsed) && parsed > 0) idsArray = [parsed];
    }

    if (idsArray.length === 0) {
        throw new Error('id_preinscripcion o ids_preinscripciones es obligatorio para iniciar el pago.');
    }

    // Calcular monto total si no vino especificado o si es menor o igual a cero
    let montoTotal = Number(monto);
    if (isNaN(montoTotal) || montoTotal <= 0) {
        try {
            const { data: preInfo } = await supabase
                .from('preinscripciones')
                .select('id_clase, clases_asignadas(cursos(precio))')
                .in('id_preinscripcion', idsArray);
            const sumaPrecios = (preInfo || []).reduce((sum, item) => {
                const p = Number(item.clases_asignadas?.cursos?.precio);
                return sum + (!isNaN(p) && p > 0 ? p : 0);
            }, 0);
            montoTotal = sumaPrecios > 0 ? sumaPrecios : 0;
        } catch {
            montoTotal = 0;
        }
    }
    const observaciones = titulo ? `Preinscripción iniciada para ${titulo}` : 'Preinscripción iniciada';
    let idPagoPrincipal = null;

    for (let i = 0; i < idsArray.length; i++) {
        const numPre = idsArray[i];
        // En el primer pago colocamos el monto consolidado (o proporcional si hay varios)
        const montoItem = idsArray.length === 1 ? montoTotal : (montoTotal / idsArray.length);

        const { data: pagosExistentes } = await supabase
            .from('pagos')
            .select('id_pago')
            .eq('id_preinscripcion', numPre)
            .limit(1);

        if (pagosExistentes && pagosExistentes.length > 0) {
            if (i === 0) idPagoPrincipal = pagosExistentes[0].id_pago;
        } else {
            const { data: nuevoPago, error } = await supabase
                .from('pagos')
                .insert({
                    id_preinscripcion: numPre,
                    monto_pagado: montoItem,
                    metodo_pago: 'mercadopago',
                    estado_pago: 'pendiente',
                    fecha_pago: new Date().toISOString(),
                    observaciones: idsArray.length > 1
                        ? `${observaciones} (Curso ${i + 1}/${idsArray.length})`
                        : observaciones,
                })
                .select('id_pago')
                .single();

            if (!error && i === 0) {
                idPagoPrincipal = nuevoPago?.id_pago;
            }
        }
    }

    console.log(`[iniciarPagoService] Pago(s) pendiente(s) asegurado(s) para preinscripciones: [${idsArray.join(', ')}]`);
    return {
        success: true,
        id_pago: idPagoPrincipal,
        ids_preinscripciones: idsArray,
        id_preinscripcion: idsArray[0],
        estado_pago: 'pendiente',
    };
};

/**
 * Crea una preferencia de pago en Mercado Pago y registra la orden en la base de datos (tabla 'pagos').
 * Utiliza el Service Role Key para garantizar bypass de las políticas RLS.
 *
 * @param {Object} datosPago
 * @param {string} datosPago.title
 * @param {number|string} datosPago.quantity
 * @param {number|string} datosPago.price
 * @param {number|string|number[]} [datosPago.id_preinscripcion]
 * @param {number[]|string[]} [datosPago.ids_preinscripciones]
 * @returns {Promise<{ id: string, preferenceId: string, init_point: string, sandbox_init_point: string, id_pago: number|null }>}
 */
export const crearPreferenciaMercadoPago = async (datosPago) => {
    const { title, quantity, price, id_preinscripcion, ids_preinscripciones } = datosPago;

    // Normalizar lista de IDs a string separado por comas (para external_reference y back_urls)
    let refString = '';
    if (Array.isArray(ids_preinscripciones) && ids_preinscripciones.length > 0) {
        refString = ids_preinscripciones.join(',');
    } else if (Array.isArray(id_preinscripcion) && id_preinscripcion.length > 0) {
        refString = id_preinscripcion.join(',');
    } else if (id_preinscripcion) {
        refString = String(id_preinscripcion);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const refParam = refString ? `&ref=${encodeURIComponent(refString)}` : '';
    const successUrl = `${frontendUrl}/inscripcion?pago=aprobado${refParam}`;
    const failureUrl = `${frontendUrl}/inscripcion?pago=fallo${refParam}`;
    const pendingUrl = `${frontendUrl}/inscripcion?pago=pendiente${refParam}`;

    // 1. Asegurar primero que los pagos existan en la BD en estado 'pendiente'
    let idPago = null;
    if (refString) {
        try {
            const resInicio = await iniciarPagoService({
                id_preinscripcion: refString,
                monto: price,
                titulo: title,
            });
            idPago = resInicio?.id_pago;
        } catch (dbErr) {
            console.error('[pago.service] Error asegurando pago inicial:', dbErr.message);
        }
    }

    const body = {
        items: [
            {
                title: String(title || 'Curso de Capacitación'),
                quantity: Number(quantity) || 1,
                unit_price: Number(price) || 0,
                currency_id: 'PEN', // Moneda: Soles peruanos
            },
        ],
        back_urls: {
            success: successUrl,
            failure: failureUrl,
            pending: pendingUrl,
        },
        external_reference: refString || undefined,
        metadata: {
            id_preinscripcion: refString || null,
        },
    };

    // Mercado Pago exige HTTPS para 'auto_return'; en localhost se omite para evitar error 400
    if (successUrl.startsWith('https://')) {
        body.auto_return = 'approved';
    }

    // 2. Crear preferencia en Mercado Pago
    const preference = new Preference(mpClient);
    const result = await preference.create({ body });

    // 3. Vincular el número de operación de la preferencia en la BD para todos los IDs
    if (refString && result?.id) {
        try {
            const idsList = refString.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);
            await supabase
                .from('pagos')
                .update({
                    numero_operacion: String(result.id),
                    observaciones: `Preferencia MP generada: ${title}`,
                })
                .in('id_preinscripcion', idsList);
        } catch (errVinculo) {
            console.warn('[pago.service] No se pudo vincular preference.id en tabla pagos:', errVinculo);
        }
    }

    return {
        id: result.id,
        preferenceId: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        id_pago: idPago,
    };
};

/**
 * Confirma el pago exitoso en Supabase con Service Role Key:
 * Soporta tanto una sola preinscripción como múltiples (compra de varios cursos):
 * 1. Actualiza preinscripciones: estado_inscripcion -> 'inscrito' para TODOS los IDs
 * 2. Actualiza o inserta en pagos: estado_pago -> 'pagado' para cada preinscripción
 * 3. Descuenta una vacante en clases_asignadas para cada clase involucrada
 * 4. Retorna el detalle consolidado para la UI
 */
export const confirmarPagoService = async ({
    id_preinscripcion,
    ids_preinscripciones,
    id_clase,
    numero_operacion,
    metodo_pago = 'mercadopago',
    monto,
}) => {
    // Normalizar lista de IDs (array o string separado por comas)
    let idsArray = [];
    if (Array.isArray(ids_preinscripciones) && ids_preinscripciones.length > 0) {
        idsArray = ids_preinscripciones.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
    } else if (typeof id_preinscripcion === 'string' && id_preinscripcion.includes(',')) {
        idsArray = id_preinscripcion.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id) && id > 0);
    } else if (id_preinscripcion) {
        const parsed = Number(id_preinscripcion);
        if (!isNaN(parsed) && parsed > 0) idsArray = [parsed];
    }

    if (idsArray.length === 0) {
        throw new Error('id_preinscripcion o ids_preinscripciones es obligatorio para confirmar el pago.');
    }

    const numOp = numero_operacion || `CONF-${Date.now()}`;
    const fechaActual = new Date().toISOString();

    console.log(`[confirmarPagoService] Confirmando preinscripciones: [${idsArray.join(', ')}]...`);

    // 1. Actualizar estado_inscripcion a 'inscrito' en tabla preinscripciones para TODOS los IDs
    const { error: errPre } = await supabase
        .from('preinscripciones')
        .update({ estado_inscripcion: 'inscrito' })
        .in('id_preinscripcion', idsArray);

    if (errPre) {
        console.error('[confirmarPagoService] Error actualizando preinscripciones:', errPre);
        throw new Error(`Error en preinscripciones: ${errPre.message}`);
    }
    console.log(`[confirmarPagoService] Preinscripciones [${idsArray.join(', ')}] actualizadas a 'inscrito'`);

    // 2. Determinar el monto real de la transacción (evitando defaults ciegos como 100)
    // Consultar primero las preinscripciones con sus clases y cursos desde la BD
    let preDataList = null;
    try {
        const { data: infoPre } = await supabase
            .from('preinscripciones')
            .select('*, personas(*), clases_asignadas(*, cursos(*))')
            .in('id_preinscripcion', idsArray);
        preDataList = infoPre;
    } catch (errInfo) {
        console.warn('[confirmarPagoService] Aviso consultando datos de preinscripciones:', errInfo.message);
    }

    const sumaPreciosCatalogo = (preDataList || []).reduce((acc, item) => {
        const p = Number(item.clases_asignadas?.cursos?.precio);
        return acc + (!isNaN(p) && p >= 0 ? p : 0);
    }, 0);

    // Si numero_operacion es un ID de pago numérico real de Mercado Pago, consultar la API oficial
    let montoMP = null;
    if (numero_operacion && /^\d+$/.test(String(numero_operacion)) && process.env.MP_ACCESS_TOKEN) {
        try {
            const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${numero_operacion}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
            });
            if (mpRes.ok) {
                const mpData = await mpRes.json();
                if (mpData.transaction_amount !== undefined && mpData.transaction_amount !== null) {
                    montoMP = Number(mpData.transaction_amount);
                    console.log(`[confirmarPagoService] Monto oficial verificado en API Mercado Pago: S/ ${montoMP}`);
                }
            }
        } catch (mpErr) {
            console.warn('[confirmarPagoService] No se pudo verificar monto con Mercado Pago API:', mpErr.message);
        }
    }

    // Resolución estricta del monto real:
    // 1. API Mercado Pago si existe
    // 2. Monto enviado explícito (siempre que no sea el fallback artificial de 100 cuando el catálogo dice otro precio)
    // 3. Precio del curso configurado en catálogo de la BD
    let montoTotal = 0;
    if (montoMP !== null && !isNaN(montoMP)) {
        montoTotal = montoMP;
    } else if (monto !== undefined && monto !== null && !isNaN(Number(monto)) && Number(monto) > 0) {
        if (Number(monto) === 100 && sumaPreciosCatalogo > 0 && sumaPreciosCatalogo !== 100) {
            montoTotal = sumaPreciosCatalogo;
        } else {
            montoTotal = Number(monto);
        }
    } else if (sumaPreciosCatalogo > 0) {
        montoTotal = sumaPreciosCatalogo;
    } else {
        montoTotal = 0;
    }

    console.log(`[confirmarPagoService] Monto final a registrar: S/ ${montoTotal}`);

    // 3. Actualizar o registrar en tabla 'pagos' para CADA preinscripción
    let idPagoPrincipal = null;

    for (let i = 0; i < idsArray.length; i++) {
        const numPre = idsArray[i];
        const montoItem = idsArray.length === 1 ? montoTotal : (montoTotal / idsArray.length);

        const { data: pagosExistentes } = await supabase
            .from('pagos')
            .select('id_pago, monto_pagado')
            .eq('id_preinscripcion', numPre);

        if (pagosExistentes && pagosExistentes.length > 0) {
            const pagoId = pagosExistentes[0].id_pago;
            const { error: errPagoUpdate } = await supabase
                .from('pagos')
                .update({
                    estado_pago: 'pagado',
                    fecha_pago: fechaActual,
                    numero_operacion: numOp,
                    metodo_pago: metodo_pago,
                    monto_pagado: montoItem,
                    observaciones: 'Pago confirmado exitosamente',
                })
                .eq('id_pago', pagoId);

            if (errPagoUpdate) {
                console.error(`[confirmarPagoService] Error actualizando pago id ${pagoId}:`, errPagoUpdate);
            } else {
                console.log(`[confirmarPagoService] Pago id ${pagoId} (preinscripción ${numPre}) actualizado a 'pagado' con monto S/ ${montoItem}`);
            }
            if (i === 0) idPagoPrincipal = pagoId;
        } else {
            const { data: nuevoPago, error: errPagoInsert } = await supabase
                .from('pagos')
                .insert({
                    id_preinscripcion: numPre,
                    monto_pagado: montoItem,
                    metodo_pago: metodo_pago,
                    numero_operacion: numOp,
                    estado_pago: 'pagado',
                    fecha_pago: fechaActual,
                    observaciones: 'Pago confirmado',
                })
                .select('id_pago')
                .single();

            if (errPagoInsert) {
                console.error(`[confirmarPagoService] Error insertando en pagos para preinscripción ${numPre}:`, errPagoInsert);
            } else {
                console.log(`[confirmarPagoService] Pago nuevo creado y marcado como 'pagado' con monto S/ ${montoItem} para preinscripción ${numPre}`);
                if (i === 0) idPagoPrincipal = nuevoPago?.id_pago;
            }
        }
    }

    // 4. Restar 1 vacante en clases_asignadas para cada clase involucrada
    const clasesUnicas = Array.from(new Set((preDataList || []).map(p => p.id_clase).filter(Boolean)));

    for (const cId of clasesUnicas) {
        const { data: claseActual } = await supabase
            .from('clases_asignadas')
            .select('vacantes_totales')
            .eq('id_clase', Number(cId))
            .single();

        if (claseActual && Number(claseActual.vacantes_totales) > 0) {
            const nuevasVacantes = Number(claseActual.vacantes_totales) - 1;
            await supabase
                .from('clases_asignadas')
                .update({ vacantes_totales: nuevasVacantes })
                .eq('id_clase', Number(cId));
            console.log(`[confirmarPagoService] Vacante descontada en clase ${cId}. Quedan: ${nuevasVacantes}`);
        }
    }

    // 5. Obtener detalle consolidado para la UI
    let detalleConsolidado = null;
    if (preDataList && preDataList.length > 0) {
        const primero = preDataList[0];
        detalleConsolidado = {
            id_preinscripcion: idsArray.join(','),
            ids_preinscripciones: idsArray,
            id_persona: primero.id_persona,
            id_clase: primero.id_clase,
            codigo_clase: primero.clases_asignadas?.codigo_clase || `CLS-${primero.id_clase}`,
            nombre_completo: primero.personas?.nombre_completo || 'Participante',
            correo: primero.personas?.correo || '',
            celular: primero.personas?.celular || '',
            ciudad: primero.personas?.ciudad || '',
            nombre_curso: preDataList.length > 1
                ? `${preDataList.length} Cursos JB Impulsa`
                : primero.clases_asignadas?.cursos?.nombre_curso || 'Curso de Capacitación',
            precio: montoTotal,
            estado_inscripcion: 'inscrito',
            estado_pago: 'pagado',
            numero_operacion: numOp,
            cursos_confirmados: preDataList.map(item => ({
                id_preinscripcion: item.id_preinscripcion,
                id_clase: item.id_clase,
                codigo_clase: item.clases_asignadas?.codigo_clase || `CLS-${item.id_clase}`,
                nombre_curso: item.clases_asignadas?.cursos?.nombre_curso || 'Curso',
                precio: Number(item.clases_asignadas?.cursos?.precio) || (montoTotal / (preDataList.length || 1)),
            })),
        };
    }

    return {
        success: true,
        ids_preinscripciones: idsArray,
        id_preinscripcion: idsArray[0],
        id_pago: idPagoPrincipal,
        numero_operacion: numOp,
        estado_inscripcion: 'inscrito',
        estado_pago: 'pagado',
        detalle: detalleConsolidado,
    };
};

export const crearPreferenciaPago = crearPreferenciaMercadoPago;
